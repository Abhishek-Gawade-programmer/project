import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { translateText } from "../services/openai";
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

const BlogTranslationComponent: React.FC = () => {
  const [englishBlog, setEnglishBlog] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedTranslations, setSavedTranslations] = useState<BlogTranslations>(
    {}
  );

  useEffect(() => {
    const savedData = localStorage.getItem("blogTranslations");
    if (savedData) {
      setSavedTranslations(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const blogId = uuidv4();
      const translations: BlogTranslation = {
        blog_en: englishBlog,
      };

      // Translate to all supported languages
      const translationPromises = SUPPORTED_LANGUAGES.map(async (language) => {
        try {
          const translatedText = await translateText(englishBlog, language);
          const langCode = language.toLowerCase().slice(0, 2);
          return { langCode, text: translatedText };
        } catch (err) {
          console.error(`Translation failed for ${language}:`, err);
          return {
            langCode: language.toLowerCase().slice(0, 2),
            text: `Translation failed for ${language}`,
          };
        }
      });

      const results = await Promise.all(translationPromises);

      // Add translations to the object
      results.forEach(({ langCode, text }) => {
        translations[`blog_${langCode}` as keyof BlogTranslation] = text;
      });

      // Update translations object
      const updatedTranslations = {
        ...savedTranslations,
        [blogId]: translations,
      };

      // Save to localStorage
      localStorage.setItem(
        "blogTranslations",
        JSON.stringify(updatedTranslations)
      );

      // Save to JSON file
      const blob = new Blob(
        [JSON.stringify({ [blogId]: translations }, null, 2)],
        {
          type: "application/json",
        }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blog_${blogId.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSavedTranslations(updatedTranslations);
      setEnglishBlog("");
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create Blog Translation</h2>
        <Link to="/my-blogs" className="text-blue-500 hover:text-blue-600">
          View All Blogs
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            English Blog:
          </label>
          <textarea
            value={englishBlog}
            onChange={(e) => setEnglishBlog(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
            placeholder="Enter your blog text in English..."
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing || !englishBlog.trim()}
          className={`flex items-center px-4 py-2 rounded ${
            isProcessing || !englishBlog.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isProcessing ? "Translating..." : "Translate & Save"}
        </button>
      </form>

      {isProcessing && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">
            Translating your blog to all languages...
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogTranslationComponent;
