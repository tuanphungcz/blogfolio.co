import Link from 'next/link';
import { filterArticlesWithMetadata } from 'lib/notion';
import prisma, { blogSelect } from 'lib/prisma';
import ListOfItems from 'components/ListOfItems';
import { getAllPosts } from 'lib/posts';
import { getSiteOptions } from 'lib/utils';
import { useRouter } from 'next/router';

export default function Index({ articles, categories, blog, routes, route }: any) {
  const router = useRouter();
  if (router.isFallback) return <div>loading</div>;

  if (!blog) {
    return (
      <div>
        The subdomain page probably does not exist, please contact admin{' '}
        <Link href="/">go back to main page</Link>
      </div>
    );
  }

  const listProps = { blog, routes, route, categories, articles, isHome: false };

  return <ListOfItems {...listProps} />;
}

export async function getStaticPaths() {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  return {
    paths: [],
    fallback: true
  };
}

export async function getStaticProps(context: any) {
  const { site, route } = context.params;

  if (!site) {
    return {
      props: {
        profile: null
      }
    };
  }

  const blog = await prisma.blogWebsite.findFirst({
    where: getSiteOptions(site),
    select: blogSelect
  });

  if (!blog?.slug) {
    return {
      props: {
        profile: null
      }
    };
  }

  const parsedSettingData = JSON.parse(blog?.settingData);
  const allPosts = await getAllPosts(blog?.notionBlogDatabaseId);
  const { categories, routes, articles } = filterArticlesWithMetadata(allPosts, route);

  return {
    props: {
      blog: {
        ...blog,
        settingData: parsedSettingData
      },
      articles,
      categories,
      routes,
      route
    },
    revalidate: 60
  };
}
