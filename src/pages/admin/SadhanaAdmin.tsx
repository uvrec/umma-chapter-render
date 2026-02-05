// src/pages/admin/SadhanaAdmin.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Activity, Target, TrendingUp, Loader2 } from "lucide-react";

export default function SadhanaAdmin() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user sadhana configs
  const { data: sadhanaConfigs, isLoading: loadingConfigs } = useQuery({
    queryKey: ["admin-sadhana-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_sadhana_config")
        .select("*, profiles:user_id(email, full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch monthly stats
  const { data: monthlyStats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-sadhana-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_sadhana_monthly_stats")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Fetch recent daily entries
  const { data: recentEntries, isLoading: loadingEntries } = useQuery({
    queryKey: ["admin-sadhana-recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_sadhana_daily")
        .select("*, profiles:user_id(email, full_name)")
        .order("date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  // Calculate overview stats
  const totalUsers = sadhanaConfigs?.length || 0;
  const avgJapaTarget = sadhanaConfigs?.length
    ? Math.round(sadhanaConfigs.reduce((sum, c) => sum + (c.japa_rounds_target || 16), 0) / sadhanaConfigs.length)
    : 16;
  const activeUsers = recentEntries
    ? new Set(recentEntries.map(e => e.user_id)).size
    : 0;

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Садгана трекер" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Садгана трекер</h1>
          <p className="text-muted-foreground">
            Огляд статистики та налаштувань садгани користувачів
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всього користувачів</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                з налаштованою садганою
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активних цього тижня</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                робили записи
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Середня ціль джапи</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgJapaTarget} кіл</div>
              <p className="text-xs text-muted-foreground">
                на день
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Записів</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentEntries?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                останніх записів
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Огляд</TabsTrigger>
            <TabsTrigger value="users">Користувачі</TabsTrigger>
            <TabsTrigger value="entries">Записи</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика садгани</CardTitle>
                <CardDescription>
                  Загальний огляд активності користувачів
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : monthlyStats && monthlyStats.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Місяць</TableHead>
                        <TableHead>Джапа (всього)</TableHead>
                        <TableHead>Читання (хв)</TableHead>
                        <TableHead>Днів записів</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyStats.slice(0, 10).map((stat) => (
                        <TableRow key={`${stat.user_id}-${stat.year}-${stat.month}`}>
                          <TableCell>
                            {stat.month}/{stat.year}
                          </TableCell>
                          <TableCell>{stat.total_japa_rounds || 0}</TableCell>
                          <TableCell>{stat.total_reading_minutes || 0}</TableCell>
                          <TableCell>{stat.days_with_entries || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Статистики поки немає
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Налаштування користувачів</CardTitle>
                <CardDescription>
                  Цілі та налаштування садгани кожного користувача
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingConfigs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : sadhanaConfigs && sadhanaConfigs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Користувач</TableHead>
                        <TableHead>Джапа (ціль)</TableHead>
                        <TableHead>Читання (хв)</TableHead>
                        <TableHead>Підйом</TableHead>
                        <TableHead>Профіль</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sadhanaConfigs.map((config) => (
                        <TableRow key={config.id}>
                          <TableCell>
                            {(config.profiles as any)?.full_name || (config.profiles as any)?.email || config.user_id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{config.japa_rounds_target || 16} кіл</Badge>
                          </TableCell>
                          <TableCell>{config.reading_minutes_target || 30} хв</TableCell>
                          <TableCell>{config.wake_up_target || "—"}</TableCell>
                          <TableCell>
                            {config.is_public ? (
                              <Badge variant="default">Публічний</Badge>
                            ) : (
                              <Badge variant="outline">Приватний</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Користувачів з налаштованою садганою ще немає
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entries" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Останні записи</CardTitle>
                <CardDescription>
                  Нещодавні записи садгани від користувачів
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEntries ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : recentEntries && recentEntries.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Користувач</TableHead>
                        <TableHead>Джапа</TableHead>
                        <TableHead>Читання</TableHead>
                        <TableHead>Кіртан</TableHead>
                        <TableHead>Підйом</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {new Date(entry.date).toLocaleDateString("uk-UA")}
                          </TableCell>
                          <TableCell>
                            {(entry.profiles as any)?.full_name || entry.user_id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {(entry.japa_before_730 || 0) +
                                (entry.japa_before_10 || 0) +
                                (entry.japa_before_18 || 0) +
                                (entry.japa_after_18 || 0)} кіл
                            </Badge>
                          </TableCell>
                          <TableCell>{entry.reading_minutes || 0} хв</TableCell>
                          <TableCell>{entry.kirtan_minutes || 0} хв</TableCell>
                          <TableCell>{entry.wake_up_time || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Записів поки немає
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
