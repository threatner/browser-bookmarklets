// Broken Links and Images Checker Bookmarklet
// Find suspicious links, duplicate URLs, broken images, and missing alt text

javascript:(function(){
    const existing = document.getElementById('broken-checker-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('broken-checker-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    const findings = [];
    const linkCount = {};
    let activeHighlight = null;

    function addFinding(group, message, element) {
        findings.push({
            id: findings.length + 1,
            group: group,
            message: message,
            element: element
        });
    }

    Array.from(document.links).forEach(function(link) {
        const href = (link.getAttribute('href') || '').trim();
        const text = (link.textContent || '').trim();
        const aria = (link.getAttribute('aria-label') || '').trim();

        if (!href) addFinding('Links', 'Link has an empty href attribute.', link);
        if (href === '#') addFinding('Links', 'Link uses only "#" and may be a placeholder.', link);
        if (/^javascript:/i.test(href)) addFinding('Links', 'Link uses a javascript: URL.', link);
        if (!text && !aria) addFinding('Links', 'Link has no visible label or aria-label.', link);

        if (link.href) {
            linkCount[link.href] = (linkCount[link.href] || 0) + 1;
        }
    });

    Object.keys(linkCount).forEach(function(url) {
        if (linkCount[url] > 5) {
            const duplicate = Array.from(document.links).find(function(link) {
                return link.href === url;
            });
            addFinding('Links', 'URL appears ' + linkCount[url] + ' times: ' + url, duplicate);
        }
    });

    Array.from(document.images).forEach(function(image) {
        const src = (image.getAttribute('src') || '').trim();
        const alt = image.getAttribute('alt');
        if (!src) addFinding('Images', 'Image is missing a src attribute.', image);
        if (image.complete && image.naturalWidth === 0) addFinding('Images', 'Image appears broken in the current page render.', image);
        if (alt === null) addFinding('Images', 'Image is missing alt text.', image);
    });

    const grouped = findings.reduce(function(result, finding) {
        result[finding.group] = result[finding.group] || [];
        result[finding.group].push(finding);
        return result;
    }, {});

    function describeElement(element) {
        if (!element || !element.tagName) return 'document';
        let label = element.tagName.toLowerCase();
        if (element.id) label += '#' + element.id;
        const className = Array.from(element.classList || []).slice(0, 2).join('.');
        if (className) label += '.' + className;
        return label;
    }

    const style = document.createElement('style');
    style.id = 'broken-checker-style';
    style.textContent = `
        #broken-checker-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.52);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #broken-checker-panel {
            width: min(960px, 92vw);
            max-height: 88vh;
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
        }
        #broken-checker-panel * { box-sizing: border-box; }
        .broken-header {
            padding: 16px 18px;
            display: flex;
            gap: 10px;
            align-items: center;
            background: linear-gradient(135deg, #fef2f2, #f8fafc);
            border-bottom: 1px solid #e2e8f0;
        }
        .broken-header h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .broken-spacer { flex: 1; }
        .broken-btn {
            border: none;
            background: #111827;
            color: #fff;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }
        .broken-content {
            padding: 18px;
            overflow: auto;
        }
        .broken-group {
            margin-bottom: 18px;
        }
        .broken-group h3 {
            margin: 0 0 10px;
            font-size: 15px;
            color: #0f172a;
        }
        .broken-item {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 10px;
            background: #fff;
        }
        .broken-meta {
            font-size: 12px;
            color: #64748b;
            margin: 8px 0 10px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            word-break: break-word;
        }
        .broken-jump {
            border: none;
            background: #2563eb;
            color: #fff;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
        }
        .broken-empty {
            border: 1px dashed #cbd5e1;
            border-radius: 12px;
            padding: 26px;
            text-align: center;
            color: #475569;
            background: #fff;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'broken-checker-overlay';
    overlay.innerHTML = `
        <div id="broken-checker-panel" role="dialog" aria-label="Broken links and images checker">
            <div class="broken-header">
                <h2>Broken Links and Images Checker</h2>
                <div class="broken-spacer"></div>
                <button class="broken-btn" id="broken-close">Close</button>
            </div>
            <div class="broken-content">
                ${findings.length ? Object.keys(grouped).map(function(group) {
                    return `
                        <div class="broken-group">
                            <h3>${group} (${grouped[group].length})</h3>
                            ${grouped[group].map(function(finding) {
                                return `
                                    <div class="broken-item">
                                        <div>${finding.message}</div>
                                        <div class="broken-meta">${describeElement(finding.element)}</div>
                                        <button class="broken-jump" data-id="${finding.id}">Jump to element</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                }).join('') : '<div class="broken-empty">No suspicious links or images found in this quick scan.</div>'}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    function clearHighlight() {
        if (!activeHighlight) return;
        activeHighlight.style.outline = activeHighlight.getAttribute('data-broken-old-outline') || '';
        activeHighlight.style.outlineOffset = activeHighlight.getAttribute('data-broken-old-offset') || '';
        activeHighlight.removeAttribute('data-broken-old-outline');
        activeHighlight.removeAttribute('data-broken-old-offset');
        activeHighlight = null;
    }

    function jumpTo(id) {
        const finding = findings.find(function(item) {
            return String(item.id) === String(id);
        });
        if (!finding || !finding.element || !finding.element.scrollIntoView) return;
        clearHighlight();
        activeHighlight = finding.element;
        activeHighlight.setAttribute('data-broken-old-outline', activeHighlight.style.outline || '');
        activeHighlight.setAttribute('data-broken-old-offset', activeHighlight.style.outlineOffset || '');
        activeHighlight.style.outline = '3px solid #f97316';
        activeHighlight.style.outlineOffset = '3px';
        activeHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'broken-close') {
            clearHighlight();
            overlay.remove();
            style.remove();
            return;
        }
        const jumpButton = event.target.closest('.broken-jump');
        if (jumpButton) jumpTo(jumpButton.dataset.id);
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('broken-checker-overlay')) {
            clearHighlight();
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });
})();
