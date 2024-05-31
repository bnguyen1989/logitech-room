/// <reference types="vite/client" />
interface Window {
  snapshot: (
    type: "string" | "blob",
    side: "Front" | "Left" = "Front"
  ) => Blob | string;
}
