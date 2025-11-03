import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Trash2, FileText, FileJson } from "lucide-react";
import { toast } from "sonner";
import { Highlight } from "@/hooks/useHighlights";

export default function Highlights() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);

  const { data: highlights, isLoading, refetch } = useQuery({
    queryKey: ["admin-highlights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("highlights")
        .select(`
          *,
          books:book_id (title_ua, title_en, slug),
          chapters:chapter_id (chapter_number, title_ua, title_en)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  const filteredHighlights = highlights?.filter((h) =>
    h.selected_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.verse_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Видалити це виділення?")) return;

    const { error } = await supabase
      .from("highlights")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Помилка при видаленні");
      return;
    }

    toast.success("Виділення видалено");
    refetch();
  };

  const exportToCSV = () => {
    if (!filteredHighlights?.length) {
      toast.error("Немає даних для експорту");
      return;
    }

    const headers = ["Книга", "Розділ", "Вірш", "Текст", "Нотатки", "Дата створення"];
    const rows = filteredHighlights.map((h) => [
      h.books?.title_ua || "",
      `Розділ ${h.chapters?.chapter_number}`,
      h.verse_number || "",
      h.selected_text.replace(/"/g, '""'),
      (h.notes || "").replace(/"/g, '""'),
      new Date(h.created_at).toLocaleDateString("uk-UA"),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `highlights_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Експорт завершено");
  };

  const exportToJSON = () => {
    if (!filteredHighlights?.length) {
      toast.error("Немає даних для експорту");
      return;
    }

    const data = filteredHighlights.map((h) => ({
      book: h.books?.title_ua,
      chapter: h.chapters?.chapter_number,
      verse: h.verse_number,
      text: h.selected_text,
      notes: h.notes,
      created_at: h.created_at,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `highlights_${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    toast.success("Експорт завершено");
  };

  const exportToText = () => {
    if (!filteredHighlights?.length) {
      toast.error("Немає даних для експорту");
      return;
    }

    const text = filteredHighlights
      .map((h) => {
        const parts = [
          `${h.books?.title_ua} - Розділ ${h.chapters?.chapter_number}`,
          h.verse_number ? `Вірш: ${h.verse_number}` : "",
          "",
          h.selected_text,
          "",
          h.notes ? `Нотатки: ${h.notes}` : "",
          `Дата: ${new Date(h.created_at).toLocaleDateString("uk-UA")}`,
          "-".repeat(80),
        ];
        return parts.filter(Boolean).join("\n");
      })
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `highlights_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();

    toast.success("Експорт завершено");
  };

  if (isLoading) {
    return <div className="p-8">Завантаження...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Виділення тексту</h1>
        <div className="flex gap-2">
          <Button onClick={exportToText} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            TXT
          </Button>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button onClick={exportToJSON} variant="outline" size="sm">
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      <Input
        placeholder="Пошук по тексту, нотаткам або номеру вірша..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-md"
      />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Книга</TableHead>
              <TableHead>Розділ</TableHead>
              <TableHead>Вірш</TableHead>
              <TableHead className="max-w-md">Текст</TableHead>
              <TableHead>Нотатки</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className="w-[100px]">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHighlights?.map((highlight) => (
              <TableRow key={highlight.id}>
                <TableCell className="font-medium">
                  {highlight.books?.title_ua}
                </TableCell>
                <TableCell>Розділ {highlight.chapters?.chapter_number}</TableCell>
                <TableCell>{highlight.verse_number || "-"}</TableCell>
                <TableCell className="max-w-md">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="text-left hover:underline line-clamp-2"
                        onClick={() => setSelectedHighlight(highlight)}
                      >
                        {highlight.selected_text}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Деталі виділення</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Текст:</h4>
                          <p className="text-sm">{highlight.selected_text}</p>
                        </div>
                        {highlight.context_before && (
                          <div>
                            <h4 className="font-semibold mb-2">Контекст до:</h4>
                            <p className="text-sm text-muted-foreground">
                              {highlight.context_before}
                            </p>
                          </div>
                        )}
                        {highlight.context_after && (
                          <div>
                            <h4 className="font-semibold mb-2">Контекст після:</h4>
                            <p className="text-sm text-muted-foreground">
                              {highlight.context_after}
                            </p>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold mb-2">Нотатки:</h4>
                          <Textarea
                            value={highlight.notes || ""}
                            readOnly
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="line-clamp-2 text-sm text-muted-foreground">
                    {highlight.notes || "-"}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(highlight.created_at).toLocaleDateString("uk-UA")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(highlight.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredHighlights?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Виділень не знайдено
        </div>
      )}
    </div>
  );
}
