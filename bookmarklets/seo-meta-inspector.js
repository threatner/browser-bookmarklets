// SEO Meta Inspector Bookmarklet
// Review page titles, meta tags, social tags, headings, and structured data

javascript:(function(){
    const existing = document.getElementById('seo-meta-overlay');
    if (existing) {
        existing.remove();
        const oldStyle = document.getElementById('seo-meta-style');
        if (oldStyle) oldStyle.remove();
        return;
    }

    function getMeta(name, attribute) {
        const selector = attribute === 'property'
            ? 'meta[property="' + name + '"]'
            : 'meta[name="' + name + '"]';
        const node = document.querySelector(selector);
        return node ? (node.getAttribute('content') || '').trim() : '';
    }

    const title = document.title.trim();
    const description = getMeta('description', 'name');
    const canonical = document.querySelector('link[rel="canonical"]');
    const robots = getMeta('robots', 'name');
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'].map(function(name) {
        return { name: name, value: getMeta(name, 'property') };
    });
    const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].map(function(name) {
        return { name: name, value: getMeta(name, 'name') };
    });
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const headingCounts = headings.reduce(function(result, heading) {
        const level = heading.tagName.toLowerCase();
        result[level] = (result[level] || 0) + 1;
        return result;
    }, {});
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');

    const warnings = [];
    if (!title) warnings.push('Missing page title.');
    if (title && title.length > 60) warnings.push('Title is longer than 60 characters.');
    if (title && title.length < 20) warnings.push('Title is quite short.');
    if (!description) warnings.push('Missing meta description.');
    if (description && description.length > 160) warnings.push('Meta description is longer than 160 characters.');
    if (!canonical) warnings.push('Missing canonical link.');
    if (!headingCounts.h1) warnings.push('No h1 heading found.');
    if ((headingCounts.h1 || 0) > 1) warnings.push('Multiple h1 headings found.');

    const style = document.createElement('style');
    style.id = 'seo-meta-style';
    style.textContent = `
        #seo-meta-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        #seo-meta-panel {
            width: min(980px, 92vw);
            max-height: 88vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 28px 70px rgba(15, 23, 42, 0.32);
        }
        #seo-meta-panel * {
            box-sizing: border-box;
        }
        .seo-header {
            padding: 16px 18px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #e2e8f0;
            background: linear-gradient(135deg, #ecfeff, #f8fafc);
        }
        .seo-header h2 {
            margin: 0;
            font-size: 22px;
            color: #0f172a;
        }
        .seo-btn {
            border: none;
            background: #111827;
            color: #fff;
            border-radius: 10px;
            padding: 9px 12px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }
        .seo-spacer {
            flex: 1;
        }
        .seo-content {
            padding: 18px;
            overflow: auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 14px;
        }
        .seo-card {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px;
        }
        .seo-card h3 {
            margin: 0 0 10px;
            font-size: 15px;
            color: #0f172a;
        }
        .seo-line {
            margin-bottom: 10px;
            font-size: 13px;
            color: #334155;
            word-break: break-word;
        }
        .seo-line strong {
            color: #0f172a;
        }
        .seo-code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12px;
            color: #1d4ed8;
        }
        .seo-warning {
            background: #fff7ed;
            border: 1px solid #fdba74;
            color: #9a3412;
            border-radius: 12px;
            padding: 10px;
            font-size: 13px;
            margin-bottom: 8px;
        }
        .seo-ok {
            background: #ecfdf5;
            border: 1px solid #86efac;
            color: #166534;
            border-radius: 12px;
            padding: 10px;
            font-size: 13px;
        }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'seo-meta-overlay';
    overlay.innerHTML = `
        <div id="seo-meta-panel" role="dialog" aria-label="SEO meta inspector">
            <div class="seo-header">
                <h2>SEO Meta Inspector</h2>
                <div class="seo-spacer"></div>
                <button class="seo-btn" id="seo-close">Close</button>
            </div>
            <div class="seo-content">
                <div class="seo-card">
                    <h3>Core Metadata</h3>
                    <div class="seo-line"><strong>Title:</strong> ${title || 'Missing'}</div>
                    <div class="seo-line"><strong>Title Length:</strong> ${title.length}</div>
                    <div class="seo-line"><strong>Description:</strong> ${description || 'Missing'}</div>
                    <div class="seo-line"><strong>Description Length:</strong> ${description.length}</div>
                    <div class="seo-line"><strong>Canonical:</strong> <span class="seo-code">${canonical ? canonical.href : 'Missing'}</span></div>
                    <div class="seo-line"><strong>Robots:</strong> ${robots || 'Not set'}</div>
                </div>
                <div class="seo-card">
                    <h3>Warnings</h3>
                    ${warnings.length ? warnings.map(function(warning) {
                        return '<div class="seo-warning">' + warning + '</div>';
                    }).join('') : '<div class="seo-ok">No obvious SEO issues found in this quick scan.</div>'}
                </div>
                <div class="seo-card">
                    <h3>Open Graph</h3>
                    ${ogTags.map(function(tag) {
                        return '<div class="seo-line"><strong>' + tag.name + ':</strong> ' + (tag.value || 'Missing') + '</div>';
                    }).join('')}
                </div>
                <div class="seo-card">
                    <h3>Twitter Cards</h3>
                    ${twitterTags.map(function(tag) {
                        return '<div class="seo-line"><strong>' + tag.name + ':</strong> ' + (tag.value || 'Missing') + '</div>';
                    }).join('')}
                </div>
                <div class="seo-card">
                    <h3>Heading Outline</h3>
                    <div class="seo-line"><strong>Total headings:</strong> ${headings.length}</div>
                    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(function(level) {
                        return '<div class="seo-line"><strong>' + level.toUpperCase() + ':</strong> ' + (headingCounts[level] || 0) + '</div>';
                    }).join('')}
                </div>
                <div class="seo-card">
                    <h3>Structured Data</h3>
                    <div class="seo-line"><strong>JSON-LD blocks:</strong> ${jsonLdScripts.length}</div>
                    <div class="seo-line"><strong>Lang:</strong> ${document.documentElement.lang || 'Missing'}</div>
                    <div class="seo-line"><strong>URL:</strong> <span class="seo-code">${location.href}</span></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.id === 'seo-close') {
            overlay.remove();
            style.remove();
        }
    });

    document.addEventListener('keydown', function onKeydown(event) {
        if (event.key === 'Escape' && document.getElementById('seo-meta-overlay')) {
            overlay.remove();
            style.remove();
            document.removeEventListener('keydown', onKeydown);
        }
    });
})();
