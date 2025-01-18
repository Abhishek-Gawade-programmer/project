import React, { useState } from "react";
import { translateText } from "../services/openai";

interface Translation {
  language: string;
  text: string;
}

interface BlogData {
  blog_en: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: string;
  [key: string]: any;
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

const CATEGORIES = [
  "Technology",
  "Travel",
  "Food",
  "Health",
  "Education",
  "Business",
  "Entertainment",
  "Sports",
  "Lifestyle",
  "Culture",
];

const SUGGESTED_TAGS = [
  "AI",
  "Machine Learning",
  "Web Development",
  "Mobile Apps",
  "Cloud Computing",
  "Data Science",
  "Blockchain",
  "IoT",
  "Cybersecurity",
  "Programming",
  "Indian Culture",
  "Festivals",
  "Traditions",
  "Food",
  "Travel",
  "Health",
  "Fitness",
  "Yoga",
  "Meditation",
  "Education",
];

const BlogTranslationComponent: React.FC = () => {
  const [englishBlog, setEnglishBlog] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  const handleTagClick = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleCustomTagAdd = () => {
    if (customTag && !tags.includes(customTag) && tags.length < 5) {
      setTags([...tags, customTag]);
      setCustomTag("");
    }
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || tags.length === 0 || !author.trim()) {
      alert("Please fill in all required fields (category, tags, and author)");
      return;
    }

    setIsProcessing(true);
    setTranslations([]);

    try {
      // Translate to all supported languages
      const translationPromises = SUPPORTED_LANGUAGES.map(async (language) => {
        try {
          const translatedText = await translateText(englishBlog, language);
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

      // Create blog data object with metadata
      const blogData: BlogData = {
        blog_en: englishBlog,
        category,
        tags,
        author,
        createdAt: new Date().toISOString(),
      };

      // Add translations for each language
      results.forEach(({ language, text }) => {
        const langCode = language.toLowerCase().slice(0, 2);
        blogData[`blog_${langCode}`] = text;
      });

      // Save to localStorage
      const savedData = localStorage.getItem("blogTranslations");
      const existingTranslations = savedData ? JSON.parse(savedData) : {};
      const blogId = Date.now().toString();

      const updatedTranslations = {
        ...existingTranslations,
        [blogId]: blogData,
      };

      localStorage.setItem(
        "blogTranslations",
        JSON.stringify(updatedTranslations)
      );
      setTranslations(results);

      // Reset form
      setEnglishBlog("");
      setCategory("");
      setTags([]);
      setAuthor("");
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Translation</h2>
      </div>

      <form onSubmit={handleTranslate} className="space-y-6">
        {/* Author Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Author Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter author name..."
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tags <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-2">
              (Select up to 5 tags)
            </span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-2 py-1 rounded-full text-sm ${
                  tags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Add custom tag..."
            />
            <button
              type="button"
              onClick={handleCustomTagAdd}
              disabled={!customTag || tags.length >= 5}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
            >
              Add Tag
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Selected Tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="ml-1 text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div>
          <label className="block text-sm font-medium mb-1">
            English Blog <span className="text-red-500">*</span>
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
          className={`w-full px-4 py-2 rounded ${
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

      {translations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Translations</h3>
          <div className="space-y-4">
            {translations.map((translation) => (
              <div key={translation.language} className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2">
                  {translation.language}
                </h4>
                <p className="text-gray-700">{translation.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTranslationComponent;
