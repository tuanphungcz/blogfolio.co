import ArticleCard from '../ArticleCard';

export default function ArticleList({ articles, route, routeSettings }: any) {
  return (
    <div
      className={`grid gap-10 sm:grid-cols-2 auto-rows-max ${
        routeSettings?.cols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
      }`}
    >
      {articles.map(article => (
        <ArticleCard
          article={article}
          key={article.id}
          route={route}
          routeSettings={routeSettings}
        />
      ))}
    </div>
  );
}
