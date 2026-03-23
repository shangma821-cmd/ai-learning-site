// AI Nexus — 渲染脚本 v4.4
// 统一渲染逻辑，支持新版设计系统 + 滚动动画 + 交互增强
// ✨ v4.4 · 2026-03-24 01:08 · 极光美学版 · v8.9 适配

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
    renderBentoStats(); // v4.4 新增
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
    
    // ✨ v4.3 春季特效
    initSpringEffects();
    initSpringPetals();
    
    // ✨ v4.4 极光美学特效
    initCopyLink();
    initMinimap();
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
        <div class="paper-card reveal aurora-border-2 deep-glow hover-reveal-meta" data-category="${item.tag}" style="animation-delay:${i * 0.08}s">
            <div class="glow-bar"></div>
            <div class="meta-overlay">
                <span style="font-size:0.78rem;color:var(--accent-cyan);">📄 ${item.venue}</span>
            </div>
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

/* ── 统计 Bento 网格（v4.4 新增）── */
function renderBentoStats() {
    const container = document.getElementById('bento-stats');
    if (!container || typeof siteData === 'undefined') return;
    
    const aiCount = siteData.papers.ai.length;
    const eduCount = siteData.papers.edu.length;
    const healthCount = siteData.papers.health.length;
    const total = aiCount + eduCount + healthCount;
    const newsCount = siteData.news.length;
    const babelCount = siteData.babel.length;
    
    container.innerHTML = `
        <div class="bento-card">
            <div class="bento-icon">📚</div>
            <div class="bento-label">论文总数</div>
            <div class="bento-value" data-count="${total}">0</div>
            <div class="bento-sub">持续更新中</div>
        </div>
        <div class="bento-card">
            <div class="bento-icon">🤖</div>
            <div class="bento-label">AI 前沿</div>
            <div class="bento-value" data-count="${aiCount}">0</div>
            <div class="bento-sub">人工智能研究</div>
        </div>
        <div class="bento-card">
            <div class="bento-icon">📰</div>
            <div class="bento-label">产业资讯</div>
            <div class="bento-value" data-count="${newsCount}">0</div>
            <div class="bento-sub">每日更新</div>
        </div>
        <div class="bento-card">
            <div class="bento-icon">💡</div>
            <div class="bento-label">破茧洞见</div>
            <div class="bento-value" data-count="${babelCount}">0</div>
            <div class="bento-sub">思维火花</div>
        </div>
    `;
    
    // 数字计数动画
    setTimeout(() => {
        container.querySelectorAll('.bento-value').forEach(el => {
            const target = parseInt(el.dataset.count);
            if (!target) return;
            let current = 0;
            const step = Math.ceil(target / 30);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { el.textContent = target; clearInterval(timer); }
                else el.textContent = current;
            }, 30);
        });
    }, 300);
}

/* ── 复制链接功能（v4.4 新增）── */
function initCopyLink() {
    document.querySelectorAll('.paper-link, .paper-card a').forEach(link => {
        link.addEventListener('click', function(e) {
            // 延迟让链接正常跳转
            const url = this.href;
            if (!url) return;
            
            // 尝试复制到剪贴板
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).catch(() => {});
            }
        });
    });
    
    // 添加复制提示
    const toast = document.createElement('div');
    toast.className = 'copy-link-toast';
    toast.innerHTML = '<span>✓</span> 链接已复制';
    document.body.appendChild(toast);
    
    document.querySelectorAll('[data-copy]').forEach(el => {
        el.addEventListener('click', () => {
            const text = el.dataset.copy;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 2000);
                });
            }
        });
    });
}

