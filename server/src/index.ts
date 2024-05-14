import express from "express";
import path from "path";
import cors from "cors";
import userRouterProduct from "./routes/product";
import userLang from "./routes/languages";
import userRouterRoom from "./routes/room";
import { dataLangFile } from "./utils/langUtils";

const app = express();

const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Для парсинга application/x-www-form-urlencoded

app.use("/products", userRouterProduct);
app.use("/languages", userLang);
app.use("/room", userRouterRoom);

app.use(express.static(path.join(__dirname, "../../dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist/index.html"));
});

app.listen(PORT, () => {
  dataLangFile();
  console.log("listening on port: ", PORT);
});
