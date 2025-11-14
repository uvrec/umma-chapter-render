import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator } from "lucide-react";
import { calculateNumCal, isValidBirthDate, formatDate, NumCalResult } from "@/utils/numcal";

const NumCal = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<NumCalResult | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const handleCalculate = () => {
    setError("");
    setResult(null);

    if (!birthDate) {
      setError("Будь ласка, введіть дату народження");
      return;
    }

    const date = new Date(birthDate);

    if (!isValidBirthDate(date)) {
      setError("Невалідна дата народження");
      return;
    }

    const calculatedResult = calculateNumCal(date);
    setResult(calculatedResult);
  };

  const handleReset = () => {
    setBirthDate("");
    setResult(null);
    setError("");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до панелі адміністратора
        </Button>

        <h1 className="text-3xl font-bold mb-2">NumCal - Нумерологічний калькулятор</h1>
        <p className="text-muted-foreground">
          Розрахунок нумерологічних чисел на основі дати народження
        </p>
      </div>

      <div className="grid gap-6">
        {/* Форма введення */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Введіть дату народження
            </CardTitle>
            <CardDescription>
              Формат: день.місяць.рік (наприклад: 07.01.2000)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Дата народження</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="max-w-md"
                />
              </div>

              {error && (
                <div className="text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleCalculate}>
                  Розрахувати
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Скинути
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Результати */}
        {result && (
          <>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Результат</CardTitle>
                <CardDescription>
                  Дата народження: {formatDate(new Date(birthDate))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-5xl font-bold mb-2 font-mono">
                    {result.formatted}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Число Ума - Число Действия - Число Реализации - Число Итога
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Детальна інформація */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Ума (Сознания)</CardTitle>
                  <CardDescription>
                    Як людина мислить, її бажання та базові характеристики
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.mindNumber}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Ума визначає Ваше мировоззрение, желания і сприйняття себе
                      та навколишнього світу. Воно відображає Ваші вроджені таланти,
                      схильності та унікальні якості особистості.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Действия</CardTitle>
                  <CardDescription>
                    Як людина діє та досягає результатів
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.actionNumber}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Действия показує, як Ви проявляєте себе в соціумі та
                      взаємодієте з людьми і обставинами для досягнення своїх цілей.
                      Це Ваша головна життєва енергія.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Реализации</CardTitle>
                  <CardDescription>
                    Сфери максимального успіху та реалізації
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.realizationNumber}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Реализації розкриває Ваше істинне призначення та місію в
                      цьому житті. Воно вказує на ті сфери діяльності та напрямки,
                      в яких Ви можете найбільш повно реалізувати свої таланти.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Итога</CardTitle>
                  <CardDescription>
                    Головний життєвий урок та мудрість
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {result.resultNumber}
                    {result.resultNumberDouble && (
                      <span className="text-lg text-muted-foreground ml-2">
                        ({result.resultNumberDouble})
                      </span>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      Число Итога — це Ваш головний життєвий урок та ключ до обретення
                      мудрості. Воно відображає ту сферу життя, яка викликатиме у Вас
                      найбільший інтерес. Активізується після 40 років.
                    </p>
                    {result.resultNumberDouble && (
                      <p className="mt-2 text-xs">
                        * Двозначне число {result.resultNumberDouble} має значення
                        для детального вивчення шляху
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Приклад інтерпретації */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Приклад інтерпретації</CardTitle>
                <CardDescription>
                  Загальна характеристика на основі розрахованих чисел
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Свідомість ({result.mindNumber}):</strong> Базовий тип мислення
                  та сприйняття світу визначається енергією числа {result.mindNumber}.
                </p>
                <p>
                  <strong>Дії ({result.actionNumber}):</strong> У діях людина проявляє
                  енергію числа {result.actionNumber}, що визначає її стиль досягнення цілей.
                </p>
                <p>
                  <strong>Реалізація ({result.realizationNumber}):</strong> Найкраще
                  реалізується через енергію числа {result.realizationNumber}.
                </p>
                <p>
                  <strong>Итог ({result.resultNumber}):</strong> Життя постійно повертає
                  до теми числа {result.resultNumber}, розвиваючи відповідні якості.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  Примітка: Детальні описи для кожного числа будуть додані пізніше.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default NumCal;
