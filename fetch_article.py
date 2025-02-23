import requests
import json
from bs4 import BeautifulSoup

DW_URL = "https://www.dw.com/de/themen/s-9077"


def fetch_articles():
    response = requests.get(DW_URL)
    if response.status_code != 200:
        print("Failed to fetch DW articles")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    articles = []

    # Select article links (adjust if DW changes its structure)
    els = soup.find_all(class_="lap31d1 l1amv4u6 btl76l3 e1eo633p wgx1hx2 b1ho1h07")
    article_links = list(set([a['href'] for a in els]))
    print(f"links {article_links}")

    for link in article_links[:10]:  # Fetch 10 latest articles
        article_url = "https://www.dw.com" + link
        article_data = fetch_article_content(article_url)
        if article_data:
            articles.append(article_data)

    return articles


def fetch_article_content(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch article: {url}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.find("h1")
    content_tag = soup.find_all(class_="cc0m0op s1ebneao rich-text t1it8i9i r1wgtjne wgx1hx2 b1ho1h07")
    if len(content_tag) == 0:
        return None

    content = '\n'.join(e.text for e in content_tag[0].select('div p'))

    if not title or not content:
        return None

    print(url)
    return {"title": title.text.strip(), "content": content.strip(), "url": url}


def save_articles(articles, filename="public/dw_articles.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    articles = fetch_articles()
    print(articles)
    if articles:
        save_articles(articles)
        print(f"Saved {len(articles)} articles to dw_articles.json")
