// Global Keyframes and Fonts Helper for Avatar Frames (Dark & Light Modes)
const AVATAR_FRAMES_DARK = [
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(150,180,220,.16),transparent 68%);filter:blur(14px);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid rgba(214,228,245,.85);box-shadow:0 0 6px rgba(160,190,225,.6),0 0 16px rgba(120,155,200,.35);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:1px solid rgba(180,200,225,.22);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#151327,#07060f 75%);box-shadow:inset 0 0 22px rgba(140,170,210,.18);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:126px;height:126px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#141826,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(60,220,200,.2),transparent 68%);filter:blur(16px);"></div>
          <div style="position:absolute;inset:12px;border-radius:50%;border:1.5px solid #7ff2e2;box-shadow:0 0 8px rgba(79,227,208,.75),0 0 22px rgba(79,227,208,.4),inset 0 0 10px rgba(79,227,208,.3);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1px solid rgba(79,227,208,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(224,255,250,.95) 0deg 1deg,transparent 1deg 15deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 3px #4fe3d0);animation:om-spin 90s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#0e2028,#05070c 75%);box-shadow:inset 0 0 24px rgba(79,227,208,.2);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:110px;height:110px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#0c2027,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.24),transparent 68%);filter:blur(18px);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;border:1.5px solid #9fe4ff;box-shadow:0 0 9px rgba(56,189,248,.8),0 0 26px rgba(56,189,248,.45);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:1.5px solid rgba(125,211,252,.7);box-shadow:0 0 8px rgba(56,189,248,.5),inset 0 0 12px rgba(56,189,248,.25);"></div>
          <div style="position:absolute;inset:32px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(236,254,255,.95) 0deg 1.4deg,transparent 1.4deg 10deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 4px #38bdf8);animation:om-spin 70s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#0b1b2b,#05070c 75%);box-shadow:inset 0 0 26px rgba(56,189,248,.22);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#0b1b2b,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-24px;border-radius:50%;background:radial-gradient(circle,rgba(79,124,255,.3),transparent 66%);filter:blur(20px);animation:om-breathe 7s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:6px;border-radius:50%;border:2px solid #b9caff;box-shadow:0 0 10px rgba(79,124,255,.85),0 0 30px rgba(79,124,255,.5);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;border:1.5px solid rgba(146,170,255,.75);box-shadow:0 0 8px rgba(79,124,255,.55),inset 0 0 14px rgba(79,124,255,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(240,244,255,.95) 0deg 2deg,transparent 2deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);filter:drop-shadow(0 0 4px #4f7cff);animation:om-spin 58s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(185,202,255,.8) 0deg 4deg,transparent 4deg 24deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 3px #4f7cff);animation:om-spin 44s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#101736,#05060e 75%);box-shadow:inset 0 0 28px rgba(79,124,255,.26);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#101736,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-28px;border-radius:50%;background:radial-gradient(circle,rgba(124,92,255,.34),transparent 66%);filter:blur(22px);animation:om-breathe 6.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;border:2px solid #cbbcff;box-shadow:0 0 12px rgba(124,92,255,.9),0 0 34px rgba(124,92,255,.5);"></div>
          <div style="position:absolute;inset:18px;border-radius:50%;border:1px solid rgba(167,139,250,.55);box-shadow:0 0 8px rgba(124,92,255,.4);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(196,181,253,.8);box-shadow:0 0 10px rgba(124,92,255,.6),inset 0 0 16px rgba(124,92,255,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(245,240,255,.95) 0deg 2.2deg,transparent 2.2deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 4px #7c5cff);animation:om-spin 52s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:42px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(203,188,255,.85) 0deg 3deg,transparent 3deg 12deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 3px #7c5cff);animation:om-spin 40s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#191238,#06050f 75%);box-shadow:inset 0 0 30px rgba(124,92,255,.3);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#191238,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-44px;border-radius:50%;background:radial-gradient(circle,rgba(255,47,208,.34),rgba(59,107,255,.22) 50%,transparent 72%);filter:blur(28px);animation:om-breathe 5.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #6f9bff;box-shadow:0 0 16px rgba(59,107,255,.9),0 0 44px rgba(59,107,255,.5);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1px solid rgba(120,160,255,.5);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:4px solid transparent;background:conic-gradient(from 210deg,#ff2fd0,#ff8ae6 25%,rgba(255,47,208,.25) 55%,#c026d3 78%,#ff2fd0);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 10px rgba(255,47,208,.9)) drop-shadow(0 0 26px rgba(255,47,208,.5));animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:40px;border-radius:50%;border:2px solid #ffb3f0;box-shadow:0 0 14px rgba(255,47,208,.85),inset 0 0 20px rgba(255,47,208,.35);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(186,214,255,.9) 0deg 1.6deg,transparent 1.6deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 4px #3b6bff);animation:om-spin 60s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(2.5px 2.5px at 18% 24%,#cfe0ff,transparent),radial-gradient(2px 2px at 82% 18%,#fff,transparent),radial-gradient(3px 3px at 92% 62%,#7ab0ff,transparent),radial-gradient(2px 2px at 66% 92%,#fff,transparent),radial-gradient(2.5px 2.5px at 24% 86%,#8ab6ff,transparent),radial-gradient(2px 2px at 6% 54%,#fff,transparent),radial-gradient(2px 2px at 48% 4%,#ff8ae6,transparent),radial-gradient(2px 2px at 40% 70%,#ffb3f0,transparent);filter:drop-shadow(0 0 6px rgba(122,176,255,.9));animation:om-pulse 4s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(59,107,255,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(120deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#ffd9f6,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#ffd9f6,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,47,208,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(240deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(59,107,255,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2b0b32,#07040e 75%);box-shadow:inset 0 0 36px rgba(255,47,208,.32);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#22102e,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-40px;border-radius:50%;background:radial-gradient(circle,rgba(217,70,239,.42),rgba(168,85,247,.16) 45%,transparent 70%);filter:blur(26px);animation:om-breathe 6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #fbd0ff;box-shadow:0 0 14px #e879ff,0 0 40px rgba(217,70,239,.6),inset 0 0 10px rgba(217,70,239,.5);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;border:2px solid #f0a8ff;box-shadow:0 0 12px rgba(217,70,239,.8),0 0 26px rgba(217,70,239,.4);"></div>
          <div style="position:absolute;inset:34px;border-radius:50%;border:1.5px solid rgba(240,168,255,.7);box-shadow:0 0 10px rgba(217,70,239,.55),inset 0 0 18px rgba(217,70,239,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0deg 2.4deg,transparent 2.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 5px #e879ff);animation:om-spin 46s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.9) 0deg 2deg,transparent 2deg 9deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 4px #e879ff);animation:om-spin 36s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2a0f3a,#0a0413 75%);box-shadow:inset 0 0 34px rgba(217,70,239,.35);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2a0f3a,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-48px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.4),rgba(124,58,237,.18) 48%,transparent 72%);filter:blur(30px);animation:om-breathe 5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-22px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(216,180,254,.45) 14deg,transparent 30deg,transparent 90deg,rgba(168,85,247,.4) 104deg,transparent 120deg);-webkit-mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);filter:blur(6px);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(216,180,254,.45);box-shadow:0 0 14px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #efe0ff;box-shadow:0 0 20px #a855f7,0 0 56px rgba(168,85,247,.65),inset 0 0 12px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid #c99cff;box-shadow:0 0 12px rgba(168,85,247,.75);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:2.5px solid #f3e8ff;box-shadow:0 0 14px rgba(168,85,247,.85),inset 0 0 16px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:1.5px solid rgba(216,180,254,.75);box-shadow:0 0 10px rgba(168,85,247,.6),inset 0 0 20px rgba(168,85,247,.3);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0deg 1deg,transparent 1deg 3deg,rgba(216,180,254,.9) 3deg 3.8deg,transparent 3.8deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 5px #a855f7);animation:om-spin 40s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:52px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.95) 0deg 3deg,transparent 3deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);filter:drop-shadow(0 0 4px #c084fc);animation:om-spin 30s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;inset:22%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2b1547,#080410 75%);box-shadow:inset 0 0 44px rgba(168,85,247,.5);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2b1547,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-52px;border-radius:50%;background:radial-gradient(circle,rgba(255,209,102,.3),rgba(192,132,252,.3) 42%,transparent 72%);filter:blur(32px);animation:om-breathe 4.6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-16px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(255,209,102,.35) 18deg,transparent 36deg,transparent 54deg,rgba(192,132,252,.35) 72deg,transparent 90deg);-webkit-mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);filter:blur(6px);animation:om-spin 26s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #ffe6ad;box-shadow:0 0 16px rgba(255,209,102,.9),0 0 46px rgba(255,209,102,.4);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:2.5px solid #e9d5ff;box-shadow:0 0 16px rgba(192,132,252,.9),0 0 34px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(255,209,102,.8);box-shadow:0 0 12px rgba(255,209,102,.7);"></div>
          <div style="position:absolute;inset:46px;border-radius:50%;border:2px solid #f5ebff;box-shadow:0 0 14px rgba(192,132,252,.8),inset 0 0 22px rgba(168,85,247,.35);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff5da 0deg 1.2deg,transparent 1.2deg 3deg,rgba(255,209,102,.9) 3deg 4deg,transparent 4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 5px #ffd166);animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:54px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(233,213,255,.95) 0deg 2.4deg,transparent 2.4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 4px #c084fc);animation:om-spin 24s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-64px;top:-64px;width:128px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,229,173,.8),transparent);transform:rotate(45deg);transform-origin:64px 1px;"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;inset:23%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2a1a3c,#0a0512 75%);box-shadow:inset 0 0 42px rgba(255,209,102,.28);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2a1a3c,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-60px;border-radius:50%;background:radial-gradient(circle,rgba(255,59,92,.34),rgba(255,207,92,.28) 38%,rgba(120,40,200,.2) 62%,transparent 78%);filter:blur(34px);animation:om-breathe 4.2s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-26px;border-radius:50%;background:conic-gradient(from 0deg,rgba(255,207,92,.5) 0deg 6deg,transparent 6deg 30deg,rgba(255,59,92,.45) 30deg 36deg,transparent 36deg 60deg);-webkit-mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);filter:blur(5px);animation:om-spin 20s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #ffd9c2;box-shadow:0 0 18px rgba(255,59,92,.9),0 0 52px rgba(255,59,92,.45);"></div>
          <div style="position:absolute;inset:10px;border-radius:50%;border:3px solid #ffe9b0;box-shadow:0 0 20px rgba(255,207,92,.95),0 0 40px rgba(255,207,92,.5);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1.5px solid rgba(255,255,255,.9);box-shadow:0 0 14px rgba(255,255,255,.7);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:2.5px solid #ffb0c0;box-shadow:0 0 16px rgba(255,59,92,.85),inset 0 0 24px rgba(255,59,92,.4);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0deg 1deg,transparent 1deg 2.4deg,rgba(255,207,92,.95) 2.4deg 3.4deg,transparent 3.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);filter:drop-shadow(0 0 6px #ffcf5c);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:36px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,176,192,.95) 0deg 2deg,transparent 2deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 5px #ff3b5c);animation:om-spin 18s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:56px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.95) 0deg 3.2deg,transparent 3.2deg 8deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 4px #ffcf5c);animation:om-spin 36s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,207,92,.85),transparent);transform:rotate(45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,207,92,.85),transparent);transform:rotate(-45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;inset:24%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#3a1220,#0c0409 75%);box-shadow:inset 0 0 46px rgba(255,59,92,.36);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#3a1220,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
];

