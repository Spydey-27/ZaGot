const { SlashCommandBuilder } = require('discord.js');
// const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('code')
		.setDescription('Ouvre visual studio code sur le serveur')
		.addBooleanOption(option =>
			option
				.setName('confidentiel')
				.setDescription('Affiche pour tout le monde (non) ou seulement pour toi(oui) '),

		),
	info: {
		name: 'code',
		description: 'ouvres visual studio code sur le serveur',
		category: 'stockage',
		usage: 'code <confidentiel>',
		examples: ['/code confidentiel:false'],
	},
	async execute(interaction) {
	/*	const file = interaction.options.getString('fichier');
		const language = interaction.options.getString('language'); */
		const response = interaction.options.getBoolean('confidentiel');
		const url = 'https://code.' + interaction.guildId + '.vsnu.fr' ;

		if (response) {
			return interaction.reply({ content: `Voici l'url pour accéder a visual studio : ${url}`, ephemeral: true });
		}
		else {
			return interaction.reply(`Voici l'url pour accéder a visual studio : ${url}`);
		}


	},
};