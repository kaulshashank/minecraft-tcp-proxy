export default {
	fetch: async (username: string) => ({
		username,
		name: "Speedrunman",
		password: "#",
		active: true, // allows connection
	})
}