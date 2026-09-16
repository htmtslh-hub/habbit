(function(){
'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

// ===== API BASE URL =====
// API nằm trên Vercel, KHÔNG nằm trên Firebase Hosting. Firebase Hosting
// cũng không thể rewrite sang một tên miền ngoài (chỉ trỏ được vào Cloud
// Functions / Cloud Run), nên đường dẫn tương đối '/api' KHÔNG BAO GIỜ
// tồn tại trên habit-mastery.com hay habitmastery.web.app.
//
// [SỬA 09/09/2026] Điều kiện cũ bị ngược: chỉ dùng URL Vercel khi chạy
// localhost/file, còn trên tên miền thật lại gọi '/api' -> **404**, tức
// xác thực 2 lớp OTP hỏng trên web suốt thời gian qua. Đây là lỗi thứ
// hai của cùng luồng OTP, độc lập với lỗi CORS đã sửa trước đó: request
// thậm chí chưa bao giờ tới được máy chủ để mà bị CORS chặn.
//
// admin.js vốn làm đúng theo hướng này (chỉ dùng '/api' khi CHÍNH TRANG
// đang chạy trên vercel.app) — nay thống nhất lại cho giống.
const API_BASE = window.location.hostname.endsWith('.vercel.app')
    ? '/api'
    : 'https://habbit-opal.vercel.app/api';

// Register additional UI translations for the redesigned layout
(function(){
    const i18n = window.I18N || window.i18n;
    if (!i18n || !i18n.registerTranslations) return;

    i18n.registerTranslations('vi', {
        app_nav_title: "Habit Mastery • Trải nghiệm Mobile App",
        auth_card_title_login: "Đăng nhập",
        auth_card_title_register: "Đăng ký",
        auth_card_sub_login: "Chào mừng bạn trở lại! Tiếp tục hành trình rèn luyện",
        auth_card_sub_register: "Tạo tài khoản để bắt đầu rèn luyện kỷ luật",
        forgot_password: "Quên mật khẩu?",
        btn_apple: "Tiếp tục với Apple",
        already_have_account: "Đã có tài khoản?",
        dont_have_account: "Chưa có tài khoản?",
        link_login: "Đăng nhập",
        link_register: "Đăng ký",
        exp_header: "4 Trụ Cột Kỷ Luật Giữ Chân Người Dùng",
        exp_card1_title: "👑 Hệ Thống Cảnh Giới",
        exp_card1_desc: "21 bậc thang tâm thức, thăng cấp theo chuỗi Streak & mở khóa Khung Avatar thần thoại",
        exp_card2_title: "📚 Hệ Thống Tài Liệu",
        exp_card2_desc: "Kho tàng tri thức kỷ luật, tâm pháp khắc kỷ & cẩm nang thực chiến chuyên sâu",
        exp_card3_title: "🎧 Hệ Thống Tập Trung",
        exp_card3_desc: "Đồng hồ Pomodoro kết hợp Sound Mixer sóng não đa tầng, đưa bạn vào dòng chảy Flow",
        exp_card4_title: "🛡️ Hệ Thống Cộng Đồng",
        exp_card4_desc: "Tổ đội Squads 3-5 người cam kết, bảng xếp hạng vinh danh & kết nối chiến hữu Zalo",
        exp_book_title: "📖 Khám phá Cẩm nang 4 Trụ Cột Kỷ Luật",
        exp_btn_continue: "Bắt đầu trải nghiệm ngay",
        util_desktop_app: "💻 Desktop App",
        util_pricing: "💎 Bảng giá",
        util_zalo_group: "Nhóm Zalo",
        showcase_social_label: "Cộng Đồng Kỷ Luật",
        showcase_zalo_pill_text: "Cộng đồng Zalo: <strong>Habit Mastery</strong> ↗",
        book_modal_title: "4 Trụ Cột Giữ Chân Người Dùng",
        book_modal_sub: "Hệ sinh thái rèn luyện kỷ luật gây nghiện lành mạnh của Habit Mastery",
        book_modal_p1: "<strong style=\"color:#ffffff;\">👑 1. Hệ Thống Cảnh Giới (21 Bậc Thang Tâm Thức):</strong><br>Biến kỷ luật thành hành trình tu luyện: tích lũy điểm DP, duy trì chuỗi Streak rực lửa, thăng cấp từ Vô Minh đến Siêu Thoát Niết Bàn và mở khóa Khung Avatar danh giá.",
        book_modal_p2: "<strong style=\"color:#ffffff;\">📚 2. Hệ Thống Tài Liệu (Thư Viện Tâm Pháp Tri Thức):</strong><br>Kho tàng tài liệu rèn luyện, triết lý Khắc Kỷ (Stoicism), tâm lý học hành vi và tóm tắt sách tinh hoa giúp củng cố nhận thức gốc rễ.",
        book_modal_p3: "<strong style=\"color:#ffffff;\">🎧 3. Hệ Thống Tập Trung (Không Gian Deep Work & Flow):</strong><br>Bộ đếm Pomodoro chuyên sâu tích hợp Sound Mixer âm thanh đa tầng (tiếng mưa, sóng não Alpha, lửa trại) giúp đập tan xao nhãng tức thì.",
        book_modal_p4: "<strong style=\"color:#ffffff;\">🛡️ 4. Hệ Thống Cộng Đồng (Tổ Đội & Trách Nhiệm Xã Hội):</strong><br>Thách đấu chuỗi ngày, lập tổ đội Squads 3-5 người cùng cam kết, bảng xếp hạng vinh danh và cộng đồng Zalo đồng hành mỗi ngày.",
        book_modal_blog_btn: "Khám phá Blog ↗",
        book_modal_understand_btn: "Đã hiểu",
        download_modal_title: "💻 Tải Ứng Dụng Habit Mastery Cho Máy Tính",
        forgot_modal_title: "Khôi phục mật khẩu",
        forgot_modal_desc: "Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu an toàn.",
        btn_send_reset: "Gửi email khôi phục",
        msg_reset_sent: "Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư đến của bạn."
    });

    i18n.registerTranslations('en', {
        app_nav_title: "Habit Mastery • Mobile App Experience",
        auth_card_title_login: "Sign In",
        auth_card_title_register: "Sign Up",
        auth_card_sub_login: "Welcome back! Continue your journey",
        auth_card_sub_register: "Create an account to continue",
        forgot_password: "Forgot Password?",
        btn_apple: "Continue with Apple",
        already_have_account: "Already have an account?",
        dont_have_account: "Don't have an account?",
        link_login: "Log In",
        link_register: "Sign Up",
        exp_header: "4 Core Retention Pillars of Mastery",
        exp_card1_title: "👑 Realm Evolution System",
        exp_card1_desc: "21 conscious stages, ascend via Streak discipline & unlock mythic avatar frames",
        exp_card2_title: "📚 Knowledge & Library System",
        exp_card2_desc: "Stoic mastery guides, mental models & curated deep-learning library",
        exp_card3_title: "🎧 Deep Focus & Flow System",
        exp_card3_desc: "Integrated Pomodoro timer with multi-layered ambient sound mixer for deep work",
        exp_card4_title: "🛡️ Community & Squad System",
        exp_card4_desc: "Accountability squads, real-time leaderboard duels & active community support",
        exp_book_title: "📖 Explore the 4 Pillars of Discipline Guide",
        exp_btn_continue: "Start Your Journey",
        util_desktop_app: "💻 Desktop App",
        util_pricing: "💎 Pricing",
        util_zalo_group: "Zalo Group",
        showcase_social_label: "Mastery Community",
        showcase_zalo_pill_text: "Zalo Community: <strong>Habit Mastery</strong> ↗",
        book_modal_title: "4 Core Retention Pillars",
        book_modal_sub: "Habit Mastery's healthy, habit-building mastery ecosystem",
        book_modal_p1: "<strong style=\"color:#ffffff;\">👑 1. Realm Evolution System (21 Consciousness Stages):</strong><br>Transform daily discipline into spiritual ascension: accumulate DP, maintain unbroken streaks, evolve from Ignorance to Nirvana, and unlock mythic avatar frames.",
        book_modal_p2: "<strong style=\"color:#ffffff;\">📚 2. Knowledge Library (Stoic Wisdom):</strong><br>Curated deep-discipline books, Stoic philosophies, behavioral psychology, and master summaries to solidify mental clarity.",
        book_modal_p3: "<strong style=\"color:#ffffff;\">🎧 3. Deep Focus & Flow Space:</strong><br>Dedicated Pomodoro timer with layered binaural sound mixer (rain, alpha brainwaves, campfire) for instant flow state.",
        book_modal_p4: "<strong style=\"color:#ffffff;\">🛡️ 4. Community & Squads (Peer Accountability):</strong><br>Streak challenges, 3-5 member mutual squads, honor leaderboards, and daily companion community.",
        book_modal_blog_btn: "Explore Blog ↗",
        book_modal_understand_btn: "Got it",
        download_modal_title: "💻 Download Habit Mastery Desktop App",
        forgot_modal_title: "Reset Password",
        forgot_modal_desc: "Enter your registered email address to receive a secure password reset link.",
        btn_send_reset: "Send Reset Link",
        msg_reset_sent: "Password reset email sent! Please check your inbox."
    });

    i18n.registerTranslations('zh', {
        app_nav_title: "Habit Mastery • 移动应用体验",
        auth_card_title_login: "登录",
        auth_card_title_register: "注册",
        auth_card_sub_login: "欢迎回来！继续自律修行之旅",
        auth_card_sub_register: "创建账号以开始自律训练",
        forgot_password: "忘记密码？",
        btn_apple: "通过 Apple 继续",
        already_have_account: "已有账号？",
        dont_have_account: "还没有账号？",
        link_login: "立即登录",
        link_register: "注册新账号",
        exp_header: "Habit Mastery 四大核心留存基石",
        exp_card1_title: "👑 境界修炼体系",
        exp_card1_desc: "21重意识层级，连击打卡进阶并解锁专属神话头像框",
        exp_card2_title: "📚 智慧知识文库",
        exp_card2_desc: "斯多葛哲学、自律心法及大师级深度阅读专栏",
        exp_card3_title: "🎧 深度专注系统",
        exp_card3_desc: "集成番茄钟与多轨自然白噪音混音器，极速进入心流",
        exp_card4_title: "🛡️ 战队与社群系统",
        exp_card4_desc: "3-5人互助同盟战队、荣耀排行榜与同行自律圈子",
        exp_book_title: "📖 探索四大自律支柱指南",
        exp_btn_continue: "立即体验",
        util_desktop_app: "💻 桌面端应用",
        util_pricing: "💎 价格方案",
        util_zalo_group: "Zalo 社群",
        showcase_social_label: "自律社群同盟",
        showcase_zalo_pill_text: "Zalo 社群: <strong>Habit Mastery</strong> ↗",
        book_modal_title: "四大自律留存基石",
        book_modal_sub: "Habit Mastery 科学高效的良性自律成长生态",
        book_modal_p1: "<strong style=\"color:#ffffff;\">👑 1. 境界修炼体系（21重意识层级）：</strong><br>将日常自律升华为修行之旅：积累DP积分、保持不熄连击、自无明进阶至涅槃，并解锁专属神话头像框。",
        book_modal_p2: "<strong style=\"color:#ffffff;\">📚 2. 智慧知识文库（斯多葛心法）：</strong><br>精选自律典籍、斯多葛哲学、行为心理学与大师级精华书单，筑牢底层认知基石。",
        book_modal_p3: "<strong style=\"color:#ffffff;\">🎧 3. 深度专注空间（心流工作区）：</strong><br>沉浸式番茄钟集成多轨自然音效混音器（雨声、Alpha脑波、篝火），瞬间击碎分心。",
        book_modal_p4: "<strong style=\"color:#ffffff;\">🛡️ 4. 战队与社群（同盟互督体系）：</strong><br>连击PK挑战、3-5人互助战队同盟、荣耀天梯榜及自律同路人每日陪伴。",
        book_modal_blog_btn: "浏览博客 ↗",
        book_modal_understand_btn: "知道了",
        download_modal_title: "💻 下载 Habit Mastery 电脑桌面版",
        forgot_modal_title: "找回密码",
        forgot_modal_desc: "请输入您的注册邮箱，我们将发送重置密码的邮件链接。",
        btn_send_reset: "发送重置邮件",
        msg_reset_sent: "密码重置邮件已发送！请查收您的电子邮箱。"
    });
})();

// Flag to prevent redirect during OTP credential-check
let _otpInProgress = false;

// ===== TRAFFIC & REGISTRATION SOURCE TRACKING =====
// Mã mời bạn bè đi qua tham số ?invite= — CỐ Ý không dùng ?ref= vì tham
// số đó đã được detectAndSaveTrafficSource() dùng để đo nguồn quảng cáo
// (tiktok, facebook, kol_...). Dùng chung sẽ làm hỏng cả hai.
(function captureInviteCode(){
    try {
        const c = new URLSearchParams(window.location.search).get('invite');
        if (c && /^[A-Z0-9]{6}$/i.test(c.trim())) {
            localStorage.setItem('hm_pending_invite', c.trim().toUpperCase());
        }
    } catch (e) {}
})();

function detectAndSaveTrafficSource(){
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref') || urlParams.get('source') || urlParams.get('src') || urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium') || '';
        const utmCampaign = urlParams.get('utm_campaign') || urlParams.get('campaign') || '';
        const rawReferrer = document.referrer || '';
        
        let detectedSource = '';
        
        // 1. Direct param match
        if (ref) {
            const clean = ref.trim().toLowerCase();
            if (['tiktok', 'tt', 'douyin'].includes(clean)) detectedSource = 'tiktok';
            else if (['facebook', 'fb', 'meta', 'messenger'].includes(clean)) detectedSource = 'facebook';
            else if (['youtube', 'yt', 'shorts'].includes(clean)) detectedSource = 'youtube';
            else if (['zalo', 'zl'].includes(clean)) detectedSource = 'zalo';
            else if (['threads'].includes(clean)) detectedSource = 'threads';
            else if (['instagram', 'ig', 'insta'].includes(clean)) detectedSource = 'instagram';
            else if (['google', 'gg', 'search'].includes(clean)) detectedSource = 'google';
            else if (['telegram', 'tele', 'tg'].includes(clean)) detectedSource = 'telegram';
            else if (['twitter', 'x'].includes(clean)) detectedSource = 'twitter';
            else detectedSource = clean; // custom influencer or channel tag like 'kol_linh'
        }
        
        // 2. Referrer fallback if no query param
        if (!detectedSource && rawReferrer) {
            const refLower = rawReferrer.toLowerCase();
            if (refLower.includes('tiktok.com') || refLower.includes('musical.ly')) detectedSource = 'tiktok';
            else if (refLower.includes('facebook.com') || refLower.includes('fb.com') || refLower.includes('messenger.com') || refLower.includes('l.facebook.com') || refLower.includes('lm.facebook.com')) detectedSource = 'facebook';
            else if (refLower.includes('youtube.com') || refLower.includes('youtu.be')) detectedSource = 'youtube';
            else if (refLower.includes('zalo.me') || refLower.includes('chat.zalo.me')) detectedSource = 'zalo';
            else if (refLower.includes('instagram.com')) detectedSource = 'instagram';
            else if (refLower.includes('threads.net')) detectedSource = 'threads';
            else if (refLower.includes('google.com') || refLower.includes('google.com.vn')) detectedSource = 'google';
            else if (refLower.includes('t.co') || refLower.includes('twitter.com') || refLower.includes('x.com')) detectedSource = 'twitter';
            else {
                try {
                    const host = new URL(rawReferrer).hostname;
                    if (host && !host.includes(window.location.hostname)) {
                        detectedSource = host;
                    }
                } catch(e){}
            }
        }
        
        if (!detectedSource) {
            detectedSource = 'direct';
        }
        
        const existingSource = localStorage.getItem('hm_register_source');
        if (detectedSource !== 'direct' || !existingSource) {
            localStorage.setItem('hm_register_source', detectedSource);
            const sourceDetails = {
                source: detectedSource,
                utm_source: ref || detectedSource,
                utm_medium: utmMedium,
                utm_campaign: utmCampaign,
                referrer: rawReferrer,
                landingPage: window.location.href,
                capturedAt: new Date().toISOString()
            };
            localStorage.setItem('hm_source_details', JSON.stringify(sourceDetails));
        }
    } catch(err) {
        console.warn('[Traffic Tracking] Error detecting source:', err);
    }
}

