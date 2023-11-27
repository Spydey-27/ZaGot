const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();
const discord_token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;

const commands = [];


// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(discord_token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// reset all commands

		// The put method is used to fully refresh all commands globally
		const data_global = await rest.put(
			Routes.applicationCommands(client_id),
			{ body: commands },
		); // Permet de tester sur tous les serveurs

		/*const data_guild = await rest.put(
			Routes.applicationGuildCommands(client_id), // normal si les commandes sont en doubles !
			{ body: commands },
		); */ // Permet de tester sur un seul serveur


		console.log(`Successfully reloaded  & ${data_guild.length} application (/) commands.`);
		console.log(`Successfully reloaded  & ${data_global.length} application (/) commands.`);

	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();