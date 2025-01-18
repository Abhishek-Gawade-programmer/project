import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchBlogs } from "../utils/blogSearch";

interface BlogTranslation {
  blog_en: string;
  category: string;
  tags: string[];
  createdAt: string;
  author: string;
  [key: string]: any;
}

interface BlogTranslations {
  [key: string]: BlogTranslation;
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

const ExploreBlog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogTranslations>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogTranslations>({});

  useEffect(() => {
    const savedData = localStorage.getItem("blogTranslations");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setBlogs(parsedData);

      // Extract unique tags from all blogs
      const tags = new Set<string>();
      Object.values(parsedData).forEach((blog: any) => {
        if (blog.tags && Array.isArray(blog.tags)) {
          blog.tags.forEach((tag: string) => tags.add(tag));
        }
      });
      setAvailableTags(Array.from(tags));
    }
  }, []);

  useEffect(() => {
    const results = searchBlogs(
      blogs,
      searchTerm,
      selectedCategory,
      selectedTags
    );
    setFilteredBlogs(results);
  }, [blogs, searchTerm, selectedCategory, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getUrlSlug = (text: string) => {
    return text.slice(0, 10).toLowerCase().replace(/\s+/g, "-");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Blogs</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blogs in any language..."
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Filter by Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-gray-600 mb-4">
          Found {Object.keys(filteredBlogs).length} blogs
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filteredBlogs).map(([id, blog]) => {
          const urlSlug = getUrlSlug(blog.blog_en);
          return (
            <div
              key={id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {blog.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    by {blog.author}
                  </span>
                </div>

                <Link to={`/blog/${urlSlug}/en`} className="block mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 mb-2">
                    {blog.blog_en.slice(0, 50)}...
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{blog.blog_en}</p>
                </Link>

                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <span>Available in:</span>
                    <div className="flex -space-x-1">
                      {Object.entries(LANGUAGE_NAMES).map(([code, name]) => {
                        const key = `blog_${code}`;
                        if (blog[key]) {
                          return (
                            <Link
                              key={code}
                              to={`/blog/${urlSlug}/${code}`}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium hover:bg-blue-500 hover:text-white"
                              title={name}
                            >
                              {code.toUpperCase()}
                            </Link>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(filteredBlogs).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No blogs found matching your criteria.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreBlog;
