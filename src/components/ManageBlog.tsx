import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { translateText } from "../services/openai";

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

const SUPPORTED_LANGUAGES = [
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Kannada",
  "Telugu",
  "Bengali",
  "Malayalam",
  "Punjabi",
  "Odia",
];

const ManageBlog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogTranslations>({});
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("blogTranslations");
    if (savedData) {
      setBlogs(JSON.parse(savedData));
    }
  }, []);

  const handleDelete = (blogId: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const updatedBlogs = { ...blogs };
      delete updatedBlogs[blogId];
      localStorage.setItem("blogTranslations", JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
    }
  };

  const startEditing = (blogId: string) => {
    setEditingBlog(blogId);
    setEditedText(blogs[blogId].blog_en);
  };

  const cancelEditing = () => {
    setEditingBlog(null);
    setEditedText("");
  };

  const handleUpdate = async (blogId: string) => {
    setIsProcessing(true);
    try {
      // Translate the updated English text to all languages
      const translationPromises = SUPPORTED_LANGUAGES.map(async (language) => {
        try {
          const translatedText = await translateText(editedText, language);
          return {
            language,
            text: translatedText,
          };
        } catch (err) {
          console.error(`Translation failed for ${language}:`, err);
          return {
            language,
            text: `Translation failed for ${language}`,
          };
        }
      });

      const results = await Promise.all(translationPromises);

      // Create updated blog translation object
      const updatedTranslation: BlogTranslation = {
        blog_en: editedText,
      };

      // Add translations for each language
      results.forEach(({ language, text }) => {
        const langCode = language.toLowerCase().slice(0, 2);
        updatedTranslation[`blog_${langCode}` as keyof BlogTranslation] = text;
      });

      // Update blogs object
      const updatedBlogs = {
        ...blogs,
        [blogId]: updatedTranslation,
      };

      // Save to localStorage
      localStorage.setItem("blogTranslations", JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
      setEditingBlog(null);
      setEditedText("");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrlSlug = (text: string) => {
    return text.slice(0, 10).toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Link
          to="/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Blog
        </Link>
      </div>

      <div className="space-y-6">
        {Object.entries(blogs).map(([blogId, blog]) => (
          <div
            key={blogId}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              {editingBlog === blogId ? (
                <div className="space-y-4">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-2 border rounded h-32"
                    placeholder="Edit your blog text..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(blogId)}
                      disabled={isProcessing}
                      className={`px-4 py-2 rounded ${
                        isProcessing
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {isProcessing ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <Link
                      to={`/blog/${getUrlSlug(blog.blog_en)}/en`}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {blog.blog_en.slice(0, 50)}...
                    </Link>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(blogId)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blogId)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{blog.blog_en}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(LANGUAGE_NAMES).map(([code, name]) => {
                      const key = `blog_${code}` as keyof BlogTranslation;
                      if (blog[key]) {
                        return (
                          <Link
                            key={code}
                            to={`/blog/${getUrlSlug(blog.blog_en)}/${code}`}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {name}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {Object.keys(blogs).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found.</p>
            <Link
              to="/create"
              className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlog;
