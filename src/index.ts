import minimist from "minimist";

import Proxy from "./modules/proxy";
import { generate } from "./modules/worldgen";
import { run } from "./modules/runserver";

const argv = minimist(process.argv.slice(2));

const frontend = 10100;

const backends = [
	// 26000 // World gen server uses this
	26001
];

(async function main() {
	if (argv["proxy"]) {
		const proxy = Proxy(backends);
		proxy.listen(frontend, () => console.log("Proxy server listening on", frontend));
	} else if (argv["generate"]) {
		generate("1.16.1");
	} else if (argv["server"]) {
		run("1.16.1", backends[0]);
	}
})();