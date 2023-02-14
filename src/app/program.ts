
import { program } from "commander";
import { version } from "../../package.json";
import compile from "./compile";

export default program
	.version(version)
	.name('Basl')
	.description('The official Basl compiler')
	.argument('<path>', 'Path to compile')
	.action((path: string) => {
		compile(path)
	});
