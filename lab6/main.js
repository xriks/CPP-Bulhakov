const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function getBooksFilePath() {
    return path.join(app.getPath("userData"), "books.json");
}

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        title: "Букварня Desktop",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
}

ipcMain.handle("books:load", () => {
    const filePath = getBooksFilePath();
    if (!fs.existsSync(filePath)) {
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (error) {
        console.error("Не вдалося прочитати books.json:", error);
        return [];
    }
});

ipcMain.handle("books:save", (event, books) => {
    fs.writeFileSync(getBooksFilePath(), JSON.stringify(books, null, 2), "utf-8");
    return true;
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
