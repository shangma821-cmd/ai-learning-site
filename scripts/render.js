// AI Nexus — 渲染脚本 v3.1
// 统一渲染逻辑，支持新版设计系统 + 滚动动画 + 交互增强

document.addEventListener('DOMContentLoaded', function () {
    // 设置更新日期
    const dateEl = document.getElementById('update-date');
    if (dateEl) {
        const today = new Date();
        dateEl.textContent = today.toLocaleDateString('zh-CN', {
            month: 'short', day: 'numeric'
        });
    }

    renderHighlightCards();
    renderPaperLists();
    renderNews();
    renderBabel();

    // 初始化滚动动画观察器
    initScrollReveal();
});

/* ── 精选卡片 ── */
function renderHighlightCards() {
    const container = document.getElementById('highlight-cards');
    if (!container || typeof siteData === 'undefined') return;

    const highlights = [
        ...siteData.papers.ai.slice(0, 1).map(p => ({ ...p, tag: 'ai', tagText: '🤖 AI' })),
        ...siteData.papers.edu.slice(0, 1).map(p => ({ ...p, tag: 'edu', tagText: '📚 AI教育' })),
        ...siteData.papers.health.slice(0, 1).map(p => ({ ...p, tag: 'health', tagText: '🏥 AI健康' }))
    ];

    container.innerHTML = highlights.map((item, i) => `
        <div class="paper-card reveal" data-category="${item.tag}" style="animation-delay:${i * 0.08}s">
            <span class="tag ${item.tag}">${item.tagText}</span>
            <h3><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
            <p class="meta">${item.venue} · ${item.authors}</p>
            <p class="summary">${item.summary}</p>
            <a href="${item.url}" target="_blank" rel="noopener" class="paper-link">
                阅读原文 <span>→</span>
            </a>
        </div>
    `).join('');
}

/* ── 论文列表 ── */
function renderPaperLists() {
    if (typeof siteData === 'undefined') return;

    const renderList = (id, papers) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = papers.slice(0, 3).map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue}</span>
            </li>
        `).join('');
    };

    renderList('ai-papers-list', siteData.papers.ai);
    renderList('edu-papers-list', siteData.papers.edu);
    renderList('health-papers-list', siteData.papers.health);
}

/* ── 资讯 ── */
function renderNews() {
    const container = document.getElementById('news-grid');
    if (!container || typeof siteData === 'undefined') return;

    const categoryMap = {
        ai:     { emoji: '🤖', cls: 'ai' },
        edu:    { emoji: '📚', cls: 'edu' },
        health: { emoji: '🏥', cls: 'health' }
    };

    container.innerHTML = siteData.news.slice(0, 6).map((item, i) => {
        const cat = categoryMap[item.category] || { emoji: '📌', cls: 'default' };
        return `
            <div class="news-card reveal" style="animation-delay:${i * 0.06}s">
                <span class="tag ${cat.cls}">${cat.emoji}</span>
                <h4>${item.title}</h4>
                <p class="news-meta">${item.source} · ${item.date}</p>
                ${item.summary ? `<p class="news-summary">${item.summary}</p>` : ''}
            </div>
        `;
    }).join('');
}

/* ── 破茧 ── */
function renderBabel() {
    const container = document.getElementById('babel-grid');
    if (!container || typeof siteData === 'undefined') return;

    const categoryMap = {
        thinking: { emoji: '🧠', cls: 'purple' },
        science:  { emoji: '🔬', cls: 'blue' },
        tech:     { emoji: '💻', cls: 'cyan' },
        design:   { emoji: '🎨', cls: 'pink' },
        history:  { emoji: '📜', cls: 'orange' },
        nature:   { emoji: '🌿', cls: 'green' }
    };

    container.innerHTML = siteData.babel.slice(0, 4).map((item, i) => {
        const cat = categoryMap[item.category] || { emoji: '✨', cls: 'default' };
        return `
            <div class="babel-card reveal" onclick="window.open('${item.url || '#'}','_blank')" style="animation-delay:${i * 0.08}s">
                <div class="emoji">${cat.emoji}</div>
                <h4>${item.title}</h4>
                <div class="field">${item.source} · ${item.date}</div>
            </div>
        `;
    }).join('');
}

/* ── 滚动触发动画 ── */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
