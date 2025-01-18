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

export const searchBlogs = (
  blogs: BlogTranslations,
  searchTerm: string,
  selectedCategory: string | null,
  selectedTags: string[]
): BlogTranslations => {
  const results: BlogTranslations = {};
  const searchTermLower = searchTerm.toLowerCase();

  Object.entries(blogs).forEach(([id, blog]) => {
    // Check category filter
    if (selectedCategory && blog.category !== selectedCategory) {
      return;
    }

    // Check tags filter
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every(tag => blog.tags.includes(tag));
      if (!hasAllTags) {
        return;
      }
    }

    // Search in all languages and metadata
    const matchesSearch = searchTerm === "" || Object.entries(blog).some(([key, value]) => {
      // Skip non-string values and metadata fields
      if (typeof value !== 'string' || ['createdAt', 'tags', 'category'].includes(key)) {
        return false;
      }
      return value.toLowerCase().includes(searchTermLower);
    }) || 
    // Search in tags
    blog.tags.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
    // Search in category
    blog.category.toLowerCase().includes(searchTermLower) ||
    // Search in author
    blog.author.toLowerCase().includes(searchTermLower);

    if (matchesSearch) {
      results[id] = blog;
    }
  });

  return results;
}; 