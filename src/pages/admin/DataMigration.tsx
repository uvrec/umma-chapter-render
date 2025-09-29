import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { verses } from '@/data/verses';
import { useToast } from '@/hooks/use-toast';

export default function DataMigration() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [imported, setImported] = useState(false);

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleImport = async () => {
    setIsImporting(true);
    setProgress({ current: 0, total: verses.length });

    try {
      // Get book and chapter IDs
      const { data: books } = await supabase
        .from('books')
        .select('id')
        .eq('slug', 'srimad-bhagavatam')
        .single();

      if (!books) {
        throw new Error('Book not found');
      }

      const { data: chapters } = await supabase
        .from('chapters')
        .select('id')
        .eq('book_id', books.id)
        .eq('chapter_number', 1)
        .single();

      if (!chapters) {
        throw new Error('Chapter not found');
      }

      // Import verses in batches of 10
      const batchSize = 10;
      for (let i = 0; i < verses.length; i += batchSize) {
        const batch = verses.slice(i, i + batchSize);
        
        const verseData = batch.map(verse => ({
          chapter_id: chapters.id,
          verse_number: verse.number,
          sanskrit: verse.sanskrit || null,
          transliteration: verse.transliteration || null,
          synonyms_ua: verse.synonyms || null,
          synonyms_en: null,
          translation_ua: verse.translation || null,
          translation_en: null,
          commentary_ua: verse.commentary || null,
          commentary_en: null,
          audio_url: verse.audioUrl || null
        }));

        const { error } = await supabase
          .from('verses')
          .insert(verseData);

        if (error) throw error;

        setProgress({ current: Math.min(i + batchSize, verses.length), total: verses.length });
      }

      setImported(true);
      toast({
        title: 'Success!',
        description: `Successfully imported ${verses.length} verses`,
      });
    } catch (error: any) {
      toast({
        title: 'Import failed',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Data Migration</h1>
        </div>

        <Card className="p-6 max-w-2xl">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Import Verses from Data File</h2>
              <p className="text-muted-foreground">
                This will import all {verses.length} verses from the static data file into the database.
                This is a one-time operation.
              </p>
            </div>

            {imported ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span>Successfully imported {verses.length} verses!</span>
              </div>
            ) : (
              <>
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Importing verses...</span>
                      <span>{progress.current} / {progress.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? 'Importing...' : 'Start Import'}
                </Button>
              </>
            )}

            <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Before importing:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure the book "Srimad-Bhagavatam" exists</li>
                  <li>Make sure Chapter 1 exists for this book</li>
                  <li>This will import Ukrainian translations only</li>
                  <li>English fields will be left empty for manual translation</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
