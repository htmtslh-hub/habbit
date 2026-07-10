(function(){
'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

// ===== CREATE USER PROFILE =====
async function createUserProfile(user, isNewUser){
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    if(!doc.exists || isNewUser){
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
        const profileData = {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            plan: 'trial',
            role: 'customer',
            trialStartedAt: firebase.firestore.Timestamp.fromDate(now),
            trialExpiresAt: firebase.firestore.Timestamp.fromDate(trialEnd),
            planUpdatedAt: firebase.firestore.Timestamp.fromDate(now),
            planExpiresAt: null,
            createdAt: firebase.firestore.Timestamp.fromDate(now),
            lastLoginAt: firebase.firestore.Timestamp.fromDate(now),
            disabled: false,
        };
        if(doc.exists){
            // Existing user - only update lastLoginAt and missing fields
            await userRef.set(profileData, {merge: true});
        } else {
            await userRef.set(profileData);
        }
    } else {
        // Existing user - update last login and profile info
        await userRef.update({
            lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
            email: user.email || doc.data().email || '',
            displayName: user.displayName || doc.data().displayName || '',
            photoURL: user.photoURL || doc.data().photoURL || '',
        });
    }
}

// ===== PARTICLE BACKGROUND =====
function initParticles(){
    const canvas = document.getElementById('particleCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    const particles = [];
    for(let i = 0; i < 60; i++){
        particles.push({
            x: Math.random()*W, y: Math.random()*H,
            vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
            r: Math.random()*2 + 0.5,
            alpha: Math.random()*0.4 + 0.1
        });
    }

    function draw(){
        ctx.clearRect(0,0,W,H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
            if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(0, 245, 160, ${p.alpha})`;
            ctx.fill();
        });
        // Draw connections
        for(let i = 0; i < particles.length; i++){
            for(let j = i+1; j < particles.length; j++){
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 120){
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 245, 160, ${0.06 * (1 - dist/120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ===== TAB SWITCHING =====
function initTabs(){
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    tabLogin.onclick = () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        hideMessages();
    };
    tabRegister.onclick = () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
        hideMessages();
    };
}

// ===== PASSWORD TOGGLE =====
function initPassToggle(){
    document.getElementById('toggleLoginPass').onclick = function(){
        const inp = document.getElementById('loginPassword');
        inp.type = inp.type === 'password' ? 'text' : 'password';
        this.textContent = inp.type === 'password' ? '👁️' : '🙈';
    };
    document.getElementById('toggleRegPass').onclick = function(){
        const inp = document.getElementById('regPassword');
        inp.type = inp.type === 'password' ? 'text' : 'password';
        this.textContent = inp.type === 'password' ? '👁️' : '🙈';
    };
}

// ===== MESSAGE HELPERS =====
function showError(msg){
    const el = document.getElementById('authError');
    el.textContent = msg;
    el.classList.add('show');
    document.getElementById('authSuccess').classList.remove('show');
}
function showSuccess(msg){
    const el = document.getElementById('authSuccess');
    el.textContent = msg;
    el.classList.add('show');
    document.getElementById('authError').classList.remove('show');
}
function hideMessages(){
    document.getElementById('authError').classList.remove('show');
    document.getElementById('authSuccess').classList.remove('show');
}

function setLoading(btn, loading){
    const text = btn.querySelector('.btn-text');
    const load = btn.querySelector('.btn-loading');
    if(loading){
        text.style.display = 'none';
        load.style.display = 'inline';
        btn.disabled = true;
    } else {
        text.style.display = 'inline';
        load.style.display = 'none';
        btn.disabled = false;
    }
}

function translateFirebaseError(code){
    const map = {
        'auth/user-not-found': 'Email chưa được đăng ký',
        'auth/wrong-password': 'Mật khẩu không đúng',
        'auth/invalid-credential': 'Email hoặc mật khẩu không đúng',
        'auth/email-already-in-use': 'Email đã được sử dụng',
        'auth/weak-password': 'Mật khẩu phải có ít nhất 6 ký tự',
        'auth/invalid-email': 'Địa chỉ email không hợp lệ',
        'auth/too-many-requests': 'Quá nhiều lần thử, vui lòng đợi',
        'auth/popup-closed-by-user': 'Đã đóng cửa sổ đăng nhập Google',
        'auth/network-request-failed': 'Lỗi mạng, vui lòng kiểm tra kết nối',
    };
    return map[code] || 'Đã xảy ra lỗi. Vui lòng thử lại.';
}

// ===== EMAIL/PASSWORD LOGIN =====
function initLogin(){
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        hideMessages();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;
        const btn = document.getElementById('btnLogin');
        setLoading(btn, true);
        try {
            const cred = await auth.signInWithEmailAndPassword(email, pass);
            await createUserProfile(cred.user, false);
            showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch(err) {
            showError(translateFirebaseError(err.code));
            setLoading(btn, false);
        }
    };
}

// ===== EMAIL/PASSWORD REGISTER =====
function initRegister(){
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        hideMessages();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        const btn = document.getElementById('btnRegister');

        if(pass !== confirm){
            showError('Mật khẩu xác nhận không khớp');
            return;
        }
        if(pass.length < 6){
            showError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(btn, true);
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, pass);
            await cred.user.updateProfile({ displayName: name });
            await createUserProfile(cred.user, true);
            showSuccess('Tạo tài khoản thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch(err) {
            showError(translateFirebaseError(err.code));
            setLoading(btn, false);
        }
    };
}

// ===== GOOGLE SIGN-IN =====
function initGoogle(){
    document.getElementById('btnGoogle').onclick = async () => {
        hideMessages();
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
            await createUserProfile(result.user, isNew);
            showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch(err) {
            if(err.code !== 'auth/popup-closed-by-user'){
                showError(translateFirebaseError(err.code));
            }
        }
    };
}

// ===== AUTH STATE CHECK =====
function checkAuth(){
    auth.onAuthStateChanged(user => {
        if(user){
            // Already logged in, redirect to app
            window.location.href = 'index.html';
        }
    });
}

// ===== INIT =====
function init(){
    initParticles();
    initTabs();
    initPassToggle();
    initLogin();
    initRegister();
    initGoogle();
    checkAuth();
}

document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', init) 
    : init();

})();
