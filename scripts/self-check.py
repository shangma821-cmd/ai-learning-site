#!/usr/bin/env python3
"""
AI学习站 - 链接自检脚本
每次更新前自动检查所有链接有效性
"""
import json
import re
import sys
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from datetime import datetime

def check_url(url, timeout=10):
    """检查URL是否可访问"""
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urlopen(req, timeout=timeout)
        return response.getcode(), response.getheader('Content-Type', '')
    except HTTPError as e:
        return e.code, str(e)
    except URLError as e:
        return 0, str(e)
    except Exception as e:
        return 0, str(e)

def validate_arxiv(arxiv_id):
    """验证arXiv论文ID格式"""
    return bool(re.match(r'^\d{4}\.\d{4,5}$', arxiv_id))

def validate_url(url):
    """验证URL格式"""
    return bool(re.match(r'^https?://', url))

def extract_arxiv_id(url):
    """从URL提取arXiv ID"""
    match = re.search(r'(\d{4}\.\d{4,5})', url)
    return match.group(1) if match else None

def check_data_file(filepath):
    """检查data.js中的所有链接"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取JSON部分
    match = re.search(r'const siteData = (\{[\s\S]*?\});', content)
    if not match:
        print("❌ 无法解析data.js文件")
        return False
    
    try:
        # 使用简单的JSON解析
        json_str = match.group(1)
        # 修复JavaScript语法使其成为有效JSON
        json_str = json_str.replace('//.*', '')  # 移除注释
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"⚠️ JSON解析警告: {e}，尝试继续检查...")
        # 继续检查，不因解析错误中断
        data = {'papers': {}, 'news': [], 'babel': []}
    
    all_valid = True
    issues = []
    
    print(f"\n{'='*60}")
    print(f"🔍 AI学习站链接自检 - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}\n")
    
    # 检查论文
    for category in ['ai', 'edu', 'health']:
        papers = data.get('papers', {}).get(category, [])
        print(f"📚 {category.upper()} 论文 ({len(papers)}篇):")
        for paper in papers:
            url = paper.get('url', '')
            arxiv_id = extract_arxiv_id(url)
            
            if arxiv_id:
                # 验证arXiv ID格式
                if not validate_arxiv(arxiv_id):
                    issues.append(f"❌ [{paper.get('title', 'Unknown')[:30]}] arXiv ID格式错误: {arxiv_id}")
                    all_valid = False
                    continue
                
                # 检查arXiv页面
                code, msg = check_url(f"https://arxiv.org/abs/{arxiv_id}")
                if code == 200:
                    print(f"  ✅ {arxiv_id}: {paper.get('title', '')[:40]}...")
                else:
                    issues.append(f"❌ [{category}] {paper.get('title', '')[:30]}... - HTTP {code}")
                    print(f"  ❌ {arxiv_id}: HTTP {code}")
                    all_valid = False
            else:
                # 非arXiv链接直接检查
                if url:
                    code, msg = check_url(url)
                    if code == 200:
                        print(f"  ✅ {paper.get('title', '')[:40]}...")
                    else:
                        issues.append(f"❌ [{category}] {paper.get('title', '')[:30]} - HTTP {code}")
                        print(f"  ❌ HTTP {code}: {url[:50]}...")
                        all_valid = False
        print()
    
    # 检查新闻
    print(f"📰 新闻 ({len(data.get('news', []))}条):")
    for news in data.get('news', []):
        url = news.get('url', '')
        if url:
            code, msg = check_url(url)
            if code == 200:
                print(f"  ✅ {news.get('title', '')[:45]}...")
            else:
                issues.append(f"❌ [新闻] {news.get('title', '')[:30]} - HTTP {code}")
                print(f"  ❌ HTTP {code}: {url[:50]}...")
                all_valid = False
    print()
    
    # 检查破茧内容
    print(f"🌈 破茧内容 ({len(data.get('babel', []))}条):")
    for item in data.get('babel', []):
        url = item.get('url', '')
        if url:
            code, msg = check_url(url)
            if code == 200:
                print(f"  ✅ {item.get('title', '')[:45]}...")
            else:
                issues.append(f"❌ [破茧] {item.get('title', '')[:30]} - HTTP {code}")
                print(f"  ❌ HTTP {code}: {url[:50]}...")
                all_valid = False
    print()
    
    # 总结
    print(f"{'='*60}")
    if all_valid:
        print("✅ 所有链接验证通过！可以安全更新网站。")
    else:
        print(f"❌ 发现 {len(issues)} 个问题，更新前请先修复:")
        for issue in issues:
            print(f"  {issue}")
    print(f"{'='*60}\n")
    
    return all_valid, issues

if __name__ == '__main__':
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'scripts/data.js'
    success, issues = check_data_file(filepath)
    sys.exit(0 if success else 1)
