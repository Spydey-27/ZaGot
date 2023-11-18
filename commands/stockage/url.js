const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('url')
		.setDescription('Demande l\'url pour accéder au site de stockage')
		.addBooleanOption(option =>
			option
				.setName('confidentiel')
				.setDescription('Affiche pour tout le monde (non) ou seulement pour toi(oui) '),

		),
	info: {
		name: 'url',
		description: 'Demande l\'url pour accéder au site de stockage',
		category: 'utils',
		usage: 'url <Affiche pour tout le monde ou seulement pour toi >',
		examples: ['url non'],
	},
	async execute(interaction) {
		const response = interaction.options.getBoolean('confidentiel');
		const url = 'https://' + interaction.guildId + '.vsnu.fr' ;

		if (response) {
			return interaction.reply({ content: `Voici l'url pour accéder au site de stockage : ${url}`, ephemeral: true });
		}
		else {
			return interaction.reply(`Voici l'url pour accéder au site de stockage : ${url}`);
		}

	},
};