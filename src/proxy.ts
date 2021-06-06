import { createServer, connect, Socket } from "net";

import Pkt from "./modules/packet";

import { fromVarIntStream, PACKET_IDS, NEXT_STATES } from "./utils/protocol";

/** Store connections to backend incase of client reconnects */
const BackendMap = new Map<string, Socket>();

export default (backends: number[]) =>
	createServer(async socket => {
		const packetSize = await fromVarIntStream(socket);
		const packetID = await fromVarIntStream(socket);

		if (packetID === PACKET_IDS.HANDSHAKING) {
			const handshake = await Pkt.handshake.parse(socket, packetID, packetSize);
			if (handshake && handshake.nextState === NEXT_STATES.LOGIN) {
				// TODO: Create a module that stores backends.
				const backend = connect(backends[0], "localhost");

				Pkt.handshake.write(backend, handshake); // Send parsed handshake to server

				socket.pipe(backend);
				backend.pipe(socket);

				backend.on("error", err => {
					console.log("========== BACKEND ERROR ==========");
					console.log(err);
					console.log("===================================");
				});
			} else if (handshake && handshake.nextState === NEXT_STATES.STATUS) {
				console.log("SLP will start from next packet.");
				socket.end();
			}
		}

		socket.on("close", () => {
			// TODO: setTimeout clear BackendMap
		});

		socket.on("error", err => {
			// TODO: setTimeout clear BackendMap
			console.log("========== CLIENT ERROR ===========");
			console.log(err);
			console.log("===================================");
		});
	});
