export const isValidHostname = (hostname: string) => /[A-Za-z0-9_]{3,16}\.speedrunner\.in/g.test(hostname);

export const getUsernameFromHostname = (hostname: string) =>
	isValidHostname(hostname)
		? (hostname.match(/[A-Za-z0-9_]{3,16}(?=\.speedrunner\.in)/g) as string[])[0]
		: undefined;
