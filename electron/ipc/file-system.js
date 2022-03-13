"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IPC_1 = __importDefault(require("./General/IPC"));
const electron_1 = require("electron");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const nameAPI = "fileSystem";
// to Main
const validSendChannel = {
    "readFile": readFileTodos,
    "saveFile": saveFile
};
// from Main
const validReceiveChannel = [
    "getFile"
];
const fileSystem = new IPC_1.default({
    nameAPI,
    validSendChannel,
    validReceiveChannel
});
exports.default = fileSystem;
async function readFileTodos(mainWindow, event, fileName) {
    const fileExists = await checkFileTodosExists(fileName);
    if (!fileExists) {
        await createDir();
        const data = `[]`;
        await writeTodos(fileName, data);
    }
    const todos = await loadTodos(fileName);
    mainWindow.webContents.send("getFile", todos);
}
async function saveFile(mainWindow, event, data) {
    const { fileName, todo } = { ...data };
    console.log(fileName);
    console.log(todo);
    const fileExists = await checkFileTodosExists(fileName);
    if (!fileExists) {
        await createDir();
    }
    await writeTodos(fileName, todo);
}
async function checkFileTodosExists(fileName) {
    const userData = electron_1.app.getPath('userData');
    const pathFile = path_1.default.join(userData, 'todos', fileName);
    try {
        await (0, promises_1.access)(pathFile);
        return true;
    }
    catch (error) {
        console.log("DOES NOT exist:", pathFile);
        console.error(error);
        return false;
    }
}
async function writeTodos(fileName, data) {
    const userData = electron_1.app.getPath('userData');
    const pathFile = path_1.default.join(userData, 'todos', fileName);
    try {
        await (0, promises_1.writeFile)(pathFile, data);
    }
    catch (error) {
        console.log("await writeFile(pathFile, data);", pathFile);
        console.error(error);
    }
}
async function createDir() {
    const userData = electron_1.app.getPath('userData');
    const pathDir = path_1.default.join(userData, 'todos');
    let dirExists = false;
    try {
        await (0, promises_1.access)(pathDir);
        dirExists = true;
    }
    catch (error) {
        // The check failed
        console.log("DOES NOT exist:", pathDir);
        console.error(error);
        dirExists = false;
    }
    if (!dirExists) {
        try {
            await (0, promises_1.mkdir)(pathDir);
        }
        catch (error) {
            console.log(" await mkdir(pathDir);", pathDir);
            console.error(error);
        }
    }
}
async function loadTodos(fileName) {
    const userData = electron_1.app.getPath('userData');
    const pathDir = path_1.default.join(userData, 'todos', fileName);
    let result = [];
    try {
        const rawData = await (0, promises_1.readFile)(pathDir, 'utf-8');
        result = JSON.parse(rawData);
    }
    catch (err) {
        console.error(err);
    }
    return result;
}
