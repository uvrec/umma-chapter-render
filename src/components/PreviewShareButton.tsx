// PreviewShareButton.tsx - Button for admins to generate preview links for unpublished content
import { useState } from 'react';
import { Share2, Copy, Check, Clock, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePreviewToken, ResourceType } from '@/hooks/usePreviewToken';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PreviewShareButtonProps {
  resourceType: ResourceType;
  resourceId: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

export function PreviewShareButton({
  resourceType,
  resourceId,
  className,
  variant = 'ghost',
  size = 'icon',
}: PreviewShareButtonProps) {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const { generatePreviewLink, isGenerating } = usePreviewToken();
  const [showDialog, setShowDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState<number | ''>('');
  const [note, setNote] = useState('');

  // Only show for admins
  if (!isAdmin) return null;

  const handleQuickShare = async (days?: number) => {
    const link = await generatePreviewLink(resourceType, resourceId, {
      expiresInDays: days,
    });
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomShare = async () => {
    const link = await generatePreviewLink(resourceType, resourceId, {
      expiresInDays: expiresInDays || undefined,
      note: note || undefined,
    });
    if (link) {
      setGeneratedLink(link);
    }
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resourceLabel = {
    book: t('книгу', 'book'),
    canto: t('пісню', 'canto'),
    chapter: t('главу', 'chapter'),
    verse: t('вірш', 'verse'),
  }[resourceType];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn('text-amber-600 hover:text-amber-700', className)}
            title={t('Поділитися превью', 'Share preview')}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onClick={() => handleQuickShare()}
            disabled={isGenerating}
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t('Безстрокове посилання', 'Permanent link')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleQuickShare(7)}
            disabled={isGenerating}
          >
            <Clock className="mr-2 h-4 w-4" />
            {t('На 7 днів', 'For 7 days')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleQuickShare(30)}
            disabled={isGenerating}
          >
            <Clock className="mr-2 h-4 w-4" />
            {t('На 30 днів', 'For 30 days')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <Copy className="mr-2 h-4 w-4" />
            {t('Налаштувати...', 'Customize...')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('Створити превью-посилання', 'Create preview link')}
            </DialogTitle>
            <DialogDescription>
              {t(
                `Створіть приватне посилання на ${resourceLabel} для перегляду неопублікованого контенту.`,
                `Create a private link to this ${resourceLabel} for viewing unpublished content.`
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expires">
                {t('Термін дії (днів)', 'Expires in (days)')}
              </Label>
              <Input
                id="expires"
                type="number"
                min="1"
                placeholder={t('Без обмеження', 'No limit')}
                value={expiresInDays}
                onChange={(e) =>
                  setExpiresInDays(e.target.value ? parseInt(e.target.value) : '')
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">
                {t('Нотатка (опціонально)', 'Note (optional)')}
              </Label>
              <Input
                id="note"
                placeholder={t('Для кого це посилання?', 'Who is this link for?')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {!generatedLink ? (
              <Button
                onClick={handleCustomShare}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating
                  ? t('Створення...', 'Creating...')
                  : t('Створити посилання', 'Create link')}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>{t('Ваше посилання', 'Your link')}</Label>
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Будь-хто з цим посиланням зможе переглядати контент.',
                    'Anyone with this link will be able to view the content.'
                  )}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
