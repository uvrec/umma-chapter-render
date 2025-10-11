import { supabase } from "@/integrations/supabase/client";

/** Отримати тимчасовий (signed) URL для програвання приватного файлу */
export async function getSignedAudioUrl(storagePath: string, expiresInSec = 60 * 60) {
  const { data, error } = await supabase
    .storage
    .from("audio")
    .createSignedUrl(storagePath, expiresInSec);

  if (error) throw error;
  return data.signedUrl;
}

/** Безпечна назва файлу */
export function toSafeFilename(name: string) {
  return name
    .trim()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\.\-\s_]/gu, "") // лишаємо літери/цифри/.-_ та пробіли
    .replace(/\s+/g, "-")
    .toLowerCase();
}
