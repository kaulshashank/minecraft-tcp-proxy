const path = require("path");
const { spawn } = require("child_process");
const { JAR_DIR, WORLD_DIR } = require("../constants");

const runServer = (version, port) => {
	const jarFile = path.join(JAR_DIR, version + ".jar");
	const worldDir = path.join(WORLD_DIR, version, "world1");

	const server = spawn(
			"java",
			`-jar ${jarFile} --port ${port} --world ${worldDir} --nogui`.split(" "),
			{ cwd: worldDir }
		);
	
	server.stdout.pipe(process.stdout);
	server.stderr.pipe(process.stderr);
	process.stdin.pipe(process.stdin);
}

runServer("1.16.1", "26000");

//module.exports = backends => {
//	const servers = {};

//	const Manager = {
//		addServer: ({ username, version, whitelist }) => { },
//		switchServers: ({  }) => { },
		
//	};

//	return Manager;
//}