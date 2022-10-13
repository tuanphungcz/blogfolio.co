import Link from 'next/link';
import { filterArticlesWithMetadata, getArticlePage, shuffleArray } from 'lib/notion';
import { Layout } from 'layouts/Layout';
import getLocalizedDate from 'lib/getLocalizedDate';
import prisma, { blogSelect } from 'lib/prisma';
import Container from 'components/base/Container';
import ArticleList from 'components/base/ArticleList';
import { getAllPosts, getPageById } from 'lib/posts';
import { NotionRenderer } from 'react-notion';
import { flattenDeep, getSiteOptions } from 'lib/utils';
import { IconChevronRight } from '@tabler/icons';
import slugify from 'slugify';
import { SecondaryButton } from 'components/base/Button';

const ArticlePage = ({ summary, route, blog, blockMap, page, origin, moreArticles }) => {
  const publishedOn = getLocalizedDate(page.published);

  const ogImage = `${
    process.env.NEXT_PUBLIC_IS_LOCALHOST
      ? 'http://localhost:3000'
      : 'https://blogfolio.co'
  }/api/og?title=${encodeURIComponent(page.title)}&domain=${encodeURIComponent(
    blog?.customDomain || blog?.slug + '.blogfolio.co'
  )}`;

  const coverImage = page?.coverImage?.[0].url || '';

  const routeSettings = blog.settingData?.links.find(setting =>
    setting?.url?.includes(route)
  );

  return (
    <>
      <Layout
        description={summary}
        imageUrl={ogImage}
        blog={blog}
        title={page.title}
        baseUrl={origin}
      >
        <div>
          <div className={` py-16 pb-48 mx-auto -mb-48 ${coverImage && 'bg-gray-100'}`}>
            <Container small>
              <div className="mb-2 text-sm text-gray-500">
                <div className="text-lg">{publishedOn}</div>
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                {page.title}
              </div>
              <div className="mx-auto mt-3 text-lg notion-text sm:mt-4">
                {page.summary}
              </div>
            </Container>
          </div>

          {coverImage && (
            <Container small>
              <img
                className="object-cover w-full mx-auto my-8 rounded-lg aspect-video"
                src={coverImage}
                alt="article cover"
              />
            </Container>
          )}

          <Container small>
            <NotionRenderer
              blockMap={blockMap}
              customBlockComponents={{
                text: ({ renderComponent, blockValue }) => {
                  return (
                    blockValue?.properties && (
                      <div className="text-lg">{renderComponent()}</div>
                    )
                  );
                }
              }}
            />
          </Container>

          <div className="py-12 border-t">
            <Container>
              <div className="flex items-center justify-between my-8">
                <div className="text-3xl font-bold text-gray-900 capitalize">{route}</div>

                <Link href={`/${route}`}>
                  <SecondaryButton>
                    <div> More {route}</div>
                    <IconChevronRight className="w-4" />
                  </SecondaryButton>
                </Link>
              </div>

              <ArticleList
                articles={
                  routeSettings?.cols === 3 ? moreArticles : moreArticles.slice(0, 2)
                }
                routeSettings={routeSettings}
                route={route}
              />
            </Container>
          </div>
        </div>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const blogs = await prisma.blogWebsite.findMany({
    select: {
      customDomain: true,
      slug: true,
      notionBlogDatabaseId: true
    }
  });

  const fetchBlogs = await Promise.all(
    blogs.map(async blog => {
      const allPosts = await getAllPosts(blog?.notionBlogDatabaseId);
      let articles: any[] = [];

      console.log('blog & length:', blog?.slug, blog?.customDomain, allPosts.length);

      allPosts.forEach((article: any) => {
        if (article?.title && article?.route) {
          return articles.push({
            route: article?.route,
            slug: slugify(article?.title).toLowerCase()
          });
        }
      });

      return articles
        .filter(item => item?.route)
        .map(article => ({
          route: article.route,
          slug: article.slug,
          subdomain: blog.slug,
          customDomain: blog.customDomain
        }));
    })
  );

  const flattenBlogs = flattenDeep(fetchBlogs);

  const paths = flattenBlogs.flatMap(blog => {
    if (blog?.subdomain === null || blog?.customDomain === null) return [];

    if (blog.customDomain) {
      return [
        {
          params: {
            site: blog.customDomain,
            route: blog.route,
            slug: blog.slug
          }
        },
        {
          params: {
            site: blog.subdomain,
            route: blog.route,
            slug: blog.slug
          }
        }
      ];
    } else {
      return {
        params: {
          site: blog.subdomain,
          route: blog.route,
          slug: blog.slug
        }
      };
    }
  });

  return {
    paths: paths,
    fallback: 'blocking'
  };
}
export const getStaticProps = async context => {
  const { site, slug, route } = context.params;

  const blog = await prisma.blogWebsite.findFirst({
    where: getSiteOptions(site),
    select: blogSelect
  });

  const allPosts = await getAllPosts(blog.notionBlogDatabaseId);
  const { articles } = filterArticlesWithMetadata(allPosts, route);

  const page = getArticlePage(allPosts, slug);
  const blockMap = await getPageById(page.id);

  return {
    props: {
      moreArticles: shuffleArray(articles).slice(0, 3),
      blog: {
        ...blog,
        settingData: JSON.parse(blog.settingData)
      },
      route,
      blockMap,
      page
      // origin
    },
    revalidate: 60
  };
};

export default ArticlePage;
