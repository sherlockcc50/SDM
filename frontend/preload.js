const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAPI", {
  log: (msg) => console.log("From renderer:", msg),

  closeWindow: () => ipcRenderer.send("request-window-close"),
  minimizeWindow: () => ipcRenderer.send("request-window-min"),
  maximizeWindow: () => ipcRenderer.send("request-window-max"),
});

