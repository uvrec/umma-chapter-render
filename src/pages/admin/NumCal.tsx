import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateNumCal, isValidBirthDate, NumCalResult } from "@/utils/numcal";

const NumCal = () => {
  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<NumCalResult | null>(null);
  const [error, setError] = useState<string>("");

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

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Нумерологія" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Нумерологічний калькулятор</h1>
          <p className="text-muted-foreground text-sm">
            Розрахунок чисел на основі дати народження
          </p>
        </div>

        {/* Форма введення */}
        <div className="flex items-end gap-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Дата народження</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-48"
            />
          </div>
          <Button onClick={handleCalculate}>Розрахувати</Button>
          {result && (
            <Button onClick={handleReset} variant="outline">
              Скинути
            </Button>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive mb-4">{error}</p>
        )}

        {/* Результати */}
        {result && (
          <div className="space-y-8">
            {/* Головний результат */}
            <div className="border rounded-lg p-6 bg-muted/30">
              <p className="text-sm text-muted-foreground mb-2">
                Результат для {birthDate.split('-').reverse().join('.')}
              </p>
              <div className="text-4xl font-mono font-bold tracking-wider">
                {result.formatted}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Розум — Дія — Реалізація — Підсумок
              </p>
            </div>

            {/* Числа */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Основні числа</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NumberBlock
                  title="Число Розуму"
                  number={result.mindNumber}
                  description="Мислення, бажання, сприйняття"
                />
                <NumberBlock
                  title="Число Дії"
                  number={result.actionNumber}
                  description="Прояв у соціумі, взаємодія"
                />
                <NumberBlock
                  title="Число Реалізації"
                  number={result.realizationNumber}
                  description="Призначення, сфери успіху"
                />
                <NumberBlock
                  title="Число Підсумку"
                  number={result.resultNumber}
                  extra={result.resultNumberDouble}
                  description="Життєвий урок (після 40 років)"
                />
              </div>
            </div>

            <Separator />

            {/* Цикли */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Цикли розвитку</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Кожна енергія розвивається через три етапи (+3 на кожному кроці)
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <CycleBlock
                  title="Розум"
                  numbers={result.cycles.mind.numbers}
                  color="blue"
                />
                <CycleBlock
                  title="Дія"
                  numbers={result.cycles.action.numbers}
                  color="green"
                />
                <CycleBlock
                  title="Реалізація"
                  numbers={result.cycles.realization.numbers}
                  color="purple"
                />
                <CycleBlock
                  title="Підсумок"
                  numbers={result.cycles.result.numbers}
                  color="amber"
                />
              </div>
            </div>

            <Separator />

            {/* Пояснення */}
            <div className="text-sm text-muted-foreground space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-1">Як працюють цикли</h3>
                <p>
                  Кожна енергія проходить три етапи. На кожному етапі до числа додається +3,
                  результат зводиться до однієї цифри. Після третього кроку цикл повертається
                  до початкового числа з набутими якостями.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-1">Приклад розвитку</h3>
                <p>
                  <strong>Число Дії 8:</strong> Людина може мати проблеми з контролем та делегуванням.
                  Цикл 8→2→5→8 показує шлях: спочатку навчитися довіряти (2), потім розширювати
                  комунікацію (5), і тоді розкриються кращі якості вісімки — стратегія та управління.
                </p>
              </div>

              <div className="p-3 rounded border border-destructive/30 bg-destructive/5">
                <strong className="text-destructive">Важливо:</strong> Цикли можуть розвиватися
                позитивно або негативно. Без свідомого розвитку через позитивні якості,
                автоматично проявляються негативні аспекти кожного числа.
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

function NumberBlock({
  title,
  number,
  description,
  extra
}: {
  title: string;
  number: number;
  description: string;
  extra?: number;
}) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{number}</span>
        {extra && (
          <Badge variant="secondary" className="text-xs">
            {extra}
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
}

function CycleBlock({
  title,
  numbers,
  color
}: {
  title: string;
  numbers: number[];
  color: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      <div className={`flex items-center gap-2 font-mono text-lg font-bold ${colorClasses[color]}`}>
        <span>{numbers[0]}</span>
        <span className="text-muted-foreground text-sm">→</span>
        <span>{numbers[1]}</span>
        <span className="text-muted-foreground text-sm">→</span>
        <span>{numbers[2]}</span>
        <span className="text-muted-foreground text-sm">→</span>
        <span>{numbers[0]}</span>
      </div>
    </div>
  );
}

export default NumCal;
