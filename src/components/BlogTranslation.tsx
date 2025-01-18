import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translateText } from "../services/openai";
import AudioUpload from "./AudioUpload";

interface BlogTranslation {
  blog_en: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: string;
  [key: string]: any;
}

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

const BlogTranslationComponent: React.FC = () => {
  const navigate = useNavigate();
  const [blogText, setBlogText] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTag, setCurrentTag] = useState("");

  const handleTranscriptionComplete = (text: string) => {
    setBlogText(text);
  };

  const handleTagAdd = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogText || !category || tags.length === 0 || !author) {
      alert("Please fill in all required fields");
      return;
    }

    setIsTranslating(true);
    try {
      const translations = await Promise.all([
        translateText(blogText, "Hindi"),
        translateText(blogText, "Marathi"),
        translateText(blogText, "Gujarati"),
        translateText(blogText, "Tamil"),
        translateText(blogText, "Kannada"),
        translateText(blogText, "Telugu"),
        translateText(blogText, "Bengali"),
        translateText(blogText, "Malayalam"),
        translateText(blogText, "Punjabi"),
        translateText(blogText, "Odia"),
      ]);

      const blogData: BlogTranslation = {
        blog_en: blogText,
        blog_hi: translations[0],
        blog_mr: translations[1],
        blog_gu: translations[2],
        blog_ta: translations[3],
        blog_kn: translations[4],
        blog_te: translations[5],
        blog_bn: translations[6],
        blog_ml: translations[7],
        blog_pa: translations[8],
        blog_or: translations[9],
        category,
        tags,
        author,
        createdAt: new Date().toISOString(),
      };

      const savedBlogs = JSON.parse(
        localStorage.getItem("blogTranslations") || "{}"
      );
      const blogId = Date.now().toString();
      savedBlogs[blogId] = blogData;
      localStorage.setItem("blogTranslations", JSON.stringify(savedBlogs));

      navigate("/my-blogs");
    } catch (error) {
      console.error("Translation error:", error);
      alert("Error translating blog. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AudioUpload onTranscriptionComplete={handleTranscriptionComplete} />

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Blog Content in English
          </label>
          <textarea
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Enter your blog content or use audio upload..."
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Author Name
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        <div>
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a tag"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isTranslating}
          className={`w-full py-3 rounded-lg text-white font-medium
            ${
              isTranslating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {isTranslating ? "Translating..." : "Create and Translate Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogTranslationComponent;
