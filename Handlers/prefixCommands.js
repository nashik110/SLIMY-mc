async function loadPrefixCommands(client) {
	const { loadFiles } = require("../Functions/fileLoader");
	const ascii = require("ascii-table");
  	const table = new ascii().setHeading("Commands", "Count", "Status");

	await client.prefixCommands.clear();

	const Files = await loadFiles("PrefixCommands");

	Files.forEach((file) => {
		const prefixCommand = require(file);
		if ('execute' in prefixCommand && 'category' in prefixCommand) {
			client.prefixCommands.set(prefixCommand.name, prefixCommand);
		} else {
			console.log(`\x1b[31m[ADVERTENCIA] el archivo ${file} no contiene "Execute" o "Category"\x1b[0m`)
		}
	});

	table.addRow(`PrefixCommands`, client.prefixCommands.size, "🟩");
	return console.log(table.toString(), "\nComandos de Prefix cargados.");
}

module.exports = { loadPrefixCommands };
