const net = require("net");

(async function main() {
	const server = net.createServer(socket => {
		console.log("Received connection");
		socket.on("data", data => {
			console.log("Data: ", data.toString());
		});
	});

	server.listen(26000, () => console.log("Test server started at port 26000."));
})();