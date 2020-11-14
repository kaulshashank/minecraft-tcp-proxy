import { join } from "path";

export const JAR_DIR = join(__dirname, "../jars");
export const WORLD_DIR = join(__dirname, "../worlds");

export const EULA_STRING = `eula=true`;

export const SERVER_STARTED_RGX = /(Done\s)(\(\d+\.\d+s\))\!\s(For help, type "help")/;