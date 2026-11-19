const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("booksAPI", {
    genres: () => ipcRenderer.invoke("books:genres"),
    list: (query) => ipcRenderer.invoke("books:list", query),
    add: (data) => ipcRenderer.invoke("books:add", data),
    remove: (id) => ipcRenderer.invoke("books:remove", id),
});
