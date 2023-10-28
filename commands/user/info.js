const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Affiche certaines info sur les membres du serveur')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('L\'utilisateur dont on veut les infos')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('mfa')
                .setDescription('Affiche si l\'utilisateur a l\'authentification à double facteur activée ou non')
        )
        .addStringOption(option =>
            option
                .setName('email')
                .setDescription('Affiche le mail de l\'utilisateur')
        ),
    info: {
        name: 'url',
        description: 'Demande l\'url pour accéder au site de stockage',
        category: 'utils',
        usage: 'url <Affiche pour tout le monde ou seulement pour toi >',
        examples: ['url oui\nAffiche l\'url pour toi uniquement'],
    },
    async execute(interaction) {
        const response = interaction.options.getBoolean('confidentiel');
        const user = {
            
        }
        const url = 'https://spydey.me';

        if(response){
            return interaction.reply({content: `Voici l'url pour accéder au site de stockage : ${url}`, ephemeral: true });
        }
        else{
            return interaction.reply(`Voici l'url pour accéder au site de stockage : ${url}`);
        }
        
    },
};