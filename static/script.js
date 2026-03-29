document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('savedNexusEmail')) {
        const mailField = document.getElementById('email');
        const passField = document.getElementById('password');
        if(mailField) mailField.value = localStorage.getItem('savedNexusEmail');
        if(passField) passField.value = localStorage.getItem('savedNexusPassword');
    }
});

// ===== GOOGLE SIGN-IN =====
const GOOGLE_CLIENT_ID = localStorage.getItem('googleClientId') || 'YOUR_GOOGLE_CLIENT_ID';

function signInWithGoogle() {
    if (!window.google) {
        showToast('Google Sign-In is loading, please wait a moment...', 'error');
        return;
    }
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
    });
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
            // Prompt was blocked, fallback to popup
            google.accounts.id.renderButton(
                document.createElement('div'),
                { theme: 'outline', size: 'large' }
            );
            document.getElementById('googleBtn').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening Google...';
            google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: 'email profile',
                callback: (resp) => { if (resp.access_token) fetchGoogleUserInfo(resp.access_token); }
            }).requestAccessToken();
        }
    });
}

async function handleGoogleCredential(response) {
    const btn = document.getElementById('googleBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';
    try {
        const res = await fetch('/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Google Sign-In successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = data.redirect, 1000);
        } else {
            showToast(data.message || 'Google Sign-In failed', 'error');
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Sign in with Google';
        }
    } catch(e) {
        showToast('Connection error during Google Sign-In', 'error');
    }
}


// Modern Toast Notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 30px; right: 30px; padding: 16px 28px; 
        border-radius: 12px; font-weight: 600; font-family: 'Outfit', sans-serif; color: white; opacity: 0;
        transform: translateY(-20px) scale(0.9); transition: all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.3);
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);
        box-shadow: 0 10px 40px rgba(0,0,0,0.4); z-index: 9999; display: flex; align-items: center; gap: 10px;
    `;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0) scale(1)'; }, 10);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-20px) scale(0.9)'; }, 4000);
    setTimeout(() => { toast.remove(); }, 4500);
}

function toggleAuth(type) {
    document.getElementById('error-msg').innerText = '';
    document.getElementById('success-msg').innerText = '';
    if (type === 'login') {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('btn-login').className = 'btn';
        document.getElementById('btn-signup').className = 'btn btn-secondary';
        document.getElementById('login-form').animate([{ opacity: 0, transform: 'translateX(-20px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 400, fill: 'forwards', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    } else {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('btn-login').className = 'btn btn-secondary';
        document.getElementById('btn-signup').className = 'btn';
        document.getElementById('signup-form').animate([{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 400, fill: 'forwards', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
    }
}

async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    if(!name || !email || !password || !role) return showToast('Please fill all required fields', 'error');
    
    const btn = document.getElementById('regBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    try {
        const res = await fetch('/register', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name, email, password, role}) });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('savedNexusEmail', email);
            localStorage.setItem('savedNexusPassword', password);
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            document.getElementById('regName').value = ''; document.getElementById('regEmail').value = ''; document.getElementById('regPassword').value = '';
            showToast('Account created successfully!', 'success');
            toggleAuth('login');
        } else {
            showToast(data.message, 'error');
        }
    } catch (e) { showToast('Connection Error.', 'error'); }
    setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account'; }, 300);
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if(!email || !password) return showToast('Please enter Email and Password', 'error');
    
    const btn = document.getElementById('logBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
    try {
        const res = await fetch('/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password}) });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('savedNexusEmail', email);
            localStorage.setItem('savedNexusPassword', password);
            showToast('Login successful. Redirecting...', 'success');
            setTimeout(() => window.location.href = data.redirect, 1000);
        } else {
            showToast(data.message, 'error');
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login into Platform';
        }
    } catch (e) { 
        showToast('Connection Error.', 'error'); 
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login into Platform';
    }
}

async function submitApplication() {
    const name = document.getElementById('leadName').value;
    const email = document.getElementById('leadEmail').value;
    const phone = document.getElementById('leadPhone').value;
    const dob = document.getElementById('leadDOB').value;
    const gpa = document.getElementById('leadGPA').value;
    const major = document.getElementById('leadMajor').value;
    
    if(!name || !email || !phone || !dob || !major) return showToast('Please fill in all critical application fields', 'error');

    try {
        await fetch('/api/leads', { 
            method: 'POST', headers:{'Content-Type':'application/json'}, 
            body: JSON.stringify({name, email, phone, dob, gpa, major}) 
        });
        showToast('Application successfully submitted to the Admissions Board!', 'success');
        document.getElementById('apply-form').animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.95)' }], { duration: 300, fill: 'forwards' });
        setTimeout(() => document.getElementById('apply-form').style.display = 'none', 300);
    } catch(e) { showToast('Submission failed.', 'error') }
}

async function loadLeaves() {
    try {
        const res = await fetch('/api/leaves'); const leaves = await res.json();
        const list = document.getElementById('leaves-list');
        list.innerHTML = leaves.map(l => `
            <li style="background:rgba(255,255,255,0.02); border:1px solid var(--border); display:flex; flex-direction:column; align-items:flex-start; gap:10px;">
                <div style="display:flex; justify-content:space-between; width:100%;">
                    <div style="font-weight:bold;"><i class="fa-solid fa-user-tie"></i> ${l.full_name}</div>
                    <span class="badge" style="background:${l.status==='Pending' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}; color:${l.status==='Pending' ? '#ef4444' : '#10b981'};">${l.status}</span>
                </div>
                <div style="color:var(--text-muted); font-size:0.9rem;">"${l.reason}"</div>
                ${l.status==='Pending' ? `<button onclick="approveLeave(${l.id})" class="btn" style="padding:6px 12px; font-size:0.8rem; margin-top:5px;"><i class="fa-solid fa-check"></i> Approve Leave</button>` : ''}
            </li>
        `).join('');
        if(leaves.length===0) list.innerHTML = '<li style="justify-content:center; color:var(--text-muted)">No HR leaves.</li>';
    } catch(e) {}
}

async function approveLeave(id) {
    await fetch('/api/leaves', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id:id, status:'Approved'})});
    showToast('Leave Approved Successfully', 'success');
    loadLeaves();
}

async function loadAssignments() {
    try {
        const res = await fetch('/api/assignments'); const assignments = await res.json();
        const list = document.getElementById('assignments-list');
        list.innerHTML = assignments.map(a => `
            <li style="flex-direction:column; align-items:flex-start; background:rgba(255,255,255,0.02); border-radius:12px; margin-bottom:10px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="font-weight:bold; font-size:1.1rem; color:var(--text);">${a.title}</div>
                <div style="font-size:0.85rem; color:var(--text-muted); margin-top:5px;"><i class="fa-solid fa-chalkboard"></i> Module: ${a.course}</div>
                <div class="badge" style="margin-top:10px; background:rgba(245,158,11,0.1); color:#fbbf24;"><i class="fa-solid fa-clock-rotate-left"></i> Due: ${a.due_date}</div>
            </li>
        `).join('');
        if(assignments.length===0) list.innerHTML = '<li style="justify-content:center; color:var(--text-muted)">No Assignments.</li>';
    } catch(e) {}
}

async function loadCourses() {
    try {
        const res = await fetch('/api/courses'); const courses = await res.json();
        const list = document.getElementById('courses-list');
        list.innerHTML = courses.map((c, i) => `
            <li style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); flex-direction:column; align-items:flex-start; padding:1.8rem; animation: slideUp ${0.3 + i*0.1}s ease-out backwards;">
                <div style="font-size:2.5rem; margin-bottom:1.5rem; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"><i class="fa-solid fa-laptop-code"></i></div>
                <h4 style="margin:0 0 1rem 0; font-size:1.4rem; color:var(--text);">${c.title}</h4>
                <div class="badge" style="background: rgba(99,102,241,0.15); color:var(--primary); font-size:0.75rem;"><i class="fa-solid fa-check"></i> Standard Curriculum</div>
            </li>
        `).join('');
        if(courses.length === 0) list.innerHTML = '<li style="justify-content:center; color:var(--text-muted)">No courses active.</li>';
    } catch(e) { }
}

async function loadLeads() {
    try {
        const res = await fetch('/api/leads'); const leads = await res.json();
        const list = document.getElementById('leads-list');
        list.innerHTML = leads.map(l => `
            <li>
                <div style="display:flex; align-items:center; gap:18px;">
                    <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,var(--primary),var(--accent)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.2rem; box-shadow:0 4px 10px rgba(0,0,0,0.3);">
                        ${l.name.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight:600; font-size:1.1rem;">${l.name}</div>
                        <div style="font-size:0.9rem; color:var(--text-muted); margin-top:4px;">${l.email}</div>
                    </div>
                </div>
                <span class="badge" style="background:${l.status==='New' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color:${l.status==='New' ? '#34d399' : '#fbbf24'}; box-shadow:0 0 10px ${l.status==='New' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'};">${l.status}</span>
            </li>
        `).join('');
        if(leads.length===0) list.innerHTML = '<li style="justify-content:center; color:var(--text-muted)">No CRM records.</li>';
    } catch(e) { }
}

async function loadFees() {
    try {
        const res = await fetch('/api/fees'); const fees = await res.json();
        const list = document.getElementById('fees-list');
        list.innerHTML = fees.map(f => `
            <li>
                <div>
                    <div style="font-weight:400; font-size:1rem; color:var(--text-muted);"><i class="fa-regular fa-user" style="margin-right:8px;"></i>${f.full_name}</div>
                    <div style="font-size:1.4rem; color:var(--text); font-weight:800; margin-top:8px;">₹${f.amount}</div>
                </div>
                <span class="badge" style="background:${f.status==='Pending' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; color:${f.status==='Pending' ? '#f87171' : '#34d399'};"><i class="fa-solid ${f.status==='Pending' ? 'fa-clock' : 'fa-check'}"></i> ${f.status}</span>
            </li>
        `).join('');
        if(fees.length === 0) list.innerHTML = '<li style="justify-content:center; color:var(--text-muted)">No financial constraints!</li>';
    } catch(e) { }
}
