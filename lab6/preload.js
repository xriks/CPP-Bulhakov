const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("booksAPI", {
    loadBooks: () => ipcRenderer.invoke("books:load"),
    saveBooks: (books) => ipcRenderer.invoke("books:save", books),
});
