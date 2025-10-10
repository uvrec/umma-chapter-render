import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Settings, List, Eye } from "lucide-react";
import { UploadStep } from "@/components/admin/import/UploadStep";
import { MappingStep } from "@/components/admin/import/MappingStep";
import { ChapterPickerStep } from "@/components/admin/import/ChapterPickerStep";
import { PreviewStep } from "@/components/admin/import/PreviewStep";
import { ParsedChapter, ImportTemplate } from "@/types/book-import";

type Step = "upload" | "mapping" | "chapters" | "preview";

export default function ImportWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [extractedText, setExtractedText] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<ImportTemplate | null>(null);
  const [chapters, setChapters] = useState<ParsedChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ParsedChapter | null>(null);

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: "upload", label: "Завантаження", icon: Upload },
    { id: "mapping", label: "Налаштування", icon: Settings },
    { id: "chapters", label: "Вибір глави", icon: List },
    { id: "preview", label: "Попередній перегляд", icon: Eye },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold">Імпорт глави з книги</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Steps indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStepIndex === index;
              const isCompleted = currentStepIndex > index;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="p-6">
          {currentStep === "upload" && (
            <UploadStep
              onNext={(text) => {
                setExtractedText(text);
                setCurrentStep("mapping");
              }}
            />
          )}

          {currentStep === "mapping" && (
            <MappingStep
              extractedText={extractedText}
              onNext={(template, parsedChapters) => {
                setSelectedTemplate(template);
                setChapters(parsedChapters);
                setCurrentStep("chapters");
              }}
              onBack={() => setCurrentStep("upload")}
            />
          )}

          {currentStep === "chapters" && (
            <ChapterPickerStep
              chapters={chapters}
              onNext={(chapter) => {
                setSelectedChapter(chapter);
                setCurrentStep("preview");
              }}
              onBack={() => setCurrentStep("mapping")}
            />
          )}

          {currentStep === "preview" && selectedChapter && (
            <PreviewStep
              chapter={selectedChapter}
              allChapters={chapters} // обов’язково додай цей проп
              onBack={() => setCurrentStep("chapters")}
              onComplete={() => navigate("/admin/dashboard")}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
