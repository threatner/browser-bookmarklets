// Local Storage Manager Bookmarklet
// View, search, edit, export, and clear localStorage and sessionStorage

javascript:(function(){
    const existing = document.getElementById('storage-manager-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('storage-manager-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    const style = document.createElement('style');
    style.id = 'storage-manager-style';
    style.textContent = `
        #storage-manager-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.45);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #storage-manager-panel {
            background: #ffffff;
            width: min(980px, 92vw);
            max-height: 88vh;
            border-radius: 16px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #storage-manager-panel * {
            box-sizing: border-box;
        }
        .storage-toolbar {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
            padding: 16px 18px;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #f8fafc, #eef2ff);
        }
        .storage-toolbar h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .storage-spacer {
            flex: 1;
        }
        .storage-tab,
        .storage-btn {
            border: none;
            cursor: pointer;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
        }
        .storage-tab {
            background: #e2e8f0;
            color: #334155;
        }
        .storage-tab.active {
            background: #2563eb;
            color: #fff;
        }
        .storage-btn {
            background: #111827;
            color: #fff;
        }
        .storage-btn.secondary {
            background: #e5e7eb;
            color: #111827;
        }
        .storage-btn.danger {
            background: #dc2626;
        }
        .storage-search {
            padding: 0 18px 16px;
            border-bottom: 1px solid #e5e7eb;
            background: #fff;
        }
        .storage-search input {
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 11px 12px;
            font-size: 14px;
        }
        .storage-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            padding: 18px;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
        }
        .storage-stat {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
        }
        .storage-stat-label {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 6px;
        }
        .storage-stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
        }
        #storage-list {
            overflow: auto;
            padding: 14px 18px 18px;
            display: grid;
            gap: 10px;
        }
        .storage-item {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: #fff;
            padding: 14px;
        }
        .storage-item-header {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            align-items: center;
            margin-bottom: 8px;
        }
        .storage-key {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 13px;
            font-weight: 700;
            color: #1d4ed8;
            word-break: break-word;
        }
        .storage-meta {
            font-size: 12px;
            color: #64748b;
        }
        .storage-value {
            white-space: pre-wrap;
            word-break: break-word;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            background: #f8fafc;
            border-radius: 10px;
            padding: 10px;
            font-size: 12px;
            color: #111827;
            margin-bottom: 10px;
            max-height: 140px;
            overflow: auto;
        }
        .storage-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .storage-empty {
            padding: 30px;
            text-align: center;
            color: #64748b;
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
            background: #fff;
        }
        #storage-status {
            padding: 12px 18px 16px;
            font-size: 13px;
            color: #475569;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'storage-manager-overlay';
    overlay.innerHTML = `
        <div id="storage-manager-panel" role="dialog" aria-label="Storage manager">
            <div class="storage-toolbar">
                <h2>Storage Manager</h2>
                <button class="storage-tab active" data-store="local">localStorage</button>
                <button class="storage-tab" data-store="session">sessionStorage</button>
                <div class="storage-spacer"></div>
                <button class="storage-btn secondary" id="storage-add">Add Item</button>
                <button class="storage-btn secondary" id="storage-export">Copy JSON</button>
                <button class="storage-btn danger" id="storage-clear">Clear Store</button>
                <button class="storage-btn" id="storage-close">Close</button>
            </div>
            <div class="storage-search">
                <input id="storage-filter" type="text" placeholder="Search by key or value">
            </div>
            <div class="storage-summary" id="storage-summary"></div>
            <div id="storage-list"></div>
            <div id="storage-status">Ready.</div>
        </div>
    `;
    document.body.appendChild(overlay);

    let currentStore = 'local';
    let filterText = '';

    function getStore(type) {
        return type === 'session' ? window.sessionStorage : window.localStorage;
    }

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    function setStatus(message) {
        overlay.querySelector('#storage-status').textContent = message;
    }

    function copyText(text, successMessage) {
        const fallback = function() {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                setStatus(successMessage);
            }).catch(function() {
                fallback();
                setStatus(successMessage);
            });
        } else {
            fallback();
            setStatus(successMessage);
        }
    }

    function readEntries(type) {
        const store = getStore(type);
        const entries = [];
        for (let index = 0; index < store.length; index++) {
            const key = store.key(index);
            const value = store.getItem(key) || '';
            entries.push({
                key: key,
                value: value,
                size: key.length + value.length
            });
        }
        entries.sort(function(a, b) {
            return a.key.localeCompare(b.key);
        });
        return entries;
    }

    function render() {
        const entries = readEntries(currentStore);
        const filteredEntries = entries.filter(function(entry) {
            const haystack = (entry.key + ' ' + entry.value).toLowerCase();
            return haystack.includes(filterText.toLowerCase());
        });
        const totalChars = entries.reduce(function(sum, entry) {
            return sum + entry.size;
        }, 0);

        overlay.querySelectorAll('.storage-tab').forEach(function(button) {
            button.classList.toggle('active', button.dataset.store === currentStore);
        });

        overlay.querySelector('#storage-summary').innerHTML = `
            <div class="storage-stat">
                <div class="storage-stat-label">Active Store</div>
                <div class="storage-stat-value">${currentStore === 'local' ? 'Local' : 'Session'}</div>
            </div>
            <div class="storage-stat">
                <div class="storage-stat-label">Items</div>
                <div class="storage-stat-value">${entries.length}</div>
            </div>
            <div class="storage-stat">
                <div class="storage-stat-label">Filtered</div>
                <div class="storage-stat-value">${filteredEntries.length}</div>
            </div>
            <div class="storage-stat">
                <div class="storage-stat-label">Approx Size</div>
                <div class="storage-stat-value">${totalChars}</div>
            </div>
        `;

        const list = overlay.querySelector('#storage-list');
        if (!filteredEntries.length) {
            list.innerHTML = `<div class="storage-empty">No ${currentStore}Storage entries match the current filter.</div>`;
            return;
        }

        list.innerHTML = filteredEntries.map(function(entry) {
            const preview = entry.value.length > 1000 ? entry.value.slice(0, 1000) + '\n\n[truncated]' : entry.value;
            return `
                <div class="storage-item" data-key="${escapeHtml(entry.key)}">
                    <div class="storage-item-header">
                        <div>
                            <div class="storage-key">${escapeHtml(entry.key)}</div>
                            <div class="storage-meta">${entry.value.length} chars in value</div>
                        </div>
                    </div>
                    <div class="storage-value">${escapeHtml(preview || '[empty string]')}</div>
                    <div class="storage-actions">
                        <button class="storage-btn secondary" data-action="edit" data-key="${escapeHtml(entry.key)}">Edit</button>
                        <button class="storage-btn secondary" data-action="copy" data-key="${escapeHtml(entry.key)}">Copy Value</button>
                        <button class="storage-btn danger" data-action="delete" data-key="${escapeHtml(entry.key)}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'storage-close') {
            overlay.remove();
            style.remove();
            return;
        }

        const tab = event.target.closest('.storage-tab');
        if (tab) {
            currentStore = tab.dataset.store;
            setStatus('Switched to ' + (currentStore === 'local' ? 'localStorage.' : 'sessionStorage.'));
            render();
            return;
        }

        if (event.target.id === 'storage-add') {
            const key = prompt('Enter a storage key:');
            if (!key) return;
            const value = prompt('Enter a value for "' + key + '":', '');
            if (value === null) return;
            getStore(currentStore).setItem(key, value);
            setStatus('Saved "' + key + '" to ' + currentStore + 'Storage.');
            render();
            return;
        }

        if (event.target.id === 'storage-export') {
            const entries = readEntries(currentStore);
            const data = {};
            entries.forEach(function(entry) {
                data[entry.key] = entry.value;
            });
            copyText(JSON.stringify(data, null, 2), 'Copied ' + currentStore + 'Storage as JSON.');
            return;
        }

        if (event.target.id === 'storage-clear') {
            if (!confirm('Clear all keys from ' + currentStore + 'Storage?')) return;
            getStore(currentStore).clear();
            setStatus('Cleared ' + currentStore + 'Storage.');
            render();
            return;
        }

        const actionButton = event.target.closest('[data-action]');
        if (!actionButton) return;

        const key = actionButton.dataset.key;
        const store = getStore(currentStore);

        if (actionButton.dataset.action === 'copy') {
            copyText(store.getItem(key) || '', 'Copied value for "' + key + '".');
        } else if (actionButton.dataset.action === 'delete') {
            if (!confirm('Delete "' + key + '" from ' + currentStore + 'Storage?')) return;
            store.removeItem(key);
            setStatus('Deleted "' + key + '".');
            render();
        } else if (actionButton.dataset.action === 'edit') {
            const nextValue = prompt('Edit value for "' + key + '":', store.getItem(key) || '');
            if (nextValue === null) return;
            store.setItem(key, nextValue);
            setStatus('Updated "' + key + '".');
            render();
        }
    });

    overlay.querySelector('#storage-filter').addEventListener('input', function(event) {
        filterText = event.target.value;
        render();
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('storage-manager-overlay')) {
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });

    render();
})();
