/**
 * HreflangTags - Standalone hreflang/canonical tags for pages not using PageMeta
 *
 * Use this component to add proper multilingual SEO tags to any page.
 * It automatically generates correct hreflang and canonical URLs based on current path.
 */

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";

// Paths that should not have hreflang tags (admin, auth, api)
const NON_LOCALIZED_PATHS = ['/admin', '/auth', '/api'];

export const HreflangTags = () => {
  const location = useLocation();
  const { language } = useLanguage();

  // Don't add hreflang for non-localized paths
  if (NON_LOCALIZED_PATHS.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  // Get path without language prefix
  const pathWithoutLang = location.pathname.replace(/^\/(uk|en)/, '') || '/';

  // Build URLs for each language
  const ukUrl = `${SITE_CONFIG.baseUrl}/uk${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const enUrl = `${SITE_CONFIG.baseUrl}/en${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  const currentUrl = language === "uk" ? ukUrl : enUrl;

  // ISO 639-1: 'uk' for Ukrainian
  const htmlLang = language === "uk" ? "uk" : "en";

  return (
    <Helmet>
      <html lang={htmlLang} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Hreflang for multilingual SEO */}
      <link rel="alternate" hrefLang="uk" href={ukUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={ukUrl} />
    </Helmet>
  );
};
