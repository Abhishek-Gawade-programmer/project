import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAnalytics, formatDuration } from "../services/analytics";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BlogAnalyticsProps {
  blogId: string;
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

const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({ blogId }) => {
  const analytics = getAnalytics(blogId);

  const chartData = {
    labels: Object.entries(analytics.languageStats).map(
      ([code]) => LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES]
    ),
    datasets: [
      {
        label: "Views by Language",
        data: Object.values(analytics.languageStats),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Language Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Blog Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Unique Visitors */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-600 mb-2">
            Unique Visitors
          </h3>
          <p className="text-2xl font-bold text-blue-700">
            {analytics.uniqueVisitors}
          </p>
        </div>

        {/* Average Session Duration */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-600 mb-2">
            Avg. Session Duration
          </h3>
          <p className="text-2xl font-bold text-green-700">
            {formatDuration(analytics.averageSessionDuration)}
          </p>
        </div>

        {/* Total Sessions */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-600 mb-2">
            Total Sessions
          </h3>
          <p className="text-2xl font-bold text-purple-700">
            {analytics.totalSessions}
          </p>
        </div>
      </div>

      {/* Language Distribution Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Language Breakdown Table */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Language Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(analytics.languageStats).map(([code, views]) => {
                const totalViews = Object.values(
                  analytics.languageStats
                ).reduce((a, b) => a + b, 0);
                const percentage =
                  totalViews > 0 ? (views / totalViews) * 100 : 0;

                return (
                  <tr key={code}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogAnalytics;
