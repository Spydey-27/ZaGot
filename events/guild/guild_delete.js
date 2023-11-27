const { Events } = require('discord.js');
const { exec } = require('child_process');
const util = require('util');

module.exports = {
	name: Events.GuildDelete,
	async execute(guild) {
		console.log(`Quited guild: ${guild.name}`);
		const server = guild.id;
		const execPromise = util.promisify(exec);

		async function runPythonScript() {
			try {
				await execPromise('./delete.sh' + server);

			}
			catch (error) {
				console.error('Sortie d\'erreur :', error.stderr);
				console.error(`Erreur lors de l'exécution de la commande : ${error}`);
			}
		}

		await runPythonScript();
		console.log(`l'id de la guilde est ${server}`);
	},
};

