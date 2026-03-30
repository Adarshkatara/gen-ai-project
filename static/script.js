document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('savedNexusEmail')) {
        const mailField = document.getElementById('email');
        const passField = document.getElementById('password');
        if(mailField) mailField.value = localStorage.getItem('savedNexusEmail');
        if(passField) passField.value = localStorage.getItem('savedNexusPassword');
    }
});

// ===== GOOGLE SIGN-IN =====
let GOOGLE_CLIENT_ID = localStorage.getItem('googleClientId') || '706755090302-hrvetflmapv6rjt8vmljbrujhse7hd0g.apps.googleusercontent.com';

function signInWithGoogle() {
    // Check if a real Client ID has been configured
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.length < 20 || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        showGoogleSetupModal();
        return;
    }
    if (!window.google) {
        showToast('Google Sign-In script is still loading, please try again in a moment.', 'error');
        return;
    }
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
    });
    google.accounts.id.prompt();
}

function showGoogleSetupModal() {
    const existing = document.getElementById('google-setup-modal');
    if (existing) { existing.style.display = 'flex'; return; }
    const modal = document.createElement('div');
    modal.id = 'google-setup-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    modal.innerHTML = `
        <div style="background:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:2.5rem;max-width:480px;width:100%;font-family:'Outfit',sans-serif;color:#f1f5f9;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;">
                <svg width="32" height="32" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <h3 style="margin:0;font-size:1.3rem;font-weight:700;">Set Up Google Sign-In</h3>
            </div>
            <p style="color:#94a3b8;font-size:0.92rem;margin:0 0 1.2rem;line-height:1.7;">Google Sign-In requires a free <strong>OAuth Client ID</strong> from Google Cloud. Follow these steps:</p>
            <ol style="color:#94a3b8;font-size:0.88rem;line-height:2;margin:0 0 1.5rem;padding-left:1.2rem;">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" style="color:#818cf8;">console.cloud.google.com</a></li>
                <li>Create a project → APIs & Services → Credentials</li>
                <li>Create OAuth 2.0 Client ID → Web application</li>
                <li>Add <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">http://127.0.0.1:5000</code> to Authorized Origins</li>
                <li>Copy the Client ID and paste it below</li>
            </ol>
            <input type="text" id="google-client-id-input" placeholder="Paste your Google Client ID here..." style="width:100%;box-sizing:border-box;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.1);color:#f1f5f9;padding:12px 16px;border-radius:10px;font-family:'Outfit',sans-serif;font-size:0.95rem;margin-bottom:1rem;">
            <div style="display:flex;gap:10px;">
                <button onclick="saveGoogleClientId()" style="flex:1;background:linear-gradient(135deg,#6366f1,#0ea5e9);color:white;border:none;padding:12px;border-radius:10px;font-weight:700;font-size:0.95rem;cursor:pointer;font-family:'Outfit',sans-serif;">Save & Sign In</button>
                <button onclick="document.getElementById('google-setup-modal').style.display='none'" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:12px 20px;border-radius:10px;font-weight:600;cursor:pointer;font-family:'Outfit',sans-serif;">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

function saveGoogleClientId() {
    const input = document.getElementById('google-client-id-input').value.trim();
    if (!input || input.length < 20) return showToast('Please paste a valid Google Client ID', 'error');
    localStorage.setItem('googleClientId', input);
    GOOGLE_CLIENT_ID = input;
    document.getElementById('google-setup-modal').style.display = 'none';
    showToast('Client ID saved! Launching Google Sign-In...', 'success');
    setTimeout(signInWithGoogle, 800);
}

// Temporarily store Google credential while user picks a role
let _pendingGoogleCredential = null;

function handleGoogleCredential(response) {
    _pendingGoogleCredential = response.credential;
    showRoleSelectionModal();
}

function showRoleSelectionModal() {
    const existing = document.getElementById('google-role-modal');
    if (existing) { existing.remove(); }

    const roles = [
        {
            value: 'Student',
            icon: 'fa-graduation-cap',
            label: 'Student',
            desc: 'Access courses, grades & attendance',
            gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            glow: 'rgba(99,102,241,0.35)'
        },
        {
            value: 'Faculty',
            icon: 'fa-chalkboard-user',
            label: 'Faculty',
            desc: 'Manage classes, marks & materials',
            gradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
            glow: 'rgba(14,165,233,0.35)'
        },
        {
            value: 'Admin',
            icon: 'fa-shield-halved',
            label: 'Administrator',
            desc: 'Full platform control & analytics',
            gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
            glow: 'rgba(245,158,11,0.35)'
        }
    ];

    const modal = document.createElement('div');
    modal.id = 'google-role-modal';
    modal.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.75);
        backdrop-filter:blur(12px);z-index:9999;
        display:flex;align-items:center;justify-content:center;padding:20px;
        animation:fadeIn 0.25s ease;
    `;

    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @keyframes fadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .role-card {
            position:relative;background:rgba(255,255,255,0.04);
            border:1.5px solid rgba(255,255,255,0.08);border-radius:18px;
            padding:1.6rem 1.4rem;cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
            text-align:center;animation:slideUp 0.35s ease backwards;
        }
        .role-card:hover { transform:translateY(-4px) scale(1.03); border-color:rgba(255,255,255,0.22); }
        .role-card.selected { border-width:2px; transform:translateY(-4px) scale(1.04); }
        .role-icon {
            width:64px;height:64px;border-radius:16px;
            display:flex;align-items:center;justify-content:center;
            font-size:1.7rem;color:white;margin:0 auto 1rem;
            box-shadow:0 8px 24px var(--glow);
        }
        #google-role-modal .confirm-btn {
            width:100%;padding:15px;border:none;border-radius:12px;
            background:linear-gradient(135deg,#6366f1,#0ea5e9);
            color:white;font-family:'Outfit',sans-serif;font-size:1.05rem;
            font-weight:700;cursor:pointer;margin-top:1.2rem;
            transition:all 0.3s;opacity:0.5;pointer-events:none;
            display:flex;align-items:center;justify-content:center;gap:10px;
        }
        #google-role-modal .confirm-btn.active { opacity:1;pointer-events:auto;box-shadow:0 8px 28px rgba(99,102,241,0.4); }
        #google-role-modal .confirm-btn.active:hover { transform:translateY(-2px);box-shadow:0 12px 36px rgba(99,102,241,0.5); }
    `;
    document.head.appendChild(styleTag);

    modal.innerHTML = `
        <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:2.2rem 2rem 2rem;max-width:520px;width:100%;font-family:'Outfit',sans-serif;color:#f1f5f9;box-shadow:0 40px 80px rgba(0,0,0,0.6);">
            <div style="text-align:center;margin-bottom:1.8rem;">
                <div style="font-size:2.2rem;margin-bottom:0.6rem;">👋</div>
                <h2 style="margin:0 0 0.5rem;font-size:1.55rem;font-weight:800;background:linear-gradient(135deg,#c7d2fe,#7dd3fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Who are you?</h2>
                <p style="margin:0;color:#94a3b8;font-size:0.95rem;">Select your role to complete Google Sign-In</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:0.5rem;" id="role-cards-grid">
                ${roles.map((r, i) => `
                    <div class="role-card" data-role="${r.value}" onclick="selectGoogleRole('${r.value}', this)"
                         style="animation-delay:${i * 0.07}s;">
                        <div class="role-icon" style="background:${r.gradient};--glow:${r.glow};box-shadow:0 8px 24px ${r.glow};">
                            <i class="fa-solid ${r.icon}"></i>
                        </div>
                        <div style="font-weight:700;font-size:1rem;margin-bottom:0.35rem;">${r.label}</div>
                        <div style="color:#94a3b8;font-size:0.78rem;line-height:1.4;">${r.desc}</div>
                    </div>
                `).join('')}
            </div>
            <div id="google-role-hint" style="text-align:center;color:#64748b;font-size:0.82rem;margin-top:0.8rem;min-height:18px;"></div>
            <button class="confirm-btn" id="google-role-confirm-btn" onclick="completeGoogleSignIn()">
                <i class="fa-solid fa-right-to-bracket"></i> Continue to NEXUS
            </button>
            <button onclick="document.getElementById('google-role-modal').remove()" style="
                width:100%;margin-top:10px;padding:11px;border:1px solid rgba(255,255,255,0.08);
                border-radius:12px;background:transparent;color:#64748b;
                font-family:'Outfit',sans-serif;font-size:0.9rem;cursor:pointer;
                transition:color 0.2s;
            " onmouseover="this.style.color='#94a3b8'" onmouseout="this.style.color='#64748b'">
                Cancel
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

let _selectedGoogleRole = null;

function selectGoogleRole(role, cardEl) {
    _selectedGoogleRole = role;
    // Reset all cards
    document.querySelectorAll('#role-cards-grid .role-card').forEach(c => {
        c.classList.remove('selected');
        c.style.boxShadow = '';
        c.style.borderColor = '';
    });
    // Highlight selected
    const gradients = { Student: '#6366f1', Faculty: '#0ea5e9', Admin: '#f59e0b' };
    const color = gradients[role] || '#6366f1';
    cardEl.classList.add('selected');
    cardEl.style.boxShadow = `0 0 0 2px ${color}, 0 12px 32px ${color}44`;
    cardEl.style.borderColor = color;
    // Enable button
    const btn = document.getElementById('google-role-confirm-btn');
    btn.classList.add('active');
    // Update hint
    const hints = {
        Student: '🎓 You\'ll be redirected to the Student ERP Dashboard',
        Faculty: '📚 You\'ll access Faculty tools and class management',
        Admin: '🛡️ Full administrator access will be granted'
    };
    document.getElementById('google-role-hint').textContent = hints[role] || '';
}

async function completeGoogleSignIn() {
    if (!_selectedGoogleRole || !_pendingGoogleCredential) return;
    const btn = document.getElementById('google-role-confirm-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
    btn.style.pointerEvents = 'none';
    try {
        const res = await fetch('/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: _pendingGoogleCredential, role: _selectedGoogleRole })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('google-role-modal').remove();
            showToast(`Welcome! Signed in as ${_selectedGoogleRole}`, 'success');
            setTimeout(() => window.location.href = data.redirect, 1000);
        } else {
            showToast(data.message || 'Google Sign-In failed', 'error');
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Continue to NEXUS';
            btn.style.pointerEvents = 'auto';
        }
    } catch(e) {
        showToast('Connection error during Google Sign-In', 'error');
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Continue to NEXUS';
        btn.style.pointerEvents = 'auto';
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