const AVATAR_FRAMES_LIGHT = [
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(88,118,152,.16),transparent 68%);filter:blur(14px);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid rgba(58,82,112,.95);box-shadow:0 0 3px rgba(88,118,152,.6),0 0 8px rgba(120,155,200,.35);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:1px solid rgba(90,118,150,.22);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#eff3f9,#ffffff 75%);box-shadow:inset 0 0 11px rgba(140,170,210,.18);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:126px;height:126px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#f1f5fa,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.2),transparent 68%);filter:blur(16px);"></div>
          <div style="position:absolute;inset:12px;border-radius:50%;border:1.5px solid #17b8a6;box-shadow:0 0 4px rgba(13,148,136,.75),0 0 11px rgba(13,148,136,.4),inset 0 0 5px rgba(13,148,136,.3);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1px solid rgba(13,148,136,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(13,148,136,.95) 0deg 1deg,transparent 1deg 15deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 1.5px #0d9488);animation:om-spin 90s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#e8f7f4,#ffffff 75%);box-shadow:inset 0 0 12px rgba(13,148,136,.2);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:110px;height:110px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#eaf8f5,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(circle,rgba(2,132,199,.24),transparent 68%);filter:blur(18px);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;border:1.5px solid #3ba0d8;box-shadow:0 0 4.5px rgba(2,132,199,.8),0 0 13px rgba(2,132,199,.45);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:1.5px solid rgba(2,132,199,.7);box-shadow:0 0 4px rgba(2,132,199,.5),inset 0 0 6px rgba(2,132,199,.25);"></div>
          <div style="position:absolute;inset:32px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(2,132,199,.95) 0deg 1.4deg,transparent 1.4deg 10deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 2px #0284c7);animation:om-spin 70s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#e9f4fb,#ffffff 75%);box-shadow:inset 0 0 13px rgba(2,132,199,.22);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#e9f4fb,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-24px;border-radius:50%;background:radial-gradient(circle,rgba(49,78,196,.3),transparent 66%);filter:blur(20px);animation:om-breathe 7s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:6px;border-radius:50%;border:2px solid #6b83e8;box-shadow:0 0 5px rgba(49,78,196,.85),0 0 15px rgba(49,78,196,.5);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;border:1.5px solid rgba(58,82,200,.75);box-shadow:0 0 4px rgba(49,78,196,.55),inset 0 0 7px rgba(49,78,196,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(58,82,200,.95) 0deg 2deg,transparent 2deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);filter:drop-shadow(0 0 2px #3a52c8);animation:om-spin 58s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(90,112,220,.8) 0deg 4deg,transparent 4deg 24deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 1.5px #3a52c8);animation:om-spin 44s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#eff1fc,#ffffff 75%);box-shadow:inset 0 0 14px rgba(49,78,196,.26);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#eff1fc,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-28px;border-radius:50%;background:radial-gradient(circle,rgba(93,58,214,.34),transparent 66%);filter:blur(22px);animation:om-breathe 6.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;border:2px solid #8b6ae8;box-shadow:0 0 6px rgba(93,58,214,.9),0 0 17px rgba(93,58,214,.5);"></div>
          <div style="position:absolute;inset:18px;border-radius:50%;border:1px solid rgba(93,58,214,.55);box-shadow:0 0 4px rgba(93,58,214,.4);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(93,58,214,.8);box-shadow:0 0 5px rgba(93,58,214,.6),inset 0 0 8px rgba(93,58,214,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(93,58,214,.95) 0deg 2.2deg,transparent 2.2deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 2px #5d3ad6);animation:om-spin 52s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:42px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(120,90,230,.85) 0deg 3deg,transparent 3deg 12deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 1.5px #5d3ad6);animation:om-spin 40s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#f2effd,#ffffff 75%);box-shadow:inset 0 0 15px rgba(93,58,214,.3);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#f2effd,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-44px;border-radius:50%;background:radial-gradient(circle,rgba(200,20,155,.34),rgba(43,74,190,.22) 50%,transparent 72%);filter:blur(28px);animation:om-breathe 5.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #3f63c8;box-shadow:0 0 8px rgba(43,74,190,.9),0 0 22px rgba(43,74,190,.5);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1px solid rgba(43,74,190,.5);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:4px solid transparent;background:conic-gradient(from 210deg,#c8149b,#e14fc0 25%,rgba(200,20,155,.25) 55%,#9c1aa8 78%,#c8149b);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 5px rgba(200,20,155,.9)) drop-shadow(0 0 13px rgba(200,20,155,.5));animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:40px;border-radius:50%;border:2px solid #e14fc0;box-shadow:0 0 7px rgba(200,20,155,.85),inset 0 0 10px rgba(200,20,155,.35);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(43,74,190,.9) 0deg 1.6deg,transparent 1.6deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 2px #2b4abe);animation:om-spin 60s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(2.5px 2.5px at 18% 24%,#5a7ad0,transparent),radial-gradient(2px 2px at 82% 18%,#c8149b,transparent),radial-gradient(3px 3px at 92% 62%,#3f63c8,transparent),radial-gradient(2px 2px at 66% 92%,#c8149b,transparent),radial-gradient(2.5px 2.5px at 24% 86%,#4f6fc8,transparent),radial-gradient(2px 2px at 6% 54%,#c8149b,transparent),radial-gradient(2px 2px at 48% 4%,#e14fc0,transparent),radial-gradient(2px 2px at 40% 70%,#e14fc0,transparent);filter:drop-shadow(0 0 3px rgba(43,74,190,.9));animation:om-pulse 4s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#c8149b,rgba(43,74,190,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(120deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#d43fb0,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#d43fb0,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#c8149b,rgba(200,20,155,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(240deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#c8149b,rgba(43,74,190,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fbeef8,#ffffff 75%);box-shadow:inset 0 0 18px rgba(200,20,155,.32);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fdf0f9,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-40px;border-radius:50%;background:radial-gradient(circle,rgba(168,26,200,.42),rgba(126,34,206,.16) 45%,transparent 70%);filter:blur(26px);animation:om-breathe 6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #c94ede;box-shadow:0 0 7px #a81ac8,0 0 20px rgba(168,26,200,.6),inset 0 0 5px rgba(168,26,200,.5);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;border:2px solid #b93bd0;box-shadow:0 0 6px rgba(168,26,200,.8),0 0 13px rgba(168,26,200,.4);"></div>
          <div style="position:absolute;inset:34px;border-radius:50%;border:1.5px solid rgba(168,26,200,.7);box-shadow:0 0 5px rgba(168,26,200,.55),inset 0 0 9px rgba(168,26,200,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#a81ac8 0deg 2.4deg,transparent 2.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 2.5px #a81ac8);animation:om-spin 46s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(168,26,200,.9) 0deg 2deg,transparent 2deg 9deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 2px #a81ac8);animation:om-spin 36s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fbeffc,#ffffff 75%);box-shadow:inset 0 0 17px rgba(168,26,200,.35);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fbeffc,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-48px;border-radius:50%;background:radial-gradient(circle,rgba(126,34,206,.4),rgba(92,20,160,.18) 48%,transparent 72%);filter:blur(30px);animation:om-breathe 5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-22px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(126,34,206,.45) 14deg,transparent 30deg,transparent 90deg,rgba(126,34,206,.4) 104deg,transparent 120deg);-webkit-mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);filter:blur(6px);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(126,34,206,.45);box-shadow:0 0 7px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #9d5be0;box-shadow:0 0 10px #a855f7,0 0 28px rgba(126,34,206,.65),inset 0 0 6px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid #8b48d0;box-shadow:0 0 6px rgba(126,34,206,.75);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:2.5px solid #63189e;box-shadow:0 0 7px rgba(126,34,206,.85),inset 0 0 8px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:1.5px solid rgba(126,34,206,.75);box-shadow:0 0 5px rgba(126,34,206,.6),inset 0 0 10px rgba(126,34,206,.3);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#9333ea 0deg 1deg,transparent 1deg 3deg,rgba(126,34,206,.9) 3deg 3.8deg,transparent 3.8deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 2.5px #a855f7);animation:om-spin 40s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:52px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(147,51,234,.95) 0deg 3deg,transparent 3deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);filter:drop-shadow(0 0 2px #9333ea);animation:om-spin 30s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;inset:22%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#f6eefd,#ffffff 75%);box-shadow:inset 0 0 22px rgba(126,34,206,.5);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#f6eefd,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-52px;border-radius:50%;background:radial-gradient(circle,rgba(202,138,4,.3),rgba(139,79,196,.3) 42%,transparent 72%);filter:blur(32px);animation:om-breathe 4.6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-16px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(202,138,4,.35) 18deg,transparent 36deg,transparent 54deg,rgba(139,79,196,.35) 72deg,transparent 90deg);-webkit-mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);filter:blur(6px);animation:om-spin 26s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #d9a11c;box-shadow:0 0 8px rgba(202,138,4,.9),0 0 23px rgba(202,138,4,.4);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:2.5px solid #9a5cd0;box-shadow:0 0 8px rgba(139,79,196,.9),0 0 17px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(202,138,4,.8);box-shadow:0 0 6px rgba(160,110,4,.95);"></div>
          <div style="position:absolute;inset:46px;border-radius:50%;border:2px solid #8b4fc4;box-shadow:0 0 7px rgba(139,79,196,.8),inset 0 0 11px rgba(126,34,206,.35);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#d9a11c 0deg 1.2deg,transparent 1.2deg 3deg,rgba(202,138,4,.9) 3deg 4deg,transparent 4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 2.5px #ca8a04);animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:54px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(139,79,196,.95) 0deg 2.4deg,transparent 2.4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 2px #8b4fc4);animation:om-spin 24s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-64px;top:-64px;width:128px;height:2px;background:linear-gradient(90deg,transparent,rgba(202,138,4,.8),transparent);transform:rotate(45deg);transform-origin:64px 1px;"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;inset:23%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fdf7ea,#ffffff 75%);box-shadow:inset 0 0 21px rgba(202,138,4,.28);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fdf7ea,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
  `<div style="position:relative;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-60px;border-radius:50%;background:radial-gradient(circle,rgba(200,29,60,.34),rgba(199,132,0,.28) 38%,rgba(110,40,170,.2) 62%,transparent 78%);filter:blur(34px);animation:om-breathe 4.2s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-26px;border-radius:50%;background:conic-gradient(from 0deg,rgba(158,104,0,.85) 0deg 6deg,transparent 6deg 30deg,rgba(200,29,60,.45) 30deg 36deg,transparent 36deg 60deg);-webkit-mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);filter:blur(5px);animation:om-spin 20s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #cf6a4a;box-shadow:0 0 9px rgba(200,29,60,.9),0 0 26px rgba(200,29,60,.45);"></div>
          <div style="position:absolute;inset:10px;border-radius:50%;border:3px solid #d19c17;box-shadow:0 0 10px rgba(199,132,0,.95),0 0 20px rgba(158,104,0,.85);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1.5px solid rgba(199,132,0,.9);box-shadow:0 0 7px rgba(158,104,0,.95);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:2.5px solid #d0455f;box-shadow:0 0 8px rgba(200,29,60,.85),inset 0 0 12px rgba(200,29,60,.4);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#c78400 0deg 1deg,transparent 1deg 2.4deg,rgba(199,132,0,.95) 2.4deg 3.4deg,transparent 3.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);filter:drop-shadow(0 0 3px #c78400);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:36px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(200,60,90,.95) 0deg 2deg,transparent 2deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 2.5px #c81d3c);animation:om-spin 18s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:56px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(199,132,0,.95) 0deg 3.2deg,transparent 3.2deg 8deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 2px #c78400);animation:om-spin 36s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(199,132,0,.85),transparent);transform:rotate(45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(199,132,0,.85),transparent);transform:rotate(-45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;inset:24%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fdf1f3,#ffffff 75%);box-shadow:inset 0 0 23px rgba(200,29,60,.36);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fdf1f3,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
];

const FULL_RANK_CARDS_DARK = [
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(160,190,225,0.160),transparent 76%);filter:blur(14px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#7f93ad,#d6e4f5 46%,#7f93ad);box-shadow:0 0 14px rgba(160,190,225,0.50),0 0 30px rgba(160,190,225,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#141826,#07040e 72%);box-shadow:inset 0 0 22px rgba(160,190,225,0.20);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(160,190,225,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(160,190,225,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#e8f1fb;text-shadow:0 0 9px rgba(160,190,225,.85);white-space:nowrap;">\${displayName || 'Tân Binh'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(160,190,225,.85);">\${subText || 'Lv 01'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(160,190,225,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(150,180,220,.16),transparent 68%);filter:blur(14px);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid rgba(214,228,245,.85);box-shadow:0 0 6px rgba(160,190,225,.6),0 0 16px rgba(120,155,200,.35);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:1px solid rgba(180,200,225,.22);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#151327,#07060f 75%);box-shadow:inset 0 0 22px rgba(140,170,210,.18);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:126px;height:126px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#141826,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(79,227,208,0.186),transparent 76%);filter:blur(16px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#2b9d8f,#7ff2e2 46%,#2b9d8f);box-shadow:0 0 16px rgba(79,227,208,0.54),0 0 34px rgba(79,227,208,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#0c2027,#07040e 72%);box-shadow:inset 0 0 25px rgba(79,227,208,0.23);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(79,227,208,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(79,227,208,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#c9fff5;text-shadow:0 0 11px rgba(79,227,208,.85);white-space:nowrap;">\${displayName || 'Học Việc'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(79,227,208,.85);">\${subText || 'Lv 02'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(79,227,208,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(60,220,200,.2),transparent 68%);filter:blur(16px);"></div>
          <div style="position:absolute;inset:12px;border-radius:50%;border:1.5px solid #7ff2e2;box-shadow:0 0 8px rgba(79,227,208,.75),0 0 22px rgba(79,227,208,.4),inset 0 0 10px rgba(79,227,208,.3);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1px solid rgba(79,227,208,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(224,255,250,.95) 0deg 1deg,transparent 1deg 15deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 3px #4fe3d0);animation:om-spin 90s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#0e2028,#05070c 75%);box-shadow:inset 0 0 24px rgba(79,227,208,.2);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:110px;height:110px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#0c2027,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(56,189,248,0.212),transparent 76%);filter:blur(18px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#2b7fb8,#9fe4ff 46%,#2b7fb8);box-shadow:0 0 18px rgba(56,189,248,0.58),0 0 38px rgba(56,189,248,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#0b1b2b,#07040e 72%);box-shadow:inset 0 0 28px rgba(56,189,248,0.26);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(56,189,248,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(56,189,248,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#d6f2ff;text-shadow:0 0 13px rgba(56,189,248,.85);white-space:nowrap;">\${displayName || 'Thành Thạo'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(56,189,248,.85);">\${subText || 'Lv 03'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(56,189,248,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#9fe4ff;box-shadow:0 0 8px rgba(56,189,248,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(circle,rgba(56,189,248,.24),transparent 68%);filter:blur(18px);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;border:1.5px solid #9fe4ff;box-shadow:0 0 9px rgba(56,189,248,.8),0 0 26px rgba(56,189,248,.45);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:1.5px solid rgba(125,211,252,.7);box-shadow:0 0 8px rgba(56,189,248,.5),inset 0 0 12px rgba(56,189,248,.25);"></div>
          <div style="position:absolute;inset:32px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(236,254,255,.95) 0deg 1.4deg,transparent 1.4deg 10deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 4px #38bdf8);animation:om-spin 70s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#eafcff;box-shadow:0 0 10px #38bdf8,0 0 22px rgba(56,189,248,.7);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#0b1b2b,#05070c 75%);box-shadow:inset 0 0 26px rgba(56,189,248,.22);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#0b1b2b,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(79,124,255,0.238),transparent 76%);filter:blur(20px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#3f56c9,#b9caff 46%,#3f56c9);box-shadow:0 0 20px rgba(79,124,255,0.62),0 0 42px rgba(79,124,255,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#101736,#07040e 72%);box-shadow:inset 0 0 31px rgba(79,124,255,0.29);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(79,124,255,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(79,124,255,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#e2e9ff;text-shadow:0 0 15px rgba(79,124,255,.85);white-space:nowrap;">\${displayName || 'Tinh Nhuệ'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(79,124,255,.85);">\${subText || 'Lv 04'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(79,124,255,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#b9caff;box-shadow:0 0 8px rgba(79,124,255,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-24px;border-radius:50%;background:radial-gradient(circle,rgba(79,124,255,.3),transparent 66%);filter:blur(20px);animation:om-breathe 7s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:6px;border-radius:50%;border:2px solid #b9caff;box-shadow:0 0 10px rgba(79,124,255,.85),0 0 30px rgba(79,124,255,.5);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;border:1.5px solid rgba(146,170,255,.75);box-shadow:0 0 8px rgba(79,124,255,.55),inset 0 0 14px rgba(79,124,255,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(240,244,255,.95) 0deg 2deg,transparent 2deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);filter:drop-shadow(0 0 4px #4f7cff);animation:om-spin 58s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(185,202,255,.8) 0deg 4deg,transparent 4deg 24deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 3px #4f7cff);animation:om-spin 44s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #dfe7ff;box-shadow:0 0 10px #4f7cff,0 0 24px rgba(79,124,255,.7);rotate:45deg;"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#101736,#05060e 75%);box-shadow:inset 0 0 28px rgba(79,124,255,.26);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#101736,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(124,92,255,0.264),transparent 76%);filter:blur(22px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(124,92,255,.45);box-shadow:0 0 16px rgba(124,92,255,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#5b3fd6,#cbbcff 46%,#5b3fd6);box-shadow:0 0 22px rgba(124,92,255,0.66),0 0 46px rgba(124,92,255,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#191238,#07040e 72%);box-shadow:inset 0 0 34px rgba(124,92,255,0.32);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(124,92,255,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(124,92,255,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#ece5ff;text-shadow:0 0 17px rgba(124,92,255,.85);white-space:nowrap;">\${displayName || 'Cao Thủ'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(124,92,255,.85);">\${subText || 'Lv 05'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(124,92,255,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#cbbcff;box-shadow:0 0 8px rgba(124,92,255,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#cbbcff;box-shadow:0 0 8px rgba(124,92,255,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-28px;border-radius:50%;background:radial-gradient(circle,rgba(124,92,255,.34),transparent 66%);filter:blur(22px);animation:om-breathe 6.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;border:2px solid #cbbcff;box-shadow:0 0 12px rgba(124,92,255,.9),0 0 34px rgba(124,92,255,.5);"></div>
          <div style="position:absolute;inset:18px;border-radius:50%;border:1px solid rgba(167,139,250,.55);box-shadow:0 0 8px rgba(124,92,255,.4);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(196,181,253,.8);box-shadow:0 0 10px rgba(124,92,255,.6),inset 0 0 16px rgba(124,92,255,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(245,240,255,.95) 0deg 2.2deg,transparent 2.2deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 4px #7c5cff);animation:om-spin 52s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:42px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(203,188,255,.85) 0deg 3deg,transparent 3deg 12deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 3px #7c5cff);animation:om-spin 40s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #efeaff;box-shadow:0 0 12px #7c5cff,0 0 28px rgba(124,92,255,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(224,214,255,.9);box-shadow:0 0 8px rgba(124,92,255,.8);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#191238,#06050f 75%);box-shadow:inset 0 0 30px rgba(124,92,255,.3);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#191238,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(255,47,208,0.290),transparent 76%);filter:blur(24px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(255,47,208,.45);box-shadow:0 0 16px rgba(255,47,208,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#3b6bff,#ffb3f0 46%,#3b6bff);box-shadow:0 0 24px rgba(255,47,208,0.70),0 0 50px rgba(255,47,208,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#22102e,#07040e 72%);box-shadow:inset 0 0 37px rgba(255,47,208,0.35);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,47,208,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,47,208,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#ffe0f8;text-shadow:0 0 19px rgba(255,47,208,.85);white-space:nowrap;">\${displayName || 'Tông Sư'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(255,47,208,.85);">\${subText || 'Lv 06'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(255,47,208,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffb3f0;box-shadow:0 0 8px rgba(255,47,208,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffb3f0;box-shadow:0 0 8px rgba(255,47,208,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-44px;border-radius:50%;background:radial-gradient(circle,rgba(255,47,208,.34),rgba(59,107,255,.22) 50%,transparent 72%);filter:blur(28px);animation:om-breathe 5.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #6f9bff;box-shadow:0 0 16px rgba(59,107,255,.9),0 0 44px rgba(59,107,255,.5);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1px solid rgba(120,160,255,.5);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:4px solid transparent;background:conic-gradient(from 210deg,#ff2fd0,#ff8ae6 25%,rgba(255,47,208,.25) 55%,#c026d3 78%,#ff2fd0);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 10px rgba(255,47,208,.9)) drop-shadow(0 0 26px rgba(255,47,208,.5));animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:40px;border-radius:50%;border:2px solid #ffb3f0;box-shadow:0 0 14px rgba(255,47,208,.85),inset 0 0 20px rgba(255,47,208,.35);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(186,214,255,.9) 0deg 1.6deg,transparent 1.6deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 4px #3b6bff);animation:om-spin 60s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(2.5px 2.5px at 18% 24%,#cfe0ff,transparent),radial-gradient(2px 2px at 82% 18%,#fff,transparent),radial-gradient(3px 3px at 92% 62%,#7ab0ff,transparent),radial-gradient(2px 2px at 66% 92%,#fff,transparent),radial-gradient(2.5px 2.5px at 24% 86%,#8ab6ff,transparent),radial-gradient(2px 2px at 6% 54%,#fff,transparent),radial-gradient(2px 2px at 48% 4%,#ff8ae6,transparent),radial-gradient(2px 2px at 40% 70%,#ffb3f0,transparent);filter:drop-shadow(0 0 6px rgba(122,176,255,.9));animation:om-pulse 4s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(59,107,255,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(120deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#ffd9f6,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#ffd9f6,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,47,208,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(240deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#dff0ff,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(59,107,255,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2b0b32,#07040e 75%);box-shadow:inset 0 0 36px rgba(255,47,208,.32);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#22102e,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(232,121,255,0.316),transparent 76%);filter:blur(26px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(232,121,255,.45);box-shadow:0 0 16px rgba(232,121,255,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#b026c9,#fbd0ff 46%,#b026c9);box-shadow:0 0 26px rgba(232,121,255,0.74),0 0 54px rgba(232,121,255,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#2a0f3a,#07040e 72%);box-shadow:inset 0 0 40px rgba(232,121,255,0.38);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(232,121,255,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(232,121,255,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#ffe4ff;text-shadow:0 0 21px rgba(232,121,255,.85);white-space:nowrap;">\${displayName || 'Bán Thánh'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(232,121,255,.85);">\${subText || 'Lv 07'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(232,121,255,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fbd0ff;box-shadow:0 0 8px rgba(232,121,255,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fbd0ff;box-shadow:0 0 8px rgba(232,121,255,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fbd0ff;box-shadow:0 0 8px rgba(232,121,255,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-40px;border-radius:50%;background:radial-gradient(circle,rgba(217,70,239,.42),rgba(168,85,247,.16) 45%,transparent 70%);filter:blur(26px);animation:om-breathe 6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #fbd0ff;box-shadow:0 0 14px #e879ff,0 0 40px rgba(217,70,239,.6),inset 0 0 10px rgba(217,70,239,.5);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;border:2px solid #f0a8ff;box-shadow:0 0 12px rgba(217,70,239,.8),0 0 26px rgba(217,70,239,.4);"></div>
          <div style="position:absolute;inset:34px;border-radius:50%;border:1.5px solid rgba(240,168,255,.7);box-shadow:0 0 10px rgba(217,70,239,.55),inset 0 0 18px rgba(217,70,239,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0deg 2.4deg,transparent 2.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 5px #e879ff);animation:om-spin 46s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.9) 0deg 2deg,transparent 2deg 9deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 4px #e879ff);animation:om-spin 36s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #fff;box-shadow:0 0 14px #e879ff,0 0 30px rgba(217,70,239,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(217,70,239,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(255,255,255,.95);box-shadow:0 0 10px #e879ff;"></div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2a0f3a,#0a0413 75%);box-shadow:inset 0 0 34px rgba(217,70,239,.35);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2a0f3a,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(168,85,247,0.342),transparent 76%);filter:blur(28px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(168,85,247,.45);box-shadow:0 0 16px rgba(168,85,247,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:3px;background:linear-gradient(105deg,#8b3fd6,#efe0ff 46%,#8b3fd6);box-shadow:0 0 28px rgba(168,85,247,0.78),0 0 58px rgba(168,85,247,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#2b1547,#07040e 72%);box-shadow:inset 0 0 43px rgba(168,85,247,0.41);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(168,85,247,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(168,85,247,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#f3e8ff;text-shadow:0 0 23px rgba(168,85,247,.85);white-space:nowrap;">\${displayName || 'Thánh Giả'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(168,85,247,.85);">\${subText || 'Lv 08'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(168,85,247,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#efe0ff;box-shadow:0 0 8px rgba(168,85,247,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#efe0ff;box-shadow:0 0 8px rgba(168,85,247,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#efe0ff;box-shadow:0 0 8px rgba(168,85,247,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-48px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,.4),rgba(124,58,237,.18) 48%,transparent 72%);filter:blur(30px);animation:om-breathe 5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-22px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(216,180,254,.45) 14deg,transparent 30deg,transparent 90deg,rgba(168,85,247,.4) 104deg,transparent 120deg);-webkit-mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);filter:blur(6px);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(216,180,254,.45);box-shadow:0 0 14px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #efe0ff;box-shadow:0 0 20px #a855f7,0 0 56px rgba(168,85,247,.65),inset 0 0 12px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid #c99cff;box-shadow:0 0 12px rgba(168,85,247,.75);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:2.5px solid #f3e8ff;box-shadow:0 0 14px rgba(168,85,247,.85),inset 0 0 16px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:1.5px solid rgba(216,180,254,.75);box-shadow:0 0 10px rgba(168,85,247,.6),inset 0 0 20px rgba(168,85,247,.3);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0deg 1deg,transparent 1deg 3deg,rgba(216,180,254,.9) 3deg 3.8deg,transparent 3.8deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 5px #a855f7);animation:om-spin 40s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:52px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.95) 0deg 3deg,transparent 3deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);filter:drop-shadow(0 0 4px #c084fc);animation:om-spin 30s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#fff,#c084fc 55%,rgba(168,85,247,.4));box-shadow:0 0 16px rgba(168,85,247,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#fff,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(168,85,247,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#f3e8ff,rgba(168,85,247,.5));box-shadow:0 0 12px rgba(168,85,247,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 10px #c084fc,0 0 22px rgba(168,85,247,.85);"></div>
          <div style="position:absolute;inset:22%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2b1547,#080410 75%);box-shadow:inset 0 0 44px rgba(168,85,247,.5);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2b1547,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(255,209,102,0.368),transparent 76%);filter:blur(30px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(255,209,102,.45);box-shadow:0 0 16px rgba(255,209,102,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:3px;background:linear-gradient(105deg,#a45ce0,#ffe6ad 46%,#a45ce0);box-shadow:0 0 30px rgba(255,209,102,0.82),0 0 62px rgba(255,209,102,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#2a1a3c,#07040e 72%);box-shadow:inset 0 0 46px rgba(255,209,102,0.44);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,209,102,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,209,102,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:27px;font-weight:700;letter-spacing:.05em;color:#fff2d4;text-shadow:0 0 25px rgba(255,209,102,.85);white-space:nowrap;">\${displayName || 'Thần Vực'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(255,209,102,.85);">\${subText || 'Lv 09'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(255,209,102,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe6ad;box-shadow:0 0 8px rgba(255,209,102,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe6ad;box-shadow:0 0 8px rgba(255,209,102,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe6ad;box-shadow:0 0 8px rgba(255,209,102,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe6ad;box-shadow:0 0 8px rgba(255,209,102,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-52px;border-radius:50%;background:radial-gradient(circle,rgba(255,209,102,.3),rgba(192,132,252,.3) 42%,transparent 72%);filter:blur(32px);animation:om-breathe 4.6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-16px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(255,209,102,.35) 18deg,transparent 36deg,transparent 54deg,rgba(192,132,252,.35) 72deg,transparent 90deg);-webkit-mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);filter:blur(6px);animation:om-spin 26s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #ffe6ad;box-shadow:0 0 16px rgba(255,209,102,.9),0 0 46px rgba(255,209,102,.4);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:2.5px solid #e9d5ff;box-shadow:0 0 16px rgba(192,132,252,.9),0 0 34px rgba(168,85,247,.45);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(255,209,102,.8);box-shadow:0 0 12px rgba(255,209,102,.7);"></div>
          <div style="position:absolute;inset:46px;border-radius:50%;border:2px solid #f5ebff;box-shadow:0 0 14px rgba(192,132,252,.8),inset 0 0 22px rgba(168,85,247,.35);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff5da 0deg 1.2deg,transparent 1.2deg 3deg,rgba(255,209,102,.9) 3deg 4deg,transparent 4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 5px #ffd166);animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:54px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(233,213,255,.95) 0deg 2.4deg,transparent 2.4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 4px #c084fc);animation:om-spin 24s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-64px;top:-64px;width:128px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,229,173,.8),transparent);transform:rotate(45deg);transform-origin:64px 1px;"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#fff,#ffd166 45%,rgba(192,132,252,.6));box-shadow:0 0 20px rgba(255,209,102,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,209,102,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#fff,#c084fc 60%,rgba(168,85,247,.4));box-shadow:0 0 14px rgba(192,132,252,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#fff;box-shadow:0 0 10px #ffd166,0 0 20px rgba(255,209,102,.8);"></div>
          <div style="position:absolute;inset:23%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2a1a3c,#0a0512 75%);box-shadow:inset 0 0 42px rgba(255,209,102,.28);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2a1a3c,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(255,207,92,0.394),transparent 76%);filter:blur(32px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(255,207,92,.45);box-shadow:0 0 16px rgba(255,207,92,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:3px;background:linear-gradient(105deg,#ff3b5c,#ffe9b0 46%,#ff3b5c);box-shadow:0 0 32px rgba(255,207,92,0.86),0 0 66px rgba(255,207,92,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#3a1220,#07040e 72%);box-shadow:inset 0 0 49px rgba(255,207,92,0.47);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,207,92,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,207,92,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:27px;font-weight:700;letter-spacing:.05em;color:#ffe6d4;text-shadow:0 0 27px rgba(255,207,92,.85);white-space:nowrap;">\${displayName || 'Huyền Thoại'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:rgba(255,207,92,.85);">\${subText || 'Lv 10'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#fff;box-shadow:0 0 8px rgba(255,207,92,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe9b0;box-shadow:0 0 8px rgba(255,207,92,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe9b0;box-shadow:0 0 8px rgba(255,207,92,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe9b0;box-shadow:0 0 8px rgba(255,207,92,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ffe9b0;box-shadow:0 0 8px rgba(255,207,92,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-60px;border-radius:50%;background:radial-gradient(circle,rgba(255,59,92,.34),rgba(255,207,92,.28) 38%,rgba(120,40,200,.2) 62%,transparent 78%);filter:blur(34px);animation:om-breathe 4.2s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-26px;border-radius:50%;background:conic-gradient(from 0deg,rgba(255,207,92,.5) 0deg 6deg,transparent 6deg 30deg,rgba(255,59,92,.45) 30deg 36deg,transparent 36deg 60deg);-webkit-mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);filter:blur(5px);animation:om-spin 20s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #ffd9c2;box-shadow:0 0 18px rgba(255,59,92,.9),0 0 52px rgba(255,59,92,.45);"></div>
          <div style="position:absolute;inset:10px;border-radius:50%;border:3px solid #ffe9b0;box-shadow:0 0 20px rgba(255,207,92,.95),0 0 40px rgba(255,207,92,.5);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1.5px solid rgba(255,255,255,.9);box-shadow:0 0 14px rgba(255,255,255,.7);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:2.5px solid #ffb0c0;box-shadow:0 0 16px rgba(255,59,92,.85),inset 0 0 24px rgba(255,59,92,.4);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0deg 1deg,transparent 1deg 2.4deg,rgba(255,207,92,.95) 2.4deg 3.4deg,transparent 3.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);filter:drop-shadow(0 0 6px #ffcf5c);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:36px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,176,192,.95) 0deg 2deg,transparent 2deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 5px #ff3b5c);animation:om-spin 18s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:56px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.95) 0deg 3.2deg,transparent 3.2deg 8deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 4px #ffcf5c);animation:om-spin 36s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,207,92,.85),transparent);transform:rotate(45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(255,207,92,.85),transparent);transform:rotate(-45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#fff,#ffcf5c 40%,#ff3b5c 78%,rgba(255,59,92,.5));box-shadow:0 0 26px rgba(255,207,92,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#fff,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,207,92,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#fff,#ff3b5c 62%,rgba(255,59,92,.4));box-shadow:0 0 18px rgba(255,59,92,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #fff;box-shadow:0 0 12px #ffcf5c,0 0 24px rgba(255,207,92,.8);rotate:45deg;"></div>
          <div style="position:absolute;inset:24%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#3a1220,#0c0409 75%);box-shadow:inset 0 0 46px rgba(255,59,92,.36);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#3a1220,#06040d 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
];

const FULL_RANK_CARDS_LIGHT = [
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(88,118,152,0.160),transparent 76%);filter:blur(14px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#4a5f78,#8098b3 46%,#4a5f78);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 7px rgba(88,118,152,0.50),0 0 15px rgba(88,118,152,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#f1f5fa,#ffffff 72%);box-shadow:inset 0 0 11px rgba(88,118,152,0.20);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(88,118,152,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(88,118,152,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#31445a;white-space:nowrap;">\${displayName || 'Tân Binh'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#3e5670;">\${subText || 'Lv 01'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#5b7290;box-shadow:0 0 4px rgba(88,118,152,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-10px;border-radius:50%;background:radial-gradient(circle,rgba(88,118,152,.16),transparent 68%);filter:blur(14px);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid rgba(58,82,112,.95);box-shadow:0 0 3px rgba(88,118,152,.6),0 0 8px rgba(120,155,200,.35);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:1px solid rgba(90,118,150,.22);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#eff3f9,#ffffff 75%);box-shadow:inset 0 0 11px rgba(140,170,210,.18);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:126px;height:126px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#f1f5fa,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(13,148,136,0.186),transparent 76%);filter:blur(16px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#0b6f64,#17b8a6 46%,#0b6f64);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 8px rgba(13,148,136,0.54),0 0 17px rgba(13,148,136,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#eaf8f5,#ffffff 72%);box-shadow:inset 0 0 12.5px rgba(13,148,136,0.23);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(13,148,136,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(13,148,136,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#0e6f66;white-space:nowrap;">\${displayName || 'Học Việc'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#0b6f64;">\${subText || 'Lv 02'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#0d9488;box-shadow:0 0 4px rgba(13,148,136,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(13,148,136,.2),transparent 68%);filter:blur(16px);"></div>
          <div style="position:absolute;inset:12px;border-radius:50%;border:1.5px solid #17b8a6;box-shadow:0 0 4px rgba(13,148,136,.75),0 0 11px rgba(13,148,136,.4),inset 0 0 5px rgba(13,148,136,.3);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1px solid rgba(13,148,136,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(13,148,136,.95) 0deg 1deg,transparent 1deg 15deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 1.5px #0d9488);animation:om-spin 90s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#e8f7f4,#ffffff 75%);box-shadow:inset 0 0 12px rgba(13,148,136,.2);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:110px;height:110px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#eaf8f5,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(2,132,199,0.212),transparent 76%);filter:blur(18px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#0a5c88,#3ba0d8 46%,#0a5c88);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 9px rgba(2,132,199,0.58),0 0 19px rgba(2,132,199,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#e9f4fb,#ffffff 72%);box-shadow:inset 0 0 14px rgba(2,132,199,0.26);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(2,132,199,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(2,132,199,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#0a5d86;white-space:nowrap;">\${displayName || 'Thành Thạo'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#075f8c;">\${subText || 'Lv 03'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#0284c7;box-shadow:0 0 4px rgba(2,132,199,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#3ba0d8;box-shadow:0 0 4px rgba(2,132,199,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-18px;border-radius:50%;background:radial-gradient(circle,rgba(2,132,199,.24),transparent 68%);filter:blur(18px);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;border:1.5px solid #3ba0d8;box-shadow:0 0 4.5px rgba(2,132,199,.8),0 0 13px rgba(2,132,199,.45);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:1.5px solid rgba(2,132,199,.7);box-shadow:0 0 4px rgba(2,132,199,.5),inset 0 0 6px rgba(2,132,199,.25);"></div>
          <div style="position:absolute;inset:32px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(2,132,199,.95) 0deg 1.4deg,transparent 1.4deg 10deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 2px #0284c7);animation:om-spin 70s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-142px);width:8px;height:8px;border-radius:50%;background:#0284c7;box-shadow:0 0 5px #0284c7,0 0 11px rgba(2,132,199,.7);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#e9f4fb,#ffffff 75%);box-shadow:inset 0 0 13px rgba(2,132,199,.22);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#e9f4fb,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(49,78,196,0.238),transparent 76%);filter:blur(20px);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#26348c,#6b83e8 46%,#26348c);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 10px rgba(49,78,196,0.62),0 0 21px rgba(49,78,196,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#eff1fc,#ffffff 72%);box-shadow:inset 0 0 15.5px rgba(49,78,196,0.29);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(49,78,196,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(49,78,196,.5),transparent);"></div>
          
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:23px;font-weight:700;letter-spacing:.05em;color:#26327a;white-space:nowrap;">\${displayName || 'Tinh Nhuệ'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#28357f;">\${subText || 'Lv 04'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#3a52c8;box-shadow:0 0 4px rgba(49,78,196,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#6b83e8;box-shadow:0 0 4px rgba(49,78,196,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-24px;border-radius:50%;background:radial-gradient(circle,rgba(49,78,196,.3),transparent 66%);filter:blur(20px);animation:om-breathe 7s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:6px;border-radius:50%;border:2px solid #6b83e8;box-shadow:0 0 5px rgba(49,78,196,.85),0 0 15px rgba(49,78,196,.5);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;border:1.5px solid rgba(58,82,200,.75);box-shadow:0 0 4px rgba(49,78,196,.55),inset 0 0 7px rgba(49,78,196,.3);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(58,82,200,.95) 0deg 2deg,transparent 2deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);mask:radial-gradient(circle closest-side,transparent 0 84%,#000 84% 100%);filter:drop-shadow(0 0 2px #3a52c8);animation:om-spin 58s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(90,112,220,.8) 0deg 4deg,transparent 4deg 24deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 1.5px #3a52c8);animation:om-spin 44s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-144px);width:16px;height:16px;border:1.5px solid #4a63cf;box-shadow:0 0 5px #3a52c8,0 0 12px rgba(49,78,196,.7);rotate:45deg;"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#eff1fc,#ffffff 75%);box-shadow:inset 0 0 14px rgba(49,78,196,.26);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#eff1fc,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(93,58,214,0.264),transparent 76%);filter:blur(22px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(93,58,214,.45);box-shadow:0 0 8px rgba(93,58,214,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#3f2596,#8b6ae8 46%,#3f2596);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 11px rgba(93,58,214,0.66),0 0 23px rgba(93,58,214,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#f2effd,#ffffff 72%);box-shadow:inset 0 0 17px rgba(93,58,214,0.32);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(93,58,214,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(93,58,214,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#3a2782;white-space:nowrap;">\${displayName || 'Cao Thủ'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#4a2aa8;">\${subText || 'Lv 05'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#5d3ad6;box-shadow:0 0 4px rgba(93,58,214,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#8b6ae8;box-shadow:0 0 4px rgba(93,58,214,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#8b6ae8;box-shadow:0 0 4px rgba(93,58,214,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-28px;border-radius:50%;background:radial-gradient(circle,rgba(93,58,214,.34),transparent 66%);filter:blur(22px);animation:om-breathe 6.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;border:2px solid #8b6ae8;box-shadow:0 0 6px rgba(93,58,214,.9),0 0 17px rgba(93,58,214,.5);"></div>
          <div style="position:absolute;inset:18px;border-radius:50%;border:1px solid rgba(93,58,214,.55);box-shadow:0 0 4px rgba(93,58,214,.4);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(93,58,214,.8);box-shadow:0 0 5px rgba(93,58,214,.6),inset 0 0 8px rgba(93,58,214,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(93,58,214,.95) 0deg 2.2deg,transparent 2.2deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 2px #5d3ad6);animation:om-spin 52s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:42px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(120,90,230,.85) 0deg 3deg,transparent 3deg 12deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 1.5px #5d3ad6);animation:om-spin 40s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-146px);width:20px;height:20px;border:1.5px solid #6a45d8;box-shadow:0 0 6px #5d3ad6,0 0 14px rgba(93,58,214,.75);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-140px);width:12px;height:12px;border:1.5px solid rgba(110,74,220,.9);box-shadow:0 0 4px rgba(93,58,214,.8);"></div>
          <div style="position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#f2effd,#ffffff 75%);box-shadow:inset 0 0 15px rgba(93,58,214,.3);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#f2effd,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(200,20,155,0.290),transparent 76%);filter:blur(24px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(200,20,155,.45);box-shadow:0 0 8px rgba(200,20,155,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#2b4abe,#e14fc0 46%,#2b4abe);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 12px rgba(200,20,155,0.70),0 0 25px rgba(200,20,155,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#fdf0f9,#ffffff 72%);box-shadow:inset 0 0 18.5px rgba(200,20,155,0.35);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,20,155,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,20,155,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#9c157c;white-space:nowrap;">\${displayName || 'Tông Sư'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#9c157c;">\${subText || 'Lv 06'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#c8149b;box-shadow:0 0 4px rgba(200,20,155,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#e14fc0;box-shadow:0 0 4px rgba(200,20,155,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#e14fc0;box-shadow:0 0 4px rgba(200,20,155,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-44px;border-radius:50%;background:radial-gradient(circle,rgba(200,20,155,.34),rgba(43,74,190,.22) 50%,transparent 72%);filter:blur(28px);animation:om-breathe 5.5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #3f63c8;box-shadow:0 0 8px rgba(43,74,190,.9),0 0 22px rgba(43,74,190,.5);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1px solid rgba(43,74,190,.5);"></div>
          <div style="position:absolute;inset:24px;border-radius:50%;border:4px solid transparent;background:conic-gradient(from 210deg,#c8149b,#e14fc0 25%,rgba(200,20,155,.25) 55%,#9c1aa8 78%,#c8149b);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 5px rgba(200,20,155,.9)) drop-shadow(0 0 13px rgba(200,20,155,.5));animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:40px;border-radius:50%;border:2px solid #e14fc0;box-shadow:0 0 7px rgba(200,20,155,.85),inset 0 0 10px rgba(200,20,155,.35);"></div>
          <div style="position:absolute;inset:8px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(43,74,190,.9) 0deg 1.6deg,transparent 1.6deg 7deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 2px #2b4abe);animation:om-spin 60s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-6px;border-radius:50%;background:radial-gradient(2.5px 2.5px at 18% 24%,#5a7ad0,transparent),radial-gradient(2px 2px at 82% 18%,#c8149b,transparent),radial-gradient(3px 3px at 92% 62%,#3f63c8,transparent),radial-gradient(2px 2px at 66% 92%,#c8149b,transparent),radial-gradient(2.5px 2.5px at 24% 86%,#4f6fc8,transparent),radial-gradient(2px 2px at 6% 54%,#c8149b,transparent),radial-gradient(2px 2px at 48% 4%,#e14fc0,transparent),radial-gradient(2px 2px at 40% 70%,#e14fc0,transparent);filter:drop-shadow(0 0 3px rgba(43,74,190,.9));animation:om-pulse 4s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#c8149b,rgba(43,74,190,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(120deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#d43fb0,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#d43fb0,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#c8149b,rgba(200,20,155,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(240deg) translateY(-150px);width:0;height:0;">
          <div style="position:absolute;left:-70px;top:-1px;width:140px;height:2px;background:linear-gradient(90deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-70px;width:2px;height:140px;background:linear-gradient(180deg,transparent,#3f63c8,transparent);"></div>
          <div style="position:absolute;left:-11px;top:-11px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,#c8149b,rgba(43,74,190,.7) 40%,transparent 72%);"></div>
          </div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fbeef8,#ffffff 75%);box-shadow:inset 0 0 18px rgba(200,20,155,.32);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fdf0f9,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(168,26,200,0.316),transparent 76%);filter:blur(26px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(168,26,200,.45);box-shadow:0 0 8px rgba(168,26,200,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:2px;background:linear-gradient(105deg,#701184,#c94ede 46%,#701184);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 13px rgba(168,26,200,0.74),0 0 27px rgba(168,26,200,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#fbeffc,#ffffff 72%);box-shadow:inset 0 0 20px rgba(168,26,200,0.38);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(168,26,200,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(168,26,200,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#821594;white-space:nowrap;">\${displayName || 'Bán Thánh'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#7c1494;">\${subText || 'Lv 07'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#a81ac8;box-shadow:0 0 4px rgba(168,26,200,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#c94ede;box-shadow:0 0 4px rgba(168,26,200,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#c94ede;box-shadow:0 0 4px rgba(168,26,200,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#c94ede;box-shadow:0 0 4px rgba(168,26,200,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-40px;border-radius:50%;background:radial-gradient(circle,rgba(168,26,200,.42),rgba(126,34,206,.16) 45%,transparent 70%);filter:blur(26px);animation:om-breathe 6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #c94ede;box-shadow:0 0 7px #a81ac8,0 0 20px rgba(168,26,200,.6),inset 0 0 5px rgba(168,26,200,.5);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;border:2px solid #b93bd0;box-shadow:0 0 6px rgba(168,26,200,.8),0 0 13px rgba(168,26,200,.4);"></div>
          <div style="position:absolute;inset:34px;border-radius:50%;border:1.5px solid rgba(168,26,200,.7);box-shadow:0 0 5px rgba(168,26,200,.55),inset 0 0 9px rgba(168,26,200,.3);"></div>
          <div style="position:absolute;inset:22px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#a81ac8 0deg 2.4deg,transparent 2.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 2.5px #a81ac8);animation:om-spin 46s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(168,26,200,.9) 0deg 2deg,transparent 2deg 9deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);mask:radial-gradient(circle closest-side,transparent 0 90%,#000 90% 100%);filter:drop-shadow(0 0 2px #a81ac8);animation:om-spin 36s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-148px);width:0;height:0;">
          <div style="position:absolute;left:-95px;top:-1px;width:190px;height:2px;background:linear-gradient(90deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-1px;top:-95px;width:2px;height:190px;background:linear-gradient(180deg,transparent,#a81ac8,transparent);filter:blur(.7px);"></div>
          <div style="position:absolute;left:-13px;top:-13px;width:26px;height:26px;border:1.5px solid #a81ac8;box-shadow:0 0 7px #a81ac8,0 0 15px rgba(168,26,200,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,#a81ac8,rgba(168,26,200,.6) 38%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-138px);width:18px;height:18px;border:1.5px solid rgba(168,26,200,.95);box-shadow:0 0 5px #a81ac8;"></div>
          <div style="position:absolute;inset:21%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fbeffc,#ffffff 75%);box-shadow:inset 0 0 17px rgba(168,26,200,.35);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fbeffc,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(126,34,206,0.342),transparent 76%);filter:blur(28px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(126,34,206,.45);box-shadow:0 0 8px rgba(126,34,206,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:3px;background:linear-gradient(105deg,#511a86,#9d5be0 46%,#511a86);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 14px rgba(126,34,206,0.78),0 0 29px rgba(126,34,206,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#f6eefd,#ffffff 72%);box-shadow:inset 0 0 21.5px rgba(126,34,206,0.41);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(126,34,206,.7),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(126,34,206,.5),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:25px;font-weight:700;letter-spacing:.05em;color:#63189e;white-space:nowrap;">\${displayName || 'Thánh Giả'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#66189e;">\${subText || 'Lv 08'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#9333ea;box-shadow:0 0 4px rgba(126,34,206,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#9d5be0;box-shadow:0 0 4px rgba(126,34,206,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#9d5be0;box-shadow:0 0 4px rgba(126,34,206,.9);"></div><div style="width:7px;height:7px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#9d5be0;box-shadow:0 0 4px rgba(126,34,206,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-48px;border-radius:50%;background:radial-gradient(circle,rgba(126,34,206,.4),rgba(92,20,160,.18) 48%,transparent 72%);filter:blur(30px);animation:om-breathe 5s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-22px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(126,34,206,.45) 14deg,transparent 30deg,transparent 90deg,rgba(126,34,206,.4) 104deg,transparent 120deg);-webkit-mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);mask:radial-gradient(circle closest-side,#000 44%,transparent 80%);filter:blur(6px);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(126,34,206,.45);box-shadow:0 0 7px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:2px;border-radius:50%;border:2.5px solid #9d5be0;box-shadow:0 0 10px #a855f7,0 0 28px rgba(126,34,206,.65),inset 0 0 6px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:1.5px solid #8b48d0;box-shadow:0 0 6px rgba(126,34,206,.75);"></div>
          <div style="position:absolute;inset:26px;border-radius:50%;border:2.5px solid #63189e;box-shadow:0 0 7px rgba(126,34,206,.85),inset 0 0 8px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:1.5px solid rgba(126,34,206,.75);box-shadow:0 0 5px rgba(126,34,206,.6),inset 0 0 10px rgba(126,34,206,.3);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#9333ea 0deg 1deg,transparent 1deg 3deg,rgba(126,34,206,.9) 3deg 3.8deg,transparent 3.8deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);mask:radial-gradient(circle closest-side,transparent 0 86%,#000 86% 100%);filter:drop-shadow(0 0 2.5px #a855f7);animation:om-spin 40s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:52px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(147,51,234,.95) 0deg 3deg,transparent 3deg 7.5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);mask:radial-gradient(circle closest-side,transparent 0 91%,#000 91% 100%);filter:drop-shadow(0 0 2px #9333ea);animation:om-spin 30s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-152px);width:0;height:0;">
          <div style="position:absolute;left:-9px;top:-30px;width:18px;height:60px;clip-path:polygon(50% 0,100% 42%,60% 100%,40% 100%,0 42%);background:linear-gradient(180deg,#9333ea,#9333ea 55%,rgba(126,34,206,.4));box-shadow:0 0 8px rgba(126,34,206,.9);"></div>
          <div style="position:absolute;left:-100px;top:-1px;width:200px;height:2px;background:linear-gradient(90deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-1px;top:-105px;width:2px;height:210px;background:linear-gradient(180deg,transparent,#9333ea,transparent);filter:blur(.6px);"></div>
          <div style="position:absolute;left:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9333ea,rgba(126,34,206,.55) 36%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-146px);width:14px;height:34px;clip-path:polygon(50% 0,100% 40%,50% 100%,0 40%);background:linear-gradient(180deg,#63189e,rgba(126,34,206,.5));box-shadow:0 0 6px rgba(126,34,206,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-136px);width:9px;height:9px;border-radius:50%;background:#9333ea;box-shadow:0 0 5px #9333ea,0 0 11px rgba(126,34,206,.85);"></div>
          <div style="position:absolute;inset:22%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#f6eefd,#ffffff 75%);box-shadow:inset 0 0 22px rgba(126,34,206,.5);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#f6eefd,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(202,138,4,0.368),transparent 76%);filter:blur(30px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(202,138,4,.45);box-shadow:0 0 8px rgba(202,138,4,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:3px;background:linear-gradient(105deg,#6b2f9e,#d9a11c 46%,#6b2f9e);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 15px rgba(202,138,4,0.82),0 0 31px rgba(202,138,4,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#fdf7ea,#ffffff 72%);box-shadow:inset 0 0 23px rgba(202,138,4,0.44);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(160,110,4,.95),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(160,110,4,.85),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:27px;font-weight:700;letter-spacing:.05em;color:#8a6410;white-space:nowrap;">\${displayName || 'Thần Vực'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#7a5a08;">\${subText || 'Lv 09'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#ca8a04;box-shadow:0 0 4px rgba(202,138,4,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d9a11c;box-shadow:0 0 4px rgba(202,138,4,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d9a11c;box-shadow:0 0 4px rgba(202,138,4,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d9a11c;box-shadow:0 0 4px rgba(202,138,4,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d9a11c;box-shadow:0 0 4px rgba(202,138,4,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-52px;border-radius:50%;background:radial-gradient(circle,rgba(202,138,4,.3),rgba(139,79,196,.3) 42%,transparent 72%);filter:blur(32px);animation:om-breathe 4.6s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-16px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0deg,rgba(202,138,4,.35) 18deg,transparent 36deg,transparent 54deg,rgba(139,79,196,.35) 72deg,transparent 90deg);-webkit-mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);mask:radial-gradient(circle closest-side,#000 40%,transparent 78%);filter:blur(6px);animation:om-spin 26s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:0;border-radius:50%;border:2px solid #d9a11c;box-shadow:0 0 8px rgba(202,138,4,.9),0 0 23px rgba(202,138,4,.4);"></div>
          <div style="position:absolute;inset:14px;border-radius:50%;border:2.5px solid #9a5cd0;box-shadow:0 0 8px rgba(139,79,196,.9),0 0 17px rgba(126,34,206,.45);"></div>
          <div style="position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(202,138,4,.8);box-shadow:0 0 6px rgba(160,110,4,.95);"></div>
          <div style="position:absolute;inset:46px;border-radius:50%;border:2px solid #8b4fc4;box-shadow:0 0 7px rgba(139,79,196,.8),inset 0 0 11px rgba(126,34,206,.35);"></div>
          <div style="position:absolute;inset:20px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#d9a11c 0deg 1.2deg,transparent 1.2deg 3deg,rgba(202,138,4,.9) 3deg 4deg,transparent 4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);mask:radial-gradient(circle closest-side,transparent 0 88%,#000 88% 100%);filter:drop-shadow(0 0 2.5px #ca8a04);animation:om-spin 34s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:54px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(139,79,196,.95) 0deg 2.4deg,transparent 2.4deg 6deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);mask:radial-gradient(circle closest-side,transparent 0 92%,#000 92% 100%);filter:drop-shadow(0 0 2px #8b4fc4);animation:om-spin 24s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-64px;top:-64px;width:128px;height:2px;background:linear-gradient(90deg,transparent,rgba(202,138,4,.8),transparent);transform:rotate(45deg);transform-origin:64px 1px;"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-156px);width:0;height:0;">
          <div style="position:absolute;left:-11px;top:-40px;width:22px;height:80px;clip-path:polygon(50% 0,72% 34%,100% 50%,58% 68%,50% 100%,42% 68%,0 50%,28% 34%);background:linear-gradient(180deg,#ca8a04,#ca8a04 45%,rgba(139,79,196,.6));box-shadow:0 0 10px rgba(202,138,4,.9);"></div>
          <div style="position:absolute;left:-112px;top:-1px;width:224px;height:2px;background:linear-gradient(90deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-1px;top:-118px;width:2px;height:236px;background:linear-gradient(180deg,transparent,#ca8a04,transparent);"></div>
          <div style="position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#ca8a04,rgba(202,138,4,.6) 34%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-148px);width:16px;height:44px;clip-path:polygon(50% 0,100% 38%,50% 100%,0 38%);background:linear-gradient(180deg,#ca8a04,#8b4fc4 60%,rgba(126,34,206,.4));box-shadow:0 0 7px rgba(139,79,196,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-138px);width:10px;height:10px;border-radius:50%;background:#ca8a04;box-shadow:0 0 5px #ca8a04,0 0 10px rgba(202,138,4,.8);"></div>
          <div style="position:absolute;inset:23%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fdf7ea,#ffffff 75%);box-shadow:inset 0 0 21px rgba(202,138,4,.28);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fdf7ea,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>
    </div>`,
  `<div style="position:relative;width:528px;height:156px;margin:0 auto;">
      <div style="position:absolute;left:78px;top:16px;width:440px;height:124px;border-radius:40px;background:radial-gradient(65% 100% at 40% 50%,rgba(199,132,0,0.394),transparent 76%);filter:blur(32px);"></div>
      <div style="position:absolute;left:71px;top:19px;width:434px;height:118px;border-radius:34px;-webkit-mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);mask:radial-gradient(circle 80px at 7px 50%,transparent 0 80px,#000 80px);border:1px solid rgba(199,132,0,.45);box-shadow:0 0 8px rgba(199,132,0,.35);"></div>
      <div style="position:absolute;left:78px;top:26px;width:420px;height:104px;border-radius:26px;-webkit-mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);mask:radial-gradient(circle 79px at 0px 50%,transparent 0 79px,#000 79px);padding:3px;background:linear-gradient(105deg,#c81d3c,#d19c17 46%,#c81d3c);box-shadow: 0 5px 14px rgba(30,25,50,.16),0 0 16px rgba(199,132,0,0.86),0 0 33px rgba(199,132,0,.28);">
        <div style="width:100%;height:100%;border-radius:23px;background:linear-gradient(120deg,#fdf1f3,#ffffff 72%);box-shadow:inset 0 0 24.5px rgba(199,132,0,0.47);position:relative;overflow:hidden;">
          <div style="position:absolute;left:92px;right:12px;top:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(158,104,0,.95),transparent);"></div>
          <div style="position:absolute;left:92px;right:12px;bottom:10px;height:1px;background:linear-gradient(90deg,transparent,rgba(158,104,0,.85),transparent);"></div>
        </div>
      </div>
      <div style="position:absolute;left:178px;top:26px;height:104px;width:298px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0;">
          <div style="font-family:'Cinzel',serif;font-size:27px;font-weight:700;letter-spacing:.05em;color:#9c1730;white-space:nowrap;">\${displayName || 'Huyền Thoại'}</div>
          <div style="font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:#8a5a00;">\${subText || 'Lv 10'}</div>
        </div>
        <div style="display:flex;gap:5px;align-items:center;flex:0 0 auto;"><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#c78400;box-shadow:0 0 4px rgba(199,132,0,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d19c17;box-shadow:0 0 4px rgba(199,132,0,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d19c17;box-shadow:0 0 4px rgba(199,132,0,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d19c17;box-shadow:0 0 4px rgba(199,132,0,.9);"></div><div style="width:9px;height:9px;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:#d19c17;box-shadow:0 0 4px rgba(199,132,0,.9);"></div></div>
      </div>
      <div style="position:absolute;left:0;top:0;width:156px;height:156px;">
        <div style="position:absolute;left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%) scale(0.52);">
          <div style="position:absolute;inset:-60px;border-radius:50%;background:radial-gradient(circle,rgba(200,29,60,.34),rgba(199,132,0,.28) 38%,rgba(110,40,170,.2) 62%,transparent 78%);filter:blur(34px);animation:om-breathe 4.2s ease-in-out infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-26px;border-radius:50%;background:conic-gradient(from 0deg,rgba(158,104,0,.85) 0deg 6deg,transparent 6deg 30deg,rgba(200,29,60,.45) 30deg 36deg,transparent 36deg 60deg);-webkit-mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);mask:radial-gradient(circle closest-side,#000 42%,transparent 80%);filter:blur(5px);animation:om-spin 20s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid #cf6a4a;box-shadow:0 0 9px rgba(200,29,60,.9),0 0 26px rgba(200,29,60,.45);"></div>
          <div style="position:absolute;inset:10px;border-radius:50%;border:3px solid #d19c17;box-shadow:0 0 10px rgba(199,132,0,.95),0 0 20px rgba(158,104,0,.85);"></div>
          <div style="position:absolute;inset:28px;border-radius:50%;border:1.5px solid rgba(199,132,0,.9);box-shadow:0 0 7px rgba(158,104,0,.95);"></div>
          <div style="position:absolute;inset:44px;border-radius:50%;border:2.5px solid #d0455f;box-shadow:0 0 8px rgba(200,29,60,.85),inset 0 0 12px rgba(200,29,60,.4);"></div>
          <div style="position:absolute;inset:16px;border-radius:50%;background:repeating-conic-gradient(from 0deg,#c78400 0deg 1deg,transparent 1deg 2.4deg,rgba(199,132,0,.95) 2.4deg 3.4deg,transparent 3.4deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);mask:radial-gradient(circle closest-side,transparent 0 89%,#000 89% 100%);filter:drop-shadow(0 0 3px #c78400);animation:om-spin 28s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:36px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(200,60,90,.95) 0deg 2deg,transparent 2deg 5deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 2.5px #c81d3c);animation:om-spin 18s linear infinite reverse;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;inset:56px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(199,132,0,.95) 0deg 3.2deg,transparent 3.2deg 8deg);-webkit-mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);mask:radial-gradient(circle closest-side,transparent 0 93%,#000 93% 100%);filter:drop-shadow(0 0 2px #c78400);animation:om-spin 36s linear infinite;animation-play-state:var(--om-spin,running);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(0deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(199,132,0,.85),transparent);transform:rotate(45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-70px;top:-70px;width:140px;height:2px;background:linear-gradient(90deg,transparent,rgba(199,132,0,.85),transparent);transform:rotate(-45deg);transform-origin:70px 1px;"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(90deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(180deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(270deg) translateY(-162px);width:0;height:0;">
          <div style="position:absolute;left:-13px;top:-52px;width:26px;height:104px;clip-path:polygon(50% 0,70% 30%,100% 46%,60% 62%,50% 100%,40% 62%,0 46%,30% 30%);background:linear-gradient(180deg,#c78400,#c78400 40%,#c81d3c 78%,rgba(200,29,60,.5));box-shadow:0 0 13px rgba(199,132,0,.95);"></div>
          <div style="position:absolute;left:-130px;top:-1.5px;width:260px;height:3px;background:linear-gradient(90deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-1.5px;top:-136px;width:3px;height:272px;background:linear-gradient(180deg,transparent,#c78400,transparent);"></div>
          <div style="position:absolute;left:-27px;top:-27px;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle,#c78400,rgba(199,132,0,.6) 32%,transparent 70%);"></div>
          </div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(135deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(225deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(315deg) translateY(-154px);width:18px;height:56px;clip-path:polygon(50% 0,100% 36%,50% 100%,0 36%);background:linear-gradient(180deg,#c78400,#c81d3c 62%,rgba(200,29,60,.4));box-shadow:0 0 9px rgba(200,29,60,.9);"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(22.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(67.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(112.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(157.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(202.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(247.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(292.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(337.5deg) translateY(-142px);width:14px;height:14px;border:1.5px solid #c78400;box-shadow:0 0 6px #c78400,0 0 12px rgba(199,132,0,.8);rotate:45deg;"></div>
          <div style="position:absolute;inset:24%;border-radius:50%;background:radial-gradient(circle at 50% 35%,#fdf1f3,#ffffff 75%);box-shadow:inset 0 0 23px rgba(200,29,60,.36);"></div>
        </div>
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:87px;height:87px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#fdf1f3,#ffffff 78%);">
          <img src="\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>';">
        </div>
      </div>`,
];