/* ── 页面微地图（v4.4 新增）── */
function initMinimap() {
    const minimap = document.createElement('div');
    minimap.className = 'minimap';
    minimap.innerHTML = '<div class="minimap-progress" id="minimap-progress"></div>';
    document.body.appendChild(minimap);
    
    const progress = document.getElementById('minimap-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.height = pct + '%';
    });
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
            <div class="news-card reveal neumorph-glass glass-card-shine micro-lift" style="animation-delay:${i * 0.06}s">
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
            <div class="babel-card reveal neumorph-glass glass-card-shine micro-lift" onclick="window.open('${item.url || '#'}','_blank')" style="animation-delay:${i * 0.08}s">
                <div class="emoji">${cat.emoji}</div>
                <h4>${item.title}</h4>
                <div class="field">${item.source} · ${item.date}</div>
            </div>
        `;
    }).join('');
}

/* ── 滚动触发动画 ── */
function initScrollReveal() {
    // 处理 .reveal 元素
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 处理滚动显示动画类
    const scrollClasses = ['.scroll-reveal', '.scroll-reveal-left', '.scroll-reveal-right', '.scroll-reveal-scale'];
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    scrollClasses.forEach(cls => {
        document.querySelectorAll(cls).forEach(el => scrollObserver.observe(el));
    });
}

/* ── 春季特效 ── */
function initSpringEffects() {
    // 为卡片添加春季入场动画
    document.querySelectorAll('.spring-glass-card, .paper-card, .news-card, .babel-card, .archive-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px) scale(0.97)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, i * 80);
    });
    
    // 春季按钮涟漪效果
    document.querySelectorAll('.spring-btn, .btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(196, 181, 253, 0.6);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: spring-ripple-effect 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* ── 春季花瓣动画增强 ── */
function initSpringPetals() {
    const petals = document.querySelectorAll('.petal');
    petals.forEach((petal, i) => {
        // 随机化花瓣动画
        const duration = 10 + Math.random() * 8;
        const delay = Math.random() * 5;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;
        
        // 随机大小
        const size = 6 + Math.random() * 6;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
    });
}

// 添加春季涟漪动画样式
const springStyles = document.createElement('style');
springStyles.textContent = `
    @keyframes spring-ripple-effect {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(springStyles);

// ═══════════════════════════════════════════════════════════════
// v9.0 渲染增强 · 2026-03-24 02:18
// ✨ 骨骼屏加载 + 滚动观察器 + Toast通知 + 光标光晕
// ═══════════════════════════════════════════════════════════════

/* ── 滚动触发动画 ── */
function initScrollReveal() {
    const els = document.querySelectorAll('.scroll-reveal, .fade-up, .fade-in');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    els.forEach((el, i) => {
        el.classList.add('scroll-reveal');
        // stagger delay via data attribute
        const delay = el.dataset.revealDelay || (i % 6) * 80;
        el.style.transitionDelay = `${delay}ms`;
        observer.observe(el);
    });
}

/* ── 骨架屏渲染（首次加载用） ── */
function showSkeletonLoading(container, count = 3) {
    const skeletons = Array.from({ length: count }, () => `
        <div class="skeleton-card" style="margin-bottom: 16px;">
            <div class="skeleton skeleton-circle" style="margin-bottom: 12px;"></div>
            <div class="skeleton skeleton-line long"></div>
            <div class="skeleton skeleton-line medium"></div>
            <div class="skeleton skeleton-line short"></div>
        </div>
    `).join('');
    
    if (container) container.innerHTML = skeletons;
}

/* ── Toast 通知系统 ── */
function showToast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toast-in 0.3s ease reverse both';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ── 键盘快捷键提示面板 ── */
function initKeyboardHints() {
    const hint = document.querySelector('.shortcut-hint');
    if (!hint) return;

    let hideTimer;
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            hint.classList.add('visible');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => hint.classList.remove('visible'), 4000);
        }
    });
}

/* ── 导航进度指示器 ── */
function initNavProgress() {
    const nav = document.querySelector('.glass-nav');
    if (!nav) return;

    const progress = document.createElement('div');
    progress.className = 'nav-progress';
    progress.style.width = '0%';
    nav.style.position = 'relative';
    nav.appendChild(progress);

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (scrolled / total) * 100 : 0;
        progress.style.width = `${pct}%`;
    }, { passive: true });
}

/* ── 光标跟随光晕（桌面端） ── */
function initCursorGlow() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                glow.style.left = `${e.clientX}px`;
                glow.style.top  = `${e.clientY}px`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ── 页面入场动画 ── */
function initPageEnter() {
    document.body.classList.add('page-enter');
    setTimeout(() => document.body.classList.remove('page-enter'), 600);
}

/* ── 初始化 v9.0 全部增强 ── */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initKeyboardHints();
    initNavProgress();
    initCursorGlow();
    initPageEnter();

    // 给所有卡片添加入场动画
    document.querySelectorAll('.paper-card, .news-card, .stat-card, .babel-card').forEach((card, i) => {
        if (!card.classList.contains('scroll-reveal')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + i * 60);
        }
    });
});

// ═══════════════════════════════════════════════════════════════
// End of v9.0 渲染增强 · 2026-03-24 02:18
// ═══════════════════════════════════════════════════════════════
