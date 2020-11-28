import { createServer, createClient, states, Client } from "minecraft-protocol";

import { validate } from "./validatesocket";

interface BackendStore {
	[k: string]: Client;
}

const BackendStore: BackendStore = {};

export const proxy = (backends: number[]) => {
	const proxy = createServer({
		host: "localhost",
		port: 10100,
		"online-mode": true,
		keepAlive: false,
		version: "1.16.1"
	});

	proxy.on("login", client => {
		console.log("[login] start");

		if (!BackendStore[client.username]) {
			console.log("No backend connection found. Creating client.");
			BackendStore[client.username] = createClient({
				host: "localhost",
				port: backends[0],
				username: "EMAIL_ID_NOT_USERNAME",
				password: "PASSWORD_HERE",
				keepAlive: false,
				version: "1.16.1"
			});
		} else {
			console.log("Re-using backend connection.");
		}

		const backend = BackendStore[client.username];

		let endedTargetClient = false;
		let endedClient = false;

		client.on("packet", (data, meta) => {
			if (backend.state === states.PLAY && meta.state === states.PLAY) {
				if (process.env.DEBUG) {
					console.log('client->server:',
						client.state + ' ' + meta.name + ' :'
						//, JSON.stringify(data)
					);
				}
				if (!endedTargetClient) { backend.write(meta.name, data) }
			}
		});

		client.on('end', function () {
			endedClient = true;
			console.log('Connection closed by client')
			if (!endedTargetClient) {
				console.log("Ending backend");
				backend.end('End')
			}
		});


		client.on('error', function (err) {
			endedClient = true
			console.log('Connection error by client')
			console.log(err.stack)
			if (!endedTargetClient) {
				console.log("Ending backend [error]")
				backend.end('Error')
			}
		})

		backend.on('packet', function (data, meta) {
			if (meta.state === states.PLAY && client.state === states.PLAY) {
				if (process.env.DEBUG) {
					console.log('client<-server:',
						backend.state + '.' + meta.name + ' :'
						//, JSON.stringify(data)
					);
				}
				if (!endedClient) {
					client.write(meta.name, data);
				}
			}
		})

		backend.on('end', function (reason) {
			endedTargetClient = true
			console.log('Connection closed by server', reason/*, '(' + addr + ')'*/)
			//if (!endedClient) {
			console.log("Ending client");
			client.end('End');
			//}
		});
		backend.on('error', function (err) {
			endedTargetClient = true
			console.log('Connection error by server'/*, '(' + addr + ') '*/, err)
			console.log(err.stack)
			//if (!endedClient) {
			console.log("Ending client [error]");
			client.end('Error')
			//}
		})
	});

	return proxy;
}
