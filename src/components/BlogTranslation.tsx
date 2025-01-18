import React, { useState, useEffect } from "react";

interface BlogTranslation {
  blog_en: string;
  blog_hi: string;
}

interface BlogTranslations {
  [key: string]: BlogTranslation;
}

const BlogTranslationComponent: React.FC = () => {
  const [blogId, setBlogId] = useState<string>("");
  const [englishBlog, setEnglishBlog] = useState<string>("");
  const [hindiBlog, setHindiBlog] = useState<string>("");
  const [savedTranslations, setSavedTranslations] = useState<BlogTranslations>(
    {}
  );

  // Load saved translations from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("blogTranslations");
    if (savedData) {
      setSavedTranslations(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new translation entry
    const newTranslation: BlogTranslation = {
      blog_en: englishBlog,
      blog_hi: hindiBlog,
    };

    // Update translations object
    const updatedTranslations = {
      ...savedTranslations,
      [blogId]: newTranslation,
    };

    // Save to localStorage
    localStorage.setItem(
      "blogTranslations",
      JSON.stringify(updatedTranslations)
    );
    setSavedTranslations(updatedTranslations);

    // Clear form
    setBlogId("");
    setEnglishBlog("");
    setHindiBlog("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Blog Translation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Blog ID:</label>
          <input
            type="text"
            value={blogId}
            onChange={(e) => setBlogId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            English Blog:
          </label>
          <textarea
            value={englishBlog}
            onChange={(e) => setEnglishBlog(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hindi Blog:</label>
          <textarea
            value={hindiBlog}
            onChange={(e) => setHindiBlog(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Translation
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Saved Translations</h3>
        {Object.entries(savedTranslations).map(([id, translation]) => (
          <div key={id} className="border p-4 mb-4 rounded">
            <h4 className="font-bold">Blog ID: {id}</h4>
            <div className="mt-2">
              <p className="font-medium">English:</p>
              <p className="ml-4">{translation.blog_en}</p>
            </div>
            <div className="mt-2">
              <p className="font-medium">Hindi:</p>
              <p className="ml-4">{translation.blog_hi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogTranslationComponent;
