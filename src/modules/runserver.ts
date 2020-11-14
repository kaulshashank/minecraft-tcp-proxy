import { join } from "path";
import { promises as fs } from "fs";
import {
	JAR_DIR,
	WORLD_DIR
} from "../constants";

import spawn from "./spawn";

export const run = (version: string, port: string | number) => {
	const dirName = "world2";

	const jarFile = join(JAR_DIR, version + ".jar");
	const worldDir = join(WORLD_DIR, version, dirName);

	const server = spawn({ jarPath: jarFile, port, cwd: worldDir });

	server.stdout.pipe(process.stdout);
};

