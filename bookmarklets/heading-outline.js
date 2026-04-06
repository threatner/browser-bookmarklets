// Heading Outline Bookmarklet
// Show a clickable heading map with hierarchy and skipped-level warnings

javascript:(function(){
    const existing = document.getElementById('heading-outline-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('heading-outline-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    const warnings = [];
    let h1Count = 0;

    headings.forEach(function(heading) {
        const level = Number(heading.tagName.slice(1));
        if (level === 1) h1Count++;
        if (previousLevel && level > previousLevel + 1) {
            warnings.push('Skipped from h' + previousLevel + ' to h' + level + '.');
        }
        previousLevel = level;
    });

    if (!h1Count) warnings.push('No h1 heading found.');
    if (h1Count > 1) warnings.push('Multiple h1 headings found (' + h1Count + ').');

    const style = document.createElement('style');
    style.id = 'heading-outline-style';
    style.textContent = `
        #heading-outline-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #heading-outline-panel {
            width: min(860px, 90vw);
            max-height: 86vh;
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
        }
        #heading-outline-panel * { box-sizing: border-box; }
        .heading-header {
            padding: 16px 18px;
            display: flex;
            gap: 12px;
            align-items: center;
            background: linear-gradient(135deg, #f0fdf4, #f8fafc);
            border-bottom: 1px solid #e2e8f0;
        }
        .heading-header h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .heading-btn {
            border: none;
            background: #111827;
            color: #fff;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }
        .heading-spacer { flex: 1; }
        .heading-content {
            padding: 18px;
            overflow: auto;
        }
        .heading-warning {
            background: #fff7ed;
            border: 1px solid #fdba74;
            color: #9a3412;
            border-radius: 12px;
            padding: 10px;
            font-size: 13px;
            margin-bottom: 10px;
        }
        .heading-item {
            display: flex;
            gap: 10px;
            align-items: center;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 10px 12px;
            margin-bottom: 10px;
            background: #fff;
        }
        .heading-level {
            width: 44px;
            font-size: 12px;
            font-weight: 700;
            color: #1d4ed8;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        }
        .heading-text {
            flex: 1;
            font-size: 13px;
            color: #0f172a;
        }
        .heading-jump {
            border: none;
            background: #2563eb;
            color: #fff;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }
        .heading-empty {
            text-align: center;
            padding: 28px;
            color: #475569;
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
            background: #fff;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'heading-outline-overlay';
    overlay.innerHTML = `
        <div id="heading-outline-panel" role="dialog" aria-label="Heading outline">
            <div class="heading-header">
                <h2>Heading Outline</h2>
                <div class="heading-spacer"></div>
                <button class="heading-btn" id="heading-close">Close</button>
            </div>
            <div class="heading-content">
                ${warnings.map(function(warning) {
                    return '<div class="heading-warning">' + warning + '</div>';
                }).join('')}
                ${headings.length ? headings.map(function(heading, index) {
                    const level = Number(heading.tagName.slice(1));
                    const text = (heading.textContent || '').trim() || '[Empty heading]';
                    return `
                        <div class="heading-item" style="margin-left:${(level - 1) * 18}px">
                            <div class="heading-level">${heading.tagName.toLowerCase()}</div>
                            <div class="heading-text">${text}</div>
                            <button class="heading-jump" data-index="${index}">Jump</button>
                        </div>
                    `;
                }).join('') : '<div class="heading-empty">No headings found on this page.</div>'}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'heading-close') {
            overlay.remove();
            style.remove();
            return;
        }
        const button = event.target.closest('.heading-jump');
        if (!button) return;
        const heading = headings[Number(button.dataset.index)];
        if (!heading) return;
        heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const oldOutline = heading.style.outline;
        const oldOffset = heading.style.outlineOffset;
        heading.style.outline = '3px solid #22c55e';
        heading.style.outlineOffset = '3px';
        setTimeout(function() {
            heading.style.outline = oldOutline;
            heading.style.outlineOffset = oldOffset;
        }, 2000);
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('heading-outline-overlay')) {
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });
})();
