import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useCache = () => {
  const [searchParams] = useSearchParams();
  const cacheParam = searchParams.get("cache");
  const keyCacheParam = searchParams.get("keyCache");



  const [cache, setCache] = useState(true);
  const [keyCache, setKeyCache] = useState<string>("v045");

  useEffect(() => {
    if (cacheParam) {
      setCache(cacheParam === "true");
    }

    if (keyCacheParam) {
      setKeyCache(keyCacheParam);
    }
  }, [cacheParam, keyCacheParam]);

  return {
    cache,
    keyCache,
  };
};
