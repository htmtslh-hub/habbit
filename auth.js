(function(){
'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

// ===== API BASE URL =====
const API_BASE = (window.location.hostname.endsWith('.vercel.app'))
    ? '/api'
    : 'https://habbit-opal.vercel.app/api';


// Flag to prevent redirect during OTP credential-check
let _otpInProgress = false;

// ===== CREATE USER PROFILE =====
async function createUserProfile(user, isNewUser){
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    if(!doc.exists || isNewUser){
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
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
            await userRef.set(profileData, {merge: true});
        } else {
            await userRef.set(profileData);
        }
    } else {
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
        loginForm.style.display = '';
        registerForm.style.display = 'none';
        hideMessages();
        resetLoginOtp();
        resetRegOtp();
    };
    tabRegister.onclick = () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        registerForm.style.display = '';
        loginForm.style.display = 'none';
        hideMessages();
        resetLoginOtp();
        resetRegOtp();
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
    if(!btn) return;
    const text = btn.querySelector('.btn-text');
    const load = btn.querySelector('.btn-loading');
    if(loading){
        if(text) text.style.display = 'none';
        if(load) load.style.display = 'inline';
        btn.disabled = true;
    } else {
        if(text) text.style.display = 'inline';
        if(load) load.style.display = 'none';
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

// =======================================================================
// ===== SHARED OTP UTILITIES =====
// Reusable functions for both login and register OTP flows
// =======================================================================

function setupOtpBoxes(containerSelector, verifyBtnId){
    const boxes = document.querySelectorAll(containerSelector);
    boxes.forEach((box, idx) => {
        box.oninput = (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val;
            if(val){
                box.classList.add('filled');
                box.classList.remove('error');
                const nextBox = document.querySelector(`${containerSelector}[data-index="${idx + 1}"]`);
                if(nextBox) nextBox.focus();
            } else {
                box.classList.remove('filled');
            }
        };
        box.onkeydown = (e) => {
            if(e.key === 'Backspace' && !box.value){
                const prevBox = document.querySelector(`${containerSelector}[data-index="${idx - 1}"]`);
                if(prevBox){
                    prevBox.focus();
                    prevBox.value = '';
                    prevBox.classList.remove('filled');
                }
            }
            if(e.key === 'Enter'){
                const btn = document.getElementById(verifyBtnId);
                if(btn) btn.click();
            }
        };
        box.onpaste = (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
            if(pasted.length === 6){
                pasted.split('').forEach((digit, i) => {
                    const b = document.querySelector(`${containerSelector}[data-index="${i}"]`);
                    if(b){ b.value = digit; b.classList.add('filled'); }
                });
                const lastBox = document.querySelector(`${containerSelector}[data-index="5"]`);
                if(lastBox) lastBox.focus();
            }
        };
        box.onfocus = () => box.select();
    });
}

function getOtpValue(containerSelector){
    let otp = '';
    document.querySelectorAll(containerSelector).forEach(b => { otp += b.value; });
    return otp;
}

function clearOtpBoxes(containerSelector){
    document.querySelectorAll(containerSelector).forEach(b => {
        b.value = '';
        b.classList.remove('filled','error','success');
    });
}

function shakeOtpBoxes(containerSelector){
    document.querySelectorAll(containerSelector).forEach(b => {
        b.classList.add('error');
        setTimeout(() => b.classList.remove('error'), 600);
    });
}

function successOtpBoxes(containerSelector){
    document.querySelectorAll(containerSelector).forEach(b => {
        b.classList.add('success');
    });
}

// Send OTP API call
async function sendOtpApi(email){
    const resp = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return await resp.json();
}

// Verify OTP API call
async function verifyOtpApi(email, otp){
    const resp = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });
    const data = await resp.json();
    data._ok = resp.ok;
    return data;
}

// Expiry timer manager
function createExpiryTimer(countdownElId, timerElId){
    let timerId = null;
    return {
        start(){
            this.stop();
            let remaining = 5 * 60;
            const cdEl = document.getElementById(countdownElId);
            const timerEl = document.getElementById(timerElId);
            if(timerEl) timerEl.classList.remove('expired');

            const tick = () => {
                const min = Math.floor(remaining / 60);
                const sec = remaining % 60;
                if(cdEl) cdEl.textContent = `${min}:${String(sec).padStart(2,'0')}`;
                if(remaining <= 0){
                    clearInterval(timerId); timerId = null;
                    if(cdEl) cdEl.textContent = 'Hết hạn';
                    if(timerEl) timerEl.classList.add('expired');
                    showError('Mã OTP đã hết hạn. Vui lòng gửi mã mới.');
                }
                remaining--;
            };
            tick();
            timerId = setInterval(tick, 1000);
        },
        stop(){
            if(timerId){ clearInterval(timerId); timerId = null; }
        }
    };
}

// Resend cooldown manager
function createResendCooldown(btnId, countdownSpanId){
    let timerId = null;
    return {
        start(){
            this.stop();
            let cooldown = 60;
            const btn = document.getElementById(btnId);
            if(!btn) return;
            btn.disabled = true;
            btn.classList.remove('ready');
            btn.innerHTML = `Gửi lại (<span id="${countdownSpanId}">${cooldown}</span>s)`;

            const tick = () => {
                cooldown--;
                const cd = document.getElementById(countdownSpanId);
                if(cd) cd.textContent = cooldown;
                if(cooldown <= 0){
                    clearInterval(timerId); timerId = null;
                    btn.disabled = false;
                    btn.classList.add('ready');
                    btn.textContent = '🔄 Gửi lại mã';
                }
            };
            timerId = setInterval(tick, 1000);
        },
        stop(){
            if(timerId){ clearInterval(timerId); timerId = null; }
        }
    };
}

// =======================================================================
// ===== LOGIN FLOW (Email/Password + OTP) =====
// Step 1: Enter email+password → verify credentials → send OTP
// Step 2: Enter OTP → verify → complete login
// =======================================================================

let _loginExpiry = createExpiryTimer('loginOtpCountdown', 'loginOtpTimer');
let _loginResend = createResendCooldown('btnResendLoginOtp', 'loginResendCountdown');
let _pendingLogin = null; // {email, password}

function resetLoginOtp(){
    const step1 = document.getElementById('loginStep1');
    const step2 = document.getElementById('loginStep2');
    if(step1) step1.style.display = '';
    if(step2) step2.style.display = 'none';
    _loginExpiry.stop();
    _loginResend.stop();
    clearOtpBoxes('.login-otp-box');
    _pendingLogin = null;
}

function initLogin(){
    const btnLogin = document.getElementById('btnLogin');
    const btnVerify = document.getElementById('btnVerifyLoginOtp');
    const btnResend = document.getElementById('btnResendLoginOtp');
    const btnBack = document.getElementById('btnBackToLogin');

    // Step 1: Verify email+password THEN send OTP
    btnLogin.onclick = async () => {
        hideMessages();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;

        if(!email || !pass){
            showError('Vui lòng nhập email và mật khẩu');
            return;
        }

        setLoading(btnLogin, true);
        try {
            // Set persistence based on "Remember me" checkbox
            const rememberMe = document.getElementById('rememberMe');
            const persistence = (rememberMe && rememberMe.checked)
                ? firebase.auth.Auth.Persistence.LOCAL
                : firebase.auth.Auth.Persistence.SESSION;
            await auth.setPersistence(persistence);

            // First verify credentials are correct by signing in
            _otpInProgress = true;
            const cred = await auth.signInWithEmailAndPassword(email, pass);
            // Credentials valid! Sign out immediately (we need OTP first)
            await auth.signOut();
            _otpInProgress = false;

            // Store credentials for after OTP
            _pendingLogin = { email, password: pass };

            // Send OTP
            const otpResult = await sendOtpApi(email);
            if(!otpResult.success){
                showError(otpResult.message || 'Không thể gửi mã OTP');
                setLoading(btnLogin, false);
                return;
            }

            // Go to OTP step
            showSuccess('✅ Mã xác thực đã gửi đến ' + email);
            document.getElementById('loginStep1').style.display = 'none';
            document.getElementById('loginStep2').style.display = 'block';
            document.getElementById('loginOtpEmailDisplay').textContent = email;
            clearOtpBoxes('.login-otp-box');
            setTimeout(() => {
                const first = document.querySelector('.login-otp-box[data-index="0"]');
                if(first) first.focus();
            }, 300);
            _loginExpiry.start();
            _loginResend.start();
            setLoading(btnLogin, false);

        } catch(err) {
            _otpInProgress = false;
            showError(translateFirebaseError(err.code));
            setLoading(btnLogin, false);
        }
    };

    // Step 2: Verify OTP → complete login
    btnVerify.onclick = async () => {
        hideMessages();
        if(!_pendingLogin) return;

        const otp = getOtpValue('.login-otp-box');
        if(otp.length !== 6){
            showError('Vui lòng nhập đủ 6 số');
            shakeOtpBoxes('.login-otp-box');
            return;
        }

        setLoading(btnVerify, true);
        try {
            const result = await verifyOtpApi(_pendingLogin.email, otp);
            if(!result._ok || !result.success){
                showError(result.message || 'Mã OTP không đúng');
                shakeOtpBoxes('.login-otp-box');
                setLoading(btnVerify, false);
                return;
            }

            // OTP verified! Now actually sign in
            successOtpBoxes('.login-otp-box');
            showSuccess('✅ Xác thực thành công! Đang đăng nhập...');

            const cred = await auth.signInWithEmailAndPassword(_pendingLogin.email, _pendingLogin.password);
            await createUserProfile(cred.user, false);

            _loginExpiry.stop();
            _loginResend.stop();
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);

        } catch(err) {
            showError(err.code ? translateFirebaseError(err.code) : (err.message || 'Lỗi xác thực'));
            setLoading(btnVerify, false);
        }
    };

    // Resend OTP
    btnResend.onclick = async () => {
        if(!_pendingLogin) return;
        hideMessages();
        btnResend.disabled = true;
        try {
            const result = await sendOtpApi(_pendingLogin.email);
            if(result.success){
                showSuccess('✅ Mã mới đã gửi đến ' + _pendingLogin.email);
                clearOtpBoxes('.login-otp-box');
                _loginExpiry.start();
            } else {
                showError(result.message || 'Không thể gửi lại mã');
            }
        } catch(err){
            showError('Lỗi kết nối. Vui lòng thử lại.');
        }
        _loginResend.start();
    };

    // Back button
    btnBack.onclick = () => {
        hideMessages();
        resetLoginOtp();
    };

    // Setup OTP input boxes for login
    setupOtpBoxes('.login-otp-box', 'btnVerifyLoginOtp');
}

