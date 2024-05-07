export const getParentURL = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (window.location !== window.parent.location) {
      const baseUrl = document.referrer;
      return baseUrl;
    }

    return document.location.origin;
  }
};

export const copyToClipboard = (data: string | object | number) => {
  if (!data) return;

  const str = typeof data === "string" ? data : JSON.stringify(data);

  const el = document.createElement("textarea");
  el.value = str;

  document.body.appendChild(el);

  el.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Error copy ", err);
  }

  document.body.removeChild(el);
};

export const getImageUrl = (url: string) => {
  const currentScript = document.currentScript as any;
  const scriptUrl = currentScript ? currentScript?.src : '';

  const baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);

  return `${baseUrl}${url}`;
};

