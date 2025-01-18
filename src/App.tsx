import React, { useState } from "react";
import { Languages, FileText, Percent, AlertCircle } from "lucide-react";
import { translateText } from "./services/openai";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BlogTranslationComponent from "./components/BlogTranslation";
import MyBlogs from "./components/MyBlogs";
import BlogDetail from "./components/BlogDetail";

interface Translation {
  language: string;
  text: string;
  humanText?: string;
  bleuScore?: number;
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

function App() {
  const [inputText, setInputText] = useState("");
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError(null);
    setTranslations([]);

    try {
      const translationPromises = SUPPORTED_LANGUAGES.map(async (language) => {
        try {
          const translatedText = await translateText(inputText, language);
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
      setTranslations(results);
    } catch (err: any) {
      console.error("Translation error:", err);
      setError(
        err.message || "Failed to process translations. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  const updateHumanText = (language: string, text: string) => {
    setTranslations(
      translations.map((t) =>
        t.language === language ? { ...t, humanText: text } : t
      )
    );
  };

  const calculateBleuScore = (language: string) => {
    const translation = translations.find((t) => t.language === language);
    if (!translation?.humanText || !translation.text) return;

    // Split texts into words and normalize
    const referenceWords = translation.humanText.toLowerCase().split(/\s+/);
    const candidateWords = translation.text.toLowerCase().split(/\s+/);

    // Calculate word overlap (simple unigram precision)
    const matchingWords = candidateWords.filter((word) =>
      referenceWords.includes(word)
    );
    const precision = matchingWords.length / candidateWords.length;

    // Calculate brevity penalty
    const brevityPenalty = Math.exp(
      1 - referenceWords.length / candidateWords.length
    );

    // Calculate final BLEU score
    const score = precision * brevityPenalty;

    // Convert to percentage and ensure it's between 0-100
    const scorePercentage = Math.min(100, Math.round(score * 100));

    setTranslations(
      translations.map((t) =>
        t.language === language ? { ...t, bleuScore: scorePercentage } : t
      )
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-indigo-600 text-white py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Languages className="w-8 h-8" />
                <h1 className="text-2xl font-bold">
                  Indian Language Translation Model
                </h1>
              </div>
              <nav className="flex space-x-4">
                <Link to="/" className="text-white hover:text-indigo-200">
                  Home
                </Link>
                <Link to="/crea" className="text-white hover:text-indigo-200">
                  Create Blog
                </Link>
                <Link
                  to="/my-blogs"
                  className="text-white hover:text-indigo-200"
                >
                  My Blogs
                </Link>
              </nav>
            </div>
            <p className="mt-2 text-indigo-100">
              Transcribe English to 10 Indian Regional Languages
            </p>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main className="container mx-auto px-4 py-8">
                {/* Original translation UI */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  {/* Input Section */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Enter English Text or Upload File
                    </label>
                    <div className="flex gap-4 mb-4">
                      <textarea
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text to translate..."
                      />
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-600 cursor-pointer hover:bg-indigo-50">
                        <FileText className="w-5 h-5 mr-2" />
                        Upload File
                        <input
                          type="file"
                          className="hidden"
                          accept=".txt"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <button
                        onClick={handleTranslate}
                        disabled={isProcessing || !inputText.trim()}
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          isProcessing || !inputText.trim()
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                      >
                        {isProcessing
                          ? "Processing Translations..."
                          : "Translate"}
                      </button>
                    </div>
                    {file && (
                      <p className="mt-2 text-sm text-gray-600">
                        File loaded: {file.name}
                      </p>
                    )}
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                        {!import.meta.env.VITE_OPENAI_API_KEY && (
                          <p className="text-sm mt-2">
                            Please add your OpenAI API key to the .env file:
                            <br />
                            <code className="bg-red-100 px-2 py-1 rounded">
                              VITE_OPENAI_API_KEY=your_api_key_here
                            </code>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Results Section */}
                  {isProcessing ? (
                    <div className="border-t pt-6">
                      <h2 className="text-xl font-bold mb-4">
                        Translation Results
                      </h2>
                      <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-indigo-600">
                          Processing translations...
                        </span>
                      </div>
                    </div>
                  ) : (
                    translations.length > 0 && (
                      <div className="border-t pt-6">
                        <h2 className="text-xl font-bold mb-4">
                          Translation Results
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {translations.map((translation) => (
                            <div
                              key={translation.language}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="mb-2">
                                <h3 className="font-semibold text-lg">
                                  {translation.language}
                                </h3>
                              </div>
                              <p className="text-gray-700 mb-4">
                                {translation.text}
                              </p>
                              <div className="mt-4 border-t pt-4">
                                <label className="block text-gray-600 text-sm mb-2">
                                  Human Translation:
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={translation.humanText || ""}
                                    onChange={(e) =>
                                      updateHumanText(
                                        translation.language,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    placeholder={`Enter human translation for ${translation.language}...`}
                                  />
                                  <button
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm whitespace-nowrap"
                                    onClick={() =>
                                      calculateBleuScore(translation.language)
                                    }
                                    disabled={!translation.humanText}
                                  >
                                    Get BLEU Score
                                  </button>
                                </div>
                                {translation.bleuScore !== undefined && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">
                                      BLEU Score:{" "}
                                    </span>
                                    <span
                                      className={`${
                                        translation.bleuScore >= 80
                                          ? "text-green-600"
                                          : translation.bleuScore >= 60
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {translation.bleuScore}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* API Notice */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">
                        API Integration Notice
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>
                          This application uses OpenAI's GPT-3.5 model for
                          translations. Please note:
                        </p>
                        <ul className="list-disc ml-5 mt-2">
                          <li>
                            Translations are processed in parallel for faster
                            results
                          </li>
                          <li>
                            Accuracy scores are estimates based on model
                            confidence
                          </li>
                          <li>
                            For production use, consider fine-tuning the model
                            for better accuracy
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            }
          />
          <Route path="/crea" element={<BlogTranslationComponent />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/blog/:blogId/:language" element={<BlogDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
