import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TiptapEditor } from "@/components/blog/TiptapEditor";
import { Plus, Trash2, MoveUp, MoveDown, Type, FileText, Image, Music, Video, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type BlockType = "text" | "verse" | "heading" | "image" | "audio" | "video" | "divider";

export interface PageBlock {
  id: string;
  type: BlockType;
  content: {
    text_uk?: string;
    text_en?: string;
    level?: number;
    sanskrit?: string;
    transliteration?: string;
    synonyms?: string;
    translation_uk?: string;
    translation_en?: string;
    commentary_uk?: string;
    commentary_en?: string;
    display_blocks?: {
      sanskrit: boolean;
      transliteration: boolean;
      synonyms: boolean;
      translation: boolean;
      commentary: boolean;
    };
    url?: string;
    caption_uk?: string;
    caption_en?: string;
  };
  order: number;
}

interface PageBuilderProps {
  sections: PageBlock[];
  onChange: (sections: PageBlock[]) => void;
}

export function PageBuilder({ sections, onChange }: PageBuilderProps) {
  const [activeTab, setActiveTab] = useState<"uk" | "en">("uk");

  const addBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `block_${Date.now()}_${Math.random()}`,
      type,
      content: type === "verse" ? {
        display_blocks: {
          sanskrit: true,
          transliteration: true,
          synonyms: true,
          translation: true,
          commentary: true,
        }
      } : type === "heading" ? { level: 2 } : {},
      order: sections.length,
    };
    onChange([...sections, newBlock]);
  };

  const removeBlock = (id: string) => {
    onChange(sections.filter(b => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = sections.findIndex(b => b.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order
    newSections.forEach((block, i) => {
      block.order = i;
    });
    
    onChange(newSections);
  };

  const updateBlock = (id: string, updates: Partial<PageBlock>) => {
    onChange(sections.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const blockIcons: Record<BlockType, any> = {
    text: FileText,
    verse: Type,
    heading: Type,
    image: Image,
    audio: Music,
    video: Video,
    divider: Minus,
  };

  const blockLabels: Record<BlockType, string> = {
    text: "Текст",
    verse: "Вірш",
    heading: "Заголовок",
    image: "Зображення",
    audio: "Аудіо",
    video: "Відео",
    divider: "Розділювач",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Блоки контенту</h3>
        <Select onValueChange={(value) => addBlock(value as BlockType)}>
          <SelectTrigger className="w-[200px]">
            <Plus className="h-4 w-4 mr-2" />
            Додати блок
          </SelectTrigger>
          <SelectContent>
            {Object.entries(blockLabels).map(([type, label]) => {
              const Icon = blockIcons[type as BlockType];
              return (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {sections.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p>Додайте перший блок для побудови сторінки</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sections.map((block, index) => {
          const Icon = blockIcons[block.type];
          return (
            <Card key={block.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-base">{blockLabels[block.type]}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeBlock(block.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {block.type === "text" && (
                  <div className="space-y-4">
                    <div className="flex gap-2 border-b pb-2">
                      <Button
                        size="sm"
                        variant={activeTab === "uk" ? "default" : "ghost"}
                        onClick={() => setActiveTab("uk")}
                      >
                        Українська
                      </Button>
                      <Button
                        size="sm"
                        variant={activeTab === "en" ? "default" : "ghost"}
                        onClick={() => setActiveTab("en")}
                      >
                        English
                      </Button>
                    </div>
                    {activeTab === "uk" ? (
                      <TiptapEditor
                        content={block.content.text_uk || ""}
                        onChange={(val) => updateBlock(block.id, { content: { ...block.content, text_uk: val } })}
                        placeholder="Введіть текст українською..."
                      />
                    ) : (
                      <TiptapEditor
                        content={block.content.text_en || ""}
                        onChange={(val) => updateBlock(block.id, { content: { ...block.content, text_en: val } })}
                        placeholder="Enter text in English..."
                      />
                    )}
                  </div>
                )}

                {block.type === "heading" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Розмір</Label>
                      <Select
                        value={String(block.content.level || 2)}
                        onValueChange={(val) => updateBlock(block.id, { content: { ...block.content, level: Number(val) } })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map(level => (
                            <SelectItem key={level} value={String(level)}>H{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Текст (UK)</Label>
                      <Input
                        value={block.content.text_uk || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, text_uk: e.target.value } })}
                        placeholder="Заголовок українською"
                      />
                    </div>
                    <div>
                      <Label>Текст (EN)</Label>
                      <Input
                        value={block.content.text_en || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, text_en: e.target.value } })}
                        placeholder="Heading in English"
                      />
                    </div>
                  </div>
                )}

                {block.type === "verse" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Санскрит</Label>
                      <Textarea
                        value={block.content.sanskrit || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, sanskrit: e.target.value } })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Транслітерація</Label>
                      <Textarea
                        value={block.content.transliteration || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, transliteration: e.target.value } })}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Послівний переклад</Label>
                      <Textarea
                        value={block.content.synonyms || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, synonyms: e.target.value } })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Переклад (UK)</Label>
                      <TiptapEditor
                        content={block.content.translation_uk || ""}
                        onChange={(val) => updateBlock(block.id, { content: { ...block.content, translation_uk: val } })}
                      />
                    </div>
                    <div>
                      <Label>Переклад (EN)</Label>
                      <TiptapEditor
                        content={block.content.translation_en || ""}
                        onChange={(val) => updateBlock(block.id, { content: { ...block.content, translation_en: val } })}
                      />
                    </div>
                    <div>
                      <Label>Коментар (UK)</Label>
                      <TiptapEditor
                        content={block.content.commentary_uk || ""}
                        onChange={(val) => updateBlock(block.id, { content: { ...block.content, commentary_uk: val } })}
                      />
                    </div>
                    <div>
                      <Label>Коментар (EN)</Label>
                      <TiptapEditor
                        content={block.content.commentary_en || ""}
                        onChange={(val) => updateBlock(block.id, { content: { ...block.content, commentary_en: val } })}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <Label className="mb-3 block">Видимість блоків</Label>
                      <div className="space-y-2">
                        {["sanskrit", "transliteration", "synonyms", "translation", "commentary"].map((key) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{key}</span>
                            <Switch
                              checked={block.content.display_blocks?.[key as keyof typeof block.content.display_blocks] ?? true}
                              onCheckedChange={(checked) => updateBlock(block.id, {
                                content: {
                                  ...block.content,
                                  display_blocks: {
                                    ...block.content.display_blocks,
                                    [key]: checked,
                                  } as any
                                }
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {(block.type === "image" || block.type === "audio" || block.type === "video") && (
                  <div className="space-y-4">
                    <div>
                      <Label>URL</Label>
                      <Input
                        type="url"
                        value={block.content.url || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, url: e.target.value } })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Підпис (UK)</Label>
                      <Input
                        value={block.content.caption_uk || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, caption_uk: e.target.value } })}
                      />
                    </div>
                    <div>
                      <Label>Підпис (EN)</Label>
                      <Input
                        value={block.content.caption_en || ""}
                        onChange={(e) => updateBlock(block.id, { content: { ...block.content, caption_en: e.target.value } })}
                      />
                    </div>
                  </div>
                )}

                {block.type === "divider" && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    Горизонтальна лінія-розділювач
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
