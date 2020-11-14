import { join } from "path";
import { promises as fs } from "fs";
import {
	JAR_DIR,
	WORLD_DIR,
	EULA_STRING,
	SERVER_STARTED_RGX
} from "../constants";

import spawn from "./spawn";

const GEN_SERVER_PORT = 26000; // Wont allow us to generate 100s of worlds parallely but works for the time being.

export const generate = async (version: string) => {
	const dirName = "world2";

	const jarFile = join(JAR_DIR, version + ".jar");
	const worldDir = join(WORLD_DIR, version, dirName);

	await fs.writeFile(join(worldDir, "eula.txt"), EULA_STRING);

	const server = spawn({ jarPath: jarFile, port: GEN_SERVER_PORT, cwd: worldDir });

	server.stdout.on("data", (chunk) => {
		if (chunk) {
			const msg = chunk.toString();
			// console.log(msg);
			if (SERVER_STARTED_RGX.test(msg)) {
				console.log("Server generation completed.");
				server.kill();
			}
		}
	});
};

