import { Socket } from "net";
//@ts-expect-error
import { jspack } from "jspack";

import {
	fromVarIntStream,
	unpackStringFromStream,
	readBytes,
	PACKET_IDS,
	concat,
	packet,
	packString,
	toVarInt
} from "../../utils/protocol";

type Handshake = {
	id: number;
	size: number;
	host: string;
	port: number;
	nextState: number;
	version: number;
}

export default {
	parse: async (socket: Socket, id: number, size: number): Promise<Handshake> => {

		const version = await fromVarIntStream(socket);
		const hostLength = await fromVarIntStream(socket);
		const host = await unpackStringFromStream(socket, hostLength);
		const port = Buffer.from(await readBytes(socket, 2)).readUIntBE(0, 2);
		const nextState = await fromVarIntStream(socket);
	
		return {
			id, size, host,
			port, nextState, version
		};
	},
	write: (socket: Socket, handshake: Handshake) => {
		socket.write(packet(
			handshake.id,
			concat(
				toVarInt(handshake.version),
				packString(handshake.host),
				new Uint8Array(jspack.Pack('H', [handshake.port])),
				toVarInt(handshake.nextState)
			)
		));
	}
};