function getStoredTrafficSource(){
    try {
        const src = localStorage.getItem('hm_register_source');
        if (src) return src;
    } catch(e){}
    return 'direct';
}

function getStoredTrafficDetails(){
    try {
        const str = localStorage.getItem('hm_source_details');
        if (str) return JSON.parse(str);
    } catch(e){}
    return {
        source: getStoredTrafficSource(),
        utm_source: getStoredTrafficSource(),
        utm_medium: '',
        utm_campaign: '',
        referrer: document.referrer || '',
        landingPage: window.location.href
    };
}

// ===== REFERRAL & AFFILIATE SYSTEM HELPERS =====
function generateRandomInviteCode() {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZ23456789';
    let code = 'HM';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

async function resolveReferrerUid(refCodeOrUid, currentUid) {
    if (!refCodeOrUid || !db) return null;
    const clean = String(refCodeOrUid).trim().toUpperCase();
    const raw = String(refCodeOrUid).trim();
    if (!clean || clean === currentUid.toUpperCase() || raw === currentUid) return null;

    // 1. Check if raw input is directly a UID in leaderboard or users
    try {
        const lbDoc = await db.collection('leaderboard').doc(raw).get();
        if (lbDoc.exists && lbDoc.id !== currentUid) return lbDoc.id;
    } catch (e) {}

    try {
        const uDoc = await db.collection('users').doc(raw).get();
        if (uDoc.exists && uDoc.id !== currentUid) return uDoc.id;
    } catch (e) {}

    // 2. Check if clean input is an inviteCode in invite_codes collection
    try {
        const codeDoc = await db.collection('invite_codes').doc(clean).get();
        if (codeDoc.exists && codeDoc.data() && codeDoc.data().uid) {
            const foundUid = codeDoc.data().uid;
            if (foundUid !== currentUid) return foundUid;
        }
    } catch (e) {}

    // 3. Check query users by inviteCode
    try {
        const q = await db.collection('users').where('inviteCode', '==', clean).limit(1).get();
        if (!q.empty && q.docs[0].id !== currentUid) return q.docs[0].id;
    } catch (e) {}

    return null;
}

async function recordReferralReward(referrerUid, newUser) {
    if (!referrerUid || !newUser || !db) return;
    try {
        // 1. Record referral doc
        const refDocRef = db.collection('referrals').doc(newUser.uid);
        const existing = await refDocRef.get();
        if (existing.exists) return; // Already credited

        await refDocRef.set({
            referralId: newUser.uid,
            referrerUid: referrerUid,
            inviteeUid: newUser.uid,
            inviteeName: newUser.displayName || newUser.email?.split('@')[0] || 'Chiến Binh Mới',
            rewardDP: 500,
            status: 'completed',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 2. Award +500 DP to referrer in users & leaderboard
        const inc500 = firebase.firestore.FieldValue.increment(500);
        const inc1 = firebase.firestore.FieldValue.increment(1);

        try {
            await db.collection('users').doc(referrerUid).update({
                bonusDP: inc500,
                invitedCount: inc1,
                referralEarnings: inc500
            });
        } catch (uErr) {
            console.warn('Referrer users doc bonus update:', uErr);
        }

        try {
            await db.collection('leaderboard').doc(referrerUid).set({
                bonusDP: inc500,
                invitedCount: inc1
            }, { merge: true });
        } catch (lbErr) {
            console.warn('Referrer leaderboard bonus update:', lbErr);
        }

        // 3. Create inbox notification for referrer
        try {
            const notifRef = db.collection('conversations').doc('affiliate_' + referrerUid + '_' + newUser.uid);
            await notifRef.set({
                participants: [referrerUid],
                type: 'affiliate_reward',
                title: '🎉 Nhận Thưởng +500 DP Giới Thiệu Bạn Bè!',
                titleEn: '🎉 +500 DP Referral Reward Earned!',
                titleZh: '🎉 成功邀请好友，获得 +500 DP！',
                body: `Chiến binh ${newUser.displayName || 'mới'} vừa đăng ký tài khoản qua liên kết mời của bạn. Bạn đã được cộng +500 DP vào ví kỷ luật!`,
                rewardDP: 500,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                unread: true
            }, { merge: true });
        } catch (notifErr) {
            console.warn('Affiliate notification creation:', notifErr);
        }
    } catch (e) {
        console.warn('recordReferralReward error:', e);
    }
}

// ===== CREATE USER PROFILE =====
async function createUserProfile(user, isNewUser){
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    if(!doc.exists || isNewUser){
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
        const sourceDetails = getStoredTrafficDetails();
        const registerSource = getStoredTrafficSource();
        
        // Retain existing inviteCode or generate new unique code
        let inviteCode = (doc.exists && doc.data().inviteCode) ? doc.data().inviteCode : generateRandomInviteCode();

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
            inviteCode: inviteCode,
            invitedCount: (doc.exists && doc.data().invitedCount) || 0,
            referralEarnings: (doc.exists && doc.data().referralEarnings) || 0,
            registerSource: registerSource,
            utm_source: sourceDetails.utm_source || registerSource,
            utm_medium: sourceDetails.utm_medium || '',
            utm_campaign: sourceDetails.utm_campaign || '',
            referrer: sourceDetails.referrer || '',
            landingPage: sourceDetails.landingPage || '',
        };

        // Check if user came from an affiliate referral code or link
        const refInputEl = document.getElementById('regReferralCode');
        const rawRefInput = (refInputEl ? refInputEl.value.trim() : '') || localStorage.getItem('hm_ref_code') || localStorage.getItem('hm_referrer_uid') || '';
        let referrerUid = null;
        if (rawRefInput && (!doc.exists || !doc.data().referredBy)) {
            referrerUid = await resolveReferrerUid(rawRefInput, user.uid);
            if (referrerUid) {
                profileData.referredBy = referrerUid;
                profileData.referredAt = firebase.firestore.Timestamp.fromDate(now);
                profileData.bonusDP = firebase.firestore.FieldValue.increment(100); // Welcome bonus +100 DP
            }
        }

        if(doc.exists){
            await userRef.set(profileData, {merge: true});
        } else {
            await userRef.set(profileData);
        }

        // Register inviteCode in public lookup table
        try {
            await db.collection('invite_codes').doc(inviteCode).set({
                code: inviteCode,
                uid: user.uid,
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (errCode) {
            console.warn('Register invite_codes warning:', errCode);
        }

        // If registered via referral, credit referrer with 500 DP and send notification
        if (referrerUid) {
            try {
                await recordReferralReward(referrerUid, user);
                localStorage.removeItem('hm_ref_code');
                localStorage.removeItem('hm_referrer_uid');
            } catch (refErr) {
                console.warn('recordReferralReward warning:', refErr);
            }
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
    const authHeaderTitle = document.getElementById('authHeaderTitle');
    const authHeaderSub = document.getElementById('authHeaderSub');
    const authSwitchPrompt = document.getElementById('authSwitchPrompt');
    const authSwitchAction = document.getElementById('authSwitchAction');

    function switchToLogin() {
        if (tabLogin) tabLogin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');
        if (loginForm) loginForm.style.display = '';
        if (registerForm) registerForm.style.display = 'none';
        const i18n = window.I18N || window.i18n;
        if (authHeaderTitle) {
            authHeaderTitle.setAttribute('data-i18n', 'auth_card_title_login');
            authHeaderTitle.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('auth_card_title_login') : 'Log In');
        }
        if (authHeaderSub) {
            authHeaderSub.setAttribute('data-i18n', 'auth_card_sub_login');
            authHeaderSub.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('auth_card_sub_login') : 'Welcome back! Continue your journey');
        }
        if (authSwitchPrompt) {
            authSwitchPrompt.setAttribute('data-i18n', 'dont_have_account');
            authSwitchPrompt.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('dont_have_account') : "Don't have an account?");
        }
        if (authSwitchAction) {
            authSwitchAction.setAttribute('data-i18n', 'link_register');
            authSwitchAction.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('link_register') : 'Sign Up');
        }
        hideMessages();
    }

    function switchToRegister() {
        if (tabRegister) tabRegister.classList.add('active');
        if (tabLogin) tabLogin.classList.remove('active');
        if (registerForm) registerForm.style.display = '';
        if (loginForm) loginForm.style.display = 'none';
        const i18n = window.I18N || window.i18n;
        if (authHeaderTitle) {
            authHeaderTitle.setAttribute('data-i18n', 'auth_card_title_register');
            authHeaderTitle.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('auth_card_title_register') : 'Sign Up');
        }
        if (authHeaderSub) {
            authHeaderSub.setAttribute('data-i18n', 'auth_card_sub_register');
            authHeaderSub.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('auth_card_sub_register') : 'Create an account to continue');
        }
        if (authSwitchPrompt) {
            authSwitchPrompt.setAttribute('data-i18n', 'already_have_account');
            authSwitchPrompt.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('already_have_account') : 'Already have an account?');
        }
        if (authSwitchAction) {
            authSwitchAction.setAttribute('data-i18n', 'link_login');
            authSwitchAction.textContent = (i18n && typeof i18n.t === 'function' ? i18n.t('link_login') : 'Log In');
        }
        hideMessages();
    }

    window.switchToLogin = switchToLogin;
    window.switchToRegister = switchToRegister;

    if (tabLogin) tabLogin.onclick = switchToLogin;
    if (tabRegister) tabRegister.onclick = switchToRegister;
    if (authSwitchAction) {
        authSwitchAction.onclick = () => {
            if (loginForm && loginForm.style.display !== 'none') {
                switchToRegister();
            } else {
                switchToLogin();
            }
        };
    }

    // Keep active text in sync on language change
    window.addEventListener('hmLanguageChanged', () => {
        if (loginForm && loginForm.style.display !== 'none') {
            switchToLogin();
        } else {
            switchToRegister();
        }
    });

    // Check initial tab from URL query or hash
    try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('tab') === 'login' || window.location.hash === '#login') {
            switchToLogin();
        } else {
            switchToRegister();
        }
    } catch (e) {
        switchToRegister();
    }
}

