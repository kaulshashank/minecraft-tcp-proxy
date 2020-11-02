const net = require("net");

module.exports = backends => net.createServer(socket => {
	const backend = net.connect(backends[0], "localhost");
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
});
