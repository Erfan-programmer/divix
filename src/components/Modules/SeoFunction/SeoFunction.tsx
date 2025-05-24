import { Helmet } from 'react-helmet';

interface SeoType {
  title: string;
  description: string;
  type: string;
  url: string;
  image: string;
  website_name: string;
  twitter_handle?: string; 
}

function SEOFunction({
  title,
  description,
  type,
  url,
  image,
  website_name,
  twitter_handle = '@divix_truck', 
}: SeoType) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebSite",
    name: website_name,
    url: url,
    description: description,
    image: image,
    inLanguage: "fa-IR"
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <html lang="fa" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={website_name} />
      <meta property="og:locale" content="fa_IR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitter_handle} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default SEOFunction;
