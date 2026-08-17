const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'Avatar Level Frames.dc.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const rawParts = html.split('<div style="position:relative;width:528px;height:156px;');
const DEFAULT_NAMES = [
    'Tân Binh', 'Chiến Binh', 'Dũng Sĩ', 'Kiếm Sĩ', 'Cao Thủ',
    'Đại Sư', 'Chiến Thần', 'Bất Tử', 'Huyền Thoại', 'Thần Thoại'
];

const darkCards = [];
const lightCards = [];
const darkCircles = [];
const lightCircles = [];

const nameplateDarkTemplates = {};
const nameplateLightTemplates = {};

// Helper function to count and extract matching circle div
function extractCircleDiv(circleRaw) {
    let divCount = 0;
    let endIdx = circleRaw.length;
    const regex = /<\/?div/g;
    let match;
    while ((match = regex.exec(circleRaw)) !== null) {
        if (match[0] === '<div') {
            divCount++;
        } else {
            divCount--;
            if (divCount === 0) {
                endIdx = regex.lastIndex + 1; // plus closing bracket '>'
                break;
            }
        }
    }
    let clean = circleRaw.substring(0, endIdx).trim();
    // Replace <image-slot ...> with standard <img> tag template with escaped \${imgUrl}
    clean = clean.replace(/<image-slot.*?<\/image-slot>/g, '<img src="\\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>\';">');
    // Change position:absolute;left:0;top:0;width:156px;height:156px; to position:relative;width:156px;height:156px; for standalone circle
    clean = clean.replace('position:absolute;left:0;top:0;width:156px;height:156px;', 'position:relative;width:156px;height:156px;');
    return clean;
}

for (let i = 1; i < rawParts.length; i++) {
    let part = '<div style="position:relative;width:528px;height:156px;' + rawParts[i];
    
    // Cleanup end of part if it's the last in section
    if (i === 10 || i === 20) {
        const lastDivIndex = part.indexOf('</div>\n      </div>\n    </div>\n  </div>');
        if (lastDivIndex !== -1) {
            part = part.substring(0, lastDivIndex + 19);
        } else {
            const cutIdx = part.lastIndexOf('</div>\n    </div>');
            if (cutIdx !== -1) part = part.substring(0, cutIdx + 6);
        }
    } else {
        const nextPartIdx = part.indexOf('\n    <div style="position:relative;width:528px;height:156px;');
        if (nextPartIdx !== -1) {
            part = part.substring(0, nextPartIdx);
        }
        part = part.trim();
    }

    const level = i <= 10 ? i : i - 10;
    const defaultName = DEFAULT_NAMES[level - 1];
    const defaultLv = `Lv ${String(level).padStart(2, '0')}`;

    // 1) Prepare Full Card HTML for FULL_RANK_CARDS with escaped \${displayName} and \${subText}
    let cardHtml = part.replace(/<image-slot.*?<\/image-slot>/g, '<img src="\\${imgUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>\';">');
    cardHtml = cardHtml.replace(/margin:.*?;/, 'margin:0 auto;');
    cardHtml = cardHtml.replace('>' + defaultName + '<', '>\\${displayName || \'' + defaultName + '\'}<');
    cardHtml = cardHtml.replace('>' + defaultLv + '<', '>\\${subText || \'' + defaultLv + '\'}<');

    // 2) Prepare Nameplate Template for NAMEPLATE_LEVEL_TEMPLATES
    let npHtml = part.replace(/<image-slot.*?<\/image-slot>/g, '__AVATAR_IMG__');
    npHtml = npHtml.replace(/margin:.*?;/, 'margin:0 auto;');
    npHtml = npHtml.replace('>' + defaultName + '<', '>__NAME__<');
    npHtml = npHtml.replace('>' + defaultLv + '<', '>__SCORE__<');

    // 3) Extract Standalone Circle Avatar Frame
    const circleMatch = part.match(/<div style="position:absolute;left:0;top:0;width:156px;height:156px;">[\s\S]*/);
    let circleHtml = '';
    if (circleMatch) {
        circleHtml = extractCircleDiv(circleMatch[0]);
    }

    if (i <= 10) {
        darkCards.push(cardHtml);
        darkCircles.push(circleHtml);
        nameplateDarkTemplates[level] = npHtml;
    } else {
        lightCards.push(cardHtml);
        lightCircles.push(circleHtml);
        nameplateLightTemplates[level] = npHtml;
    }
}

// Generate avatar_frames.js
let avatarJs = '// Global Keyframes and Fonts Helper for Avatar Frames (Dark & Light Modes)\n';

avatarJs += 'const AVATAR_FRAMES_DARK = [\n';
darkCircles.forEach(c => avatarJs += '  `' + c.trim() + '`,\n');
avatarJs += '];\n\n';

avatarJs += 'const AVATAR_FRAMES_LIGHT = [\n';
lightCircles.forEach(c => avatarJs += '  `' + c.trim() + '`,\n');
avatarJs += '];\n\n';

avatarJs += 'const FULL_RANK_CARDS_DARK = [\n';
darkCards.forEach(c => avatarJs += '  `' + c.trim() + '`,\n');
avatarJs += '];\n\n';

avatarJs += 'const FULL_RANK_CARDS_LIGHT = [\n';
lightCards.forEach(c => avatarJs += '  `' + c.trim() + '`,\n');
avatarJs += '];\n\n';

avatarJs += 'const AVATAR_FRAMES = AVATAR_FRAMES_DARK;\n';
avatarJs += 'const FULL_RANK_CARDS = FULL_RANK_CARDS_DARK;\n\n';

