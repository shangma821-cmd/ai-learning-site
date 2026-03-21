// AI Nexus — 渲染脚本 v4.0
// 统一渲染逻辑，支持新版设计系统 + 滚动动画 + 交互增强
// ✨ v4.0 · 2026-03-22 · 全栈美学增强版

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
    
    // ✨ v4.0 新增交互增强
    initNeuralNodes();
    initElasticSearch();
    initCardSelection();
    initQuickPreview();
    initKeyboardNav();
    initHoverSound();
});

/* ── 神经网络脉冲节点 ── */
function initNeuralNodes() {
    const bg = document.querySelector('.ambient-bg');
    if (!bg || window.innerWidth < 768) return;
    
    const count = 12;
    for (let i = 0; i < count; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
            animation-duration: ${2 + Math.random() * 2}s;
            width: ${3 + Math.random() * 4}px;
            height: ${3 + Math.random() * 4}px;
            background: ${['rgba(99,102,241,0.7)', 'rgba(34,211,238,0.7)', 'rgba(168,139,250,0.7)'][Math.floor(Math.random()*3)]};
        `;
        bg.appendChild(node);
    }
}

/* ── 弹性搜索框 ── */
function initElasticSearch() {
    document.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('focused');
        });
    });
}

/* ── 卡片多选功能 ── */
function initCardSelection() {
    document.querySelectorAll('.paper-card, .news-card, .archive-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('a') || e.target.closest('button')) return;
            card.classList.toggle('selected');
        });
    });
}

/* ── 快捷预览（延迟加载摘要）── */
function initQuickPreview() {
    document.querySelectorAll('.paper-card').forEach(card => {
        let timer;
        card.addEventListener('mouseenter', () => {
            timer = setTimeout(() => {
                const preview = card.querySelector('.quick-preview');
                if (preview) preview.style.opacity = '1';
            }, 600);
        });
        card.addEventListener('mouseleave', () => {
            clearTimeout(timer);
            const preview = card.querySelector('.quick-preview');
            if (preview) preview.style.opacity = '0';
        });
    });
}

/* ── 键盘导航增强 ── */
function initKeyboardNav() {
    const cards = [...document.querySelectorAll('.paper-card, .news-card')];
    if (!cards.length) return;
    
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const focused = document.activeElement;
            const idx = cards.indexOf(focused);
            if (idx !== -1) {
                const next = e.key === 'ArrowRight' 
                    ? cards[Math.min(idx + 1, cards.length - 1)]
                    : cards[Math.max(idx - 1, 0)];
                next?.focus();
            }
        }
    });
    
    cards.forEach((card, i) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                const link = card.querySelector('a[href]');
                if (link) link.click();
            }
        });
    });
}

/* ── 悬浮声音反馈（轻量提示音）── */
function initHoverSound() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    
    let audioCtx;
    document.querySelectorAll('.paper-card, .action-btn, .filter-chip').forEach(el => {
        el.addEventListener('mouseenter', () => {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.value = 800 + Math.random() * 400;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.08);
            } catch(e) {}
        }, { once: true });
    });
}

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
