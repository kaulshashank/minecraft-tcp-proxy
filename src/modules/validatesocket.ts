import { Socket } from "net";

export const validate = (socket: Socket) => {
	socket.on("data", data => {
		const chunk = data.toString();
		console.log("Chunk: " + chunk);
	})
	return true;
}