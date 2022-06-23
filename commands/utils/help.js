const { MessageEmbed } = require('discord.js');
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

