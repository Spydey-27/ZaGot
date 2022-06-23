const { MessageEmbed } = require('discord.js');
const messageCreate = require('../../events/guild_messages/messageCreate');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    name: 'ctf',
    description: 'Affiche les prochains CTF',
    category: 'utils',
    usage: 'ctf <nombre de ctf> <qui se terminent dans combien de jour?>',
    examples: ['ctf 2 14\nAffiche les 2 premiers ctfs qui se terminent au max dans 14 jours.'],
    options: [
        {
           name: 'limit',
           description: "Nombre de ctf à afficher max 5",
           type: "NUMBER",
           required: true,
           maxValue: 5,
           minValue: 1,
        },
        {
            name: 'jours',
            description: "Ctf qui se terminent dans combien de jours ?",
            type: "NUMBER",
            required: true,
            maxValue: 14,
            minValue: 1,
         }

    ],
    runSlash: async(client, interaction) =>{
        const number = interaction.options.getNumber('limit');
        const jours = interaction.options.getNumber('limit');
        const tempsunix_today = client.readyTimestamp;
        const tempsunix_jours = jours*86400 + tempsunix_today;
        await fetch(`https://ctftime.org/api/v1/events/?limit=${number}&start=${tempsunix_today}&finish=${tempsunix_jours}`)
           
            
            .then(res => res.json())
            .then(async data => {
                let embed=[];
                for(let i = 0; i < number; i++)
                {
                    const img = data[i].logo;
                    embed[i] = {
                        color: 0x0099ff,
                        title: `${i+1}- ${data[i].title}`,
                        description: data[i].description,
                        url: data[i].ctftime_url,
                        thumbnail: 
                        {
                            url: img,
                        },
                        fields:[
                            {
                            name: 'Date de  début',
                            value: data[i].start,
                        },
                        {
                            name: 'Durée',
                            value: `${data[i].duration.days} jours ---- ${data[i].duration.hours} heures`,
                        },
                        {
                            name: 'Format',
                            value: data[i].format,
                        },
                        ],
                        footer:
                        {
                            text: 'thanks to CTFTIME.org',
                            icon_url: 'https://ctftime.org/static/images/ct/logo.svg'
                        },
                    };
                   if(i == 0)
                   {
                        await interaction.reply({ content: 'Salut @everyone, voici les prochains CTF:' , embeds: [embed[0]]});
                   }
                   else{
                    await interaction.followUp({ embeds: [embed[i]]});
                   }
                   
                }
               
            });

       
    },
};

