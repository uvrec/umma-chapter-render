import { supabase } from "@/integrations/supabase/client";

interface NumerologyTrackingData {
  tool_type: "numcal" | "calculator";
  birth_date: string; // ISO date string (YYYY-MM-DD)
  mind_number: number;
  action_number: number;
  realization_number: number;
  result_number: number;
  formatted?: string;
}

/**
 * Track a numerology calculation for analytics.
 * Fails silently — should never block the user experience.
 */
export async function trackNumerologyCalculation(data: NumerologyTrackingData): Promise<void> {
  try {
    const session = await supabase.auth.getSession();
    const userId = session?.data?.session?.user?.id || null;

    await (supabase as any)
      .from("numerology_calculations")
      .insert({
        ...data,
        user_id: userId,
      });
  } catch {
    // Silent fail — analytics should never break the user experience
  }
}