avatarJs += `
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

window.getAvatarHTML = function(level, imgUrl, size = 36, mode = null) {
    const activeMode = mode || getCurrentAvatarThemeMode();
    const frames = (activeMode === 'dark') ? AVATAR_FRAMES_DARK : AVATAR_FRAMES_LIGHT;
    let html = frames[level - 1] || frames[0];
    html = html.replace(/\\$\\{imgUrl\\}/g, imgUrl);
    const scale = size / 156;
    return '<div style="width:' + size + 'px; height:' + size + 'px; transform: scale(' + scale + '); transform-origin: top left; pointer-events: none;">' +
        html +
    '</div>';
};

window.getFullRankCardHTML = function(level, imgUrl, scale = 0.6, displayName = '', subText = '', mode = null) {
    const activeMode = mode || getCurrentAvatarThemeMode();
    const cards = (activeMode === 'dark') ? FULL_RANK_CARDS_DARK : FULL_RANK_CARDS_LIGHT;
    let html = cards[level - 1] || cards[0];
    html = html.replace(/\\$\\{imgUrl\\}/g, imgUrl);
    const defaultNames = ['Tân Binh', 'Chiến Binh', 'Dũng Sĩ', 'Kiếm Sĩ', 'Cao Thủ', 'Đại Sư', 'Chiến Thần', 'Bất Tử', 'Huyền Thoại', 'Thần Thoại'];
    const nameToUse = displayName ? displayName : (defaultNames[level - 1] || 'Tân Binh');
    const subToUse = subText ? subText : ('Lv ' + String(level).padStart(2, '0'));

    html = html.replace(/\\$\\{displayName \\|\\| '.*?'\\}/g, nameToUse);
    html = html.replace(/\\$\\{subText \\|\\| '.*?'\\}/g, subToUse);

    const width = Math.round(528 * scale);
    const height = Math.round(156 * scale);
    return '<div style="width:' + width + 'px; height:' + height + 'px; position:relative; overflow:visible; margin:0 auto; display:inline-block;">' +
        '<div style="transform: scale(' + scale + '); transform-origin: top left; width:528px; height:156px;">' +
            html +
        '</div>' +
    '</div>';
};
`;

fs.writeFileSync(path.join(__dirname, 'avatar_frames.js'), avatarJs);
console.log('Saved avatar_frames.js with Light and Dark mode support!');

// Generate nameplate_templates.js
let npJs = '// ==================== 10 LEVEL NAMEPLATE DESIGN TEMPLATES (LIGHT & DARK) ====================\n';
npJs += '// Directly extracted from Avatar Level Frames.dc.html\n\n';

npJs += 'const NAMEPLATE_LEVEL_TEMPLATES_DARK = {\n';
for (let l = 1; l <= 10; l++) {
    npJs += `    ${l}: ${JSON.stringify(nameplateDarkTemplates[l])},\n`;
}
npJs += '};\n\n';

npJs += 'const NAMEPLATE_LEVEL_TEMPLATES_LIGHT = {\n';
for (let l = 1; l <= 10; l++) {
    npJs += `    ${l}: ${JSON.stringify(nameplateLightTemplates[l])},\n`;
}
npJs += '};\n\n';

npJs += 'const NAMEPLATE_LEVEL_TEMPLATES = NAMEPLATE_LEVEL_TEMPLATES_DARK;\n\n';

npJs += `
function getCurrentNameplateThemeMode() {
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

window.getNameplateCardHTML = function(level, imgUrl, scale = 0.6, displayName = '', subText = '', mode = null) {
    const activeMode = mode || getCurrentNameplateThemeMode();
    const templates = (activeMode === 'dark') ? NAMEPLATE_LEVEL_TEMPLATES_DARK : NAMEPLATE_LEVEL_TEMPLATES_LIGHT;
    let tpl = templates[level] || templates[1];
    const defaultNames = ['Tân Binh', 'Chiến Binh', 'Dũng Sĩ', 'Kiếm Sĩ', 'Cao Thủ', 'Đại Sư', 'Chiến Thần', 'Bất Tử', 'Huyền Thoại', 'Thần Thoại'];
    const defaultName = defaultNames[level - 1] || 'Tân Binh';
    const defaultSub = 'Lv ' + String(level).padStart(2, '0');

    const finalName = displayName || defaultName;
    const finalSub = subText || defaultSub;

    // Adjust font size dynamically based on name length to prevent overflowing the nameplate
    let nameFontSize = '23px';
    const nameLen = finalName.length;
    if (nameLen > 22) nameFontSize = '13px';
    else if (nameLen > 18) nameFontSize = '15px';
    else if (nameLen > 14) nameFontSize = '17px';
    else if (nameLen > 10) nameFontSize = '19px';

    const imgTag = '<img src="' + imgUrl + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=\\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><circle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%2310b981%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2218%22 font-family=%22sans-serif%22>U</text></svg>\\';">';

    // Apply truncation and font size adjustment
    tpl = tpl.replace(/white-space:nowrap;/g, 'white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:210px; display:block; font-size:' + nameFontSize + ' !important;');
    tpl = tpl.replace(/__NAME__/g, finalName);
    tpl = tpl.replace(/__SCORE__/g, finalSub);
    tpl = tpl.replace(/__AVATAR_IMG__/g, imgTag);

    const width = Math.round(528 * scale);
    const height = Math.round(156 * scale);
    return '<div style="width:' + width + 'px; height:' + height + 'px; position:relative; overflow:visible; margin:0 auto; display:inline-block;">' +
        '<div style="transform: scale(' + scale + '); transform-origin: top left; width:528px; height:156px;">' +
            tpl +
        '</div>' +
    '</div>';
};

window.getFullRankCardHTML = window.getNameplateCardHTML;
`;

fs.writeFileSync(path.join(__dirname, 'nameplate_templates.js'), npJs);
console.log('Saved nameplate_templates.js with Light and Dark mode support!');
