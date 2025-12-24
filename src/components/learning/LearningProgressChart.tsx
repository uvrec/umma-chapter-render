/**
 * LearningProgressChart - Displays learning activity over time
 *
 * Features:
 * - Line chart showing reviews per day
 * - Accuracy percentage trend
 * - Heatmap-style activity calendar (optional)
 * - Responsive design
 */

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Clock,
  Target,
  LogIn,
} from 'lucide-react';

interface LearningActivity {
  activity_date: string;
  reviews_count: number;
  correct_count: number;
  words_added: number;
  verses_added: number;
  time_spent_seconds: number;
}

interface LearningProgressChartProps {
  activityData: LearningActivity[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

type ChartType = 'reviews' | 'accuracy' | 'items';
type TimeRange = '7d' | '14d' | '30d';

export function LearningProgressChart({
  activityData,
  isLoading = false,
  onRefresh,
}: LearningProgressChartProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [chartType, setChartType] = useState<ChartType>('reviews');
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');

  // Filter data by time range
  const filteredData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Create a map of existing data
    const dataMap = new Map(
      activityData.map(d => [d.activity_date, d])
    );

    // Fill in missing days with zeros
    const result: (LearningActivity & { accuracy: number; displayDate: string })[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = dataMap.get(dateStr);

      result.push({
        activity_date: dateStr,
        displayDate: formatDateShort(date),
        reviews_count: existing?.reviews_count ?? 0,
        correct_count: existing?.correct_count ?? 0,
        words_added: existing?.words_added ?? 0,
        verses_added: existing?.verses_added ?? 0,
        time_spent_seconds: existing?.time_spent_seconds ?? 0,
        accuracy: existing && existing.reviews_count > 0
          ? Math.round((existing.correct_count / existing.reviews_count) * 100)
          : 0,
      });
    }

    return result;
  }, [activityData, timeRange]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalReviews = filteredData.reduce((sum, d) => sum + d.reviews_count, 0);
    const totalCorrect = filteredData.reduce((sum, d) => sum + d.correct_count, 0);
    const totalWordsAdded = filteredData.reduce((sum, d) => sum + d.words_added, 0);
    const totalVersesAdded = filteredData.reduce((sum, d) => sum + d.verses_added, 0);
    const totalTime = filteredData.reduce((sum, d) => sum + d.time_spent_seconds, 0);
    const activeDays = filteredData.filter(d => d.reviews_count > 0).length;

    return {
      totalReviews,
      totalCorrect,
      accuracy: totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0,
      totalWordsAdded,
      totalVersesAdded,
      totalTimeMinutes: Math.round(totalTime / 60),
      activeDays,
      avgReviewsPerDay: activeDays > 0 ? Math.round(totalReviews / activeDays) : 0,
    };
  }, [filteredData]);

  // Format date for display
  function formatDateShort(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-popover border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {getMetricLabel(entry.dataKey)}: {entry.value}
            {entry.dataKey === 'accuracy' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  };

  function getMetricLabel(dataKey: string): string {
    switch (dataKey) {
      case 'reviews_count':
        return t('Повторень', 'Reviews');
      case 'correct_count':
        return t('Правильно', 'Correct');
      case 'accuracy':
        return t('Точність', 'Accuracy');
      case 'words_added':
        return t('Слів', 'Words');
      case 'verses_added':
        return t('Віршів', 'Verses');
      default:
        return dataKey;
    }
  }

  // If not logged in, show login prompt
  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <LogIn className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('Увійдіть для перегляду статистики', 'Sign in to view statistics')}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {t(
              'Графіки прогресу доступні для авторизованих користувачів',
              'Progress charts are available for authenticated users'
            )}
          </p>
          <Button asChild>
            <a href="/auth">{t('Увійти', 'Sign In')}</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">
            {t('Графік прогресу', 'Progress Chart')}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Time range selector */}
          <div className="flex gap-1">
            {(['7d', '14d', '30d'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? t('7 днів', '7 days') :
                 range === '14d' ? t('14 днів', '14 days') :
                 t('30 днів', '30 days')}
              </Button>
            ))}
          </div>

          {/* Chart type selector */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={chartType === 'reviews' ? 'default' : 'outline'}
              onClick={() => setChartType('reviews')}
              title={t('Повторення', 'Reviews')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={chartType === 'accuracy' ? 'default' : 'outline'}
              onClick={() => setChartType('accuracy')}
              title={t('Точність', 'Accuracy')}
            >
              <Target className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={chartType === 'items' ? 'default' : 'outline'}
              onClick={() => setChartType('items')}
              title={t('Додано елементів', 'Items Added')}
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {summary.totalReviews}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('Повторень', 'Reviews')}
          </div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {summary.accuracy}%
          </div>
          <div className="text-xs text-muted-foreground">
            {t('Точність', 'Accuracy')}
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {summary.activeDays}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('Активних днів', 'Active Days')}
          </div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {summary.totalWordsAdded + summary.totalVersesAdded}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('Додано елементів', 'Items Added')}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {t('Немає даних для відображення', 'No data to display')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'reviews' ? (
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="reviews_count"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name={t('Повторень', 'Reviews')}
                />
                <Bar
                  dataKey="correct_count"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name={t('Правильно', 'Correct')}
                />
              </BarChart>
            ) : chartType === 'accuracy' ? (
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#accuracyGradient)"
                  name={t('Точність', 'Accuracy')}
                />
              </AreaChart>
            ) : (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="words_added"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                  name={t('Слів', 'Words')}
                />
                <Line
                  type="monotone"
                  dataKey="verses_added"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                  name={t('Віршів', 'Verses')}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center text-sm">
        {chartType === 'reviews' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span>{t('Повторень', 'Reviews')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>{t('Правильно', 'Correct')}</span>
            </div>
          </>
        )}
        {chartType === 'accuracy' && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>{t('Точність %', 'Accuracy %')}</span>
          </div>
        )}
        {chartType === 'items' && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span>{t('Слова', 'Words')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span>{t('Вірші', 'Verses')}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/**
 * Activity Heatmap Component - Optional calendar-style view
 */
interface ActivityHeatmapProps {
  activityData: LearningActivity[];
}

export function ActivityHeatmap({ activityData }: ActivityHeatmapProps) {
  const { t } = useLanguage();

  // Create a 7x5 grid for the last 35 days
  const cells = useMemo(() => {
    const dataMap = new Map(
      activityData.map(d => [d.activity_date, d.reviews_count])
    );

    const result: { date: string; count: number; dayOfWeek: number }[] = [];
    const today = new Date();

    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) ?? 0;

      result.push({
        date: dateStr,
        count,
        dayOfWeek: date.getDay(),
      });
    }

    return result;
  }, [activityData]);

  // Get color intensity based on count
  function getColorClass(count: number): string {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count < 5) return 'bg-green-200 dark:bg-green-900';
    if (count < 15) return 'bg-green-400 dark:bg-green-700';
    if (count < 30) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-600 dark:bg-green-500';
  }

  const weekDays = ['Н', 'П', 'В', 'С', 'Ч', 'П', 'С'];

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-primary" />
        <h4 className="font-medium text-sm">
          {t('Активність за 35 днів', 'Activity (35 days)')}
        </h4>
      </div>

      <div className="flex gap-1">
        {/* Week day labels */}
        <div className="flex flex-col gap-1 mr-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-xs text-muted-foreground h-4 flex items-center">
              {i % 2 === 0 ? day : ''}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((week) => (
            <div key={week} className="flex flex-col gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const index = week * 7 + day;
                const cell = cells[index];
                if (!cell) return <div key={day} className="w-4 h-4" />;

                return (
                  <div
                    key={day}
                    className={`w-4 h-4 rounded-sm ${getColorClass(cell.count)} cursor-pointer transition-transform hover:scale-125`}
                    title={`${cell.date}: ${cell.count} ${t('повторень', 'reviews')}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>{t('Менше', 'Less')}</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
        </div>
        <span>{t('Більше', 'More')}</span>
      </div>
    </Card>
  );
}
