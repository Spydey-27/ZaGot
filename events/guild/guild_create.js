const { Events } = require('discord.js');
const { exec } = require('child_process');
const util = require('util');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild) {
		console.log(`Joined new guild: ${guild.name}`);
		const server = guild.id;
		const execPromise = util.promisify(exec);

		async function runPythonScript() {
			try {
				await execPromise('python3 -u ../../domain.py ' + server);
				await execPromise('python3 -u ../../new_serv.py ' + server);

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

