// URL Tools Bookmarklet
// Parse, clean, sort, encode, decode, and copy URLs and query parameters

javascript:(function(){
    const existing = document.getElementById('url-tools-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('url-tools-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    const style = document.createElement('style');
    style.id = 'url-tools-style';
    style.textContent = `
        #url-tools-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.55);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #url-tools-panel {
            width: min(1020px, 94vw);
            max-height: 88vh;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
        }
        #url-tools-panel * {
            box-sizing: border-box;
        }
        .url-toolbar {
            padding: 16px 18px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #fefce8, #f8fafc);
        }
        .url-toolbar h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .url-spacer {
            flex: 1;
        }
        .url-btn {
            border: none;
            cursor: pointer;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            background: #1d4ed8;
            color: #fff;
        }
        .url-btn.secondary {
            background: #e2e8f0;
            color: #0f172a;
        }
        .url-layout {
            padding: 18px;
            overflow: auto;
            display: grid;
            gap: 14px;
        }
        .url-block {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px;
            background: #fff;
        }
        .url-block h3 {
            margin: 0 0 10px;
            font-size: 15px;
            color: #0f172a;
        }
        .url-input,
        .url-output {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
            line-height: 1.5;
            resize: vertical;
            min-height: 90px;
        }
        .url-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 10px;
            font-size: 13px;
            padding: 7px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .url-row:last-child {
            border-bottom: none;
        }
        .url-key {
            color: #475569;
            font-weight: 700;
        }
        .url-value {
            word-break: break-word;
            color: #0f172a;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }
        .url-param {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 8px;
            background: #f8fafc;
        }
        .url-status {
            padding: 0 18px 18px;
            color: #475569;
            font-size: 13px;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'url-tools-overlay';
    overlay.innerHTML = `
        <div id="url-tools-panel" role="dialog" aria-label="URL tools">
            <div class="url-toolbar">
                <h2>URL Tools</h2>
                <button class="url-btn" id="url-parse">Parse URL</button>
                <button class="url-btn" id="url-strip">Strip Tracking</button>
                <button class="url-btn secondary" id="url-sort">Sort Params</button>
                <button class="url-btn secondary" id="url-encode">Encode</button>
                <button class="url-btn secondary" id="url-decode">Decode</button>
                <button class="url-btn secondary" id="url-copy">Copy Output</button>
                <div class="url-spacer"></div>
                <button class="url-btn secondary" id="url-reset">Use Current URL</button>
                <button class="url-btn secondary" id="url-close">Close</button>
            </div>
            <div class="url-layout">
                <div class="url-block">
                    <h3>Input</h3>
                    <textarea class="url-input" id="url-input" spellcheck="false">${location.href}</textarea>
                </div>
                <div class="url-block">
                    <h3>Parsed Parts</h3>
                    <div id="url-parts"></div>
                </div>
                <div class="url-block">
                    <h3>Query Parameters</h3>
                    <div id="url-params"></div>
                </div>
                <div class="url-block">
                    <h3>Output</h3>
                    <textarea class="url-output" id="url-output" spellcheck="false" readonly placeholder="Output will appear here"></textarea>
                </div>
            </div>
            <div class="url-status" id="url-status">Ready.</div>
        </div>
    `;
    document.body.appendChild(overlay);

    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'mc_cid', 'mc_eid', 'ref', 'ref_src', 'igshid'];
    const input = overlay.querySelector('#url-input');
    const output = overlay.querySelector('#url-output');

    function setStatus(message, isError) {
        const status = overlay.querySelector('#url-status');
        status.textContent = message;
        status.style.color = isError ? '#b91c1c' : '#475569';
    }

    function parseUrl(value) {
        return new URL(value);
    }

    function render(url) {
        const parts = [
            ['Origin', url.origin],
            ['Protocol', url.protocol],
            ['Hostname', url.hostname],
            ['Pathname', url.pathname],
            ['Search', url.search || '[none]'],
            ['Hash', url.hash || '[none]']
        ];
        overlay.querySelector('#url-parts').innerHTML = parts.map(function(part) {
            return `
                <div class="url-row">
                    <div class="url-key">${part[0]}</div>
                    <div class="url-value">${part[1]}</div>
                </div>
            `;
        }).join('');

        const params = Array.from(url.searchParams.entries());
        overlay.querySelector('#url-params').innerHTML = params.length ? params.map(function(param) {
            return `
                <div class="url-param">
                    <div class="url-key">${param[0]}</div>
                    <div class="url-value">${param[1]}</div>
                </div>
            `;
        }).join('') : '<div class="url-value">No query parameters found.</div>';
    }

    function safeParse() {
        try {
            const url = parseUrl(input.value.trim());
            render(url);
            return url;
        } catch (error) {
            overlay.querySelector('#url-parts').innerHTML = '<div class="url-value">Unable to parse the current input.</div>';
            overlay.querySelector('#url-params').innerHTML = '<div class="url-value">Fix the URL to inspect parameters.</div>';
            setStatus('Invalid URL: ' + error.message, true);
            return null;
        }
    }

    function copyText(text) {
        if (!text) {
            setStatus('Nothing to copy.', true);
            return;
        }
        const fallback = function() {
            output.removeAttribute('readonly');
            output.select();
            document.execCommand('copy');
            output.setAttribute('readonly', 'readonly');
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                setStatus('Copied output to clipboard.');
            }).catch(function() {
                fallback();
                setStatus('Copied output to clipboard.');
            });
        } else {
            fallback();
            setStatus('Copied output to clipboard.');
        }
    }

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'url-close') {
            overlay.remove();
            style.remove();
            return;
        }
        if (event.target.id === 'url-reset') {
            input.value = location.href;
            output.value = '';
            safeParse();
            setStatus('Loaded the current page URL.');
        }
        if (event.target.id === 'url-parse') {
            if (safeParse()) setStatus('Parsed URL successfully.');
        }
        if (event.target.id === 'url-strip') {
            const url = safeParse();
            if (!url) return;
            trackingParams.forEach(function(param) {
                url.searchParams.delete(param);
            });
            output.value = url.toString();
            render(url);
            setStatus('Removed common tracking parameters.');
        }
        if (event.target.id === 'url-sort') {
            const url = safeParse();
            if (!url) return;
            const params = Array.from(url.searchParams.entries()).sort(function(a, b) {
                return a[0].localeCompare(b[0]);
            });
            url.search = '';
            params.forEach(function(param) {
                url.searchParams.append(param[0], param[1]);
            });
            output.value = url.toString();
            render(url);
            setStatus('Sorted query parameters alphabetically.');
        }
        if (event.target.id === 'url-encode') {
            output.value = encodeURIComponent(input.value);
            setStatus('Encoded input.');
        }
        if (event.target.id === 'url-decode') {
            try {
                output.value = decodeURIComponent(input.value);
                setStatus('Decoded input.');
            } catch (error) {
                setStatus('Could not decode input: ' + error.message, true);
            }
        }
        if (event.target.id === 'url-copy') {
            copyText(output.value);
        }
    });

    input.addEventListener('input', function() {
        safeParse();
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('url-tools-overlay')) {
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });

    safeParse();
})();
