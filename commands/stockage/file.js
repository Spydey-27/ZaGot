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
		type: 5,
		group : null,
		sub_command: null,
		nom : 'confidentiel',
		value: false,
		examples: ['confidentiel:false'],
	},
	test:{
		name: 'file',
		options: [
			{
				name: 'confidentiel',
				value: false,
				type: 5,
			},
		],
		expect: 'Voici l\'url pour accéder au stockage : https://file.123456789012345678.vsnu.fr',
		toBeEmbed: false,
		toBeMessage: true,
	},
	async execute(interaction) {
	/*	const file = interaction.options.getString('fichier');
		const language = interaction.options.getString('language'); */
		const response = interaction.options.getBoolean('confidentiel');
		const url = 'https://file.' + interaction.guildId + '.vsnu.fr' ;

		if (response) {
			return await interaction.reply({ content: `Voici l'url pour accéder au stockage : ${url}`, ephemeral: true });
		}
		else {
			return await interaction.reply(`Voici l'url pour accéder au stockage : ${url}`);
		}


	},
};