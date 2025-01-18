import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

const MyBlogs: React.FC = () => {
  const [savedTranslations, setSavedTranslations] = useState<BlogTranslations>(
    {}
  );

  useEffect(() => {
    const savedData = localStorage.getItem("blogTranslations");
    if (savedData) {
      setSavedTranslations(JSON.parse(savedData));
    }
  }, []);

  const getUrlSlug = (text: string) => {
    return text.slice(0, 10).toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Translated Blogs</h1>
        <Link
          to="/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(savedTranslations).map(([id, translation]) => {
          const urlSlug = getUrlSlug(translation.blog_en);
          const availableLanguages = Object.keys(translation).filter(
            (key) =>
              key !== "blog_en" && translation[key as keyof BlogTranslation]
          );

          return (
            <div
              key={id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="mb-4">
                  <Link to={`/blog/${urlSlug}/en`} className="block">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-600">
                      {translation.blog_en.slice(0, 50)}...
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {translation.blog_en}
                    </p>
                  </Link>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Available in:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/blog/${urlSlug}/en`}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      English
                    </Link>
                    {availableLanguages.map((lang) => {
                      const langCode = lang.split("_")[1];
                      return (
                        <Link
                          key={lang}
                          to={`/blog/${urlSlug}/${langCode}`}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {
                            LANGUAGE_NAMES[
                              langCode as keyof typeof LANGUAGE_NAMES
                            ]
                          }
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-gray-500">
                  <span>{availableLanguages.length + 1} languages</span>
                  <button
                    onClick={() => {
                      const translations = { [id]: translation };
                      const blob = new Blob(
                        [JSON.stringify(translations, null, 2)],
                        {
                          type: "application/json",
                        }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `blog_${urlSlug}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Download JSON
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(savedTranslations).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No blogs found. Start by creating a new blog!
          </p>
          <Link
            to="/create"
            className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Your First Blog
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
