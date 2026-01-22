/**
 * UserContentPage - Page for viewing Bookmarks, Notes, and Highlights
 * Based on BBT reference app design with tabs navigation
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  StickyNote,
  Highlighter,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { BookReaderHeader } from "@/components/BookReaderHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useUserContent,
  HIGHLIGHT_COLORS,
  type Bookmark as BookmarkType,
  type Note,
  type Highlight,
} from "@/contexts/UserContentContext";
import { cn } from "@/lib/utils";

interface UserContentPageProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
  initialTab?: "bookmarks" | "notes" | "highlights";
}

// Format date for display
const formatDate = (dateString: string, language: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Build verse URL
const buildVerseUrl = (
  bookSlug: string,
  cantoNumber: number | undefined,
  chapterNumber: number,
  verseNumber: string
) => {
  if (cantoNumber) {
    return `/veda-reader/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`;
  }
  return `/veda-reader/${bookSlug}/${chapterNumber}/${verseNumber}`;
};

export const UserContentPage = ({
  bookTitle,
  bookSlug,
  cantoNumber,
  initialTab = "bookmarks",
}: UserContentPageProps) => {
  const { language, t } = useLanguage();
  const {
    getBookmarksForBook,
    removeBookmark,
    getNotesForBook,
    updateNote,
    removeNote,
    getHighlightsForBook,
    removeHighlight,
    getStats,
  } = useUserContent();

  // State
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "bookmark" | "note" | "highlight";
    id: string;
    name: string;
  } | null>(null);

  // Get data for this book
  const bookmarks = getBookmarksForBook(bookSlug);
  const notes = getNotesForBook(bookSlug);
  const highlights = getHighlightsForBook(bookSlug);
  const stats = getStats(bookSlug);

  // Handle note edit
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
  };

  const handleSaveNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, noteContent);
      setEditingNote(null);
      setNoteContent("");
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (deleteTarget) {
      switch (deleteTarget.type) {
        case "bookmark":
          removeBookmark(deleteTarget.id);
          break;
        case "note":
          removeNote(deleteTarget.id);
          break;
        case "highlight":
          removeHighlight(deleteTarget.id);
          break;
      }
      setDeleteTarget(null);
    }
  };

  // Empty state component
  const EmptyState = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={t("Мої записи", "My Content")}
      />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="bookmarks" className="gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Закладки", "Bookmarks")}</span>
              {stats.bookmarks > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.bookmarks}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Нотатки", "Notes")}</span>
              {stats.notes > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.notes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="highlights" className="gap-2">
              <Highlighter className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Виділення", "Highlights")}</span>
              {stats.highlights > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {stats.highlights}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            {bookmarks.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title={t("Немає закладок", "No Bookmarks")}
                description={t(
                  "Додавайте закладки до віршів, щоб швидко повертатися до них пізніше.",
                  "Add bookmarks to verses to quickly return to them later."
                )}
              />
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border"
                  >
                    <Link
                      to={buildVerseUrl(
                        bookmark.bookSlug,
                        bookmark.cantoNumber,
                        bookmark.chapterNumber,
                        bookmark.verseNumber
                      )}
                      className="flex-1 group"
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4 text-primary" />
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {bookmark.verseRef}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {bookmark.title && (
                        <p className="text-sm text-muted-foreground mt-1 ml-6">
                          {bookmark.title}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        {formatDate(bookmark.createdAt, language)}
                      </p>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        setDeleteTarget({
                          type: "bookmark",
                          id: bookmark.id,
                          name: bookmark.verseRef,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            {notes.length === 0 ? (
              <EmptyState
                icon={StickyNote}
                title={t("Немає нотаток", "No Notes")}
                description={t(
                  "Створюйте нотатки до віршів, щоб зберегти свої думки та роздуми.",
                  "Create notes for verses to save your thoughts and reflections."
                )}
              />
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 bg-card rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        to={buildVerseUrl(
                          note.bookSlug,
                          note.cantoNumber,
                          note.chapterNumber,
                          note.verseNumber
                        )}
                        className="flex items-center gap-2 group"
                      >
                        <StickyNote className="h-4 w-4 text-primary" />
                        <span className="font-semibold group-hover:text-primary transition-colors">
                          {note.verseRef}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            setDeleteTarget({
                              type: "note",
                              id: note.id,
                              name: note.verseRef,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap pl-6">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 pl-6">
                      {t("Оновлено", "Updated")}: {formatDate(note.updatedAt, language)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Highlights Tab */}
          <TabsContent value="highlights">
            {highlights.length === 0 ? (
              <EmptyState
                icon={Highlighter}
                title={t("Немає виділень", "No Highlights")}
                description={t(
                  "Виділяйте важливі фрагменти тексту різними кольорами.",
                  "Highlight important text passages with different colors."
                )}
              />
            ) : (
              <div className="space-y-3">
                {highlights.map((highlight) => {
                  const colorConfig = HIGHLIGHT_COLORS.find((c) => c.id === highlight.color);
                  return (
                    <div key={highlight.id} className="p-4 bg-card rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <Link
                          to={buildVerseUrl(
                            highlight.bookSlug,
                            highlight.cantoNumber,
                            highlight.chapterNumber,
                            highlight.verseNumber
                          )}
                          className="flex items-center gap-2 group"
                        >
                          <Highlighter className="h-4 w-4 text-primary" />
                          <span className="font-semibold group-hover:text-primary transition-colors">
                            {highlight.verseRef}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {highlight.section}
                          </Badge>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            setDeleteTarget({
                              type: "highlight",
                              id: highlight.id,
                              name: highlight.verseRef,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-md text-sm",
                          colorConfig?.className || "bg-yellow-200"
                        )}
                      >
                        <p className="line-clamp-3">{highlight.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 pl-1">
                        {formatDate(highlight.createdAt, language)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Редагувати нотатку", "Edit Note")}</DialogTitle>
            <DialogDescription>
              {editingNote?.verseRef}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder={t("Ваша нотатка...", "Your note...")}
            rows={5}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              {t("Скасувати", "Cancel")}
            </Button>
            <Button onClick={handleSaveNote}>{t("Зберегти", "Save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Видалити?", "Delete?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                `Ви впевнені, що хочете видалити цей запис для ${deleteTarget?.name}?`,
                `Are you sure you want to delete this entry for ${deleteTarget?.name}?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Скасувати", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("Видалити", "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserContentPage;
