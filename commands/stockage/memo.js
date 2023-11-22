const { SlashCommandBuilder } = require('discord.js');
// const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('memo')
		.setDescription('Ouvre un fichier memo sur le serveur')
		.addBooleanOption(option =>
			option
				.setName('confidentiel')
				.setDescription('Affiche pour tout le monde (non) ou seulement pour toi(oui) '),

		),
	info: {
		name: 'memo',
		description: 'ouvres un fichier memo sur le serveur',
		category: 'stockage',
		type: 5,
		group : null,
		sub_command: null,
		nom : 'confidentiel',
		value: false,
		usage: 'memo <confidentiel>',
		examples: ['confidentiel:false'],
	},
	test:{
		name: 'memo',
		options: [
			{
				name: 'confidentiel',
				value: false,
				type: 5,
			},
		],
		expect: 'Voici l\'url pour accéder au memo : https://memo.123456789012345678.vsnu.fr',
		toBeEmbed: false,
		toBeMessage: true,
	},
	async execute(interaction) {
	/*	const file = interaction.options.getString('fichier');
		const language = interaction.options.getString('language'); */
		const response = interaction.options.getBoolean('confidentiel');
		const url = 'https://memo.' + interaction.guildId + '.vsnu.fr' ;

		if (response) {
			return await interaction.reply({ content: `Voici l'url pour accéder au memo : ${url}`, ephemeral: true });
		}
		else {
			return await interaction.reply(`Voici l'url pour accéder au memeo : ${url}`);
		}


	},
};