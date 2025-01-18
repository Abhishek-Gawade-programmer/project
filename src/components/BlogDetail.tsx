import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

interface BlogTranslation {
  blog_en: string;
  blog_hi?: string;
  blog_mr?: string;
  blog_gu?: string;
  blog_ta?: string;
  blog_kn?: string;
  blog_te?: string;
  blog_bn?: string;
  blog_ml?: string;
  blog_pa?: string;
  blog_or?: string;
}

interface BlogTranslations {
  [key: string]: BlogTranslation;
}

const LANGUAGE_NAMES = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  gu: "Gujarati",
  ta: "Tamil",
  kn: "Kannada",
  te: "Telugu",
  bn: "Bengali",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
};

const getUrlSlug = (text: string) => {
  return text.slice(0, 10).toLowerCase().replace(/\s+/g, "-");
};

const BlogDetail: React.FC = () => {
  const { blogId, language = "en" } = useParams<{
    blogId: string;
    language: string;
  }>();
  const [blog, setBlog] = useState<{
    id: string;
    data: BlogTranslation;
  } | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  useEffect(() => {
    const savedData = localStorage.getItem("blogTranslations");
    if (savedData && blogId) {
      const translations: BlogTranslations = JSON.parse(savedData);
      // Find the blog by matching the URL slug with the first 10 chars of each blog's English text
      const foundBlogEntry = Object.entries(translations).find(
        ([_, blogData]) => {
          const slug = getUrlSlug(blogData.blog_en);
          return slug === blogId;
        }
      );

      if (foundBlogEntry) {
        setBlog({ id: foundBlogEntry[0], data: foundBlogEntry[1] });
      }
    }
  }, [blogId]);

  useEffect(() => {
    setCurrentLanguage(language);
  }, [language]);

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Blog not found</h1>
          <Link
            to="/my-blogs"
            className="text-blue-500 hover:text-blue-600 mt-4 inline-block"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const currentText =
    blog.data[`blog_${currentLanguage}` as keyof BlogTranslation] ||
    blog.data.blog_en;
  const blogTitle = blog.data.blog_en.slice(0, 50) + "...";
  const urlSlug = getUrlSlug(blog.data.blog_en);

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>
          {blogTitle} |{" "}
          {LANGUAGE_NAMES[currentLanguage as keyof typeof LANGUAGE_NAMES]}
        </title>
        <meta name="description" content={blog.data.blog_en.slice(0, 160)} />
        <meta property="og:title" content={blogTitle} />
        <meta
          property="og:description"
          content={blog.data.blog_en.slice(0, 160)}
        />
        <link rel="canonical" href={`/blog/${urlSlug}/${currentLanguage}`} />
        {Object.keys(LANGUAGE_NAMES).map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`/blog/${urlSlug}/${lang}`}
          />
        ))}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: blogTitle,
            inLanguage: currentLanguage,
            author: {
              "@type": "Organization",
              name: "Indian Language Translation Model",
            },
            availableLanguages: Object.keys(LANGUAGE_NAMES).filter(
              (lang) => blog.data[`blog_${lang}` as keyof BlogTranslation]
            ),
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/my-blogs" className="text-blue-500 hover:text-blue-600">
              ← Back to Blogs
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(LANGUAGE_NAMES).map(([code, name]) => {
                if (blog.data[`blog_${code}` as keyof BlogTranslation]) {
                  return (
                    <Link
                      key={code}
                      to={`/blog/${urlSlug}/${code}`}
                      className={`px-3 py-1 rounded-full text-sm ${
                        currentLanguage === code
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {name}
                    </Link>
                  );
                }
                return null;
              })}
            </div>

            <article>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blogTitle}
              </h1>
              <div className="prose max-w-none">
                {currentText.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