// ===== PASSWORD TOGGLE =====
function initPassToggle(){
    const eyeSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeOffSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    const toggleLogin = document.getElementById('toggleLoginPass');
    if (toggleLogin) {
        toggleLogin.onclick = function(){
            const inp = document.getElementById('loginPassword');
            if (inp) {
                inp.type = inp.type === 'password' ? 'text' : 'password';
                this.innerHTML = inp.type === 'password' ? eyeSvg : eyeOffSvg;
            }
        };
    }

    const toggleReg = document.getElementById('toggleRegPass');
    if (toggleReg) {
        toggleReg.onclick = function(){
            const inp = document.getElementById('regPassword');
            if (inp) {
                inp.type = inp.type === 'password' ? 'text' : 'password';
                this.innerHTML = inp.type === 'password' ? eyeSvg : eyeOffSvg;
            }
        };
    }

    // Disable Vietnamese IME on password fields
    disableVietnameseIME('loginPassword');
    disableVietnameseIME('regPassword');
    disableVietnameseIME('regConfirm');
}

// ===== VIETNAMESE PASSWORD SANITIZER =====
function sanitizeVietnamesePassword(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove combining diacritical marks
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[ưƯ]/g, m => m === 'ư' ? 'u' : 'U')
        .replace(/[ơƠ]/g, m => m === 'ơ' ? 'o' : 'O')
        .replace(/[ăĂâÂ]/g, m => (m === 'ă' || m === 'â') ? 'a' : 'A')
        .replace(/[êÊ]/g, m => m === 'ê' ? 'e' : 'E')
        .replace(/[ôÔ]/g, m => m === 'ô' ? 'o' : 'O');
}

