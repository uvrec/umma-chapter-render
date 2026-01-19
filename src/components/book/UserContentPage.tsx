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
  Tag,
  X,
  Plus,
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
import { Input } from "@/components/ui/input";
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
    return `/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verseNumber}`;
  }
  return `/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
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
    getAllNoteTags,
    addNoteTag,
  } = useUserContent();

  // State
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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

  // Get all available tags
  const allTags = getAllNoteTags();

  // Filter notes by selected tag
  const filteredNotes = selectedTag
    ? notes.filter((n) => n.tags?.includes(selectedTag))
    : notes;

  // Handle note edit
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setNoteTags(note.tags || []);
  };

  const handleSaveNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, noteContent, noteTags);
      setEditingNote(null);
      setNoteContent("");
      setNoteTags([]);
    }
  };

  // Handle adding tag to note
  const handleAddTagToNote = () => {
    const tag = newTagInput.trim().toLowerCase();
    if (tag && !noteTags.includes(tag)) {
      setNoteTags([...noteTags, tag]);
      addNoteTag(tag); // Also save to global tags list
    }
    setNewTagInput("");
  };

  const handleRemoveTagFromNote = (tag: string) => {
    setNoteTags(noteTags.filter((t) => t !== tag));
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
            {/* Tag filter */}
            {allTags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t("Фільтр по тегам:", "Filter by tags:")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedTag === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(null)}
                  >
                    {t("Всі", "All")} ({notes.length})
                  </Badge>
                  {allTags.map((tag) => {
                    const count = notes.filter((n) => n.tags?.includes(tag)).length;
                    if (count === 0) return null;
                    return (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      >
                        #{tag} ({count})
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredNotes.length === 0 ? (
              <EmptyState
                icon={StickyNote}
                title={selectedTag ? t("Немає нотаток з цим тегом", "No notes with this tag") : t("Немає нотаток", "No Notes")}
                description={selectedTag
                  ? t("Спробуйте вибрати інший тег або зняти фільтр.", "Try selecting a different tag or removing the filter.")
                  : t("Створюйте нотатки до віршів, щоб зберегти свої думки та роздуми.", "Create notes for verses to save your thoughts and reflections.")
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
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
                    {/* Tags display */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 pl-6">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-secondary/80"
                            onClick={() => setSelectedTag(tag)}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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
      <Dialog open={!!editingNote} onOpenChange={() => {
        setEditingNote(null);
        setNoteTags([]);
        setNewTagInput("");
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("Редагувати нотатку", "Edit Note")}</DialogTitle>
            <DialogDescription>
              {editingNote?.verseRef}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={t("Ваша нотатка...", "Your note...")}
              rows={5}
            />

            {/* Tags section */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {t("Теги", "Tags")}
              </label>

              {/* Current tags */}
              {noteTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {noteTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTagFromNote(tag)}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add new tag */}
              <div className="flex gap-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder={t("Новий тег...", "New tag...")}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTagToNote();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddTagToNote}
                  disabled={!newTagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggested tags */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-1">
                    {t("Швидкий вибір:", "Quick select:")}
                  </span>
                  {allTags
                    .filter((tag) => !noteTags.includes(tag))
                    .slice(0, 10)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer text-xs hover:bg-secondary"
                        onClick={() => {
                          if (!noteTags.includes(tag)) {
                            setNoteTags([...noteTags, tag]);
                          }
                        }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingNote(null);
              setNoteTags([]);
              setNewTagInput("");
            }}>
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
