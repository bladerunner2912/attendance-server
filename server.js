import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import router from "./src/routes/index.js";
import cors from "cors";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const angularBasePath = path.join(__dirname, "dist", "attendance");
const angularBrowserPath = path.join(angularBasePath, "browser");
const angularBuildPath = fs.existsSync(angularBrowserPath) ? angularBrowserPath : angularBasePath;
const angularIndexHtmlPath = path.join(angularBuildPath, "index.html");
const angularIndexCsrPath = path.join(angularBuildPath, "index.csr.html");
const angularEntryHtml = fs.existsSync(angularIndexHtmlPath) ? angularIndexHtmlPath : angularIndexCsrPath;

app.use(cors({
    origin: 'http://localhost:4200', // Angular dev server
    credentials: true
}));

app.use(express.json());

app.use("/api", router);
app.use(express.static(angularBuildPath));
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(angularEntryHtml);
});


app.listen(config.PORT, () => {
    console.log(`App listening on ${config.PORT}`);
})

