import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "./Config/.env") });

import express from "express";
import initapp from "./SRC/Modules/index.router.js";
const app = express();

const port = process.env.PORT || 5000;

app.set("case sensitive routing", true);


initapp(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
