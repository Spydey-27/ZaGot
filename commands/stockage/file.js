const { SlashCommandBuilder } = require('discord.js');
// const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('file')
		.setDescription('Ouvre le site de stockage sur le serveur')
		.addBooleanOption(option =>
			option
				.setName('confidentiel')
				.setDescription('Affiche pour tout le monde (non) ou seulement pour toi(oui) '),

		),
	info: {
		name: 'file',
		description: 'ouvres le site de stockage sur le serveur',
		category: 'stockage',
		usage: 'file <confidentiel>',
		examples: ['file non'],
	},
	async execute(interaction) {
	/*	const file = interaction.options.getString('fichier');
		const language = interaction.options.getString('language'); */
		const response = interaction.options.getBoolean('confidentiel');
		const url = 'https://file.' + interaction.guildId + '.vsnu.fr' ;

		if (response) {
			return interaction.reply({ content: `Voici l'url pour accéder au stockage : ${url}`, ephemeral: true });
		}
		else {
			return interaction.reply(`Voici l'url pour accéder au stockage : ${url}`);
		}


	},
};