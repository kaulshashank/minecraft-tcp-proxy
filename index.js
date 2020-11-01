const Proxy = require("./proxy");

const frontend = 10100;

const backends = [
	26000
];

(async function main() {
	const proxy = Proxy(backends);
	proxy.listen(frontend);
})();