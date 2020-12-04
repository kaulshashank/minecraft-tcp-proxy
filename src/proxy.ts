import { createServer, connect, Socket } from "net";

import Pkt from "./modules/packet";
import Runner from "./modules/runner";

import {
	fromVarIntStream,
	PACKET_IDS,
	NEXT_STATES
} from "./utils/protocol";
import { getUsernameFromHostname } from "./utils";

const BackendMap = new Map<string, Socket>();

export default (backends: number[]) => createServer(async socket => {

	const packetSize = await fromVarIntStream(socket);
	const packetID = await fromVarIntStream(socket);

	if (packetID === PACKET_IDS.HANDSHAKING) {
		const handshake = await Pkt.handshake.parse(socket, packetID, packetSize);
		if (handshake && handshake.nextState === NEXT_STATES.LOGIN) {
			const username = getUsernameFromHostname(handshake.host);
			if (username) {
				const runner = await Runner.fetch(username);
				if (runner) {
					if (runner.active) {
						const backend = BackendMap.get(runner.username) || connect(
							backends[0],
							"localhost"
						);

						Pkt.handshake.write(backend, handshake); // Send parsed handshake to server

						socket.pipe(backend);
						backend.pipe(socket);

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
						console.log("Runner disabled.");
					}
				} else {
					console.log("No runner found.");
				}
			} else {
				console.log("Cannot get username from address.");
			}
		} else if (handshake && handshake.nextState === NEXT_STATES.STATUS) {
			console.log("SLP will start from next packet.");
			socket.end();
		}
	}
});
