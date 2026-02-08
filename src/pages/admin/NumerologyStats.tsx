import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Users, Calendar, Loader2 } from "lucide-react";

interface NumerologyCalc {
  id: string;
  tool_type: string;
  birth_date: string;
  mind_number: number;
  action_number: number;
  realization_number: number;
  result_number: number;
  formatted: string | null;
  user_id: string | null;
  created_at: string;
}

export default function NumerologyStats() {
  const { data: calculations, isLoading } = useQuery({
    queryKey: ["admin-numerology-stats"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("numerology_calculations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as NumerologyCalc[];
    },
  });

  // Computed statistics
  const stats = useMemo(() => {
    if (!calculations || calculations.length === 0) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        byTool: { numcal: 0, calculator: 0 },
        numberDistribution: {} as Record<number, number>,
        byMonth: {} as Record<string, number>,
        topBirthMonths: [] as { month: number; count: number }[],
        recentCalculations: [] as NumerologyCalc[],
        loggedInUsers: 0,
      };
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

    const today = calculations.filter((c) => c.created_at.startsWith(todayStr)).length;
    const thisWeek = calculations.filter((c) => new Date(c.created_at) >= weekAgo).length;
    const thisMonth = calculations.filter((c) => new Date(c.created_at) >= monthAgo).length;

    const byTool = { numcal: 0, calculator: 0 };
    const numberDistribution: Record<number, number> = {};
    const birthMonthCounts: Record<number, number> = {};
    const byMonth: Record<string, number> = {};
    let loggedInUsers = 0;

    for (const calc of calculations) {
      // Tool type
      if (calc.tool_type === "numcal") byTool.numcal++;
      else byTool.calculator++;

      // Result number distribution (1-9)
      numberDistribution[calc.result_number] = (numberDistribution[calc.result_number] || 0) + 1;

      // Birth month distribution
      const birthMonth = new Date(calc.birth_date).getMonth() + 1;
      birthMonthCounts[birthMonth] = (birthMonthCounts[birthMonth] || 0) + 1;

      // Calculations per month
      const monthKey = calc.created_at.substring(0, 7); // YYYY-MM
      byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;

      // Logged-in users
      if (calc.user_id) loggedInUsers++;
    }

    const topBirthMonths = Object.entries(birthMonthCounts)
      .map(([month, count]) => ({ month: Number(month), count }))
      .sort((a, b) => b.count - a.count);

    return {
      total: calculations.length,
      today,
      thisWeek,
      thisMonth,
      byTool,
      numberDistribution,
      byMonth,
      topBirthMonths,
      recentCalculations: calculations.slice(0, 50),
      loggedInUsers,
    };
  }, [calculations]);

  const monthNames = [
    "", "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
  ];

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Статистика нумерології" },
  ];

  if (isLoading) {
    return (
      <AdminLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Статистика нумерології</h1>
          <p className="text-muted-foreground">
            Аналітика використання нумерологічних калькуляторів
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всього розрахунків</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                за весь час
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Сьогодні</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">
                цього тижня: {stats.thisWeek}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Цього місяця</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">
                розрахунків
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Залогінені</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loggedInUsers}</div>
              <p className="text-xs text-muted-foreground">
                з {stats.total} ({stats.total > 0 ? Math.round((stats.loggedInUsers / stats.total) * 100) : 0}%)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tool type breakdown + Number distribution */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* By Tool */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">За інструментом</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm">NumCal (розширений)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stats.byTool.numcal}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stats.total > 0 ? Math.round((stats.byTool.numcal / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.byTool.numcal / stats.total) * 100 : 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-sm">Калькулятор (простий)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{stats.byTool.calculator}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stats.total > 0 ? Math.round((stats.byTool.calculator / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.byTool.calculator / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Number Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Розподіл Числа Підсумку</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const count = stats.numberDistribution[num] || 0;
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={num} className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold w-4 text-center">{num}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary/70 h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Birth month distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Місяці народження користувачів</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {stats.topBirthMonths.map(({ month, count }) => (
                <div key={month} className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground">{monthNames[month]}</div>
                  <div className="text-lg font-bold">{count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculations per month */}
        {Object.keys(stats.byMonth).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Розрахунки по місяцях</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.byMonth)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 12)
                  .map(([month, count]) => {
                    const maxCount = Math.max(...Object.values(stats.byMonth));
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-sm font-mono w-20">{month}</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary/60 h-2 rounded-full transition-all"
                            style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent calculations table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Останні розрахунки</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentCalculations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Ще немає розрахунків. Дані з'являться після того, як користувачі почнуть використовувати калькулятор.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Інструмент</TableHead>
                    <TableHead>Дата народження</TableHead>
                    <TableHead>Результат</TableHead>
                    <TableHead>Користувач</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentCalculations.map((calc) => (
                    <TableRow key={calc.id}>
                      <TableCell className="text-sm">
                        {new Date(calc.created_at).toLocaleString("uk-UA", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={calc.tool_type === "numcal" ? "default" : "secondary"}>
                          {calc.tool_type === "numcal" ? "NumCal" : "Калькулятор"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {calc.birth_date.split("-").reverse().join(".")}
                      </TableCell>
                      <TableCell className="font-mono font-bold">
                        {calc.formatted || `${calc.mind_number}-${calc.action_number}-${calc.realization_number}-${calc.result_number}`}
                      </TableCell>
                      <TableCell>
                        {calc.user_id ? (
                          <Badge variant="outline" className="text-xs">залогінений</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">анонім</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
