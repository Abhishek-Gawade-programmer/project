import React, { useState } from "react";
import { translateText } from "../services/openai";

interface Translation {
  language: string;
  text: string;
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

// Map full language names to their codes
const LANGUAGE_CODES: { [key: string]: string } = {
  Hindi: "hi",
  Marathi: "mr",
  Gujarati: "gu",
  Tamil: "ta",
  Kannada: "kn",
  Telugu: "te",
  Bengali: "bn",
  Malayalam: "ml",
  Punjabi: "pa",
  Odia: "or",
};

const BlogTranslationComponent: React.FC = () => {
  const [englishBlog, setEnglishBlog] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([]);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Create blog translation object with all languages
      const blogTranslations: { [key: string]: string } = {
        blog_en: englishBlog,
      };

      // Add translations for each language
      results.forEach(({ language, text }) => {
        const langCode = LANGUAGE_CODES[language];
        if (langCode) {
          blogTranslations[`blog_${langCode}`] = text;
        }
      });

      // Save to localStorage
      const savedData = localStorage.getItem("blogTranslations");
      const existingTranslations = savedData ? JSON.parse(savedData) : {};
      const blogId = Date.now().toString(); // Using timestamp as ID for simplicity

      const updatedTranslations = {
        ...existingTranslations,
        [blogId]: blogTranslations,
      };

      localStorage.setItem(
        "blogTranslations",
        JSON.stringify(updatedTranslations)
      );
      setTranslations(results);
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
        <h2 className="text-2xl font-bold">Blog Translation</h2>
      </div>

      <form onSubmit={handleTranslate} className="space-y-4">
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
          {isProcessing ? "Translating..." : "Translate"}
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