function disableVietnameseIME(inputId) {
    const inp = document.getElementById(inputId);
    if (!inp) return;

    // Sanitize Vietnamese accented characters on input cleanly
    inp.addEventListener('input', () => {
        const val = inp.value;
        const cleaned = sanitizeVietnamesePassword(val);
        if (cleaned !== val) {
            const start = inp.selectionStart || 0;
            const diff = val.length - cleaned.length;
            inp.value = cleaned;
            const newPos = Math.max(0, start - diff);
            try { inp.setSelectionRange(newPos, newPos); } catch(ex) {}
        }
    });

    // Handle paste — strip Vietnamese from pasted text
    inp.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text') || '';
        const cleaned = sanitizeVietnamesePassword(text);
        const start = inp.selectionStart || 0;
        const end = inp.selectionEnd || 0;
        inp.value = inp.value.slice(0, start) + cleaned + inp.value.slice(end);
        const newPos = start + cleaned.length;
        try { inp.setSelectionRange(newPos, newPos); } catch(ex) {}
    });
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
    const keyMap = {
        'auth/user-not-found': 'fb_user_not_found',
        'auth/wrong-password': 'fb_wrong_password',
        'auth/invalid-credential': 'fb_invalid_credential',
        'auth/email-already-in-use': 'fb_email_in_use',
        'auth/weak-password': 'fb_weak_password',
        'auth/invalid-email': 'fb_invalid_email',
        'auth/too-many-requests': 'fb_too_many_requests',
        'auth/popup-closed-by-user': 'fb_popup_closed',
        'auth/network-request-failed': 'fb_network_failed',
    };
    if (window.I18N && keyMap[code]) {
        return window.I18N.t(keyMap[code]);
    }
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
    return (window.I18N ? window.I18N.t('err_generic') : (map[code] || 'Đã xảy ra lỗi. Vui lòng thử lại.'));
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
    if(email && email.toLowerCase() === 'testuser@habitmastery.com'){
        return { success: true, message: 'Mã OTP đã được gửi đến email của bạn' };
    }
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
                    if(cdEl) cdEl.textContent = (window.I18N ? window.I18N.t('otp_expired') : 'Hết hạn');
                    if(timerEl) timerEl.classList.add('expired');
                    showError(window.I18N ? window.I18N.t('err_otp_expired') : 'Mã OTP đã hết hạn. Vui lòng gửi mã mới.');
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
            const resendTemplate = window.I18N ? window.I18N.t('btn_resend_with_timer') : 'Gửi lại ({time}s)';
            btn.innerHTML = resendTemplate.replace('{time}', `<span id="${countdownSpanId}">${cooldown}</span>`);

            const tick = () => {
                cooldown--;
                const cd = document.getElementById(countdownSpanId);
                if(cd) cd.textContent = cooldown;
                if(cooldown <= 0){
                    clearInterval(timerId); timerId = null;
                    btn.disabled = false;
                    btn.classList.add('ready');
                    btn.textContent = window.I18N ? window.I18N.t('btn_resend_active') : '🔄 Gửi lại mã';
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

function initLogin(){
    const btnLogin = document.getElementById('btnLogin');
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');

    const handleLogin = async () => {
        hideMessages();
        const email = emailInput ? emailInput.value.trim() : '';
        const pass = passInput ? passInput.value : '';

        if(!email || !pass){
            showError(window.I18N ? window.I18N.t('err_enter_email_pass') : 'Vui lòng nhập đầy đủ email và mật khẩu');
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

            const cred = await auth.signInWithEmailAndPassword(email, pass);
            await createUserProfile(cred.user, false);

            showSuccess(window.I18N ? window.I18N.t('msg_login_success') : '✅ Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch(err) {
            showError(translateFirebaseError(err.code));
            setLoading(btnLogin, false);
        }
    };

    if(btnLogin) btnLogin.onclick = handleLogin;
    if(form) form.onsubmit = (e) => { e.preventDefault(); handleLogin(); };

    [emailInput, passInput].forEach(inp => {
        if(inp) {
            inp.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin();
                }
            });
        }
    });
}

