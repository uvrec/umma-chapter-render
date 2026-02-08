import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calculator, Copy, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { createBirthDate } from "@/utils/numerology/birthDateProcessor";
import { calculateNumerologyReading, getNumberInterpretation } from "@/utils/numerology/lifeNumberCalculator";
import { NumerologyReading } from "@/types/numerology";
import { trackNumerologyCalculation } from "@/services/numerologyTracking";

export default function NumerologyCalculator() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reading, setReading] = useState<NumerologyReading | null>(null);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleCalculate = () => {
    const birthDate = createBirthDate(day, month, year);

    if (!birthDate) {
      toast.error("Будь ласка, введіть коректну дату народження");
      return;
    }

    const numerologyReading = calculateNumerologyReading(birthDate);
    setReading(numerologyReading);
    setShowInterpretation(true);

    const d = String(birthDate.day).padStart(2, "0");
    const m = String(birthDate.month).padStart(2, "0");
    const y = String(birthDate.year);
    trackNumerologyCalculation({
      tool_type: "calculator",
      birth_date: `${y}-${m}-${d}`,
      mind_number: numerologyReading.numbers.consciousness,
      action_number: numerologyReading.numbers.action,
      realization_number: numerologyReading.numbers.realization,
      result_number: numerologyReading.numbers.lifeNumber,
      formatted: numerologyReading.notation,
    });

    toast.success("Розрахунок виконано!");
  };

  const handleClear = () => {
    setDay("");
    setMonth("");
    setYear("");
    setReading(null);
    setShowInterpretation(false);
  };

  const handleCopyResult = () => {
    if (!reading) return;

    const text = `Дата народження: ${day}.${month}.${year}
Числа: ${reading.notation}

Число Свідомості: ${reading.numbers.consciousness}
Число Дії: ${reading.numbers.action}
Число Реалізації: ${reading.numbers.realization}
Число Підсумку: ${reading.numbers.lifeNumber} (${reading.numbers.lifeNumberIntermediate})

${getNumberInterpretation(reading.numbers.consciousness)}
${getNumberInterpretation(reading.numbers.action)}
${getNumberInterpretation(reading.numbers.realization)}
${getNumberInterpretation(reading.numbers.lifeNumber)}`;

    navigator.clipboard.writeText(text);
    toast.success("Скопійовано в буфер обміну!");
  };

  const loadExample = () => {
    setDay("7");
    setMonth("1");
    setYear("2000");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Калькулятор Числа Підсумку
          </h1>
          <p className="text-lg text-muted-foreground">
            Розрахунок нумерологічних чисел за датою народження
          </p>
        </div>

        {/* Форма введення */}
        <div className="p-6 mb-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Введіть дату народження</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">День</Label>
                  <Input
                    id="day"
                    type="number"
                    min="1"
                    max="31"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="7"
                    className="text-center text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Місяць</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="1"
                    className="text-center text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Рік</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2000"
                    className="text-center text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCalculate} className="flex-1">
                <Calculator className="w-4 h-4 mr-2" />
                Розрахувати
              </Button>
              <Button onClick={handleClear} variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Очистити
              </Button>
              <Button onClick={loadExample} variant="outline">
                Приклад
              </Button>
            </div>
          </div>
        </div>

        {/* Результати */}
        {reading && (
          <div className="p-6 mb-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Результат розрахунку</h2>
                <p className="text-muted-foreground">
                  Дата народження: {day}.{month}.{year}
                </p>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Нумерологічна формула</div>
                  <div className="text-4xl font-bold font-mono">{reading.notation}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Свідомість - Дія - Реалізація - Підсумок
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Число Свідомості</div>
                  <div className="text-3xl font-bold text-primary">{reading.numbers.consciousness}</div>
                  <div className="text-xs text-muted-foreground mt-1">День народження: {day}</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Число Дії</div>
                  <div className="text-3xl font-bold text-primary">{reading.numbers.action}</div>
                  <div className="text-xs text-muted-foreground mt-1">Місяць народження: {month}</div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Число Реалізації</div>
                  <div className="text-3xl font-bold text-primary">{reading.numbers.realization}</div>
                  <div className="text-xs text-muted-foreground mt-1">Рік народження: {year}</div>
                </div>

                <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="text-sm text-muted-foreground">Число Підсумку</div>
                  <div className="text-3xl font-bold text-secondary">{reading.numbers.lifeNumber}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {reading.numbers.consciousness} + {reading.numbers.action} + {reading.numbers.realization} ={" "}
                    {reading.numbers.lifeNumberIntermediate} → {reading.numbers.lifeNumber}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCopyResult} variant="outline" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Копіювати результат
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Інтерпретація */}
        {reading && (
          <div className="p-6 mb-8">
            <Button
              onClick={() => setShowInterpretation(!showInterpretation)}
              variant="ghost"
              className="w-full justify-between text-lg font-semibold"
            >
              <span className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Інтерпретація чисел
              </span>
              <span className="text-muted-foreground">{showInterpretation ? "▲" : "▼"}</span>
            </Button>

            {showInterpretation && (
              <div className="mt-6 space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="font-semibold text-sm text-muted-foreground mb-1">
                    Число Свідомості: {reading.numbers.consciousness}
                  </div>
                  <p className="text-sm">{getNumberInterpretation(reading.numbers.consciousness)}</p>
                </div>

                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="font-semibold text-sm text-muted-foreground mb-1">
                    Число Дії: {reading.numbers.action}
                  </div>
                  <p className="text-sm">{getNumberInterpretation(reading.numbers.action)}</p>
                </div>

                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="font-semibold text-sm text-muted-foreground mb-1">
                    Число Реалізації: {reading.numbers.realization}
                  </div>
                  <p className="text-sm">{getNumberInterpretation(reading.numbers.realization)}</p>
                </div>

                <div className="border-l-4 border-secondary pl-4 py-2 bg-secondary/5">
                  <div className="font-semibold text-sm text-muted-foreground mb-1">
                    Число Підсумку: {reading.numbers.lifeNumber}
                  </div>
                  <p className="text-sm">{getNumberInterpretation(reading.numbers.lifeNumber)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Це ваш головний життєвий урок і ключ до набуття мудрості. Енергія цього числа активізується
                    у другій половині життя, після 40 років, але впливає протягом всього життя.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Інформація про розрахунок */}
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4">Про Число Підсумку</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Число Підсумку</strong> - це ваш головний життєвий урок і ключ до набуття мудрості та просвітлення.
              Воно відображає ту сферу життя, яка викликатиме у вас найбільший інтерес і стане предметом вашої постійної
              уваги та вивчення.
            </p>
            <p>
              Число Підсумку розраховується наступним чином:
            </p>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs">
              <div>Число Свідомості (день) + Число Дії (місяць) + Число Реалізації (рік) = Проміжна сума</div>
              <div className="mt-2">Проміжна сума зводиться до одної цифри = Число Підсумку</div>
            </div>
            <p>
              <strong>Приклад:</strong> Людина з датою народження 7.01.2000 має Число Свідомості 7, Число Дії 1,
              Число Реалізації 2. Розрахунок: 7 + 1 + 2 = 10, потім 1 + 0 = 1. Таким чином, Число Підсумку - 1.
            </p>
            <p>
              Число Підсумку найчастіше активізується у другій половині життя людини, після 40 років.
              Але при цьому ви відчуваєте фоновий вплив цієї енергії протягом усього життя.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
