import { ARTICLES } from '@/lib/news';

export default function NewsGrid() {
  return (
    <div className="news-grid">
      {ARTICLES.map((article) => (
        <a key={article.id} className="news-card" href={article.href} target="_blank" rel="noopener noreferrer">
          <div className="news-card__frame">
            <img className="news-card__image" src={article.image} alt="" loading="lazy" />
          </div>
          <div className="news-card__body">
            <div className="news-card__text">
              <p className="news-card__outlet">{article.outlet}</p>
              <p className="news-card__desc">{article.description}</p>
            </div>
            <span className="news-card__go" aria-label={`Read the article on ${article.outlet}`}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17 17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
