import { createServer, connect } from "net";
//import { createServer, } from "minecraft-protocol";

import { validate } from "./validatesocket";

export default (backends: number[]) => createServer(socket => {
	if (validate(socket)) {
		const backend = connect(backends[0], "localhost");
		backend.on("connect", () => {
			socket.pipe(backend);
			backend.pipe(socket);
		});

		backend.on("error", err => {
			console.log("========== BACKEND ERROR ==========");
			console.log(err);
			console.log("===================================")
		});

		socket.on("error", err => {
			console.log("========== CLIENT ERROR ===========");
			console.log(err);
			console.log("===================================")
		});
	} else {
		console.log("Invalid connection to proxy server.");
		socket.end();
	}
});
