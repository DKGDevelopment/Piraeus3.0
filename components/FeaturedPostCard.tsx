import ReadButton from './ReadButton';
import type { Post } from '@/lib/news';

export default function FeaturedPostCard({ post, align }: { post: Post; align: 'left' | 'right' }) {
  return (
    <a className={`featured-card featured-card--${align}`} href={post.href} target="_blank" rel="noopener noreferrer">
      <img className="featured-card__image" src={post.coverImage} alt="" loading="lazy" />
      <div className="featured-card__panel">
        <p className="featured-card__eyebrow">{post.category}</p>
        <h3 className="featured-card__title">{post.title}</h3>
        <ReadButton />
      </div>
    </a>
  );
}
