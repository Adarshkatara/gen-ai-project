from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'smart_college_secret'
DB_FILE = 'smart_college.db'

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# Helper to execute query safely returning dict
def query_db(query, args=(), one=False):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        rv = [dict((cur.description[i][0], value) \
                   for i, value in enumerate(row)) for row in cur.fetchall()]
        conn.commit()
        return (rv[0] if rv else None) if one else rv
    finally:
        conn.close()

def execute_db(query, args=()):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        conn.commit()
    finally:
        conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.json.get('email')
        password = request.json.get('password')
        
        user = query_db("SELECT * FROM Users WHERE email=? AND password=?", (email, password), one=True)
        if user:
            session['user_id'] = user['id']
            session['role'] = user['role']
            session['name'] = user['full_name']
            
            redirect_url = '/student'
            if user['role'] == 'Admin': redirect_url = '/admin'
            elif user['role'] == 'Faculty': redirect_url = '/faculty'
                
            return jsonify({'success': True, 'redirect': redirect_url})
        return jsonify({'success': False, 'message': 'Invalid credentials'})
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Student')
    
    try:
        execute_db("INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)", 
                   (name, email, password, role))
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Registration failed. Email might already exist.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/auth/google', methods=['POST'])
def auth_google():
    """Verify Google Identity Services JWT credential and create a session."""
    import json, base64
    try:
        credential = request.json.get('credential')
        if not credential:
            return jsonify({'success': False, 'message': 'No credential received'})
        
        # Decode the JWT payload (middle segment) — no signature verify needed for demo
        # For production, use google-auth library: pip install google-auth
        payload_b64 = credential.split('.')[1]
        # Fix base64 padding
        payload_b64 += '=' * (4 - len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        
        email = payload.get('email')
        name = payload.get('name', email.split('@')[0] if email else 'Google User')
        picture = payload.get('picture', '')
        
        if not email:
            return jsonify({'success': False, 'message': 'Could not retrieve email from Google'})
        
        # Find existing user or auto-register as Student
        user = query_db("SELECT * FROM Users WHERE email=?", (email,), one=True)
        if not user:
            execute_db("INSERT INTO Users (full_name, email, password, role, profile_pic) VALUES (?, ?, ?, ?, ?)",
                       (name, email, 'GOOGLE_AUTH', 'Student', picture))
            user = query_db("SELECT * FROM Users WHERE email=?", (email,), one=True)
        
        session['user_id'] = user['id']
        session['role'] = user['role']
        session['name'] = user['full_name']
        
        redirect_url = '/student'
        if user['role'] == 'Admin':   redirect_url = '/admin'
        elif user['role'] == 'Faculty': redirect_url = '/faculty'
        
        return jsonify({'success': True, 'redirect': redirect_url})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Google auth error: {str(e)}'})


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/student')
@app.route('/student/<path:path>')
def student(path=''):
    if session.get('role') != 'Student': return redirect(url_for('login'))
    return render_template('react_student.html')

@app.route('/lms')
def lms():
    if not session.get('user_id'): return redirect(url_for('login'))
    return render_template('lms.html', role=session.get('role'), name=session.get('name'))

@app.route('/crm')
def crm():
    if session.get('role') != 'Admin': return redirect(url_for('login'))
    return render_template('crm.html', name=session.get('name'))

@app.route('/api/courses')
def api_courses():
    courses = query_db("SELECT * FROM Courses")
    return jsonify(courses)

@app.route('/api/leads', methods=['GET', 'POST'])
def api_leads():
    if request.method == 'POST':
        data = request.json
        # Handle backward compatibility cleanly if old fields arrive empty
        execute_db("INSERT INTO Leads (name, email, phone, dob, gpa, major) VALUES (?, ?, ?, ?, ?, ?)", 
                   (data['name'], data['email'], data.get('phone', ''), data.get('dob', ''), data.get('gpa', 0.0), data.get('major', 'Unknown')))
        return jsonify({'success': True})
    else:
        leads = query_db("SELECT * FROM Leads")
        return jsonify(leads)

@app.route('/api/fees')
def api_fees():
    fees = query_db("SELECT f.amount, f.status, u.full_name FROM Fees f JOIN Users u ON f.student_id = u.id")
    return jsonify(fees)

@app.route('/api/assignments')
def api_assignments():
    return jsonify(query_db("SELECT a.title, a.due_date, c.title as course FROM Assignments a JOIN Courses c ON a.course_id = c.id"))

@app.route('/api/leaves', methods=['GET', 'POST'])
def api_leaves():
    if request.method == 'POST':
        execute_db("UPDATE Leaves SET status=? WHERE id=?", (request.json.get('status'), request.json.get('id')))
        return jsonify({'success': True})
    return jsonify(query_db("SELECT l.id, l.reason, l.status, u.full_name FROM Leaves l JOIN Users u ON l.user_id = u.id"))

@app.route('/api/me')
def api_me():
    if not session.get('user_id'): return jsonify({'error': 'Not authenticated'}), 401
    return jsonify({
        'id': session['user_id'],
        'name': session['name'],
        'role': session['role'],
        'profilePic': f"https://ui-avatars.com/api/?name={session['name'].replace(' ', '+')}&background=random"
    })

@app.route('/api/dashboard/attendance')
def dashboard_attendance_api():
    return jsonify([
        {'subjectId': {'name': 'Data Structures', 'code': 'CS201'}, 'totalClasses': 40, 'attendedClasses': 35},
        {'subjectId': {'name': 'Operating Systems', 'code': 'CS202'}, 'totalClasses': 38, 'attendedClasses': 20},
        {'subjectId': {'name': 'Discrete Math', 'code': 'MA201'}, 'totalClasses': 42, 'attendedClasses': 28}
    ])

@app.route('/api/dashboard/timetable')
def dashboard_timetable_api():
    return jsonify([
        {'dayOfWeek': 'Monday', 'startTime': '09:00', 'endTime': '10:00', 'roomNumber': 'L-101', 'type': 'Lecture', 'subjectId': {'name': 'Data Structures', 'code': 'CS201', 'facultyName': 'Dr. Smith', 'facultyImage': 'https://ui-avatars.com/api/?name=Dr+Smith'}},
        {'dayOfWeek': 'Monday', 'startTime': '10:00', 'endTime': '11:00', 'roomNumber': 'L-102', 'type': 'Lecture', 'subjectId': {'name': 'Operating Systems', 'code': 'CS202', 'facultyName': 'Prof. Johnson', 'facultyImage': 'https://ui-avatars.com/api/?name=Prof+Johnson'}}
    ])

@app.route('/api/dashboard/subjects')
def dashboard_subjects_api():
    return jsonify([
        {'code': 'CS201', 'name': 'Data Structures', 'facultyName': 'Dr. Smith', 'facultyImage': 'https://ui-avatars.com/api/?name=Dr+Smith', 'credits': 3},
        {'code': 'CS202', 'name': 'Operating Systems', 'facultyName': 'Prof. Johnson', 'facultyImage': 'https://ui-avatars.com/api/?name=Prof+Johnson', 'credits': 3}
    ])

@app.route('/api/dashboard/attendance-trends')
def dashboard_attendance_trends_api():
    return jsonify([
        {'month': 'Jan', 'attendance': 95},
        {'month': 'Feb', 'attendance': 88},
        {'month': 'Mar', 'attendance': 76},
        {'month': 'Apr', 'attendance': 85},
        {'month': 'May', 'attendance': 90}
    ])

@app.route('/api/dashboard/feedback', methods=['POST'])
def dashboard_feedback_api():
    data = request.json
    return jsonify({'success': True, 'message': 'Feedback received successfully: ' + data.get('subject', '')})

# ======= FACULTY API ROUTES =======

@app.route('/faculty')
@app.route('/faculty/<path:path>')
def faculty(path=''):
    if session.get('role') != 'Faculty': return redirect(url_for('login'))
    return render_template('react_student.html')

@app.route('/api/faculty/courses')
def faculty_courses_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    return jsonify(query_db("SELECT * FROM Courses WHERE faculty_id = ?", (fac_id,)))

@app.route('/api/faculty/students')
def faculty_students_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    students = query_db("""
        SELECT DISTINCT u.id, u.full_name, u.email, u.profile_pic, c.title as course_name 
        FROM Users u 
        JOIN Enrollments e ON u.id = e.student_id 
        JOIN Courses c ON e.course_id = c.id 
        WHERE c.faculty_id = ?
    """, (fac_id,))
    return jsonify(students)

@app.route('/api/faculty/stats')
def faculty_stats_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    st_count = query_db("SELECT COUNT(DISTINCT e.student_id) as c FROM Enrollments e JOIN Courses c ON e.course_id = c.id WHERE c.faculty_id=?", (fac_id,), one=True)['c']
    assign_count = query_db("SELECT COUNT(*) as c FROM Assignments a JOIN Courses c ON a.course_id = c.id WHERE c.faculty_id=?", (fac_id,), one=True)['c']
    return jsonify({'totalStudents': st_count, 'classesToday': 2, 'pendingAssignments': assign_count, 'attendanceRate': 85})

@app.route('/api/faculty/attendance', methods=['GET', 'POST'])
def faculty_attendance_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    if request.method == 'GET':
        return jsonify(query_db("SELECT a.*, u.full_name, c.title as course_name FROM Attendance a JOIN Courses c ON a.course_id=c.id JOIN Users u ON a.student_id=u.id WHERE c.faculty_id=?", (fac_id,)))
    
    data = request.json
    execute_db("INSERT INTO Attendance (course_id, student_id, date, status) VALUES (?, ?, ?, ?)", (data['course_id'], data['student_id'], data['date'], data['status']))
    return jsonify({'success': True})

@app.route('/api/faculty/marks', methods=['GET', 'POST'])
def faculty_marks_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    if request.method == 'GET':
        return jsonify(query_db("SELECT m.*, u.full_name, c.title as course_name FROM Marks m JOIN Courses c ON m.course_id=c.id JOIN Users u ON m.student_id=u.id WHERE c.faculty_id=?", (fac_id,)))
    
    data = request.json
    execute_db("INSERT INTO Marks (student_id, course_id, exam_type, marks, max_marks) VALUES (?, ?, ?, ?, ?)", (data['student_id'], data['course_id'], data['exam_type'], data['marks'], data['max_marks']))
    return jsonify({'success': True})

@app.route('/api/faculty/materials', methods=['GET', 'POST'])
def faculty_materials_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    if request.method == 'GET':
        return jsonify(query_db("SELECT m.*, c.title as course_name FROM Materials m JOIN Courses c ON m.course_id=c.id WHERE c.faculty_id=?", (fac_id,)))
    
    data = request.json
    execute_db("INSERT INTO Materials (course_id, title, description, file_url, upload_date) VALUES (?, ?, ?, ?, ?)", (data['course_id'], data['title'], data['description'], data['file_url'], data['upload_date']))
    return jsonify({'success': True})

@app.route('/api/faculty/assignments', methods=['GET', 'POST'])
def faculty_assignments_new_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    if request.method == 'GET':
        return jsonify(query_db("SELECT a.*, c.title as course_name FROM Assignments a JOIN Courses c ON a.course_id=c.id WHERE c.faculty_id=?", (fac_id,)))
    
    data = request.json
    execute_db("INSERT INTO Assignments (course_id, title, description, due_date) VALUES (?, ?, ?, ?)", (data['course_id'], data['title'], data['description'], data['due_date']))
    return jsonify({'success': True})

@app.route('/api/faculty/messages', methods=['GET', 'POST'])
def faculty_messages_api():
    if session.get('role') not in ['Faculty', 'Admin']: return jsonify({'error': 'Unauthorized'}), 401
    fac_id = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
    if request.method == 'GET':
        return jsonify(query_db("SELECT m.*, u.full_name as sender, c.title as course_name FROM Messages m JOIN Courses c ON m.course_id=c.id JOIN Users u ON m.sender_id=u.id WHERE c.faculty_id=?", (fac_id,)))
    
    data = request.json
    execute_db("INSERT INTO Messages (sender_id, course_id, message) VALUES (?, ?, ?)", (fac_id, data['course_id'], data['message']))
    return jsonify({'success': True})

# ======= REAL-TIME API POLLING ENGINE =======

def push_notification(user_id, role_target, title, message, notif_type='Info'):
    execute_db("INSERT INTO Notifications (user_id, role_target, title, message, type) VALUES (?, ?, ?, ?, ?)", (user_id, role_target, title, message, notif_type))

@app.route('/api/realtime/notifications', methods=['GET'])
def get_notifications():
    if not session.get('user_id'): return jsonify([])
    uid = session['user_id']
    role = session.get('role', 'Student')
    notifs = query_db("SELECT * FROM Notifications WHERE is_read=0 AND (user_id=? OR role_target=? OR role_target='All') ORDER BY created_at DESC LIMIT 10", (uid, role))
    return jsonify(notifs)

@app.route('/api/realtime/notifications/read', methods=['POST'])
def mark_notifs_read():
    if not session.get('user_id'): return jsonify({'success': False})
    notif_id = request.json.get('id')
    execute_db("UPDATE Notifications SET is_read=1 WHERE id=?", (notif_id,))
    return jsonify({'success': True})

@app.route('/api/realtime/dashboard', methods=['GET'])
def realtime_dashboard():
    # If using View Simulator in frontend, we don't know the exact intent from here easily except falling back to Admin logic.
    # The frontend fetches stats based on its active state.
    role = request.headers.get('X-Simulated-Role', session.get('role', 'Student'))
    if session.get('role') == 'Admin':
        # Default to whatever the frontend wants to query
        pass

    stats = {}
    if role == 'Admin':
        stats['totalStudents'] = query_db("SELECT COUNT(*) as c FROM Users WHERE role='Student'", one=True)['c']
        stats['pendingFees'] = query_db("SELECT SUM(amount) as c FROM Fees WHERE status='Pending'", one=True)['c'] or 0
    elif role == 'Faculty':
        uid = session['user_id'] if session.get('role') == 'Faculty' else (query_db("SELECT id FROM Users WHERE role='Faculty' LIMIT 1", one=True) or {}).get('id', 0)
        stats['totalStudents'] = query_db("SELECT COUNT(DISTINCT e.student_id) as c FROM Enrollments e JOIN Courses c ON e.course_id=c.id WHERE c.faculty_id=?", (uid,), one=True)['c']
        stats['pendingAssignments'] = query_db("SELECT COUNT(*) as c FROM Assignments a JOIN Courses c ON a.course_id=c.id WHERE c.faculty_id=?", (uid,), one=True)['c']
    return jsonify(stats)

# ======= ADMIN API ROUTES =======

def log_admin_action(admin_id, action, module):
    execute_db("INSERT INTO ActivityLogs (admin_id, action, module) VALUES (?, ?, ?)", (admin_id, action, module))

@app.route('/admin')
@app.route('/admin/<path:path>')
def admin(path=''):
    if session.get('role') != 'Admin': return redirect(url_for('login'))
    return render_template('react_student.html')

@app.route('/api/admin/analytics')
def admin_analytics_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    stats = {}
    stats['totalStudents'] = query_db("SELECT COUNT(*) as c FROM Users WHERE role='Student'", one=True)['c']
    stats['totalFaculty'] = query_db("SELECT COUNT(*) as c FROM Users WHERE role='Faculty'", one=True)['c']
    stats['activeCourses'] = query_db("SELECT COUNT(*) as c FROM Courses", one=True)['c']
    stats['pendingFees'] = query_db("SELECT SUM(amount) as c FROM Fees WHERE status='Pending'", one=True)['c'] or 0

    stats['attendanceTrend'] = [
        {'name': 'Mon', 'val': 85}, {'name': 'Tue', 'val': 88}, 
        {'name': 'Wed', 'val': 82}, {'name': 'Thu', 'val': 90}, {'name': 'Fri', 'val': 87}
    ]
    stats['passFail'] = [
        {'name': 'Pass', 'value': 75}, {'name': 'Fail', 'value': 25}
    ]
    return jsonify(stats)

@app.route('/api/admin/users', methods=['GET', 'POST', 'PUT', 'DELETE'])
def admin_users_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    
    if request.method == 'GET':
        return jsonify(query_db("SELECT id, role, email, full_name, profile_pic FROM Users"))
    elif request.method == 'POST':
        data = request.json
        execute_db("INSERT INTO Users (role, email, password, full_name) VALUES (?, ?, ?, ?)", (data['role'], data['email'], 'default123', data['full_name']))
        log_admin_action(session['user_id'], f"Created User {data['full_name']}", 'Users')
        return jsonify({'success': True})
    elif request.method == 'PUT':
        data = request.json
        execute_db("UPDATE Users SET full_name=?, email=?, role=? WHERE id=?", (data['full_name'], data['email'], data['role'], data['id']))
        log_admin_action(session['user_id'], f"Updated User ID {data['id']}", 'Users')
        return jsonify({'success': True})
    elif request.method == 'DELETE':
        data = request.json
        uid = data['id']
        # Cascade destroy all linked institutional footprints to prevent foreign-key lock conflicts
        execute_db("DELETE FROM Attendance WHERE student_id=?", (uid,))
        execute_db("DELETE FROM Marks WHERE student_id=?", (uid,))
        execute_db("DELETE FROM Enrollments WHERE student_id=?", (uid,))
        execute_db("DELETE FROM Fees WHERE student_id=?", (uid,))
        execute_db("DELETE FROM Messages WHERE sender_id=?", (uid,))
        execute_db("DELETE FROM Leaves WHERE user_id=?", (uid,))
        execute_db("UPDATE Courses SET faculty_id=NULL WHERE faculty_id=?", (uid,))
        execute_db("DELETE FROM ActivityLogs WHERE admin_id=?", (uid,))
        
        # Finally purge the primary identity 
        execute_db("DELETE FROM Users WHERE id=?", (uid,))
        log_admin_action(session['user_id'], f"Deleted System User Protocol ID #{uid}", 'Users')
        return jsonify({'success': True})

@app.route('/api/admin/courses', methods=['GET', 'POST'])
def admin_courses_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(query_db("SELECT c.*, u.full_name as faculty_name, d.name as dept_name FROM Courses c LEFT JOIN Users u ON c.faculty_id=u.id LEFT JOIN Departments d ON c.department_id=d.id"))
    data = request.json
    execute_db("INSERT INTO Courses (title, code, faculty_id, department_id, credits) VALUES (?, ?, ?, ?, ?)", (data['title'], data['code'], data.get('faculty_id') or None, data.get('department_id') or 1, data.get('credits', 3)))
    log_admin_action(session['user_id'], f"Created Course {data['title']}", 'Courses')
    return jsonify({'success': True})

@app.route('/api/admin/attendance')
def admin_attendance_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(query_db("SELECT a.*, u.full_name as student_name, c.title as course_name FROM Attendance a JOIN Users u ON a.student_id=u.id JOIN Courses c ON a.course_id=c.id ORDER BY a.date DESC LIMIT 100"))

@app.route('/api/admin/results')
def admin_results_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(query_db("SELECT m.*, u.full_name as student_name, c.title as course_name FROM Marks m JOIN Users u ON m.student_id=u.id JOIN Courses c ON m.course_id=c.id ORDER BY m.id DESC"))

@app.route('/api/admin/timetable', methods=['GET', 'POST', 'PUT'])
def admin_timetable_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify([
            {"id": 1, "day": "Monday", "time": "09:00 AM", "course": "CS201 Data Structures", "room": "Lab 4", "faculty": "John Faculty"},
            {"id": 2, "day": "Monday", "time": "11:30 AM", "course": "ME301 Thermodynamics", "room": "Hall B", "faculty": "Dr. Sarah Connor"}
        ])
    return jsonify({'success': True})

@app.route('/api/admin/fees', methods=['GET', 'POST'])
def admin_fees_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(query_db("SELECT f.*, u.full_name as student_name FROM Fees f JOIN Users u ON f.student_id=u.id"))
    data = request.json
    execute_db("INSERT INTO Fees (student_id, amount, status) VALUES (?, ?, ?)", (data['student_id'], data['amount'], data['status']))
    log_admin_action(session['user_id'], f"Added Fee Record for Student ID {data['student_id']}", 'Fees')
    push_notification(data['student_id'], 'Student', 'Fee Generated', f"A new fee of ₹{data['amount']} has been generated on your account.", 'Warning')
    push_notification(0, 'Admin', 'Fee Ledger Updated', f"Fee status for Student ID {data['student_id']} shifted to {data['status']}.", 'Info')
    return jsonify({'success': True})

@app.route('/api/admin/announcements', methods=['GET', 'POST'])
def admin_announcements_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(query_db("SELECT m.*, u.full_name as sender_name FROM Messages m JOIN Users u ON m.sender_id=u.id ORDER BY m.date DESC"))
    data = request.json
    execute_db("INSERT INTO Messages (sender_id, target_audience, message) VALUES (?, ?, ?)", (session['user_id'], data['target_audience'], data['message']))
    log_admin_action(session['user_id'], f"Published announcement to {data['target_audience']}", 'Announcements')
    return jsonify({'success': True})

@app.route('/api/admin/documents', methods=['GET', 'POST'])
def admin_documents_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    if request.method == 'GET':
        return jsonify(query_db("SELECT * FROM Documents ORDER BY upload_date DESC"))
    data = request.json
    execute_db("INSERT INTO Documents (title, file_url, target_audience) VALUES (?, ?, ?)", (data['title'], data['file_url'], data['target_audience']))
    log_admin_action(session['user_id'], f"Uploaded document {data['title']}", 'Documents')
    return jsonify({'success': True})

@app.route('/api/admin/logs')
def admin_logs_api():
    if session.get('role') != 'Admin': return jsonify({'error': 'Unauthorized'}), 401
    return jsonify(query_db("SELECT l.*, u.full_name as admin_name FROM ActivityLogs l JOIN Users u ON l.admin_id=u.id ORDER BY l.timestamp DESC LIMIT 50"))

if __name__ == '__main__':
    # Initialize DB if it doesn't exist
    if not os.path.exists(DB_FILE):
        conn = sqlite3.connect(DB_FILE)
        with open('schema.sql', 'r') as f:
            script = f.read()
            conn.executescript(script)
        conn.commit()
        conn.close()
        print("Initialized new SQLite database from schema.sql")
        
    # Auto-migrate new CRM Application fields safely
    try:
        execute_db("ALTER TABLE Leads ADD COLUMN phone VARCHAR(20)")
        execute_db("ALTER TABLE Leads ADD COLUMN dob DATE")
        execute_db("ALTER TABLE Leads ADD COLUMN gpa DECIMAL(3, 2)")
        execute_db("ALTER TABLE Leads ADD COLUMN major VARCHAR(100)")
    except Exception:
        pass
        
    app.run(debug=True, port=5000)

