import { Navigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const NoIRedirect = () => {
  const { verseNumber } = useParams();
  const { getLocalizedPath } = useLanguage();
  const target = getLocalizedPath(`/lib/noi/1/${verseNumber}`);
  return <Navigate to={target} replace />;
};

export default NoIRedirect;
