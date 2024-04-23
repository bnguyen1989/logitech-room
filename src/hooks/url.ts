import { useNavigate, useSearchParams } from "react-router-dom";

export const useUrl = (path: string) => {
  const navigate = useNavigate();
  const [searchParams]= useSearchParams();
	
  const handleNavigate = () => {
    navigate(`${path}?${searchParams.toString()}`);
  };

  return { handleNavigate };
};