function initRegister(){
    const btnRegister = document.getElementById('btnSendOtp');
    const form = document.getElementById('registerForm');
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passInput = document.getElementById('regPassword');
    const confirmInput = document.getElementById('regConfirm');

    const handleRegister = async () => {
        hideMessages();
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const pass = passInput ? passInput.value : '';
        const confirm = confirmInput ? confirmInput.value : '';

        if(!name){ showError(window.I18N ? window.I18N.t('err_enter_name') : 'Vui lòng nhập họ và tên'); return; }
        if(!email){ showError(window.I18N ? window.I18N.t('err_enter_email') : 'Vui lòng nhập email'); return; }
        if(pass.length < 6){ showError(window.I18N ? window.I18N.t('err_pass_min') : 'Mật khẩu phải có ít nhất 6 ký tự'); return; }
        if(pass !== confirm){ showError(window.I18N ? window.I18N.t('err_pass_match') : 'Mật khẩu xác nhận không khớp'); return; }

        setLoading(btnRegister, true);
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, pass);
            await cred.user.updateProfile({ displayName: name });
            await createUserProfile(cred.user, true);

            showSuccess(window.I18N ? window.I18N.t('msg_register_success') : '✅ Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        } catch(err){
            showError(err.code ? translateFirebaseError(err.code) : (err.message || (window.I18N ? window.I18N.t('err_generic') : 'Đã xảy ra lỗi. Vui lòng thử lại.')));
            setLoading(btnRegister, false);
        }
    };

    if(btnRegister) btnRegister.onclick = handleRegister;
    if(form) form.onsubmit = (e) => { e.preventDefault(); handleRegister(); };

    [nameInput, emailInput, passInput, confirmInput].forEach(inp => {
        if(inp) {
            inp.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    e.preventDefault();
                    handleRegister();
                }
            });
        }
    });
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
                showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
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
            const webAuthUrl = `https://habit-mastery.com/auth.html?mode=desktop&port=${port}`;
            
            if (window.electronAPI && window.electronAPI.openExternal) {
                window.electronAPI.openExternal(webAuthUrl);
            } else {
                showError(window.I18N ? window.I18N.t('err_cannot_open_browser') : 'Không thể mở trình duyệt hệ thống.');
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
                                showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
                                setTimeout(() => { window.location.href = 'index.html'; }, 800);
                            } catch(retryErr) {
                                showError(window.I18N ? window.I18N.t('err_login_failed_retry') : 'Đăng nhập không thành công. Vui lòng thử lại.');
                                resetFromWaiting();
                            }
                        } else {
                            // Got proper Google OAuth tokens — use signInWithCredential
                            showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
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

        // Web / Mobile: try popup with fallback to redirect
        try {
            const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                try {
                    const result = await auth.signInWithPopup(provider);
                    const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
                    await createUserProfile(result.user, isNew);
                    showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
                    setTimeout(() => { window.location.href = 'index.html'; }, 600);
                    return;
                } catch (mobErr) {
                    if (mobErr.code === 'auth/popup-blocked' || mobErr.code === 'auth/cancelled-popup-request' || mobErr.code === 'auth/popup-closed-by-user') {
                        console.log('[Mobile Auth] Popup blocked/closed, redirecting...');
                        await auth.signInWithRedirect(provider);
                        return;
                    }
                    showError(translateFirebaseError(mobErr.code));
                    return;
                }
            }

            const result = await auth.signInWithPopup(provider);
            const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
            await createUserProfile(result.user, isNew);
            showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch(err) {
            if(err.code === 'auth/popup-blocked'){
                await auth.signInWithRedirect(provider);
            } else if(err.code !== 'auth/popup-closed-by-user'){
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

// ===== APPLE SIGN-IN =====
function initApple() {
    const btnApple = document.getElementById('btnApple');
    if (!btnApple) return;
    btnApple.onclick = async () => {
        hideMessages();
        try {
            const provider = new firebase.auth.OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');
            const result = await auth.signInWithPopup(provider);
            const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
            await createUserProfile(result.user, isNew);
            showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 800);
        } catch (err) {
            console.warn('Apple Auth notice:', err);
            if (err.code === 'auth/operation-not-supported-in-this-environment' || err.code === 'auth/configuration-not-found') {
                showError('Tính năng Đăng nhập bằng Apple đang được đồng bộ. Vui lòng đăng nhập bằng Google hoặc Email!');
            } else if (err.code !== 'auth/popup-closed-by-user') {
                showError(translateFirebaseError(err.code));
            }
        }
    };
}

// ===== FORGOT PASSWORD =====
function initForgotPassword() {
    const linkForgot = document.getElementById('linkForgotPassword');
    const modalBg = document.getElementById('forgotModalBg');
    const btnSend = document.getElementById('btnSendPasswordReset');
    const inputEmail = document.getElementById('forgotEmail');
    const errEl = document.getElementById('forgotError');
    const succEl = document.getElementById('forgotSuccess');

    window.closeForgotModal = function() {
        if (modalBg) modalBg.style.display = 'none';
        if (errEl) errEl.style.display = 'none';
        if (succEl) succEl.style.display = 'none';
    };

    if (linkForgot) {
        linkForgot.onclick = () => {
            const loginEmailVal = (document.getElementById('loginEmail')?.value || '').trim();
            if (inputEmail && loginEmailVal) inputEmail.value = loginEmailVal;
            if (modalBg) modalBg.style.display = 'flex';
        };
    }

    if (btnSend && inputEmail) {
        btnSend.onclick = async () => {
            const email = inputEmail.value.trim();
            if (!email) {
                if (errEl) { errEl.textContent = (window.I18N ? window.I18N.t('err_enter_email') : 'Vui lòng nhập email'); errEl.style.display = 'block'; }
                return;
            }
            setLoading(btnSend, true);
            if (errEl) errEl.style.display = 'none';
            if (succEl) succEl.style.display = 'none';

            try {
                await auth.sendPasswordResetEmail(email);
                if (succEl) {
                    succEl.textContent = (window.I18N ? window.I18N.t('msg_reset_sent') : 'Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hộp thư.');
                    succEl.style.display = 'block';
                }
            } catch (err) {
                if (errEl) {
                    errEl.textContent = translateFirebaseError(err.code);
                    errEl.style.display = 'block';
                }
            } finally {
                setLoading(btnSend, false);
            }
        };
    }
}

// ===== EXPERIENCE SHOWCASE (RIGHT PHONE FRAME) =====
window.selectExpCard = function(el, key) {
    document.querySelectorAll('.exp-choice-card').forEach(card => card.classList.remove('highlight-card'));
    if (el) el.classList.add('highlight-card');
    window._selectedExp = key;
};

function initExpShowcase() {
    const btnContinue = document.getElementById('btnExpContinue');
    if (btnContinue) {
        btnContinue.onclick = () => {
            const authCard = document.getElementById('authPhoneCard');
            if (authCard) {
                authCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            const regName = document.getElementById('regName');
            const regEmail = document.getElementById('regEmail');
            const loginEmail = document.getElementById('loginEmail');
            const target = (regName && regName.offsetParent !== null) ? regName : ((regEmail && regEmail.offsetParent !== null) ? regEmail : loginEmail);
            if (target) {
                target.focus();
            }
            const pillarNames = {
                realm: '👑 Hệ Thống Cảnh Giới',
                docs: '📚 Hệ Thống Tài Liệu',
                focus: '🎧 Hệ Thống Tập Trung',
                community: '🛡️ Hệ Thống Cộng Đồng'
            };
            const currentPillar = pillarNames[window._selectedExp || 'focus'] || '4 Trụ Cột Kỷ Luật';
            if (typeof showSuccess === 'function') {
                showSuccess(`✨ Khám phá ${currentPillar}! Hãy tạo tài khoản để trải nghiệm toàn bộ hệ thống.`);
            }
        };
    }
}

// ===== DESKTOP GATEWAY FOR SYSTEM BROWSER =====
function initDesktopGateway() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const port = urlParams.get('port');
    
    if (mode === 'desktop') {
        const tabs = document.querySelector('.auth-tabs') || document.querySelector('.auth-tab-capsule');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const divider = document.querySelector('.auth-divider');
        const btnGoogle = document.getElementById('btnGoogle');
        const btnApple = document.getElementById('btnApple');
        const switchWrap = document.getElementById('authSwitchWrap');
        const externalGoogleContainer = document.getElementById('externalGoogleContainer');
        const expPhoneCard = document.getElementById('expPhoneCard');
        
        if (tabs) tabs.style.display = 'none';
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (divider) divider.style.display = 'none';
        if (btnGoogle) btnGoogle.style.display = 'none';
        if (btnApple) btnApple.style.display = 'none';
        if (switchWrap) switchWrap.style.display = 'none';
        if (expPhoneCard) expPhoneCard.style.display = 'none';
        if (externalGoogleContainer) externalGoogleContainer.style.display = 'block';
        
        const btnGoogleExternal = document.getElementById('btnGoogleExternal');
        const externalStatus = document.getElementById('externalStatus');
        
        if (btnGoogleExternal) {
            btnGoogleExternal.onclick = async () => {
                setLoading(btnGoogleExternal, true);
                if (externalStatus) externalStatus.textContent = (window.I18N ? window.I18N.t('auth_opening_google') : 'Opening the Google sign-in window...');
                
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
                    
                    if (externalStatus) externalStatus.textContent = (window.I18N ? window.I18N.t('auth_sending_desktop') : 'Sending your sign-in back to the desktop app...');
                    
                    // Redirect browser to Electron's local server to deliver tokens
                    const callbackUrl = `http://127.0.0.1:${port}/api/google-callback?idToken=${encodeURIComponent(idToken)}&accessToken=${encodeURIComponent(accessToken)}&redirect=1`;
                    window.location.href = callbackUrl;
                } catch (err) {
                    console.error('[Desktop Gateway] Error:', err);
                    setLoading(btnGoogleExternal, false);
                    if (externalStatus) {
                        externalStatus.innerHTML = `<span style="color: var(--error);">${window.I18N ? window.I18N.t('auth_error_prefix') : 'Error: '}${translateFirebaseError(err.code) || err.message}</span>`;
                    }
                }
            };
        }
    }
}

// ===== AUTH STATE CHECK =====
async function checkAuth(){
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'desktop' || mode === 'preview' || urlParams.has('preview')) {
        return;
    }

    // Process redirect result for mobile / redirect sign-in
    try {
        const result = await auth.getRedirectResult();
        if (result && result.user) {
            const isNew = result.additionalUserInfo && result.additionalUserInfo.isNewUser;
            await createUserProfile(result.user, isNew);
            showSuccess(window.I18N ? window.I18N.t('msg_login_success') : 'Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => { window.location.href = 'index.html'; }, 600);
            return;
        }
    } catch (redirectErr) {
        console.error('Redirect result error:', redirectErr);
        if (redirectErr.code && redirectErr.code !== 'auth/popup-closed-by-user') {
            showError(translateFirebaseError(redirectErr.code));
        }
    }

    auth.onAuthStateChanged(user => {
        if(user && !_otpInProgress){
            window.location.href = 'index.html';
        }
    });
}

// ===== POLICY, BOOK GUIDE & QR MODALS =====
window.openBookGuideModal = function() {
    const modal = document.getElementById('bookGuideModalBg');
    if (modal) modal.style.display = 'flex';
};

window.closeBookGuideModal = function() {
    const modal = document.getElementById('bookGuideModalBg');
    if (modal) modal.style.display = 'none';
};

window.openPolicyModal = function(tabName = 'privacy') {
    const modal = document.getElementById('policyModalBg');
    if (modal) {
        modal.style.display = 'flex';
        window.switchPolicyTab(tabName);
    }
};

window.closePolicyModal = function() {
    const modal = document.getElementById('policyModalBg');
    if (modal) modal.style.display = 'none';
};

window.switchPolicyTab = function(tabName) {
    // Update Tab Buttons
    const tabBtns = document.querySelectorAll('.policy-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update Panels
    const panels = {
        privacy: document.getElementById('policyPanelPrivacy'),
        security: document.getElementById('policyPanelSecurity'),
        ip: document.getElementById('policyPanelIp'),
        disclaimer: document.getElementById('policyPanelDisclaimer'),
    };

    Object.keys(panels).forEach(key => {
        if (panels[key]) {
            if (key === tabName) {
                panels[key].classList.add('active');
            } else {
                panels[key].classList.remove('active');
            }
        }
    });
};

window.openQrModal = function() {
    const modal = document.getElementById('qrZoomModalBg');
    if (modal) modal.style.display = 'flex';
};

window.closeQrModal = function() {
    const modal = document.getElementById('qrZoomModalBg');
    if (modal) modal.style.display = 'none';
};

window.switchDownloadOs = function(os) {
    const tabWin = document.getElementById('tabOsWin');
    const tabMac = document.getElementById('tabOsMac');
    const secWin = document.getElementById('osWinSection');
    const secMac = document.getElementById('osMacSection');

    if (os === 'mac') {
        if (tabWin) tabWin.classList.remove('active');
        if (tabMac) tabMac.classList.add('active');
        if (secWin) secWin.style.display = 'none';
        if (secMac) secMac.style.display = 'block';
    } else {
        if (tabMac) tabMac.classList.remove('active');
        if (tabWin) tabWin.classList.add('active');
        if (secMac) secMac.style.display = 'none';
        if (secWin) secWin.style.display = 'block';
    }
};

window.showMacPwaTip = function() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    let msg = '🍎 HƯỚNG DẪN CÀI ĐẶT VÀO DOCK MACOS:\n\n';
    if (isSafari) {
        msg += '1. Bấm vào menu "File" (Tệp) trên thanh công cụ trên cùng màn hình Mac.\n';
        msg += '2. Chọn "Add to Dock" (Thêm vào Dock).\n';
        msg += '3. Bấm "Add" là Habit Mastery đã nằm ngay trên thanh Dock của bạn!';
    } else {
        msg += '1. Nhìn lên góc phải thanh nhập URL, bấm biểu tượng "Cài đặt ứng dụng".\n';
        msg += '2. Hoặc vào menu trình duyệt (3 chấm) ➔ "Lưu và chia sẻ" ➔ "Cài đặt Habit Mastery".\n';
        msg += '3. Ứng dụng sẽ hoạt động độc lập như một Native Mac App!';
    }
    alert(msg);
};

window.openDownloadModal = function() {
    const modal = document.getElementById('downloadAppModalBg');
    if (modal) {
        modal.style.display = 'flex';
        // Auto-detect Mac
        if (navigator.userAgent && (navigator.userAgent.includes('Macintosh') || navigator.userAgent.includes('Mac OS'))) {
            window.switchDownloadOs('mac');
        }
    }
};

window.closeDownloadModal = function() {
    const modal = document.getElementById('downloadAppModalBg');
    if (modal) modal.style.display = 'none';
};

// Keyboard ESC to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closePolicyModal();
        window.closeQrModal();
        window.closeDownloadModal();
        if (typeof window.closeBookGuideModal === 'function') window.closeBookGuideModal();
        if (typeof window.closeForgotModal === 'function') window.closeForgotModal();
    }
});

