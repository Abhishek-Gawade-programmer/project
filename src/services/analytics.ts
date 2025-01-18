interface BlogAnalytics {
  uniqueVisitors: number;
  languageStats: {
    [key: string]: number;  // language code -> view count
  };
  averageSessionDuration: number;
  totalSessions: number;
  totalDuration: number;
  lastVisit?: number;
}

interface BlogAnalyticsStore {
  [blogId: string]: BlogAnalytics;
}

const ANALYTICS_STORAGE_KEY = 'blogAnalytics';

// Initialize analytics for a blog if not exists
const initializeBlogAnalytics = (blogId: string): BlogAnalytics => {
  return {
    uniqueVisitors: 0,
    languageStats: {},
    averageSessionDuration: 0,
    totalSessions: 0,
    totalDuration: 0
  };
};

// Get analytics data from localStorage
export const getAnalytics = (blogId: string): BlogAnalytics => {
  const analytics: BlogAnalyticsStore = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '{}');
  return analytics[blogId] || initializeBlogAnalytics(blogId);
};

// Save analytics data to localStorage
const saveAnalytics = (blogId: string, data: BlogAnalytics) => {
  const analytics: BlogAnalyticsStore = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '{}');
  analytics[blogId] = data;
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
};

// Track a blog view
export const trackBlogView = (blogId: string, language: string) => {
  const analytics = getAnalytics(blogId);
  const now = Date.now();
  
  // Update language stats
  analytics.languageStats[language] = (analytics.languageStats[language] || 0) + 1;
  
  // Update unique visitors (using date as simple unique identifier)
  const lastVisitDate = analytics.lastVisit ? new Date(analytics.lastVisit).toDateString() : '';
  const currentDate = new Date(now).toDateString();
  if (lastVisitDate !== currentDate) {
    analytics.uniqueVisitors++;
  }
  
  analytics.lastVisit = now;
  saveAnalytics(blogId, analytics);
};

// Start tracking session duration
export const startSession = (blogId: string) => {
  return Date.now();
};

// End session and update analytics
export const endSession = (blogId: string, startTime: number) => {
  const analytics = getAnalytics(blogId);
  const duration = (Date.now() - startTime) / 1000; // Convert to seconds
  
  analytics.totalSessions++;
  analytics.totalDuration += duration;
  analytics.averageSessionDuration = analytics.totalDuration / analytics.totalSessions;
  
  saveAnalytics(blogId, analytics);
};

// Get all blogs analytics
export const getAllBlogsAnalytics = (): BlogAnalyticsStore => {
  return JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '{}');
};

// Format duration in seconds to readable string
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}; 