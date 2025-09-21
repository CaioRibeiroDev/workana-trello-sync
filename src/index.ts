import dotenv from "dotenv";
import { startSync } from "./jobs/sync";

dotenv.config();

startSync();