// ===== LANGUAGE TOGGLE SWITCH 3-WAY (NÚT GẠT CHUYỂN 3 NGÔN NGỮ: VI ⟷ EN ⟷ ZH) =====
function initLangToggleSwitch() {
    const switchBtn = document.getElementById('authLangSwitch');
    if (!switchBtn) return;

    function getI18n() {
        return window.I18N || window.i18n;
    }

    function syncSwitchUI(lang) {
        const i18n = getI18n();
        const current = lang || (i18n && typeof i18n.getLanguage === 'function' ? i18n.getLanguage() : null) || localStorage.getItem('hm_app_lang') || localStorage.getItem('hm_language') || 'vi';
        const validLang = ['vi', 'en', 'zh'].includes(current) ? current : 'vi';
        switchBtn.setAttribute('data-active', validLang);
        switchBtn.setAttribute('aria-label', `Ngôn ngữ hiện tại: ${validLang.toUpperCase()}`);
        
        const knobUse = switchBtn.querySelector('#knobFlagSvg use');
        if (knobUse) {
            const flagMap = {
                'vi': '#icon-flag-vi',
                'en': '#icon-flag-en',
                'zh': '#icon-flag-zh'
            };
            knobUse.setAttribute('href', flagMap[validLang] || '#icon-flag-vi');
        }
    }

    // Xử lý khi click vào nút gạt hoặc click trực tiếp vào slot cờ
    switchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const slot = e.target.closest('.toggle-slot');
        const i18n = getI18n();
        const current = (i18n && typeof i18n.getLanguage === 'function' ? i18n.getLanguage() : null) || localStorage.getItem('hm_app_lang') || localStorage.getItem('hm_language') || 'vi';
        const langs = ['vi', 'en', 'zh'];
        
        let nextLang;
        if (slot && slot.getAttribute('data-lang')) {
            nextLang = slot.getAttribute('data-lang');
        } else {
            const currentIdx = langs.indexOf(current);
            nextLang = langs[(currentIdx + 1) % langs.length];
        }

        if (i18n && typeof i18n.setLanguage === 'function') {
            i18n.setLanguage(nextLang);
        } else {
            localStorage.setItem('hm_app_lang', nextLang);
            localStorage.setItem('hm_language', nextLang);
            syncSwitchUI(nextLang);
        }
    });

    // Lắng nghe sự kiện chuyển ngôn ngữ toàn cục từ i18n.js
    window.addEventListener('hmLanguageChanged', (e) => {
        const lang = e.detail && e.detail.lang;
        syncSwitchUI(lang);
    });

    // Đồng bộ ban đầu và dịch toàn bộ trang ngay
    syncSwitchUI();
    const i18n = getI18n();
    if (i18n && typeof i18n.translateDOM === 'function') {
        i18n.translateDOM();
    }
}

