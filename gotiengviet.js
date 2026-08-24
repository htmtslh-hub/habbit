(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GoTiengViet = {}));
})(this, (function (exports) { 'use strict';

    const VIETNAMESE_CHARS = {
        a: ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
        â: ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
        ă: ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
        e: ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
        ê: ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
        i: ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
        o: ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
        ô: ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
        ơ: ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
        u: ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
        ư: ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
        y: ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
        // Uppercase
        A: ['A', 'Á', 'À', 'Ả', 'Ã', 'Ạ'],
        Â: ['Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ'],
        Ă: ['Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ'],
        E: ['E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ'],
        Ê: ['Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'],
        I: ['I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị'],
        O: ['O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ'],
        Ô: ['Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ'],
        Ơ: ['Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ'],
        U: ['U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ'],
        Ư: ['Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'],
        Y: ['Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ'],
    };
    /** Vowel priority when applying tone to multi-vowel sequences */
    const TONE_VOWEL_PRIORITY = [
        'a',
        'ă',
        'â',
        'o',
        'ô',
        'ơ',
        'e',
        'ê',
        'u',
        'ư',
        'i',
        'y',
        'A',
        'Ă',
        'Â',
        'O',
        'Ô',
        'Ơ',
        'E',
        'Ê',
        'U',
        'Ư',
        'I',
        'Y',
    ];
    const INPUT_METHODS = {
        telex: {
            toneRules: { s: 1, f: 2, r: 3, x: 4, j: 5, z: 0 },
            markRules: {
                aa: 'â',
                AA: 'Â',
                ee: 'ê',
                EE: 'Ê',
                oo: 'ô',
                OO: 'Ô',
                aw: 'ă',
                AW: 'Ă',
                ow: 'ơ',
                OW: 'Ơ',
                uw: 'ư',
                UW: 'Ư',
                dd: 'đ',
                DD: 'Đ',
            },
        },
        vni: {
            toneRules: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '0': 0 },
            markRules: {
                ee: 'ê',
                EE: 'Ê',
                a6: 'â',
                A6: 'Â',
                e6: 'ê',
                E6: 'Ê',
                o6: 'ô',
                O6: 'Ô',
                a8: 'ă',
                A8: 'Ă',
                o7: 'ơ',
                O7: 'Ơ',
                u7: 'ư',
                U7: 'Ư',
                d9: 'đ',
                D9: 'Đ',
            },
        },
        viqr: {
            toneRules: { "'": 1, '`': 2, '?': 3, '~': 4, '.': 5, '^': 0 },
            markRules: {
                ee: 'ê',
                EE: 'Ê',
                'a^': 'â',
                'A^': 'Â',
                'e^': 'ê',
                'E^': 'Ê',
                'o^': 'ô',
                'O^': 'Ô',
                'a(': 'ă',
                'A(': 'Ă',
                'o+': 'ơ',
                'O+': 'Ơ',
                'u+': 'ư',
                'U+': 'Ư',
                dd: 'đ',
                DD: 'Đ',
            },
        },
    };

    function isVowelChar(ch) {
        const lower = ch.toLowerCase();
        if (/[aeiouyăâêôơư]/.test(lower)) {
            return true;
        }
        if (lower in VIETNAMESE_CHARS) {
            return true;
        }
        for (const key of Object.keys(VIETNAMESE_CHARS)) {
            const arr = VIETNAMESE_CHARS[key];
            if (arr.indexOf(ch) !== -1 || arr.indexOf(lower) !== -1) {
                return true;
            }
        }
        return false;
    }
    function getLastWord(value, position) {
        const before = value.slice(0, position);
        const match = before.match(/[^ \t\n\r.,!?]*$/);
        return match ? match[0] : '';
    }
    function findVowelPosition(text) {
        const positions = [];
        for (let i = 0; i < text.length; i++) {
            if (isVowelChar(text[i])) {
                positions.push(i);
            }
        }
        return positions;
    }
    function shouldRestoreNonViet(text) {
        // Email and URL — always skip transform
        if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)) {
            return true;
        }
        if (/^https?:\/\//.test(text)) {
            return true;
        }
        // snake_case identifiers
        if (text.includes('_')) {
            return true;
        }
        // camelCase (e.g. variableName)
        if (/[a-z][A-Z]/.test(text)) {
            return true;
        }
        // VNI: trailing single digit 0–5 is a tone key, not a code token
        const vniToneStripped = text.replace(/[0-5]$/, '');
        if (vniToneStripped !== text && /^\D+$/.test(vniToneStripped)) {
            return false;
        }
        // Tokens with digits (e.g. test123) — but not pure-letter Vietnamese input
        if (/\d/.test(text)) {
            return true;
        }
        return false;
    }
    function isInputLikeElement(element) {
        if (element instanceof HTMLInputElement) {
            const type = (element.type || '').toLowerCase();
            if (type === 'password' ||
                element.dataset.noIme === 'true' ||
                element.dataset.noVietnamese === 'true' ||
                element.classList.contains('no-ime') ||
                element.id === 'loginPassword' ||
                element.id === 'regPassword' ||
                element.id === 'regConfirm' ||
                (element.getAttribute('autocomplete') || '').toLowerCase().includes('password')) {
                return false;
            }
            return true;
        }
        return (element instanceof HTMLTextAreaElement ||
            ('value' in element &&
                typeof element.value === 'string' &&
                ('selectionStart' in element || 'setRangeText' in element)));
    }
    function isContentEditableElement(element) {
        if (!(element instanceof HTMLElement)) {
            return false;
        }
        if (element.dataset.noIme === 'true' || element.classList.contains('no-ime')) {
            return false;
        }
        const attr = element.getAttribute('contenteditable');
        return element.isContentEditable === true || attr === '' || attr === 'true';
    }
    function isEditableElement(element) {
        return isInputLikeElement(element) || isContentEditableElement(element);
    }
    function getEditableText(element) {
        var _a, _b;
        if (isInputLikeElement(element)) {
            return element.value;
        }
        const el = element;
        return (_b = (_a = el.innerText) !== null && _a !== void 0 ? _a : el.textContent) !== null && _b !== void 0 ? _b : '';
    }
    function getContentEditableCaretOffset(element) {
        const text = getEditableText(element);
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
            return text.length;
        }
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        const offset = preCaretRange.toString().length;
        return offset > 0 || text.length === 0 ? offset : text.length;
    }
    function setContentEditableCaretOffset(element, offset) {
        var _a, _b;
        const selection = window.getSelection();
        if (!selection) {
            return;
        }
        const range = document.createRange();
        let current = 0;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
            const len = (_b = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            if (current + len >= offset) {
                range.setStart(node, offset - current);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                return;
            }
            current += len;
            node = walker.nextNode();
        }
        range.selectNodeContents(element);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    function getCaretOffset(element) {
        var _a;
        if (isInputLikeElement(element)) {
            const input = element;
            return (_a = input.selectionStart) !== null && _a !== void 0 ? _a : input.value.length;
        }
        return getContentEditableCaretOffset(element);
    }
    function replaceContentEditableText(element, newText, startPos, endPos) {
        const text = getEditableText(element);
        element.innerText = text.slice(0, startPos) + newText + text.slice(endPos);
        setContentEditableCaretOffset(element, startPos + newText.length);
    }
    // Helper function to update text maintaining cursor position
    function replaceText(element, newText, startPos, endPos) {
        if (isContentEditableElement(element)) {
            replaceContentEditableText(element, newText, startPos, endPos);
            return;
        }
        const inputEl = element;
        // Save scroll state for restoration (inspired by avim.js approach)
        const savedScrollTop = inputEl.scrollTop || 0;
        if ('setRangeText' in inputEl &&
            typeof inputEl.setRangeText === 'function') {
            // setRangeText(replacement, start, end, selectionMode)
            // selectionMode 'end' moves the caret to the end of the replaced text.
            inputEl.setRangeText(newText, startPos, endPos, 'end');
            // Ensure selection reflects caret at end of inserted text
            const newCursorPos = startPos + newText.length;
            inputEl.selectionStart = inputEl.selectionEnd = newCursorPos;
        }
        else {
            // Fallback
            inputEl.value =
                inputEl.value.slice(0, startPos) + newText + inputEl.value.slice(endPos);
            const newCursorPos = startPos + newText.length;
            inputEl.selectionStart = inputEl.selectionEnd = newCursorPos;
        }
        // Restore scroll state
        inputEl.scrollTop = savedScrollTop;
    }

    const sortedMarkKeysCache = new WeakMap();
    function getSortedMarkKeys(method) {
        let keys = sortedMarkKeysCache.get(method);
        if (!keys) {
            keys = Object.keys(method.markRules).sort((a, b) => b.length - a.length);
            sortedMarkKeysCache.set(method, keys);
        }
        return keys;
    }
    function escapeRegExp(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /** VIQR: b'a → ba' (tone key after vowel) */
    function repositionViqrTones(text, method) {
        if (!("'" in method.toneRules)) {
            return text;
        }
        let result = text;
        const toneKeys = Object.keys(method.toneRules);
        const consonants = 'bcdfghjklmnpqrstvwxzđBCDEFGHJKLMNPQRSTVWXZĐ';
        const vowels = 'aeiouyăâêôơưAEIOUYĂÂÊÔƠƯ';
        for (const tk of toneKeys) {
            const pattern = new RegExp(`([${escapeRegExp(consonants)}])(${escapeRegExp(tk)})([${escapeRegExp(vowels)}])`, 'g');
            result = result.replace(pattern, '$1$3$2');
        }
        return result;
    }
    /** VNI: dd1 → đa1 (đ + a + tone) */
    function expandVniDdTone(text, method) {
        if (!('1' in method.toneRules) || !('d9' in method.markRules)) {
            return text;
        }
        return text.replace(/dd([1-5])$/i, (_, tone) => `đa${tone}`);
    }
    function applyNormalizations(text) {
        let working = text;
        working = working.replace(/uoiw/g, 'ươi');
        working = working.replace(/UOIW/g, 'ƯƠI');
        working = working.replace(/uơ/g, 'ươ');
        working = working.replace(/UƠ/g, 'ƯƠ');
        return working;
    }
    function isToneKeyChar(ch, method) {
        return method.toneRules[ch.toLowerCase()] !== undefined;
    }
    function isAlreadyTonedVowel(ch) {
        for (const key of Object.keys(VIETNAMESE_CHARS)) {
            const arr = VIETNAMESE_CHARS[key];
            const idx = arr.indexOf(ch);
            if (idx > 0) {
                return true;
            }
            const lower = ch.toLowerCase();
            const lowerIdx = arr.findIndex((v) => v.toLowerCase() === lower);
            if (lowerIdx > 0) {
                return true;
            }
        }
        return false;
    }
    function applyMarkRules(text, method) {
        let working = text;
        let changed = true;
        const markKeys = getSortedMarkKeys(method);
        while (changed) {
            changed = false;
            for (const key of markKeys) {
                const result = method.markRules[key];
                const idxExact = working.lastIndexOf(key);
                if (idxExact !== -1) {
                    const before = working.slice(0, idxExact);
                    const after = working.slice(idxExact + key.length);
                    if (after.length > 0 && isToneKeyChar(after[0], method)) {
                        continue;
                    }
                    const prev = working;
                    if (before.endsWith(result)) {
                        working = before + key + after;
                    }
                    else {
                        working = before + result + after;
                    }
                    if (working !== prev) {
                        changed = true;
                    }
                    break;
                }
                const lowerKey = key.toLowerCase();
                const lowerText = working.toLowerCase();
                const idxLower = lowerText.lastIndexOf(lowerKey);
                if (idxLower !== -1) {
                    const before = working.slice(0, idxLower);
                    const after = working.slice(idxLower + key.length);
                    if (after.length > 0 && isToneKeyChar(after[0], method)) {
                        continue;
                    }
                    const segment = working.substr(idxLower, key.length);
                    const suggestsUpper = segment[0] === segment[0].toUpperCase();
                    let mapped = result;
                    const alt = method.markRules[key.toUpperCase()];
                    if (suggestsUpper && alt)
                        mapped = alt;
                    const prev = working;
                    if (before.endsWith(mapped)) {
                        working = before + segment + after;
                    }
                    else {
                        working = before + mapped + after;
                    }
                    if (working !== prev) {
                        changed = true;
                    }
                    break;
                }
            }
        }
        return working;
    }
    function applyToneRules(text, method) {
        let working = text;
        let idx = 0;
        while (idx < working.length) {
            const ch = working[idx];
            const lowerCh = ch.toLowerCase();
            const toneIndex = method.toneRules[lowerCh];
            if (toneIndex !== undefined) {
                if (idx > 0 && working[idx - 1].toLowerCase() === lowerCh) {
                    idx++;
                    continue;
                }
                const before = working.slice(0, idx);
                const after = working.slice(idx + 1);
                const base = before + after;
                const vowelPositions = findVowelPosition(base);
                let chosenPos = -1;
                for (const vp of vowelPositions)
                    if (vp < idx)
                        chosenPos = vp;
                if (chosenPos === -1) {
                    idx++;
                    continue;
                }
                if (base.length === 1 && isAlreadyTonedVowel(base[0])) {
                    idx++;
                    continue;
                }
                // VNI: ba10 → bá0 (tone digit then literal 0)
                if (after === '0' &&
                    '0' in method.toneRules &&
                    toneIndex >= 1 &&
                    toneIndex <= 5) {
                    working = applyToneToText(before + '0', toneIndex);
                    idx = working.length;
                    continue;
                }
                working = applyToneToText(base, toneIndex);
                idx = 0;
                continue;
            }
            idx++;
        }
        return working;
    }
    /**
     * Pure, side-effect-free transformation utilities extracted from VietnameseInput.
     * These functions operate on strings only and can be unit-tested independently.
     */
    function processInputByMethod(text, method) {
        let working = repositionViqrTones(text, method);
        working = expandVniDdTone(working, method);
        working = applyMarkRules(working, method);
        working = applyNormalizations(working);
        working = applyToneRules(working, method);
        return working;
    }
    function applyToneToText(text, toneIndex) {
        const vowelPositions = findVowelPosition(text);
        if (vowelPositions.length === 0)
            return text;
        const isAllUpper = text === text.toUpperCase();
        const findMappingForChar = (ch) => {
            const lower = ch.toLowerCase();
            if (!isAllUpper && lower in VIETNAMESE_CHARS) {
                return VIETNAMESE_CHARS[lower];
            }
            for (const key of Object.keys(VIETNAMESE_CHARS)) {
                const arr = VIETNAMESE_CHARS[key];
                if (arr.indexOf(ch) !== -1) {
                    return arr;
                }
            }
            if (!isAllUpper) {
                for (const key of Object.keys(VIETNAMESE_CHARS)) {
                    const arr = VIETNAMESE_CHARS[key];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].toLowerCase() === lower) {
                            return arr;
                        }
                    }
                }
            }
            return null;
        };
        let chosenPos = vowelPositions[vowelPositions.length - 1];
        let bestRank = Number.MAX_SAFE_INTEGER;
        for (const p of vowelPositions) {
            const ch = text[p];
            const mapping = findMappingForChar(ch);
            if (!mapping)
                continue;
            const base = mapping[0];
            const rank = TONE_VOWEL_PRIORITY.indexOf(base) !== -1
                ? TONE_VOWEL_PRIORITY.indexOf(base)
                : Number.MAX_SAFE_INTEGER;
            if (rank < bestRank || (rank === bestRank && p > chosenPos)) {
                bestRank = rank;
                chosenPos = p;
            }
        }
        const vowel = text[chosenPos];
        const arr = findMappingForChar(vowel);
        if (!arr)
            return text;
        if (toneIndex === 0) {
            return text.slice(0, chosenPos) + arr[0] + text.slice(chosenPos + 1);
        }
        const idx = Math.max(0, Math.min(toneIndex, arr.length - 1));
        const tonedVowel = arr[idx] || arr[0];
        return text.slice(0, chosenPos) + tonedVowel + text.slice(chosenPos + 1);
    }

    class VietnameseInput {
        /**
         * Get the singleton instance (recommended usage)
         */
        static getInstance(config = {}) {
            if (!VietnameseInput._instance) {
                VietnameseInput._instance = new VietnameseInput(config);
            }
            return VietnameseInput._instance;
        }
        // Backwards-compatible accessors for tests and callers that relied on internal methods.
        // These delegate to the pure transform functions.
        processInput(text, method) {
            return processInputByMethod(text, method);
        }
        applyTone(text, toneIndex) {
            return applyToneToText(text, toneIndex);
        }
        /**
         * Create a new VietnameseInput instance (advanced usage, not recommended)
         * Use VietnameseInput.getInstance() for singleton.
         */
        constructor(config = {}) {
            this.composing = false;
            // Merge config with defaults
            this.config = {
                enabled: config.enabled !== undefined ? config.enabled : true,
                inputMethod: config.inputMethod || 'telex',
            };
            this.enabled = !!this.config.enabled;
            // Bind event handlers once
            this.handleInputBound = this.handleInput.bind(this);
            this.handleCompositionStart = () => {
                this.composing = true;
            };
            this.handleCompositionEnd = () => {
                this.composing = false;
            };
            this.setupListeners();
        }
        /**
         * Destroy the singleton instance (for cleanup/testing)
         */
        static destroyInstance() {
            if (VietnameseInput._instance) {
                VietnameseInput._instance.destroy();
                VietnameseInput._instance = null;
            }
        }
        setupListeners() {
            document.addEventListener('input', this.handleInputBound);
            document.addEventListener('compositionstart', this.handleCompositionStart);
            document.addEventListener('compositionend', this.handleCompositionEnd);
        }
        handleInput(event) {
            if (!this.enabled || this.composing) {
                return;
            }
            const target = event.target;
            if (!target ||
                typeof target !== 'object' ||
                !isEditableElement(target)) {
                return;
            }
            const editable = target;
            const value = getEditableText(editable);
            const cursorPos = getCaretOffset(editable);
            const lastWord = getLastWord(value, cursorPos);
            // keep previous behavior: only attempt when last word has at least 2 chars
            if (lastWord.length < 2)
                return;
            if (shouldRestoreNonViet(lastWord))
                return;
            const method = INPUT_METHODS[this.config.inputMethod || 'telex'];
            const processed = processInputByMethod(lastWord, method);
            if (processed !== lastWord) {
                // start and end positions of the last word
                const startPos = cursorPos - lastWord.length;
                const endPos = cursorPos;
                // Replace only the last word segment (replaceText expects the replacement fragment)
                event.preventDefault();
                replaceText(editable, processed, startPos, endPos);
            }
        }
        /**
         * Toggle Vietnamese input on/off
         */
        toggle() {
            this.enabled = !this.enabled;
        }
        /**
         * Enable Vietnamese input
         */
        enable() {
            this.enabled = true;
        }
        /**
         * Disable Vietnamese input
         */
        disable() {
            this.enabled = false;
        }
        /**
         * Check if Vietnamese input is enabled
         */
        isEnabled() {
            return this.enabled;
        }
        /**
         * Remove all event listeners and clean up
         */
        destroy() {
            document.removeEventListener('input', this.handleInputBound);
            document.removeEventListener('compositionstart', this.handleCompositionStart);
            document.removeEventListener('compositionend', this.handleCompositionEnd);
        }
        /**
         * Get current input method
         */
        getInputMethod() {
            return this.config.inputMethod || 'telex';
        }
        /**
         * Set input method (telex, vni, viqr)
         */
        setInputMethod(method) {
            if (['telex', 'vni', 'viqr'].includes(method)) {
                this.config.inputMethod = method;
            }
        }
    }
    /**
     * Singleton instance
     */
    VietnameseInput._instance = null;

    exports.VietnameseInput = VietnameseInput;
    exports.applyToneToText = applyToneToText;
    exports.processInputByMethod = processInputByMethod;

}));
//# sourceMappingURL=index.js.map
