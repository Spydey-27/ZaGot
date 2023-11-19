const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
// ---------------- A optimiser et recupérer du fichier deploy-commands.js ---------------- //
const commands = [{}];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.dirname(__dirname);
// 'commands' is the folder name, you can change this to match yours
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('info' in command && 'execute' in command) {
			commands.push(command);
		}
	}
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('un simple test de toutes les commandes'),
	info: {
		name: 'test',
		description: 'ouvres visual studio code sur le serveur',
		category: 'stockage',
		usage: 'code <confidentiel>',
		examples: ['code oui'],
	},
	async execute(interaction) {
		//  interaction.reply('test : en cours');
        await interaction.reply('test : en cours');
		for (let i = 0; i < commands.length; i++) {
			const command = commands[i];
			if (command.info && command.info.examples) { // Suppression de la condition && command.name != 'test'
				for (const example of command.info.examples) {
					console.log(example);
					const newInteraction = {
						...interaction, // Copie toutes les propriétés de l'interaction originale
						commandName: command.name, // Écrase commandName
						options: {
							"_hoistedOptions": [
								{
									'name': command.info.nom,
									'value': command.info.value,
									'type': command.info.type,
								},
							],
						},
					};
                    console.log(newInteraction.options);
					await command.execute(newInteraction, true);
				}
			}
		}
	} };