const net = require("net");

module.exports = (backends) => net.createServer(socket => {
	const backend = net.connect(backends[0], "localhost");
	backend.on("connect", () => {
		socket.pipe(backend);
		backend.pipe(socket);
	});
});
