import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function MergeNoiChapters() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const mergeChapters = async () => {
    setIsProcessing(true);
    setLog([]);
    
    try {
      addLog("Starting NOI chapter merge...");
      
      // Step 1: Get NOI book
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("id")
        .eq("slug", "noi")
        .single();
      
      if (bookError || !book) {
        throw new Error("NOI book not found");
      }
      addLog(`Found NOI book: ${book.id}`);
      
      // Step 2: Get chapters
      const { data: chapters, error: chaptersError } = await supabase
        .from("chapters")
        .select("id, chapter_number")
        .eq("book_id", book.id)
        .in("chapter_number", [1, 18])
        .order("chapter_number");
      
      if (chaptersError || !chapters || chapters.length !== 2) {
        throw new Error("Could not find chapters 1 and 18");
      }
      
      const chapter1 = chapters.find(c => c.chapter_number === 1);
      const chapter18 = chapters.find(c => c.chapter_number === 18);
      
      addLog(`Found Chapter 1: ${chapter1?.id}`);
      addLog(`Found Chapter 18: ${chapter18?.id}`);
      
      // Step 3: Get all verses from both chapters
      const { data: verses1, error: verses1Error } = await supabase
        .from("verses")
        .select("*")
        .eq("chapter_id", chapter1?.id);
      
      const { data: verses18, error: verses18Error } = await supabase
        .from("verses")
        .select("*")
        .eq("chapter_id", chapter18?.id);
      
      if (verses1Error || verses18Error) {
        throw new Error("Failed to fetch verses");
      }
      
      addLog(`Chapter 1 has ${verses1?.length || 0} verses`);
      addLog(`Chapter 18 has ${verses18?.length || 0} verses`);
      
      // Step 4: Merge English translations from chapter 18 into chapter 1 (verses 1-11)
      for (const v18 of verses18 || []) {
        const v1 = verses1?.find(v => v.verse_number === v18.verse_number);
        if (v1) {
          addLog(`Merging verse ${v18.verse_number}...`);
          const { error: updateError } = await supabase
            .from("verses")
            .update({
              translation_en: v18.translation_en,
              commentary_en: v18.commentary_en,
              sanskrit_en: v18.sanskrit_en || v18.sanskrit,
              transliteration_en: v18.transliteration_en || v18.transliteration,
              synonyms_en: v18.synonyms_en
            })
            .eq("id", v1.id);
          
          if (updateError) {
            addLog(`❌ Error updating verse ${v18.verse_number}: ${updateError.message}`);
          } else {
            addLog(`✅ Merged verse ${v18.verse_number}`);
          }
        }
      }
      
      // Step 5: Delete verses 12-17 from chapter 1 (NOI only has 11 texts)
      const versesToDelete = verses1?.filter(v => {
        const num = parseInt(v.verse_number);
        return num >= 12 && num <= 17;
      }) || [];
      
      addLog(`Deleting ${versesToDelete.length} extra verses (12-17)...`);
      for (const v of versesToDelete) {
        const { error: deleteError } = await supabase
          .from("verses")
          .delete()
          .eq("id", v.id);
        
        if (deleteError) {
          addLog(`❌ Error deleting verse ${v.verse_number}: ${deleteError.message}`);
        } else {
          addLog(`✅ Deleted verse ${v.verse_number}`);
        }
      }
      
      // Step 6: Delete all verses from chapter 18
      addLog("Deleting all verses from chapter 18...");
      const { error: delete18Error } = await supabase
        .from("verses")
        .delete()
        .eq("chapter_id", chapter18?.id);
      
      if (delete18Error) {
        addLog(`❌ Error deleting chapter 18 verses: ${delete18Error.message}`);
      } else {
        addLog("✅ Deleted all chapter 18 verses");
      }
      
      // Step 7: Delete chapter 18
      addLog("Deleting chapter 18...");
      const { error: deleteChapter18Error } = await supabase
        .from("chapters")
        .delete()
        .eq("id", chapter18?.id);
      
      if (deleteChapter18Error) {
        addLog(`❌ Error deleting chapter 18: ${deleteChapter18Error.message}`);
      } else {
        addLog("✅ Deleted chapter 18");
      }
      
      // Step 8: Update chapter 1 title
      addLog("Updating chapter 1 title...");
      const { error: updateTitleError } = await supabase
        .from("chapters")
        .update({
          title_en: "The Nectar of Instruction",
          title_uk: "Нектар настанов"
        })
        .eq("id", chapter1?.id);
      
      if (updateTitleError) {
        addLog(`❌ Error updating title: ${updateTitleError.message}`);
      } else {
        addLog("✅ Updated chapter title");
      }
      
      addLog("✅ ✅ ✅ MERGE COMPLETED SUCCESSFULLY!");
      toast({
        title: "Success",
        description: "NOI chapters merged successfully",
      });
      
    } catch (error: any) {
      addLog(`❌ FATAL ERROR: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Merge NOI Chapters (1 & 18)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This tool will merge English translations from Chapter 18 into Chapter 1,
            delete extra verses (12-17), and remove Chapter 18.
          </p>
          
          <Button 
            onClick={mergeChapters} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Start Merge
              </>
            )}
          </Button>
          
          {log.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Log:</h3>
              <div className="space-y-1 text-xs font-mono max-h-96 overflow-y-auto">
                {log.map((entry, idx) => (
                  <div key={idx} className={entry.includes("❌") ? "text-destructive" : entry.includes("✅") ? "text-green-600" : ""}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
