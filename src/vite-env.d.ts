/// <reference types="vite/client" />
interface Window {
  snapshot: (type: "string" | "blob") => Blob | string;
}
