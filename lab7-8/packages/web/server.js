import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.dirname(fileURLToPath(import.meta.resolve("@bukvarnia/core")));

const CORE_PREFIX = "/node_modules/@bukvarnia/core/";

const WEB_FILES = {
    "/": "index.html",
    "/index.html": "index.html",
    "/script.js": "script.js",
    "/style.css": "style.css",
    "/localStorageAdapter.js": "localStorageAdapter.js",
};

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
};

function resolveFile(pathname) {
    if (WEB_FILES[pathname]) return path.join(webDir, WEB_FILES[pathname]);

    if (pathname.startsWith(CORE_PREFIX)) {
        const relative = pathname.slice(CORE_PREFIX.length);
        const filePath = path.resolve(coreDir, relative);
        const insideCore = filePath.startsWith(coreDir + path.sep);
        // віддаємо лише .js-файли з кореня пакета ядра (без test/ та package.json)
        if (insideCore && path.dirname(filePath) === coreDir && path.extname(filePath) === ".js") {
            return filePath;
        }
    }
    return null;
}

export function createServer() {
    return http.createServer((req, res) => {
        let filePath = null;
        try {
            const { pathname } = new URL(req.url, "http://localhost");
            filePath = resolveFile(decodeURIComponent(pathname));
        } catch {
            filePath = null;
        }

        if (req.method !== "GET" && req.method !== "HEAD") {
            res.writeHead(405).end("Method Not Allowed");
            return;
        }

        fs.readFile(filePath ?? "", (error, content) => {
            if (!filePath || error) {
                res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] ?? "application/octet-stream" });
            res.end(req.method === "HEAD" ? undefined : content);
        });
    });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const port = Number(process.env.PORT) || 3000;
    createServer().listen(port, () => console.log(`Букварня Web: http://localhost:${port}`));
}
