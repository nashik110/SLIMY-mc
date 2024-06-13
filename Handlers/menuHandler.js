async function loadMenus(client) {
	const ascii = require("ascii-table");
  	const table = new ascii().setHeading("Menus", "Count", "Status");
	const { loadFiles } = require("../Functions/fileLoader");

	await client.menus.clear();

	const Files = await loadFiles("Menus");

	Files.forEach((file) => {
		const menu = require(file);
		client.menus.set(menu.data.name, menu);
	});

	table.addRow(`Modals `, client.menus.size, "🟩");
	return console.log(table.toString(), "\nMenus cargados.");
}

module.exports = { loadMenus };
