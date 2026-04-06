// CSS Selector Tester Bookmarklet
// Test selectors, highlight matches, and inspect matching elements

javascript:(function(){
    const existing = document.getElementById('selector-tester-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('selector-tester-style');
        if (oldStyle) oldStyle.remove();
        document.querySelectorAll('[data-selector-tester-active="true"]').forEach(function(node) {
            node.style.outline = node.getAttribute('data-selector-old-outline') || '';
            node.style.outlineOffset = node.getAttribute('data-selector-old-offset') || '';
            node.removeAttribute('data-selector-old-outline');
            node.removeAttribute('data-selector-old-offset');
            node.removeAttribute('data-selector-tester-active');
        });
        return;
    }

    const style = document.createElement('style');
    style.id = 'selector-tester-style';
    style.textContent = `
        #selector-tester-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #selector-tester-panel {
            width: min(980px, 92vw);
            max-height: 88vh;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
        }
        #selector-tester-panel * { box-sizing: border-box; }
        .selector-header {
            padding: 16px 18px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            background: linear-gradient(135deg, #eef2ff, #f8fafc);
            border-bottom: 1px solid #e2e8f0;
        }
        .selector-header h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .selector-spacer { flex: 1; }
        .selector-btn {
            border: none;
            cursor: pointer;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            background: #1d4ed8;
            color: #fff;
        }
        .selector-btn.secondary {
            background: #e2e8f0;
            color: #0f172a;
        }
        .selector-body {
            padding: 18px;
            overflow: auto;
        }
        .selector-input {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
        }
        .selector-status {
            padding: 12px 0 6px;
            color: #475569;
            font-size: 13px;
        }
        .selector-samples {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin: 14px 0;
        }
        .selector-sample {
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 999px;
            padding: 7px 10px;
            font-size: 12px;
            cursor: pointer;
        }
        .selector-match {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 10px;
            background: #fff;
        }
        .selector-meta {
            margin: 8px 0 10px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px;
            color: #64748b;
            word-break: break-word;
        }
        .selector-jump {
            border: none;
            background: #2563eb;
            color: #fff;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'selector-tester-overlay';
    overlay.innerHTML = `
        <div id="selector-tester-panel" role="dialog" aria-label="CSS selector tester">
            <div class="selector-header">
                <h2>CSS Selector Tester</h2>
                <button class="selector-btn" id="selector-run">Test Selector</button>
                <button class="selector-btn secondary" id="selector-clear">Clear Highlights</button>
                <button class="selector-btn secondary" id="selector-copy">Copy Selector</button>
                <div class="selector-spacer"></div>
                <button class="selector-btn secondary" id="selector-close">Close</button>
            </div>
            <div class="selector-body">
                <input class="selector-input" id="selector-input" type="text" placeholder="Enter a CSS selector like main a, [data-testid], .card h2">
                <div class="selector-samples">
                    <button class="selector-sample" data-value="main a">main a</button>
                    <button class="selector-sample" data-value="img[alt=&quot;&quot;]">img[alt=""]</button>
                    <button class="selector-sample" data-value="[data-testid]">[data-testid]</button>
                    <button class="selector-sample" data-value="form input">form input</button>
                </div>
                <div class="selector-status" id="selector-status">Enter a selector to see matching elements.</div>
                <div id="selector-results"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    let currentMatches = [];

    function clearHighlights() {
        currentMatches.forEach(function(node) {
            node.style.outline = node.getAttribute('data-selector-old-outline') || '';
            node.style.outlineOffset = node.getAttribute('data-selector-old-offset') || '';
            node.removeAttribute('data-selector-old-outline');
            node.removeAttribute('data-selector-old-offset');
            node.removeAttribute('data-selector-tester-active');
        });
        currentMatches = [];
    }

    function describe(node) {
        let value = node.tagName.toLowerCase();
        if (node.id) value += '#' + node.id;
        const classNames = Array.from(node.classList || []).slice(0, 2);
        if (classNames.length) value += '.' + classNames.join('.');
        return value;
    }

    function runTest() {
        const selector = overlay.querySelector('#selector-input').value.trim();
        const status = overlay.querySelector('#selector-status');
        const results = overlay.querySelector('#selector-results');
        clearHighlights();

        if (!selector) {
            status.textContent = 'Selector is empty.';
            status.style.color = '#b91c1c';
            results.innerHTML = '';
            return;
        }

        let matches;
        try {
            matches = Array.from(document.querySelectorAll(selector));
        } catch (error) {
            status.textContent = 'Invalid selector: ' + error.message;
            status.style.color = '#b91c1c';
            results.innerHTML = '';
            return;
        }

        currentMatches = matches;
        matches.forEach(function(node) {
            node.setAttribute('data-selector-old-outline', node.style.outline || '');
            node.setAttribute('data-selector-old-offset', node.style.outlineOffset || '');
            node.setAttribute('data-selector-tester-active', 'true');
            node.style.outline = '3px solid #8b5cf6';
            node.style.outlineOffset = '2px';
        });

        status.textContent = 'Matched ' + matches.length + ' element' + (matches.length === 1 ? '' : 's') + '.';
        status.style.color = '#475569';

        results.innerHTML = matches.length ? matches.slice(0, 50).map(function(node, index) {
            return `
                <div class="selector-match">
                    <div><strong>Match ${index + 1}</strong></div>
                    <div class="selector-meta">${describe(node)}</div>
                    <button class="selector-jump" data-index="${index}">Jump to element</button>
                </div>
            `;
        }).join('') : '<div class="selector-match">No elements matched this selector.</div>';
    }

    function copySelector() {
        const text = overlay.querySelector('#selector-input').value.trim();
        if (!text) {
            overlay.querySelector('#selector-status').textContent = 'Nothing to copy.';
            return;
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                overlay.querySelector('#selector-status').textContent = 'Copied selector to clipboard.';
            });
        } else {
            const input = overlay.querySelector('#selector-input');
            input.select();
            document.execCommand('copy');
            overlay.querySelector('#selector-status').textContent = 'Copied selector to clipboard.';
        }
    }

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'selector-close') {
            clearHighlights();
            overlay.remove();
            style.remove();
            return;
        }
        if (event.target.id === 'selector-run') runTest();
        if (event.target.id === 'selector-clear') {
            clearHighlights();
            overlay.querySelector('#selector-results').innerHTML = '';
            overlay.querySelector('#selector-status').textContent = 'Cleared highlights.';
        }
        if (event.target.id === 'selector-copy') copySelector();
        const sample = event.target.closest('.selector-sample');
        if (sample) {
            overlay.querySelector('#selector-input').value = sample.dataset.value;
            runTest();
        }
        const jump = event.target.closest('.selector-jump');
        if (jump) {
            const node = currentMatches[Number(jump.dataset.index)];
            if (!node) return;
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    overlay.querySelector('#selector-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            runTest();
        }
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('selector-tester-overlay')) {
            clearHighlights();
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });
})();
