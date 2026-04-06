// Accessibility Audit Bookmarklet
// Audit common accessibility issues and jump to affected elements

javascript:(function(){
    const existing = document.getElementById('a11y-audit-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('a11y-audit-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    const findings = [];
    let activeHighlight = null;

    function pushFinding(category, severity, message, element) {
        findings.push({
            id: findings.length + 1,
            category: category,
            severity: severity,
            message: message,
            element: element
        });
    }

    function getAccessibleName(element) {
        const ariaLabel = (element.getAttribute('aria-label') || '').trim();
        const labelledby = (element.getAttribute('aria-labelledby') || '').trim();
        const title = (element.getAttribute('title') || '').trim();
        const text = (element.textContent || '').trim();
        if (ariaLabel) return ariaLabel;
        if (labelledby) {
            return labelledby.split(/\s+/).map(function(id) {
                const labelNode = document.getElementById(id);
                return labelNode ? labelNode.textContent.trim() : '';
            }).join(' ').trim();
        }
        if (title) return title;
        if (text) return text;
        const img = element.querySelector('img[alt]');
        return img ? (img.getAttribute('alt') || '').trim() : '';
    }

    function getElementLabel(field) {
        if (field.labels && field.labels.length) {
            return Array.from(field.labels).map(function(label) {
                return label.textContent.trim();
            }).join(' ').trim();
        }
        const ariaLabel = (field.getAttribute('aria-label') || '').trim();
        const labelledby = (field.getAttribute('aria-labelledby') || '').trim();
        if (ariaLabel) return ariaLabel;
        if (labelledby) {
            return labelledby.split(/\s+/).map(function(id) {
                const node = document.getElementById(id);
                return node ? node.textContent.trim() : '';
            }).join(' ').trim();
        }
        const parentLabel = field.closest('label');
        return parentLabel ? parentLabel.textContent.trim() : '';
    }

    Array.from(document.images).forEach(function(image) {
        if (!image.hasAttribute('alt')) {
            pushFinding('Images', 'high', 'Image is missing an alt attribute.', image);
        } else if (!image.getAttribute('alt').trim()) {
            pushFinding('Images', 'medium', 'Image has an empty alt attribute. Confirm it is decorative.', image);
        }
    });

    Array.from(document.querySelectorAll('input, select, textarea')).forEach(function(field) {
        const type = (field.getAttribute('type') || '').toLowerCase();
        if (['hidden', 'submit', 'button', 'reset'].includes(type)) return;
        if (!getElementLabel(field)) {
            pushFinding('Forms', 'high', 'Form field does not have an associated label or aria-label.', field);
        }
        if (!field.name) {
            pushFinding('Forms', 'low', 'Form field is missing a name attribute.', field);
        }
    });

    Array.from(document.querySelectorAll('button, [role="button"]')).forEach(function(button) {
        if (!getAccessibleName(button)) {
            pushFinding('Buttons', 'high', 'Button has no accessible name.', button);
        }
    });

    Array.from(document.links).forEach(function(link) {
        if (!getAccessibleName(link)) {
            pushFinding('Links', 'high', 'Link has no accessible label text.', link);
        }
    });

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    let h1Count = 0;
    headings.forEach(function(heading) {
        const level = Number(heading.tagName.slice(1));
        if (level === 1) h1Count++;
        if (previousLevel && level > previousLevel + 1) {
            pushFinding('Headings', 'medium', 'Heading level skips from h' + previousLevel + ' to h' + level + '.', heading);
        }
        previousLevel = level;
    });
    if (!h1Count) {
        pushFinding('Document', 'medium', 'Page does not contain an h1 heading.', document.body);
    } else if (h1Count > 1) {
        pushFinding('Document', 'low', 'Page contains multiple h1 headings (' + h1Count + ').', headings.find(function(item) {
            return item.tagName === 'H1';
        }) || document.body);
    }

    if (!document.documentElement.lang) {
        pushFinding('Document', 'medium', 'The <html> element is missing a lang attribute.', document.documentElement);
    }

    const style = document.createElement('style');
    style.id = 'a11y-audit-style';
    style.textContent = `
        #a11y-audit-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #a11y-audit-panel {
            width: min(980px, 92vw);
            max-height: 88vh;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
            display: flex;
            flex-direction: column;
        }
        #a11y-audit-panel * {
            box-sizing: border-box;
        }
        .a11y-header {
            padding: 16px 18px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #fff7ed, #f8fafc);
        }
        .a11y-header h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .a11y-spacer {
            flex: 1;
        }
        .a11y-chip {
            padding: 8px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
        }
        .a11y-chip.high { background: #fee2e2; color: #991b1b; }
        .a11y-chip.medium { background: #fef3c7; color: #92400e; }
        .a11y-chip.low { background: #dbeafe; color: #1d4ed8; }
        .a11y-btn {
            border: none;
            background: #111827;
            color: #fff;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }
        .a11y-body {
            display: grid;
            grid-template-columns: 280px 1fr;
            min-height: 0;
            flex: 1;
        }
        .a11y-sidebar {
            border-right: 1px solid #e2e8f0;
            background: #f8fafc;
            padding: 16px;
            overflow: auto;
        }
        .a11y-main {
            padding: 16px;
            overflow: auto;
        }
        .a11y-group {
            margin-bottom: 14px;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
        }
        .a11y-group-title {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }
        .a11y-group-meta {
            color: #64748b;
            font-size: 12px;
        }
        .a11y-item {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 10px;
            background: #fff;
        }
        .a11y-item-header {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
            align-items: center;
        }
        .a11y-item-title {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
        }
        .a11y-item-path {
            color: #64748b;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px;
            margin-bottom: 10px;
            word-break: break-word;
        }
        .a11y-jump {
            background: #2563eb;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }
        .a11y-empty {
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            color: #475569;
            background: #fff;
        }
        @media (max-width: 900px) {
            .a11y-body {
                grid-template-columns: 1fr;
            }
            .a11y-sidebar {
                border-right: none;
                border-bottom: 1px solid #e2e8f0;
            }
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'a11y-audit-overlay';

    const summary = findings.reduce(function(result, finding) {
        result[finding.severity] = (result[finding.severity] || 0) + 1;
        result[finding.category] = (result[finding.category] || 0) + 1;
        return result;
    }, {});

    const categories = Array.from(new Set(findings.map(function(finding) {
        return finding.category;
    })));

    function describeElement(element) {
        if (!element || !element.tagName) return 'document';
        let label = element.tagName.toLowerCase();
        if (element.id) label += '#' + element.id;
        const classNames = Array.from(element.classList || []).slice(0, 2);
        if (classNames.length) label += '.' + classNames.join('.');
        return label;
    }

    function renderFindings() {
        const sidebarHtml = categories.map(function(category) {
            const count = findings.filter(function(finding) {
                return finding.category === category;
            }).length;
            return `
                <div class="a11y-group">
                    <div class="a11y-group-title">${category}</div>
                    <div class="a11y-group-meta">${count} issue${count === 1 ? '' : 's'}</div>
                </div>
            `;
        }).join('');

        const itemHtml = findings.length ? findings.map(function(finding) {
            return `
                <div class="a11y-item">
                    <div class="a11y-item-header">
                        <div class="a11y-item-title">${finding.message}</div>
                        <span class="a11y-chip ${finding.severity}">${finding.severity.toUpperCase()}</span>
                    </div>
                    <div class="a11y-item-path">${describeElement(finding.element)}</div>
                    <button class="a11y-jump" data-id="${finding.id}">Jump to element</button>
                </div>
            `;
        }).join('') : `<div class="a11y-empty">No issues found in this quick audit. That is a good sign, but it is still not a full accessibility review.</div>`;

        overlay.innerHTML = `
            <div id="a11y-audit-panel" role="dialog" aria-label="Accessibility audit">
                <div class="a11y-header">
                    <h2>Accessibility Audit</h2>
                    <span class="a11y-chip high">${summary.high || 0} High</span>
                    <span class="a11y-chip medium">${summary.medium || 0} Medium</span>
                    <span class="a11y-chip low">${summary.low || 0} Low</span>
                    <div class="a11y-spacer"></div>
                    <button class="a11y-btn" id="a11y-close">Close</button>
                </div>
                <div class="a11y-body">
                    <div class="a11y-sidebar">${sidebarHtml || '<div class="a11y-group"><div class="a11y-group-title">Summary</div><div class="a11y-group-meta">No grouped issues</div></div>'}</div>
                    <div class="a11y-main">${itemHtml}</div>
                </div>
            </div>
        `;
    }

    function clearHighlight() {
        if (activeHighlight) {
            activeHighlight.style.outline = activeHighlight.getAttribute('data-a11y-old-outline') || '';
            activeHighlight.style.outlineOffset = activeHighlight.getAttribute('data-a11y-old-offset') || '';
            activeHighlight.removeAttribute('data-a11y-old-outline');
            activeHighlight.removeAttribute('data-a11y-old-offset');
            activeHighlight = null;
        }
    }

    function jumpToFinding(id) {
        const finding = findings.find(function(item) {
            return String(item.id) === String(id);
        });
        if (!finding || !finding.element || !finding.element.scrollIntoView) return;
        clearHighlight();
        activeHighlight = finding.element;
        activeHighlight.setAttribute('data-a11y-old-outline', activeHighlight.style.outline || '');
        activeHighlight.setAttribute('data-a11y-old-offset', activeHighlight.style.outlineOffset || '');
        activeHighlight.style.outline = '3px solid #ef4444';
        activeHighlight.style.outlineOffset = '3px';
        activeHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    renderFindings();
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'a11y-close') {
            clearHighlight();
            overlay.remove();
            style.remove();
            return;
        }
        const button = event.target.closest('.a11y-jump');
        if (button) {
            jumpToFinding(button.dataset.id);
        }
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('a11y-audit-overlay')) {
            clearHighlight();
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });
})();
