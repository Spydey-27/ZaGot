const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

async function getApi(number, jours) {
	const tempsunix_jours = jours * 86400 + Math.floor(Date.now() / 1000);
	const query = new URLSearchParams({
		limit: number,
		start: tempsunix_jours,
	});

	const dictResult = await request(`https://ctftime.org/api/v1/events/?${query}`);
	const api_reponse = await dictResult.body.json();
	if (!api_reponse) {

		return null;
	}
	const ctf_builder = [];
	for (let i = 0; i < number; i++) {
		for (const [key, value] of Object.entries(api_reponse[i])) {
			if (value == null || value == '' || value == undefined) {
				api_reponse[i][key] = 'Non renseigné';
			}
		}

		ctf_builder[i] = new EmbedBuilder()
			.setColor('#f54ea7')
			.setTitle(api_reponse[i].title)
			.setDescription(api_reponse[i].description)
			.setURL(api_reponse[i].ctftime_url)
		// .setThumbnail(api_reponse[i].logo)
			.addFields(
				{ name: 'Date de  début', value: api_reponse[i].start },
				{ name: 'Durée', value: `${api_reponse[i].duration.days} jours ---- ${api_reponse[i].duration.hours} heures` },
				{ name: 'Format', value: api_reponse[i].format },
			)
			.setFooter({ text:'thanks to CTFTIME.org', icon_url :'https://ctftime.org/static/images/ct/logo.svg' });


		if (api_reponse[i].logo) {
			ctf_builder[i].setURL(api_reponse[i].ctftime_url);
		}

	}
	return ctf_builder;

}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ctf')
		.setDescription('Affiche les prochains CTF')
		.addIntegerOption(option =>
			option
				.setName('limit')
				.setDescription('Nombre de ctf à afficher max 5')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(5),
		)
		.addIntegerOption(option =>
			option
				.setName('dans')
				.setDescription('qui commencent dans combien de jours  ?')
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(14),
		),
	info: {
		name: 'ctf',
		description: 'Affiche les prochains CTF',
		category: 'utils',
		usage: 'ctf <nombre de ctf> <qui commecent dans combien de jours ( 0 = aujourd\'hui) ?>',
		examples: ['limit:1 dans:2'],
	},
	test:{
		name: 'ctf',
		options: [
			{
				name: 'limit',
				value: 1,
				type: 4,
			},
			{
				name: 'dans',
				value: 2,
				type: 4,
			},
		],
		expect: 'test',
		toBeEmbeds: true,
		toBeMessage: true,
	},

	async execute(interaction) {
		const number = interaction.options.getInteger('limit');
		const jours = interaction.options.getInteger('dans');

		const ctf_builder = await getApi(number, jours);
		if (!ctf_builder) {
			return await interaction.reply({ content: 'erreur lors de la requête api', ephemeral: true });
		}
		await interaction.reply({ content: 'Voici les prochains CTF', ephemeral: true });
		for (const ctf of ctf_builder) {
			await interaction.followUp({ embeds: [ctf], ephemeral: true });
		}

	},

};