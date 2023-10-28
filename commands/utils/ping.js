const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    //cooldown: 5, éviter le spam
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};

/* run: (client, message) =>{
    const embed = new MessageEmbed()
        .setTitle('Hello')
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            {
            name: 'Latence', value: `\`${client.ws.ping}ms\``, inline: true},
            {
                name: 'Uptime', value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true}
        )
        .setTimestamp()
        .setFooter({text: message.author.username, iconURL: message.author.displayAvatarURL()});

  message.channel.send({ embeds: [embed] });
},
runSlash: (client, interaction) =>{
    interaction.reply('Pong!');
},
};
*/
