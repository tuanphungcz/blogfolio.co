import slugify from 'slugify';
import getLocalizedDate from 'lib/getLocalizedDate';
import Link from 'next/link';
import TagItem from './base/TagItem';

export default function ArticleCard({ article, route }: any) {
  const slug = slugify(article.title).toLowerCase();

  const formattedTime = getLocalizedDate(article.published);

  return (
    <Link href={`/${route}/${slug}`}>
      <div
        className={`flex flex-col overflow-hidden cursor-pointer group ${
          !article?.coverImage && 'border p-6 rounded-lg hover:bg-gray-100 transition'
        }`}
      >
        {article?.coverImage && (
          <div className=" filter contrast-[0.9] mb-4">
            <img
              className="object-cover w-full transition rounded-lg aspect-[16/9] group-hover:opacity-90 "
              src={article.coverImage}
              alt="article cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between space-y-2">
          <div className="flex space-x-2 text-sm text-gray-400">
            {article.categories?.slice(0, 2).map((category, i) => (
              <TagItem key={category + i} isSelected={false}>
                {category}
              </TagItem>
            ))}
          </div>
          <p className="text-lg font-semibold text-gray-900">{article.title}</p>
          <p className="mt-3 text-gray-500 line-clamp-2">{article.summary}</p>

          <div className="text-sm text-gray-400">
            <time dateTime={formattedTime}>{formattedTime}</time>
          </div>
        </div>
      </div>
    </Link>
  );
}
