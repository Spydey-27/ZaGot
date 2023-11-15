const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('execute')
		.setDescription('execute un fichier sur le serveur')
		.addStringOption(option =>
			option
				.setName('fichier')
				.setDescription('Affiche pour tout le monde (non) ou seulement pour toi(oui) ')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('language')
				.setDescription('Quel langage de programmation est utilisé ?')
				.setRequired(true),
		),
	info: {
		name: 'execute',
		description: 'execute un fichier sur le serveur',
		category: 'stockage',
		usage: 'execute <fichier utilisé> <langage utilisé>',
		examples: ['url test.py python \nExecute le fichier test.py en python'],
	},
	async execute(interaction) {
		const file = interaction.options.getString('fichier');
		const language = interaction.options.getString('language');

		return interaction.reply(`L'execution de ton fichier **${file}** avec le langage **${language}** est en cours ...`);


	},
};