// =======================================================================
// ===== REGISTER FLOW (Info + OTP) =====
// Step 1: Enter info → send OTP
// Step 2: Enter OTP → verify → create account
// =======================================================================

let _regExpiry = createExpiryTimer('otpCountdown', 'otpTimer');
let _regResend = createResendCooldown('btnResendOtp', 'resendCountdown');
let _pendingReg = null; // {name, email, password}

function resetRegOtp(){
    const step1 = document.getElementById('regStep1');
    const step2 = document.getElementById('regStep2');
    if(step1) step1.style.display = '';
    if(step2) step2.style.display = 'none';
    _regExpiry.stop();
    _regResend.stop();
    clearOtpBoxes('#registerForm .otp-box');
    _pendingReg = null;
}

function initRegister(){
    const btnSendOtp = document.getElementById('btnSendOtp');
    const btnVerifyOtp = document.getElementById('btnVerifyOtp');
    const btnResendOtp = document.getElementById('btnResendOtp');
    const btnBack = document.getElementById('btnBackToReg');

    // Step 1: Validate info → send OTP
    btnSendOtp.onclick = async () => {
        hideMessages();
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;

        if(!name){ showError('Vui lòng nhập họ và tên'); return; }
        if(!email){ showError('Vui lòng nhập email'); return; }
        if(pass.length < 6){ showError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
        if(pass !== confirm){ showError('Mật khẩu xác nhận không khớp'); return; }

        _pendingReg = { name, email, password: pass };

        setLoading(btnSendOtp, true);
        try {
            const result = await sendOtpApi(email);
            if(!result.success){
                showError(result.message || 'Không thể gửi mã OTP');
                setLoading(btnSendOtp, false);
                return;
            }

            showSuccess('✅ Mã OTP đã gửi đến ' + email);
            document.getElementById('regStep1').style.display = 'none';
            document.getElementById('regStep2').style.display = 'block';
            document.getElementById('otpEmailDisplay').textContent = email;
            clearOtpBoxes('#registerForm .otp-box');
            setTimeout(() => {
                const first = document.querySelector('#registerForm .otp-box[data-index="0"]');
                if(first) first.focus();
            }, 300);
            _regExpiry.start();
            _regResend.start();
            setLoading(btnSendOtp, false);

        } catch(err){
            showError('Lỗi kết nối. Vui lòng thử lại.');
            setLoading(btnSendOtp, false);
        }
    };

    // Step 2: Verify OTP → create account
    btnVerifyOtp.onclick = async () => {
        hideMessages();
        if(!_pendingReg) return;

        const otp = getOtpValue('#registerForm .otp-box');
        if(otp.length !== 6){
            showError('Vui lòng nhập đủ 6 số');
            shakeOtpBoxes('#registerForm .otp-box');
            return;
        }

        setLoading(btnVerifyOtp, true);
        try {
            const result = await verifyOtpApi(_pendingReg.email, otp);
            if(!result._ok || !result.success){
                showError(result.message || 'Mã OTP không đúng');
                shakeOtpBoxes('#registerForm .otp-box');
                setLoading(btnVerifyOtp, false);
                return;
            }

            successOtpBoxes('#registerForm .otp-box');
            showSuccess('✅ Xác minh thành công! Đang tạo tài khoản...');

            const cred = await auth.createUserWithEmailAndPassword(_pendingReg.email, _pendingReg.password);
            await cred.user.updateProfile({ displayName: _pendingReg.name });
            await createUserProfile(cred.user, true);

            _regExpiry.stop();
            _regResend.stop();
            setTimeout(() => { window.location.href = 'index.html'; }, 1200);

        } catch(err){
            if(err.code){
                showError(translateFirebaseError(err.code));
            } else {
                showError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
            }
            setLoading(btnVerifyOtp, false);
        }
    };

    // Resend OTP
    btnResendOtp.onclick = async () => {
        if(!_pendingReg) return;
        hideMessages();
        btnResendOtp.disabled = true;
        try {
            const result = await sendOtpApi(_pendingReg.email);
            if(result.success){
                showSuccess('✅ Mã mới đã gửi đến ' + _pendingReg.email);
                clearOtpBoxes('#registerForm .otp-box');
                _regExpiry.start();
            } else {
                showError(result.message || 'Không thể gửi lại mã');
            }
        } catch(err){
            showError('Lỗi kết nối. Vui lòng thử lại.');
        }
        _regResend.start();
    };

    // Back button
    btnBack.onclick = () => {
        hideMessages();
        resetRegOtp();
    };

    // Setup OTP input boxes for register
    setupOtpBoxes('#registerForm .otp-box', 'btnVerifyOtp');
}

// ===== GOOGLE SIGN-IN =====
function isElectron(){
    return !!(window.electronAPI && window.electronAPI.isElectron);
}

// Helper functions for showing/hiding containers during Electron external OAuth
function showElectronWaiting() {
    const tabs = document.querySelector('.auth-tabs');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const divider = document.querySelector('.auth-divider');
    const btnGoogle = document.getElementById('btnGoogle');
    const waitingContainer = document.getElementById('electronWaitingContainer');
    
    if (tabs) tabs.style.display = 'none';
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'none';
    if (divider) divider.style.display = 'none';
    if (btnGoogle) btnGoogle.style.display = 'none';
    if (waitingContainer) waitingContainer.style.display = 'block';
}

function resetFromWaiting() {
    const tabs = document.querySelector('.auth-tabs');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const divider = document.querySelector('.auth-divider');
    const btnGoogle = document.getElementById('btnGoogle');
    const waitingContainer = document.getElementById('electronWaitingContainer');
    
    if (tabs) tabs.style.display = '';
    if (divider) divider.style.display = '';
    if (btnGoogle) btnGoogle.style.display = '';
    if (waitingContainer) waitingContainer.style.display = 'none';
    
    // Determine which form to show based on active tab
    const tabLogin = document.getElementById('tabLogin');
    if (tabLogin && tabLogin.classList.contains('active')) {
        if (loginForm) loginForm.style.display = '';
        if (registerForm) registerForm.style.display = 'none';
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = '';
    }
}

function initGoogle(){
    const btnGoogle = document.getElementById('btnGoogle');
    if (!btnGoogle) return;

    btnGoogle.onclick = async () => {
        hideMessages();
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        if (isElectron()) {
            // === APPROACH 1: Try signInWithPopup directly in Electron ===
            // Electron loads via http://127.0.0.1:PORT which should allow Google OAuth popup
            try {
                console.log('[Electron Auth] Trying direct signInWithPopup...');
                const result = await auth.signInWithPopup(provider);
                const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
                await createUserProfile(result.user, isNew);
                showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
                setTimeout(() => { window.location.href = 'index.html'; }, 800);
                return;
            } catch (popupErr) {
                console.warn('[Electron Auth] Direct popup failed:', popupErr.code, popupErr.message);
                // If popup was closed by user, don't fall back
                if (popupErr.code === 'auth/popup-closed-by-user') return;
            }

            // === APPROACH 2: System browser gateway (fallback) ===
            console.log('[Electron Auth] Falling back to system browser gateway...');
            showElectronWaiting();
            const port = window.location.port || '17532';
            const webAuthUrl = `https://habitmastery.web.app/auth.html?mode=desktop&port=${port}`;
            
            if (window.electronAPI && window.electronAPI.openExternal) {
                window.electronAPI.openExternal(webAuthUrl);
            } else {
                showError('Không thể mở trình duyệt hệ thống.');
                resetFromWaiting();
                return;
            }
            
            if (window.electronAPI && window.electronAPI.onGoogleAuthCallback) {
                window.electronAPI.onGoogleAuthCallback(async (data) => {
                    const { idToken, accessToken } = data;
                    try {
                        console.log('[Electron Auth] Received tokens from gateway, accessToken type:', accessToken === 'FIREBASE_TOKEN' ? 'Firebase' : 'Google OAuth');
                        
                        if (accessToken === 'FIREBASE_TOKEN') {
                            // Gateway couldn't get Google OAuth credential, sent Firebase ID token instead
                            // We can't use signInWithCredential with a Firebase token
                            // Instead, the user is already signed in on the gateway — we sign in again here
                            // by verifying the token through our own server
                            console.log('[Electron Auth] Received Firebase token, attempting direct Google sign-in...');
                            
                            // Try signInWithPopup one more time from Electron
                            try {
                                const result = await auth.signInWithPopup(provider);
                                const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
                                await createUserProfile(result.user, isNew);
                                showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
                                setTimeout(() => { window.location.href = 'index.html'; }, 800);
                            } catch(retryErr) {
                                showError('Đăng nhập không thành công. Vui lòng thử lại.');
                                resetFromWaiting();
                            }
                        } else {
                            // Got proper Google OAuth tokens — use signInWithCredential
                            showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
                            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken || null);
                            const result = await auth.signInWithCredential(credential);
                            await createUserProfile(result.user, result.additionalUserInfo?.isNewUser || false);
                            setTimeout(() => { window.location.href = 'index.html'; }, 800);
                        }
                    } catch (err) {
                        console.error('[Electron Auth] signInWithCredential error:', err);
                        showError(translateFirebaseError(err.code) || err.message);
                        resetFromWaiting();
                    }
                });
            }
            return;
        }

        // Web: use popup normally
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

    const btnCancelExternalLogin = document.getElementById('btnCancelExternalLogin');
    if (btnCancelExternalLogin) {
        btnCancelExternalLogin.onclick = () => {
            hideMessages();
            resetFromWaiting();
        };
    }
}

// ===== DESKTOP GATEWAY FOR SYSTEM BROWSER =====
function initDesktopGateway() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const port = urlParams.get('port');
    
    if (mode === 'desktop') {
        const tabs = document.querySelector('.auth-tabs');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const divider = document.querySelector('.auth-divider');
        const btnGoogle = document.getElementById('btnGoogle');
        const externalGoogleContainer = document.getElementById('externalGoogleContainer');
        
        if (tabs) tabs.style.display = 'none';
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (divider) divider.style.display = 'none';
        if (btnGoogle) btnGoogle.style.display = 'none';
        if (externalGoogleContainer) externalGoogleContainer.style.display = 'block';
        
        const btnGoogleExternal = document.getElementById('btnGoogleExternal');
        const externalStatus = document.getElementById('externalStatus');
        
        if (btnGoogleExternal) {
            btnGoogleExternal.onclick = async () => {
                setLoading(btnGoogleExternal, true);
                if (externalStatus) externalStatus.textContent = 'Đang mở cửa sổ đăng nhập Google...';
                
                try {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    provider.addScope('profile');
                    provider.addScope('email');
                    const result = await auth.signInWithPopup(provider);
                    
                    console.log('[Desktop Gateway] signInWithPopup success:', result.user.email);
                    
                    // Extract Google OAuth credential
                    let idToken = null, accessToken = null;
                    
                    // Method 1: Direct credential from result (compat SDK)
                    if (result.credential && result.credential.idToken) {
                        idToken = result.credential.idToken;
                        accessToken = result.credential.accessToken || '';
                        console.log('[Desktop Gateway] Got tokens from result.credential');
                    }
                    
                    // Method 2: credentialFromResult static method (newer SDK)
                    if (!idToken && firebase.auth.GoogleAuthProvider.credentialFromResult) {
                        try {
                            const cred = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
                            if (cred && cred.idToken) {
                                idToken = cred.idToken;
                                accessToken = cred.accessToken || '';
                                console.log('[Desktop Gateway] Got tokens from credentialFromResult');
                            }
                        } catch(e) { console.warn('credentialFromResult failed:', e); }
                    }
                    
                    // Method 3: Use Firebase ID token as fallback (works with signInWithCredential on Electron side using a different approach)
                    if (!idToken) {
                        console.log('[Desktop Gateway] No OAuth credential, using Firebase ID token');
                        idToken = await result.user.getIdToken(true);
                        accessToken = 'FIREBASE_TOKEN'; // Flag to tell Electron this is a Firebase token, not Google OAuth
                    }
                    
                    if (externalStatus) externalStatus.textContent = 'Đang chuyển thông tin đăng nhập về ứng dụng máy tính...';
                    
                    // Redirect browser to Electron's local server to deliver tokens
                    const callbackUrl = `http://127.0.0.1:${port}/api/google-callback?idToken=${encodeURIComponent(idToken)}&accessToken=${encodeURIComponent(accessToken)}&redirect=1`;
                    window.location.href = callbackUrl;
                } catch (err) {
                    console.error('[Desktop Gateway] Error:', err);
                    setLoading(btnGoogleExternal, false);
                    if (externalStatus) {
                        externalStatus.innerHTML = `<span style="color: var(--error);">Lỗi: ${translateFirebaseError(err.code) || err.message}</span>`;
                    }
                }
            };
        }
    }
}

// ===== AUTH STATE CHECK =====
function checkAuth(){
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'desktop') {
        return;
    }
    auth.onAuthStateChanged(user => {
        if(user && !_otpInProgress){
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
    initDesktopGateway();
    checkAuth();
}

document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', init) 
    : init();

})();
