export default {
	fetch: async (username: string) => ({
		mcUsername: username,
		// username: "Speedrunman",
		// password: "#",
		active: true, // allows connection
		whitelist: [],
	})
}