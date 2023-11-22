const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	// cooldown: 5, éviter le spam
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	info: {
		name: 'ping',
		description: 'Répond par pong',
		category: 'utils',
		usage: 'ping',
		examples: [''],
	},
	test:{
		name: 'ping',
		type : 0,
		expect: 'Pong!',
		toBeEmbed: false,
		toBeMessage: true,
	},
	async execute(interaction) {
		return await interaction.reply('Pong!');
	},
};