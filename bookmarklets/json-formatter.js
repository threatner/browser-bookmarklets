// JSON Formatter Bookmarklet
// Format, minify, validate, sort, and copy JSON from any page or selection

javascript:(function(){
    const existing = document.getElementById('json-formatter-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('json-formatter-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    const selectedText = window.getSelection().toString().trim();
    const style = document.createElement('style');
    style.id = 'json-formatter-style';
    style.textContent = `
        #json-formatter-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.55);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #json-formatter-panel {
            width: min(1100px, 94vw);
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
        }
        #json-formatter-panel * {
            box-sizing: border-box;
        }
        .json-toolbar {
            padding: 16px 18px;
            background: linear-gradient(135deg, #eff6ff, #f8fafc);
            border-bottom: 1px solid #dbeafe;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }
        .json-toolbar h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .json-spacer {
            flex: 1;
        }
        .json-btn {
            border: none;
            cursor: pointer;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            background: #1d4ed8;
            color: #fff;
        }
        .json-btn.secondary {
            background: #e2e8f0;
            color: #0f172a;
        }
        .json-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            min-height: 520px;
        }
        .json-pane {
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
        .json-pane + .json-pane {
            border-left: 1px solid #e2e8f0;
        }
        .json-pane-header {
            padding: 12px 16px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
            font-weight: 700;
            color: #475569;
        }
        .json-pane textarea {
            width: 100%;
            flex: 1;
            border: none;
            resize: none;
            padding: 16px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
            line-height: 1.55;
            color: #111827;
        }
        .json-status {
            padding: 14px 18px 18px;
            border-top: 1px solid #e2e8f0;
            font-size: 13px;
            color: #475569;
            background: #fff;
        }
        .json-stats {
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
        }
        @media (max-width: 900px) {
            .json-grid {
                grid-template-columns: 1fr;
            }
            .json-pane + .json-pane {
                border-left: none;
                border-top: 1px solid #e2e8f0;
            }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'json-formatter-overlay';
    overlay.innerHTML = `
        <div id="json-formatter-panel" role="dialog" aria-label="JSON formatter">
            <div class="json-toolbar">
                <h2>JSON Formatter</h2>
                <button class="json-btn" id="json-format">Format</button>
                <button class="json-btn" id="json-minify">Minify</button>
                <button class="json-btn" id="json-validate">Validate</button>
                <button class="json-btn secondary" id="json-sort">Sort Keys</button>
                <button class="json-btn secondary" id="json-copy">Copy Output</button>
                <button class="json-btn secondary" id="json-swap">Use Output as Input</button>
                <button class="json-btn secondary" id="json-clear">Clear</button>
                <div class="json-spacer"></div>
                <button class="json-btn secondary" id="json-close">Close</button>
            </div>
            <div class="json-grid">
                <div class="json-pane">
                    <div class="json-pane-header">Input JSON</div>
                    <textarea id="json-input" spellcheck="false" placeholder="Paste JSON here">${selectedText}</textarea>
                </div>
                <div class="json-pane">
                    <div class="json-pane-header">Output</div>
                    <textarea id="json-output" spellcheck="false" readonly placeholder="Formatted output will appear here"></textarea>
                </div>
            </div>
            <div class="json-status">
                <div id="json-message">Paste JSON or use selected text, then choose an action.</div>
                <div class="json-stats" id="json-stats"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const input = overlay.querySelector('#json-input');
    const output = overlay.querySelector('#json-output');
    const message = overlay.querySelector('#json-message');
    const stats = overlay.querySelector('#json-stats');

    function setMessage(text, isError) {
        message.textContent = text;
        message.style.color = isError ? '#b91c1c' : '#475569';
    }

    function updateStats(rawText, parsedValue) {
        const pretty = rawText || '';
        const minified = parsedValue === undefined ? '' : JSON.stringify(parsedValue);
        const type = parsedValue === null ? 'null' : Array.isArray(parsedValue) ? 'array' : typeof parsedValue;
        let keys = 0;
        if (parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)) {
            keys = Object.keys(parsedValue).length;
        }
        stats.innerHTML = parsedValue === undefined ? '' : `
            <span><strong>Type:</strong> ${type}</span>
            <span><strong>Pretty Size:</strong> ${pretty.length}</span>
            <span><strong>Minified Size:</strong> ${minified.length}</span>
            <span><strong>Top-level Keys:</strong> ${keys}</span>
        `;
    }

    function parseInput() {
        const text = input.value.trim();
        if (!text) {
            throw new Error('Input is empty.');
        }
        return JSON.parse(text);
    }

    function deepSort(value) {
        if (Array.isArray(value)) {
            return value.map(deepSort);
        }
        if (value && typeof value === 'object') {
            return Object.keys(value).sort().reduce(function(sorted, key) {
                sorted[key] = deepSort(value[key]);
                return sorted;
            }, {});
        }
        return value;
    }

    function run(action) {
        try {
            const parsed = parseInput();
            let result;
            if (action === 'format') {
                result = JSON.stringify(parsed, null, 2);
                setMessage('JSON formatted successfully.');
            } else if (action === 'minify') {
                result = JSON.stringify(parsed);
                setMessage('JSON minified successfully.');
            } else if (action === 'validate') {
                result = JSON.stringify(parsed, null, 2);
                setMessage('JSON is valid.');
            } else if (action === 'sort') {
                result = JSON.stringify(deepSort(parsed), null, 2);
                setMessage('JSON keys sorted recursively.');
            }
            output.value = result;
            updateStats(result, JSON.parse(result));
        } catch (error) {
            output.value = '';
            stats.innerHTML = '';
            setMessage(error.message, true);
        }
    }

    function copyOutput() {
        if (!output.value) {
            setMessage('Nothing to copy yet.', true);
            return;
        }
        const fallback = function() {
            output.removeAttribute('readonly');
            output.select();
            document.execCommand('copy');
            output.setAttribute('readonly', 'readonly');
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(output.value).then(function() {
                setMessage('Copied output JSON to clipboard.');
            }).catch(function() {
                fallback();
                setMessage('Copied output JSON to clipboard.');
            });
        } else {
            fallback();
            setMessage('Copied output JSON to clipboard.');
        }
    }

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'json-close') {
            overlay.remove();
            style.remove();
            return;
        }
        if (event.target.id === 'json-format') run('format');
        if (event.target.id === 'json-minify') run('minify');
        if (event.target.id === 'json-validate') run('validate');
        if (event.target.id === 'json-sort') run('sort');
        if (event.target.id === 'json-copy') copyOutput();
        if (event.target.id === 'json-swap') {
            if (!output.value) {
                setMessage('Output is empty.', true);
                return;
            }
            input.value = output.value;
            setMessage('Output moved back into input.');
        }
        if (event.target.id === 'json-clear') {
            input.value = '';
            output.value = '';
            stats.innerHTML = '';
            setMessage('Cleared input and output.');
        }
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('json-formatter-overlay')) {
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });

    if (selectedText) {
        setMessage('Loaded selected text into the formatter.');
    }
})();
