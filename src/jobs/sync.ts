import cron from "node-cron"
import { getProjects } from "../services/workana";
import { createCard, handleNewCard } from "../services/trello";

export function startSync() {
  cron.schedule("*/10 * * * *", async () => {
    console.log("buscando novos projetos");
    const projects = await getProjects();
    
    await handleNewCard()
  })
}