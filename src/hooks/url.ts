import { useNavigate, useSearchParams } from "react-router-dom";
import { getParentURLForRevert } from "../utils/browserUtils";

export const useUrl = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleNavigate = (
    path: string,
    params: URLSearchParams = searchParams
  ) => {
    navigate(`${path}?${params.toString()}`);
  };

  const getNavLink = (path: string, params?: URLSearchParams) => {
    return `${getParentURLForRevert()}/#${path}${
      params ? `?${params.toString()}` : ""
    }`;
  };

  return { handleNavigate, getNavLink };
};
