import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateNumCal, isValidBirthDate, formatDate, NumCalResult } from "@/utils/numcal";
import { numberDescriptions, actionNumberDescriptions, realizationNumberDescriptions, resultNumberDescriptions, lastYearDigitDescriptions, personalYearDescriptions, personalMonthDescriptions, personalDayDescriptions } from "@/utils/numberDescriptions";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

/**
 * NumCal - Нумерологічний калькулятор
 * Розраховує 4 числа за датою народження
 */
const Numerology = () => {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [result, setResult] = useState<NumCalResult | null>(null);

  // Генеруємо масиви для селекторів
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: "1", label: "Січень" },
    { value: "2", label: "Лютий" },
    { value: "3", label: "Березень" },
    { value: "4", label: "Квітень" },
    { value: "5", label: "Травень" },
    { value: "6", label: "Червень" },
    { value: "7", label: "Липень" },
    { value: "8", label: "Серпень" },
    { value: "9", label: "Вересень" },
    { value: "10", label: "Жовтень" },
    { value: "11", label: "Листопад" },
    { value: "12", label: "Грудень" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

  const handleCalculate = () => {
    if (!day || !month || !year) {
      toast({
        title: "Помилка",
        description: "Будь ласка, оберіть день, місяць та рік народження",
        variant: "destructive",
      });
      return;
    }

    // Створюємо дату у форматі YYYY-MM-DD
    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const date = new Date(birthDate);

    if (!isValidBirthDate(date)) {
      toast({
        title: "Помилка",
        description: "Неправильна дата народження",
        variant: "destructive",
      });
      return;
    }

    const calculatedResult = calculateNumCal(date);
    setResult(calculatedResult);

    toast({
      title: "Розрахунок виконано",
      description: `Ваші числа: ${calculatedResult.formatted}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">NumCal - Нумерологічний калькулятор</h1>
        <p className="text-muted-foreground mb-8">
          Розрахунок чисел за датою народження
        </p>

        {/* Форма вводу */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Введіть дату народження</CardTitle>
            <CardDescription>
              Оберіть день, місяць та рік для розрахунку нумерологічних чисел
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* День */}
              <div>
                <Label htmlFor="day">День</Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger id="day" className="mt-2">
                    <SelectValue placeholder="День" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d} value={d.toString()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Місяць */}
              <div>
                <Label htmlFor="month">Місяць</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month" className="mt-2">
                    <SelectValue placeholder="Місяць" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Рік */}
              <div>
                <Label htmlFor="year">Рік</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year" className="mt-2">
                    <SelectValue placeholder="Рік" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Кнопка */}
              <div>
                <Button onClick={handleCalculate} size="lg" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Розрахувати
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
                  Дата народження: {day.padStart(2, '0')}.{month.padStart(2, '0')}.{year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-5xl font-bold mb-2 font-mono">
                    {result.formatted}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.mindNumber} - {result.actionNumber} - {result.realizationNumber} - {result.resultNumber}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Пояснення чисел */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Число Розуму */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Розуму (Свідомості)</CardTitle>
                  <CardDescription>День народження</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                    {result.mindNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Розраховується як день народження, зведений до однієї цифри.
                    Показує вашу природну схильність до мислення та сприйняття світу.
                  </p>
                </CardContent>
              </Card>

              {/* Число Дії */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Дії</CardTitle>
                  <CardDescription>Сума всіх цифр дати</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400">
                    {result.actionNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сума всіх цифр дати народження, зведена до однієї цифри.
                    Відображає вашу енергію дії та те, як ви діє в світі.
                  </p>
                </CardContent>
              </Card>

              {/* Число Реалізації */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Реалізації</CardTitle>
                  <CardDescription>Розум + Дія</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                    {result.realizationNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Сума Числа Розуму та Числа Дії.
                    Показує, як ви можете реалізувати свій потенціал у житті.
                  </p>
                </CardContent>
              </Card>

              {/* Число Підсумку */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Число Підсумку</CardTitle>
                  <CardDescription>Загальна сума всіх трьох чисел</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                      {result.resultNumber}
                    </div>
                    {result.resultNumberDouble && (
                      <div className="text-xl text-muted-foreground">
                        (з {result.resultNumberDouble})
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Сума всіх трьох чисел, зведена до однієї цифри.
                    Відображає загальний підсумок вашого життєвого шляху.
                    {result.resultNumberDouble && (
                      <span className="block mt-2 text-xs">
                        Двозначне число ({result.resultNumberDouble}) зберігається
                        для детального вивчення шляху
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Цикли розвитку енергії */}
            <Card className="border-2 border-primary/20 mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Цикли розвитку енергії</CardTitle>
                <CardDescription>
                  Кожна енергія розвивається через проходження трьох етапів (+3 на кожному кроці)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Цикл Розуму */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Розуму</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.cycles.mind.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.mind.description}
                    </p>
                  </div>

                  {/* Цикл Дії */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Дії</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.cycles.action.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.action.description}
                    </p>
                  </div>

                  {/* Цикл Реалізації */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Реалізації</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.cycles.realization.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.realization.description}
                    </p>
                  </div>

                  {/* Цикл Підсумку */}
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                    <h4 className="font-semibold mb-2">Цикл розвитку Підсумку</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[0]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[1]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[2]}
                      </span>
                      <span className="text-lg">→</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {result.cycles.result.numbers[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.cycles.result.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Як працюють цикли:</strong> Кожна енергія розвивається, проходячи три етапи.
                    На кожному етапі до числа додається +3, і результат зводиться до однієї цифри.
                    Після третього кроку цикл повертається до початкового числа, але вже з новими якостями,
                    набутими на попередніх етапах.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Життєве завдання - Остання цифра року */}
            {lastYearDigitDescriptions[result.lastYearDigit] && (
              <Card className="border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 mt-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <span className="text-3xl">🎯</span>
                    Ваше Життєве Завдання
                  </CardTitle>
                  <CardDescription className="text-base">
                    Остання цифра року народження: <strong>{result.lastYearDigit}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-white/50 dark:bg-black/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      {lastYearDigitDescriptions[result.lastYearDigit].title}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {lastYearDigitDescriptions[result.lastYearDigit].mainDescription}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                        <span>✨</span> Позитивні аспекти
                      </h4>
                      <p className="text-sm">{lastYearDigitDescriptions[result.lastYearDigit].positiveAspects}</p>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                        <span>⚠️</span> Негативні аспекти
                      </h4>
                      <p className="text-sm">{lastYearDigitDescriptions[result.lastYearDigit].negativeAspects}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                      <span>📖</span> Життєвий урок
                    </h4>
                    <p className="text-sm">{lastYearDigitDescriptions[result.lastYearDigit].lifeLesson}</p>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                      <span>💡</span> Підказка для гармонізації
                    </h4>
                    <p className="text-sm italic">{lastYearDigitDescriptions[result.lastYearDigit].nextStepHint}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Грошовий код */}
            <Card className="border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 mt-6">
              <CardHeader>
                <CardTitle className="text-2xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <span className="text-3xl">💰</span>
                  Ваш Грошовий Код
                </CardTitle>
                <CardDescription className="text-base">
                  Особистий 4-цифровий код для фінансового успіху
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h3 className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 tracking-wider">
                    {result.moneyCode.code}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-2">
                    Цей код розраховано з вашої дати народження
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {result.moneyCode.digit1}
                    </div>
                    <p className="text-xs text-muted-foreground">День народження</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {result.moneyCode.digit2}
                    </div>
                    <p className="text-xs text-muted-foreground">Місяць народження</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {result.moneyCode.digit3}
                    </div>
                    <p className="text-xs text-muted-foreground">Рік народження</p>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {result.moneyCode.digit4}
                    </div>
                    <p className="text-xs text-muted-foreground">Сума перших трьох</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                    <span>💡</span> Як використовувати грошовий код?
                  </h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Використовуйте як PIN-код для банківських карток</li>
                    <li>Встановіть як пароль для фінансових додатків</li>
                    <li>Використовуйте в номерах телефонів або адресах</li>
                    <li>Медитуйте на ці цифри під час фінансових рішень</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Персональні цикли */}
            <Card className="border-2 border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 mt-6">
              <CardHeader>
                <CardTitle className="text-2xl text-violet-700 dark:text-violet-300 flex items-center gap-2">
                  <span className="text-3xl">🌟</span>
                  Ваші Персональні Цикли
                </CardTitle>
                <CardDescription className="text-base">
                  Енергія поточного року, місяця та дня
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Персональний рік */}
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200 dark:border-violet-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-violet-700 dark:text-violet-300">
                      Персональний Рік: {result.personalYear}
                    </h3>
                    <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {result.personalYear}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {personalYearDescriptions[result.personalYear].title}
                  </h4>
                  <p className="text-sm mb-3 whitespace-pre-line">
                    {personalYearDescriptions[result.personalYear].description}
                  </p>
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <h5 className="font-semibold text-sm mb-1">Рекомендації:</h5>
                    <p className="text-sm">{personalYearDescriptions[result.personalYear].recommendations}</p>
                  </div>
                </div>

                {/* Персональний місяць */}
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200 dark:border-violet-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-violet-700 dark:text-violet-300">
                      Персональний Місяць: {result.personalMonth}
                    </h3>
                    <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {result.personalMonth}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {personalMonthDescriptions[result.personalMonth].title}
                  </h4>
                  <p className="text-sm mb-3 whitespace-pre-line">
                    {personalMonthDescriptions[result.personalMonth].description}
                  </p>
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <h5 className="font-semibold text-sm mb-1">Рекомендації:</h5>
                    <p className="text-sm">{personalMonthDescriptions[result.personalMonth].recommendations}</p>
                  </div>
                </div>

                {/* Персональний день */}
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-violet-200 dark:border-violet-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-violet-700 dark:text-violet-300">
                      Персональний День: {result.personalDay}
                    </h3>
                    <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {result.personalDay}
                    </span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {personalDayDescriptions[result.personalDay].title}
                  </h4>
                  <p className="text-sm mb-3 whitespace-pre-line">
                    {personalDayDescriptions[result.personalDay].description}
                  </p>
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <h5 className="font-semibold text-sm mb-1">Рекомендації на сьогодні:</h5>
                    <p className="text-sm">{personalDayDescriptions[result.personalDay].recommendations}</p>
                  </div>
                </div>

                <div className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
                  <h4 className="font-semibold text-violet-700 dark:text-violet-300 mb-2 flex items-center gap-2">
                    <span>💡</span> Про персональні цикли
                  </h4>
                  <p className="text-sm">
                    Кожен рік, місяць та день має свою унікальну енергію, яка впливає на ваше життя.
                    Персональний рік показує загальну енергію всього року (цикл з 9 років).
                    Персональний місяць показує енергію поточного місяця в контексті вашого року.
                    Персональний день показує енергію сьогоднішнього дня та підказує, чим краще займатися.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Детальні описи чисел */}
            <div className="space-y-6 mt-8">
              <h2 className="text-2xl font-bold">Детальний опис ваших чисел</h2>

              {/* Число Розуму (Свідомості) */}
              {numberDescriptions[result.mindNumber] && (
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
                      Число Розуму (Свідомості) {result.mindNumber}
                    </CardTitle>
                    <CardDescription>
                      {numberDescriptions[result.mindNumber].birthDates}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{numberDescriptions[result.mindNumber].mainDescription}</p>
                    </div>

                    {/* Опис конкретної дати народження */}
                    {numberDescriptions[result.mindNumber].specificDates && (
                      (() => {
                        const birthDay = parseInt(day, 10);
                        const specificDate = numberDescriptions[result.mindNumber].specificDates?.find(
                          (d) => d.date === birthDay
                        );
                        if (specificDate) {
                          return (
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h4 className="font-semibold mb-2">Народжені {specificDate.date} числа:</h4>
                              <p className="whitespace-pre-line">{specificDate.description}</p>
                            </div>
                          );
                        }
                        return null;
                      })()
                    )}

                    {numberDescriptions[result.mindNumber].planet && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Планета-покровитель:</h4>
                          <p>{numberDescriptions[result.mindNumber].planet}</p>
                        </div>
                        {numberDescriptions[result.mindNumber].luckyDay && (
                          <div>
                            <h4 className="font-semibold mb-2">Щасливий день:</h4>
                            <p>{numberDescriptions[result.mindNumber].luckyDay}</p>
                          </div>
                        )}
                        {numberDescriptions[result.mindNumber].luckyStone && (
                          <div>
                            <h4 className="font-semibold mb-2">Щасливий камінь:</h4>
                            <p>{numberDescriptions[result.mindNumber].luckyStone}</p>
                          </div>
                        )}
                        {numberDescriptions[result.mindNumber].luckyColor && (
                          <div>
                            <h4 className="font-semibold mb-2">Щасливий колір:</h4>
                            <p>{numberDescriptions[result.mindNumber].luckyColor}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].karmicTasks && (
                      <div>
                        <h4 className="font-semibold mb-2">Кармічні завдання:</h4>
                        <p>{numberDescriptions[result.mindNumber].karmicTasks}</p>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.mindNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.mindNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].professions && (
                      <div>
                        <h4 className="font-semibold mb-2">Сприятливі професії та сфери діяльності:</h4>
                        <div className="flex flex-wrap gap-2">
                          {numberDescriptions[result.mindNumber].professions?.map((profession, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                              {profession}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {numberDescriptions[result.mindNumber].additionalInfo && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="whitespace-pre-line">{numberDescriptions[result.mindNumber].additionalInfo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Число Дії */}
              {actionNumberDescriptions[result.actionNumber] && (
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600 dark:text-green-400">
                      Число Дії {result.actionNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{actionNumberDescriptions[result.actionNumber].mainDescription}</p>
                    </div>

                    {actionNumberDescriptions[result.actionNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {actionNumberDescriptions[result.actionNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {actionNumberDescriptions[result.actionNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {actionNumberDescriptions[result.actionNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Число Реалізації */}
              {realizationNumberDescriptions[result.realizationNumber] && (
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-600 dark:text-purple-400">
                      Число Реалізації {result.realizationNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{realizationNumberDescriptions[result.realizationNumber].mainDescription}</p>
                    </div>

                    {realizationNumberDescriptions[result.realizationNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {realizationNumberDescriptions[result.realizationNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {realizationNumberDescriptions[result.realizationNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {realizationNumberDescriptions[result.realizationNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Число Підсумку */}
              {resultNumberDescriptions[result.resultNumber] && (
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-amber-600 dark:text-amber-400">
                      Число Підсумку {result.resultNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-line">{resultNumberDescriptions[result.resultNumber].mainDescription}</p>
                    </div>

                    {resultNumberDescriptions[result.resultNumber].positiveQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Позитивні якості:</h4>
                        <div className="flex flex-wrap gap-2">
                          {resultNumberDescriptions[result.resultNumber].positiveQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resultNumberDescriptions[result.resultNumber].negativeQualities && (
                      <div>
                        <h4 className="font-semibold mb-2">Негативні якості (які треба опрацьовувати):</h4>
                        <div className="flex flex-wrap gap-2">
                          {resultNumberDescriptions[result.resultNumber].negativeQualities?.map((quality, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Numerology;