const AVATAR_FRAMES = AVATAR_FRAMES_DARK;
const FULL_RANK_CARDS = FULL_RANK_CARDS_DARK;


function getCurrentAvatarThemeMode() {
    try {
        if (typeof document !== 'undefined') {
            const attr = document.documentElement.getAttribute('data-theme') || document.body.getAttribute('data-theme');
            if (attr === 'dark' || attr === 'light') return attr;
        }
        if (typeof localStorage !== 'undefined') {
            const local = localStorage.getItem('hg_theme');
            if (local === 'dark' || local === 'light') return local;
        }
    } catch (e) {}
    return 'light';
}

// Ensure keyframe animations exist
if (typeof document !== 'undefined' && !document.getElementById('avatar-frames-anim-style')) {
    const animStyle = document.createElement('style');
    animStyle.id = 'avatar-frames-anim-style';
    animStyle.textContent = `
        @keyframes om-spin { to { transform: rotate(360deg); } }
        @keyframes om-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes om-sweep { from { transform: translateX(-110%) skewX(-18deg); } to { transform: translateX(345%) skewX(-18deg); } }
        @keyframes om-gloss { 0%,100% { opacity: .28; } 50% { opacity: .6; } }
        @keyframes om-breathe { 0%,100% { transform: scale(1); opacity: .5; } 50% { transform: scale(1.06); opacity: .9; } }
    `;
    document.head.appendChild(animStyle);
}

