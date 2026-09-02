import ReadButton from './ReadButton';
import type { Post } from '@/lib/news';

export default function JournalGridItem({ post, reverse }: { post: Post; reverse: boolean }) {
  return (
    <a
      className={`journal-item${reverse ? ' journal-item--reverse' : ''}`}
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="journal-item__frame">
        <img className="journal-item__image" src={post.coverImage} alt="" loading="lazy" />
      </span>
      <span className="journal-item__content">
        <span className="journal-item__inner">
          <p className="journal-item__eyebrow">{post.category}</p>
          <h3 className="journal-item__title">{post.title}</h3>
          <ReadButton />
        </span>
      </span>
    </a>
  );
}
