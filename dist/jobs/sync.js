"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSync = startSync;
const node_cron_1 = __importDefault(require("node-cron"));
const workana_1 = require("../services/workana");
const trello_1 = require("../services/trello");
function startSync() {
    node_cron_1.default.schedule("*/5 * * * *", async () => {
        console.log("buscando novos projetos");
        const projects = await (0, workana_1.getProjects)();
        await (0, trello_1.handleNewCard)();
    });
}
