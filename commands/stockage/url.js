const { SlashCommandBuilder } = require('discord.js');

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
		category: 'stockage',
		type: 5,
		group : null,
		sub_command: null,
		nom : 'confidentiel',
		value: false,
		usage: 'url <Affiche pour tout le monde ou seulement pour toi >',
		examples: ['/url confidentiel:false'],
	},
	test:{
		name: 'url',
		options: [
			{
				name: 'confidentiel',
				value: false,
				type: 5,
			},
		],
		expect: 'Voici l\'url pour accéder au site web : https://123456789012345678.vsnu.fr',
		toBeEmbed: false,
		toBeMessage: true,
	},
	async execute(interaction) {
		const response = interaction.options.getBoolean('confidentiel');
		const url = 'https://' + interaction.guildId + '.vsnu.fr' ;

		if (response) {
			return await interaction.reply({ content: `Voici l'url pour accéder au site de stockage : ${url}`, ephemeral: true });
		}
		else {
			return await interaction.reply(`Voici l'url pour accéder au site de stockage : ${url}`);
		}

	},
};