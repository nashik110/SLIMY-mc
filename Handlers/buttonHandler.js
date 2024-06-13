async function loadButtons(client) {
	const ascii = require("ascii-table");
  	const table = new ascii().setHeading("Buttons", "Count", "Status");
	const { loadFiles } = require("../Functions/fileLoader");

	await client.buttons.clear();

	const Files = await loadFiles("Buttons");

	Files.forEach((file) => {
		const button = require(file);
		client.buttons.set(button.data.name, button);
	});

	table.addRow(`Buttons `, client.modals.size, "🟩");
	return console.log(table.toString(), "\nButtons cargados.");
}

module.exports = { loadButtons };
