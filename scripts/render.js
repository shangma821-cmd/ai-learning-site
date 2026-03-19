// AI学习站 - 渲染脚本

document.addEventListener('DOMContentLoaded', function() {
    // 设置更新日期
    document.getElementById('update-date').textContent = siteData.lastUpdate;
    
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
        <div class="highlight-card">
            <span class="tag ${item.tag}">${item.tagText}</span>
            <h3>${item.title}</h3>
            <p class="meta">${item.venue} · ${item.authors}</p>
            <p class="summary">${item.summary}</p>
            <a href="${item.url}" target="_blank" class="link">阅读原文 →</a>
        </div>
    `).join('');
}

function renderPaperLists() {
    // AI论文
    const aiList = document.getElementById('ai-papers-list');
    if (aiList) {
        aiList.innerHTML = siteData.papers.ai.map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue} · ${p.authors}</span>
            </li>
        `).join('');
    }
    
    // AI教育论文
    const eduList = document.getElementById('edu-papers-list');
    if (eduList) {
        eduList.innerHTML = siteData.papers.edu.map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue} · ${p.authors}</span>
            </li>
        `).join('');
    }
    
    // AI健康论文
    const healthList = document.getElementById('health-papers-list');
    if (healthList) {
        healthList.innerHTML = siteData.papers.health.map(p => `
            <li>
                <span class="paper-title">${p.title}</span>
                <span class="paper-meta">${p.venue} · ${p.authors}</span>
            </li>
        `).join('');
    }
}

function renderNews() {
    const container = document.getElementById('news-grid');
    if (!container) return;
    
    container.innerHTML = siteData.news.map(item => `
        <div class="news-item">
            <span class="tag ${item.category}">${getCategoryEmoji(item.category)}</span>
            <h4>${item.title}</h4>
            <p class="source">${item.source} · ${item.date}</p>
        </div>
    `).join('');
}

function renderBabel() {
    const container = document.getElementById('babel-grid');
    if (!container) return;
    
    container.innerHTML = siteData.babel.map(item => `
        <div class="babel-item">
            <span class="tag ${item.category}">${getCategoryEmoji(item.category)}</span>
            <h4>${item.title}</h4>
            <p class="source">${item.source} · ${item.date}</p>
        </div>
    `).join('');
}

function getCategoryEmoji(cat) {
    const map = {
        ai: '🤖', edu: '📚', health: '🏥', 
        thinking: '🧠', science: '🔬', tech: '💻',
        design: '🎨', history: '📜', nature: '🌿'
    };
    return map[cat] || '📌';
}
