const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

// ---------------- A optimiser et recupérer du fichier deploy-commands.js ---------------- //
const commands = [{}];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.dirname(__dirname);
// 'commands' is the folder name, you can change this to match yours
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('info' in command && 'execute' in command) {
			commands.push(command.info);
		}
	}
}

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
		examples: ['help ctf'],
	},
	async execute(interaction) {
		const cmd = interaction.options.getString('command');
		if (cmd) {
			for (let i = 0; i < commands.length; i++) {
				const command = commands[i];
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

					return interaction.reply({ embeds: [ArgsEmbed], ephemeral: true });
				}
			}
			return interaction.reply({ content: 'cette commande n\'existe pas!', ephemeral: true });
		}
	},
};

/* const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const messageCreate = require('../../events/guild_messages/messageCreate');
const commandFolder = readdirSync('./commands');

module.exports = {
    name: 'help',
    category: 'utils',
    description: 'Commande help',
    options: [
        {
            name: 'command',
        description: 'Taper le nom de votre commande',
        type: 'STRING',
        required: false
        }
    ],
    runSlash: (client, interaction) =>{
        const options = interaction.options.getString('command');
        const cmd = client.commands.get(options);
        if(!options){
            const noArgsEmbed = new MessageEmbed()
                .setColor('#f54ea7')
                .addField('Liste des commandes', 'Liste des commandes par catégories.\nPour plus d\'informations sur une commande, tapez \\help <command>')

            for(const category of commandFolder){
                    noArgsEmbed.addField(
                        `${category}`,
                        `${client.commands.filter(cmd => cmd.category == category.toLocaleLowerCase()).map(cmd => cmd.name).join(', ')}`
                    );
            }
            return interaction.reply({ embeds: [noArgsEmbed], ephemeral: true});

        }
        else if(!cmd)
            return interaction.reply({content: 'cette commande n\'existe pas!', ephemeral: true});
        else
        {
            const ArgsEmbed = new MessageEmbed()
                .setColor('#f54ea7')
                .setTitle(`\`${cmd.name}\``)
                .setDescription(cmd.description)
                .addFields({

                    name: 'Utilisation :',
                    value: cmd.usage
                },
                {
                    name: 'Exemples:',
                    value: `\\${cmd.examples}`
                }
                )

            return interaction.reply({ embeds: [ArgsEmbed], ephemeral: true});


        }
    },
};

*/