window.getAvatarHTML = function(level, imgUrl, size = 36, mode = null) {
    const activeMode = mode || getCurrentAvatarThemeMode();
    const frames = (activeMode === 'dark') ? AVATAR_FRAMES_DARK : AVATAR_FRAMES_LIGHT;
    const lvl = Math.max(1, Math.min(10, parseInt(level, 10) || 1));
    let html = frames[lvl - 1] || frames[0];
    const safeUrl = imgUrl || `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>`;
    html = html.replace(/\$\{imgUrl\}/g, safeUrl);
    const scale = size / 156;
    return '<div class="avatar-frame-badge" style="width:' + size + 'px; height:' + size + 'px; position:relative; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; pointer-events:none;">' +
        '<div style="width:156px; height:156px; transform: scale(' + scale + '); transform-origin: center center; position:absolute; top:50%; left:50%; margin-top:-78px; margin-left:-78px; pointer-events:none;">' +
            html +
        '</div>' +
    '</div>';
};

window.getFullRankCardHTML = function(level, imgUrl, scale = 0.6, displayName = '', subText = '', mode = null) {
    const activeMode = mode || getCurrentAvatarThemeMode();
    const cards = (activeMode === 'dark') ? FULL_RANK_CARDS_DARK : FULL_RANK_CARDS_LIGHT;
    const lvl = Math.max(1, Math.min(10, parseInt(level, 10) || 1));
    let html = cards[lvl - 1] || cards[0];
    const safeUrl = imgUrl || `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>`;
    html = html.replace(/\$\{imgUrl\}/g, safeUrl);
    const defaultNames = ['Tân Binh', 'Chiến Binh', 'Dũng Sĩ', 'Kiếm Sĩ', 'Cao Thủ', 'Đại Sư', 'Chiến Thần', 'Bất Tử', 'Huyền Thoại', 'Thần Thoại'];
    const nameToUse = displayName ? displayName : (defaultNames[lvl - 1] || 'Tân Binh');
    const subToUse = subText ? subText : ('Lv ' + String(lvl).padStart(2, '0'));

    html = html.replace(/\$\{displayName \|\| '.*?'\}/g, nameToUse);
    html = html.replace(/\$\{subText \|\| '.*?'\}/g, subToUse);

    const width = Math.round(528 * scale);
    const height = Math.round(156 * scale);
    return '<div style="width:' + width + 'px; height:' + height + 'px; position:relative; overflow:visible; margin:0 auto; display:inline-block;">' +
        '<div style="transform: scale(' + scale + '); transform-origin: top left; width:528px; height:156px;">' +
            html +
        '</div>' +
    '</div>';
};

