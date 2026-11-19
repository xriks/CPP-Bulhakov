import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BooksService } from "@bukvarnia/core";
import { FileStorageAdapter } from "./fileStorageAdapter.js";
import { createHandlers } from "./ipcHandlers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        title: "Букварня Desktop",
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
    const adapter = new FileStorageAdapter(path.join(app.getPath("userData"), "books.json"));
    const handlers = createHandlers(new BooksService(adapter));

    ipcMain.handle("books:genres", () => handlers.genres());
    ipcMain.handle("books:list", (event, query) => handlers.list(query));
    ipcMain.handle("books:add", (event, data) => handlers.add(data));
    ipcMain.handle("books:remove", (event, id) => handlers.remove(id));

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
