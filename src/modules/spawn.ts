import { spawn } from "child_process";

interface SpawnOptions {
	jarPath: string;
	port: string | number;
	cwd: string;
}

export default ({
	jarPath, port, cwd
}: SpawnOptions) => {
	const proc = spawn(
		"java",
		`-jar ${jarPath} --port ${port} --nogui`.split(" "),
		{ cwd }
	);

	proc.stderr.pipe(process.stderr);

	return proc;
}