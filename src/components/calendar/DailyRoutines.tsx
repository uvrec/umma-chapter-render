/**
 * DailyRoutines - NotePlan-like daily checklist component
 *
 * Features:
 * - Time-based routine items
 * - Checkboxes with completion tracking
 * - Value tracking (japa rounds, reading minutes)
 * - Quick task adding
 * - Daily notes
 */

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRoutines } from '@/hooks/useRoutines';
import { ROUTINE_CATEGORIES, type RoutineCategory } from '@/types/routines';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Check,
  Plus,
  Circle,
  Clock,
  BookOpen,
  Music,
  GraduationCap,
  Heart,
  Dumbbell,
  Brain,
  CircleDot,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Edit3,
} from 'lucide-react';

interface DailyRoutinesProps {
  selectedDate?: Date;
  className?: string;
  compact?: boolean;
}

// Icon mapping for categories
const categoryIcons: Record<RoutineCategory, React.ReactNode> = {
  japa: <CircleDot className="w-4 h-4" />,
  reading: <BookOpen className="w-4 h-4" />,
  service: <Heart className="w-4 h-4" />,
  exercise: <Dumbbell className="w-4 h-4" />,
  meditation: <Brain className="w-4 h-4" />,
  kirtan: <Music className="w-4 h-4" />,
  lecture: <GraduationCap className="w-4 h-4" />,
  custom: <Circle className="w-4 h-4" />,
};

export function DailyRoutines({ selectedDate, className, compact = false }: DailyRoutinesProps) {
  const { t, language } = useLanguage();
  const date = selectedDate || new Date();

  const {
    todayRoutines,
    todayTasks,
    todayNote,
    dailyData,
    isLoading,
    toggleRoutineCompletion,
    updateRoutineValue,
    getRoutineCompletion,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateNote,
  } = useRoutines(date);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(todayNote?.content || '');
  const [expandedRoutine, setExpandedRoutine] = useState<string | null>(null);

  // Format time display
  const formatTime = (time?: string) => {
    if (!time) return '';
    return time;
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      date: format(date, 'yyyy-MM-dd'),
      isRecurring: false,
      priority: 'medium',
      completed: false,
    });
    setNewTaskTitle('');
  };

  // Handle note save
  const handleNoteSave = () => {
    updateNote(noteContent);
  };

  // Group routines by time
  const groupedRoutines = useMemo(() => {
    const morning: typeof todayRoutines = [];
    const afternoon: typeof todayRoutines = [];
    const evening: typeof todayRoutines = [];
    const anytime: typeof todayRoutines = [];

    todayRoutines.forEach(routine => {
      if (!routine.startTime) {
        anytime.push(routine);
      } else {
        const hour = parseInt(routine.startTime.split(':')[0], 10);
        if (hour < 12) morning.push(routine);
        else if (hour < 17) afternoon.push(routine);
        else evening.push(routine);
      }
    });

    return { morning, afternoon, evening, anytime };
  }, [todayRoutines]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t('Завантаження...', 'Loading...')}
        </CardContent>
      </Card>
    );
  }

  const dateFormatted = format(date, 'd MMMM', {
    locale: language === 'ua' ? uk : undefined,
  });

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('Рутини', 'Routines')}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{dateFormatted}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {dailyData.completionPercent}%
            </div>
            <p className="text-xs text-muted-foreground">
              {dailyData.completedRoutines}/{dailyData.totalRoutines}
            </p>
          </div>
        </div>
        <Progress value={dailyData.completionPercent} className="h-2 mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Routine Groups */}
        {Object.entries(groupedRoutines).map(([period, routines]) => {
          if (routines.length === 0) return null;

          const periodLabels: Record<string, { ua: string; en: string }> = {
            morning: { ua: 'Ранок', en: 'Morning' },
            afternoon: { ua: 'День', en: 'Afternoon' },
            evening: { ua: 'Вечір', en: 'Evening' },
            anytime: { ua: 'Будь-коли', en: 'Anytime' },
          };

          return (
            <div key={period} className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t(periodLabels[period].ua, periodLabels[period].en)}
              </h4>

              {routines.map(routine => {
                const completion = getRoutineCompletion(routine.id);
                const isCompleted = completion?.completed || false;
                const currentValue = completion?.value;
                const categoryInfo = ROUTINE_CATEGORIES[routine.category];
                const isExpanded = expandedRoutine === routine.id;

                return (
                  <div
                    key={routine.id}
                    className={cn(
                      'group flex items-start gap-3 p-2 rounded-lg transition-colors',
                      isCompleted ? 'bg-primary/5' : 'hover:bg-muted/50'
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleRoutineCompletion(routine.id)}
                      className={cn(
                        'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 hover:border-primary'
                      )}
                      style={{
                        borderColor: isCompleted ? categoryInfo.color : undefined,
                        backgroundColor: isCompleted ? categoryInfo.color : undefined,
                      }}
                    >
                      {isCompleted && <Check className="w-3 h-3" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-muted-foreground"
                          style={{ color: categoryInfo.color }}
                        >
                          {categoryIcons[routine.category]}
                        </span>
                        <span
                          className={cn(
                            'font-medium text-sm',
                            isCompleted && 'line-through text-muted-foreground'
                          )}
                        >
                          {language === 'ua' && routine.title_ua
                            ? routine.title_ua
                            : routine.title}
                        </span>
                      </div>

                      {/* Time */}
                      {routine.startTime && (
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatTime(routine.startTime)}
                            {routine.endTime && ` - ${formatTime(routine.endTime)}`}
                          </span>
                        </div>
                      )}

                      {/* Value tracker (e.g., japa rounds) */}
                      {routine.trackValue && (
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            min={0}
                            max={routine.targetValue ? routine.targetValue * 2 : 100}
                            value={currentValue || ''}
                            onChange={(e) => updateRoutineValue(routine.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-7 text-sm"
                            placeholder="0"
                          />
                          <span className="text-xs text-muted-foreground">
                            / {routine.targetValue} {routine.unit}
                          </span>
                          {currentValue !== undefined && routine.targetValue && (
                            <Progress
                              value={Math.min((currentValue / routine.targetValue) * 100, 100)}
                              className="h-1.5 flex-1 max-w-[80px]"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Tasks Section */}
        <div className="space-y-2 pt-2 border-t">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            {t('Завдання', 'Tasks')}
            <Badge variant="secondary" className="text-xs">
              {todayTasks.filter(t => t.completed).length}/{todayTasks.length}
            </Badge>
          </h4>

          {/* Existing tasks */}
          {todayTasks.map(task => (
            <div
              key={task.id}
              className={cn(
                'group flex items-center gap-2 p-2 rounded-lg',
                task.completed ? 'bg-muted/30' : 'hover:bg-muted/50'
              )}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span
                className={cn(
                  'flex-1 text-sm',
                  task.completed && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add new task */}
          <div className="flex items-center gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder={t('Додати завдання...', 'Add task...')}
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes Section */}
        <div className="pt-2 border-t">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition"
          >
            <span className="flex items-center gap-2">
              <Edit3 className="w-3 h-3" />
              {t('Нотатки', 'Notes')}
            </span>
            {showNotes ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showNotes && (
            <div className="mt-2 space-y-2">
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                onBlur={handleNoteSave}
                placeholder={t(
                  'Записи дня, реалізації, подяки...',
                  'Daily reflections, realizations, gratitude...'
                )}
                className="min-h-[100px] text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {t('Автозбереження при виході з поля', 'Auto-saves when you click away')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DailyRoutines;
