import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

// Zod schema for validation
const customWordSchema = z.object({
  script: z.string().trim().min(1, "Скрипт обов'язковий").max(100, "Максимум 100 символів"),
  iast: z.string().trim().min(1, "IAST обов'язковий").max(100, "Максимум 100 символів"),
  ukrainian: z.string().trim().min(1, "Переклад обов'язковий").max(200, "Максимум 200 символів"),
  meaning: z.string().trim().min(1, "Meaning обов'язковий").max(200, "Максимум 200 символів"),
});

type CustomWordFormData = z.infer<typeof customWordSchema>;

export interface CustomWordInput {
  script: string;
  iast: string;
  ukrainian: string;
  meaning: string;
}

interface AddCustomWordFormProps {
  onAdd: (word: CustomWordInput) => void;
  existingIasts: string[]; // For duplicate checking
}

export function AddCustomWordForm({ onAdd, existingIasts }: AddCustomWordFormProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const form = useForm<CustomWordFormData>({
    resolver: zodResolver(customWordSchema),
    defaultValues: {
      script: "",
      iast: "",
      ukrainian: "",
      meaning: "",
    },
  });

  const onSubmit = (data: CustomWordFormData) => {
    // Check for duplicates
    if (existingIasts.includes(data.iast.toLowerCase())) {
      form.setError("iast", {
        type: "manual",
        message: t("Це слово вже додано", "This word already exists"),
      });
      return;
    }

    onAdd(data);
    form.reset();
    setOpen(false);
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {t("Додати своє слово", "Add Custom Word")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Додати нове слово", "Add New Word")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("Скрипт (деванагарі/бенгалі)", "Script (Devanagari/Bengali)")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("напр. कृष्ण", "e.g. कृष्ण")}
                      className="text-2xl sanskrit-text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IAST</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("напр. kṛṣṇa", "e.g. kṛṣṇa")}
                      className="iast-text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ukrainian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Український переклад", "Ukrainian Translation")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("напр. Крішна", "e.g. Krishna")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Значення (англійською)", "Meaning (English)")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("напр. the all-attractive one", "e.g. the all-attractive one")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                {t("Скасувати", "Cancel")}
              </Button>
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {t("Додати", "Add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
