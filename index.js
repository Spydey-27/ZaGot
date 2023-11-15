// ------ Require ------//
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection } = require('discord.js');
const dotenv = require('dotenv'); // Permet de charger les variables d'environnement à partir d'un fichier .env*

// ---------------- Client ------//
const client = new Client({ intents: 3276799 });

dotenv.config(); // Chargement des variables d'environnement


// client.on('ready', async () => console.log(`Connecté en tant que ${client.user.tag}!`));

// --------------------- Commandes ---------------------//

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


/* process.on('exit', code => {console.log(`Le processus s'est arrêté avec le code: ${code}!`)});
process.on('uncaughtException', (err, origin) => {console.log(`UNCAUGHT_EXCEPTION: ${err}`,`Origine: ${origin}`)});
process.on('unhandledRejection', (reason, promise) => {console.log(`UNHANDLED_REJECTION: ${reason}\n-------\n`, promise)});
process.on('warning', (...args) => console.log(...args));*/

const folders_event_Path = path.join(__dirname, 'events');
const events_Folders = fs.readdirSync(folders_event_Path);

for (const folder of events_Folders) {
	const eventsPath = path.join(folders_event_Path, folder);
	const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
	for (const file of eventsFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}


client.login(process.env.DISCORD_TOKEN);
