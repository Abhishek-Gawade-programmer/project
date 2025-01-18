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
        {Object.entries(savedTranslations).map(([id, translation]) => (
          <div
            key={id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Blog #{id.slice(0, 8)}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {translation.blog_en}
                </p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{Object.keys(translation).length - 1} translations</span>
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
                    a.download = `blog_${id.slice(0, 8)}.json`;
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
            <div className="bg-gray-50 px-6 py-3">
              <button
                onClick={() => {
                  const el = document.createElement("textarea");
                  el.value = JSON.stringify(translation, null, 2);
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand("copy");
                  document.body.removeChild(el);
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Copy All Translations
              </button>
            </div>
          </div>
        ))}
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
