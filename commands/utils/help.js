const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const parcours = require('../../function/parcours_command.js');

const commands = parcours();


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Commande help')
		.addStringOption(option =>
			option
				.setName('command')
				.setDescription('Taper le nom de votre commande')
				.setRequired(false),
		),
	info: {
		name: 'help',
		description: 'L\'aide pour savoir comment marchent les commandes',
		category: 'utils',
		usage: 'help <command>',
		examples: ['command:ctf'],
	},
	test:{
		name: 'help',
		options: [
			{
				name: 'command',
				value: 'ctf',
				type: 3,
			},
		],
		expect: 'Infos sur une commande',
		toBeEmbeds: true,
		toBeMessage: false,
	},
	async execute(interaction) {
		const cmd = interaction.options.getString('command');
		if (cmd) {
			for (let i = 0; i < commands.length; i++) {
				const command = commands[i].info;
				if (command.name == cmd) {
					const ArgsEmbed = new EmbedBuilder()
						.setColor('#f54ea7')
						.setTitle(`\`${command.name}\``)
						.setDescription(command.description)
						.addFields({

							name: 'Utilisation :',
							value: command.usage,
						},
						{
							name: 'Exemples:',
							value: `\\${command.examples}`,
						},
						);
					return await interaction.reply({ embeds: [ArgsEmbed], ephemeral: true });
				}
			}
			return await interaction.reply({ content: 'cette commande n\'existe pas!', ephemeral: true });
		}
	},
};