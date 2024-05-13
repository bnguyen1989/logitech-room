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
  let baseUrl = getParentURL();
  if (process.env.NODE_ENV !== "development") {
    baseUrl = "https://staging.project--logitech.pages.dev";
  }
  return `${baseUrl}/${url}`;
};

export const recalculateVh = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  window.onresize = function () {
    setTimeout(function () {
      const height =
        document.documentElement.clientHeight > window.innerHeight
          ? document.documentElement.clientHeight
          : window.innerHeight;
      vh = height * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, 500);
  };
};
