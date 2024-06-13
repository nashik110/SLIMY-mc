async function loadCommands(client) {
  const { loadFiles } = require("../Functions/fileLoader");
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Commands", "Count", "Status");

  await client.commands.clear();

  let commandsArray = [];

  const Files = await loadFiles("Commands");

  Files.forEach((file) => {
    const command = require(file);

    if ('data' in command && 'execute' in command && 'category' in command) {
		  client.commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
	  } else {
		  console.log(`\x1b[31m[ADVERTENCIA] el archivo ${file} no contiene "data", "category" o "execute"\x1b[0m`)
	  }

  });

  client.application.commands.set(commandsArray);

  table.addRow(`CommandsSlash `, client.commands.size, "🟩");

  return console.log(table.toString(), "\nComandos Slash cargados.");
}

module.exports = { loadCommands };
