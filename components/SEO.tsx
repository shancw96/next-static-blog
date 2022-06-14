import Head from "next/head";
import { useRouter } from "next/router";
import * as siteMetadata from "../lib/constants";
const CommonSEO = ({ title, description, ogType }) => {
  const router = useRouter();
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta
        property="og:url"
        content={`${siteMetadata.siteUrl}${router.asPath}`}
      />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMetadata.siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <link rel="canonical" href={`${siteMetadata.siteUrl}${router.asPath}`} />
    </Head>
  );
};

export const BlogSEO = ({ title, summary, date, url }) => {
  const publishedAt = new Date(date).toISOString();

  const authorList = {
    "@type": "Person",
    name: siteMetadata.author,
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    datePublished: publishedAt,
    author: authorList,
    publisher: {
      "@type": "Organization",
      name: siteMetadata.author,
      logo: {
        "@type": "ImageObject",
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: summary,
  };
  return (
    <>
      <CommonSEO title={title} description={summary} ogType="article" />
      <Head>
        {date && (
          <meta property="article:published_time" content={publishedAt} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  );
};
