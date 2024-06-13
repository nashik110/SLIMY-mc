async function loadModals(client) {
	const ascii = require("ascii-table");
  	const table = new ascii().setHeading("Modals", "Count", "Status");
	const { loadFiles } = require("../Functions/fileLoader");

	await client.modals.clear();

	const Files = await loadFiles("Modals");

	Files.forEach((file) => {
		const modal = require(file);
		client.modals.set(modal.data.name, modal);
	});

	table.addRow(`Modals `, client.modals.size, "🟩");
	return console.log(table.toString(), "\nModals cargados cargados.");
}

module.exports = { loadModals };
