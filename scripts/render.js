// AI Nexus - 渲染脚本

document.addEventListener('DOMContentLoaded', function() {
    // 设置更新日期
    const dateEl = document.getElementById('update-date');
    if (dateEl) {
        const today = new Date();
        const options = { month: 'short', day: 'numeric' };
        dateEl.textContent = today.toLocaleDateString('zh-CN', options);
    }
    
    // 渲染今日精选
    renderHighlightCards();
    
    // 渲染论文列表
    renderPaperLists();
    
    // 渲染资讯
    renderNews();
    
    // 渲染破茧内容
    renderBabel();
});

function renderHighlightCards() {
    const container = document.getElementById('highlight-cards');
    if (!container) return;
    
    const highlights = [
        ...siteData.papers.ai.slice(0, 1).map(p => ({...p, tag: 'ai', tagText: '🤖 AI'})),
        ...siteData.papers.edu.slice(0, 1).map(p => ({...p, tag: 'edu', tagText: '📚 AI教育'})),
        ...siteData.papers.health.slice(0, 1).map(p => ({...p, tag: 'health', tagText: '🏥 AI健康'}))
    ];
    
    container.innerHTML = highlights.map(item => `
        <div class="featured-card">
            <span class="featured-tag ${item.tag}">${item.tagText}</span>
            <h3>${item.title}</h3>
            <p class="featured-meta">${item.venue} · ${item.authors}</p>
            <p class="featured-summary">${item.summary}</p>
            <a href="${item.url}" target="_blank" class="featured-link">
                阅读原文 <span>→</span>
            </a>
        </div>
    `).join('');
}

function renderPaperLists() {
    // AI论文
    const aiList = document.getElementById('ai-papers-list');
    if (aiList) {
        aiList.innerHTML = siteData.papers.ai.slice(0, 3).map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue}</span>
            </li>
        `).join('');
    }
    
    // AI教育论文
    const eduList = document.getElementById('edu-papers-list');
    if (eduList) {
        eduList.innerHTML = siteData.papers.edu.slice(0, 3).map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue}</span>
            </li>
        `).join('');
    }
    
    // AI健康论文
    const healthList = document.getElementById('health-papers-list');
    if (healthList) {
        healthList.innerHTML = siteData.papers.health.slice(0, 3).map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue}</span>
            </li>
        `).join('');
    }
}

function renderNews() {
    const container = document.getElementById('news-grid');
    if (!container) return;
    
    const categoryMap = {
        ai: { emoji: '🤖', class: 'ai' },
        edu: { emoji: '📚', class: 'edu' },
        health: { emoji: '🏥', class: 'health' }
    };
    
    container.innerHTML = siteData.news.slice(0, 6).map(item => {
        const cat = categoryMap[item.category] || { emoji: '📌', class: 'default' };
        return `
            <div class="news-item">
                <span class="tag ${cat.class}">${cat.emoji}</span>
                <h4>${item.title}</h4>
                <p class="source">${item.source} · ${item.date}</p>
            </div>
        `;
    }).join('');
}

function renderBabel() {
    const container = document.getElementById('babel-grid');
    if (!container) return;
    
    const categoryMap = {
        thinking: { emoji: '🧠', class: 'purple' },
        science: { emoji: '🔬', class: 'blue' },
        tech: { emoji: '💻', class: 'cyan' },
        design: { emoji: '🎨', class: 'pink' },
        history: { emoji: '📜', class: 'orange' },
        nature: { emoji: '🌿', class: 'green' }
    };
    
    container.innerHTML = siteData.babel.slice(0, 4).map(item => {
        const cat = categoryMap[item.category] || { emoji: '📌', class: 'default' };
        return `
            <div class="babel-item">
                <span class="tag ${cat.class}">${cat.emoji}</span>
                <h4>${item.title}</h4>
                <p class="source">${item.source} · ${item.date}</p>
            </div>
        `;
    }).join('');
}
