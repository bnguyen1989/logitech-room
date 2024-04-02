export const getParentURL = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (window.location !== window.parent.location) {
      const baseUrl = document.referrer;
      return baseUrl;
    }

    return document.location.origin;
  }
};