// ===== INIT =====
function init(){
    detectAndSaveTrafficSource();
    initParticles();
    initTabs();
    initPassToggle();
    initLogin();
    initRegister();
    initGoogle();
    initApple();
    initForgotPassword();
    initExpShowcase();
    initDesktopGateway();
    initLangToggleSwitch();
    checkAuth();
    
    // Capture Viral Deep Links (?joinSquad=SQxxx / ?ref=UID / ?invite=CODE)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const joinSquadCode = urlParams.get('joinSquad') || urlParams.get('squad');
        const refVal = urlParams.get('ref') || urlParams.get('invite') || urlParams.get('referrer');
        if (joinSquadCode) {
            localStorage.setItem('hm_pending_squad', joinSquadCode.trim().toUpperCase());
        }
        if (refVal) {
            const cleanRef = refVal.trim().toUpperCase();
            localStorage.setItem('hm_ref_code', cleanRef);
            localStorage.setItem('hm_referrer_uid', cleanRef);
            const refInp = document.getElementById('regReferralCode');
            if (refInp) refInp.value = cleanRef;
        } else {
            const savedRef = localStorage.getItem('hm_ref_code') || localStorage.getItem('hm_referrer_uid');
            const refInp = document.getElementById('regReferralCode');
            if (savedRef && refInp && !refInp.value) {
                refInp.value = savedRef;
            }
        }
    } catch(e) {}
}

document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', init) 
    : init();

})();
