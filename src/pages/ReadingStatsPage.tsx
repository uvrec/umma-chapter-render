/**
 * ReadingStatsPage - User reading statistics dashboard
 *
 * Features:
 * - Total reading time and sessions
 * - Book progress with % completion
 * - Chapter progress visualization
 * - Daily reading activity chart
 * - Reading streak tracking
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  BookOpen,
  Clock,
  Calendar,
  TrendingUp,
  Target,
  Flame,
  ChevronRight,
  LogIn,
  BarChart3,
} from 'lucide-react';
import {
  getReadingStats,
  getBookProgress,
  getChapterProgress,
  getDailyReadingStats,
  BookProgress,
  ChapterProgress,
  ReadingStats,
} from '@/services/readingSessionService';
import { supabase } from '@/integrations/supabase/client';

// Format seconds to human readable
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}с`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}хв`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}г ${mins}хв` : `${hours}г`;
}

// Format date for chart
function formatDateShort(date: Date): string {
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
}

// Book progress colors
const BOOK_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

type TimeRange = '7d' | '14d' | '30d';

export default function ReadingStatsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [bookProgress, setBookProgress] = useState<BookProgress[]>([]);
  const [dailyStats, setDailyStats] = useState<Array<{ date: string; seconds: number; sessions: number }>>([]);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stats on mount
  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const [statsData, booksData] = await Promise.all([
          getReadingStats(user?.id),
          getBookProgress(user?.id),
        ]);

        setStats(statsData);
        setBookProgress(booksData);

        if (user?.id) {
          const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
          const daily = await getDailyReadingStats(user.id, days);
          setDailyStats(daily);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user?.id, timeRange]);

  // Fetch chapter progress when book selected
  useEffect(() => {
    if (!selectedBook) {
      setChapterProgress([]);
      return;
    }

    async function fetchChapters() {
      const chapters = await getChapterProgress(user?.id, selectedBook!);
      setChapterProgress(chapters);
    }

    fetchChapters();
  }, [selectedBook, user?.id]);

  // Chart data for daily reading
  const chartData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    const today = new Date();
    const result: Array<{ date: string; displayDate: string; minutes: number; sessions: number }> = [];

    // Create a map of daily stats
    const statsMap = new Map(dailyStats.map(d => [d.date, d]));

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = statsMap.get(dateStr);

      result.push({
        date: dateStr,
        displayDate: formatDateShort(date),
        minutes: existing ? Math.round(existing.seconds / 60) : 0,
        sessions: existing?.sessions || 0,
      });
    }

    return result;
  }, [dailyStats, timeRange]);

  // Pie chart data for book distribution
  const pieData = useMemo(() => {
    return bookProgress
      .filter(b => b.totalReadingSeconds > 0)
      .map((book, index) => ({
        name: book.bookTitle || book.bookSlug,
        value: book.totalReadingSeconds,
        color: BOOK_COLORS[index % BOOK_COLORS.length],
      }));
  }, [bookProgress]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <LogIn className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === 'ua' ? 'Увійдіть щоб переглянути статистику' : 'Sign in to view statistics'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === 'ua'
                ? 'Ваша статистика читання буде зберігатися та синхронізуватися між пристроями'
                : 'Your reading statistics will be saved and synced across devices'}
            </p>
            <Button asChild>
              <Link to="/auth">{language === 'ua' ? 'Увійти' : 'Sign In'}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {language === 'ua' ? 'Статистика читання' : 'Reading Statistics'}
        </h1>
        <div className="flex gap-2">
          {(['7d', '14d', '30d'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 днів' : range === '14d' ? '14 днів' : '30 днів'}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ua' ? 'Загальний час' : 'Total Time'}
                </p>
                <p className="text-xl font-bold">
                  {stats ? formatDuration(stats.totalReadingTime) : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ua' ? 'Глав прочитано' : 'Chapters Read'}
                </p>
                <p className="text-xl font-bold">{stats?.chaptersCompleted || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ua' ? 'Поточна серія' : 'Current Streak'}
                </p>
                <p className="text-xl font-bold">
                  {stats?.currentStreak || 0} {language === 'ua' ? 'д.' : 'd.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ua' ? 'Всього сесій' : 'Total Sessions'}
                </p>
                <p className="text-xl font-bold">{stats?.totalSessions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Daily Reading Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {language === 'ua' ? 'Час читання по днях' : 'Daily Reading Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}хв`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} хв`, 'Час читання']}
                    labelFormatter={(label) => label}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorMinutes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {language === 'ua' ? 'Розподіл по книгах' : 'Time by Book'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatDuration(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {pieData.map((entry, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <span
                        className="w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                {language === 'ua' ? 'Немає даних для відображення' : 'No data to display'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Book Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {language === 'ua' ? 'Прогрес по книгах' : 'Book Progress'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookProgress.length > 0 ? (
            <div className="space-y-4">
              {bookProgress.map((book) => (
                <div
                  key={book.bookSlug}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedBook === book.bookSlug
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedBook(
                    selectedBook === book.bookSlug ? null : book.bookSlug
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">{book.bookTitle || book.bookSlug}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{formatDuration(book.totalReadingSeconds)}</span>
                      <span>
                        {book.chaptersCompleted}/{book.totalChapters || '?'}{' '}
                        {language === 'ua' ? 'глав' : 'ch.'}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          selectedBook === book.bookSlug ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </div>
                  <Progress value={book.overallPercent} className="h-2" />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{Math.round(book.overallPercent)}% {language === 'ua' ? 'завершено' : 'complete'}</span>
                    {book.lastReadAt && (
                      <span>
                        {language === 'ua' ? 'Останнє читання:' : 'Last read:'}{' '}
                        {new Date(book.lastReadAt).toLocaleDateString('uk-UA')}
                      </span>
                    )}
                  </div>

                  {/* Chapter breakdown */}
                  {selectedBook === book.bookSlug && chapterProgress.length > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <p className="text-sm font-medium mb-2">
                        {language === 'ua' ? 'Прогрес по главах:' : 'Chapter Progress:'}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {chapterProgress.map((chapter) => (
                          <div
                            key={`${chapter.cantoNumber}-${chapter.chapterNumber}`}
                            className="p-2 rounded border bg-muted/30"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                {chapter.cantoNumber
                                  ? `${chapter.cantoNumber}.${chapter.chapterNumber}`
                                  : chapter.chapterNumber}
                              </span>
                              <Badge
                                variant={chapter.isCompleted ? 'default' : 'outline'}
                                className="text-xs"
                              >
                                {Math.round(chapter.percentRead)}%
                              </Badge>
                            </div>
                            <Progress value={chapter.percentRead} className="h-1 mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDuration(chapter.readingSeconds)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{language === 'ua' ? 'Почніть читати щоб відслідковувати прогрес' : 'Start reading to track your progress'}</p>
              <Button asChild className="mt-4">
                <Link to="/library">
                  {language === 'ua' ? 'Перейти до читання' : 'Start Reading'}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
