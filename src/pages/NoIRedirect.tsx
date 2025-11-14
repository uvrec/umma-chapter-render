import { Navigate, useParams } from "react-router-dom";

export const NoIRedirect = () => {
  const { verseNumber } = useParams();
  const target = `/veda-reader/noi/1/${verseNumber}`;
  return <Navigate to={target} replace />;
};

export default NoIRedirect;
