const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');

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
        examples: ['ctf 2 14\nAffiche les 2 premiers ctfs qui commencent dans 14 jours.'],
    },

    async execute(interaction) {
        const number = interaction.options.getInteger('limit');
        const jours = interaction.options.getInteger('dans');
        const tempsunix_today = interaction.client.readyTimestamp;
        const tempsunix_jours = jours * 86400 + tempsunix_today;
        const query = new URLSearchParams({
            limit: number,
            start: tempsunix_jours,
        });

        const dictResult = await request(`https://ctftime.org/api/v1/events/?${query}`);
        let apiResponse = await dictResult.body.json();
        if (!apiResponse) {
            return interaction.reply(`No results found for .`);
        }

        const ctf_builder = [];
        

        for (let i = 0; i < number; i++) {
            for (const [key, value] of Object.entries(apiResponse[i])) {
                if (value == null || value == '') {
                    apiResponse[i][key] = 'Non renseigné';
                }
              }
              

            ctf_builder[i] = new EmbedBuilder()
                .setColor('#f54ea7')
                .setTitle(apiResponse[i].title)
                .setDescription(apiResponse[i].description)
                .setURL(apiResponse[i].ctftime_url)
                .setThumbnail(apiResponse[i].logo)
                .addFields(
                    { name: 'Date de  début', value: apiResponse[i].start },
                    { name: 'Durée', value: `${apiResponse[i].duration.days} jours ---- ${apiResponse[i].duration.hours} heures` },
                    { name: 'Format', value: apiResponse[i].format },
                )
                .setFooter({text:'thanks to CTFTIME.org', icon_url :'https://ctftime.org/static/images/ct/logo.svg'});
            
            if (i == 0) {
                await interaction.reply({ content: 'Salut , voici les prochains CTF:', embeds: [ctf_builder[0]] });
            }
            else {
                await interaction.followUp({ embeds: [ctf_builder[i]] });
            }
        }

    }

}