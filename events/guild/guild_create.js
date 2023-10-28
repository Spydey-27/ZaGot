const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
    async execute(client){
        console.log(`Joined new guild: ${guild.name}`);
        const server = guild.id;

        console.log(`l'id de la guilde est ${server}`);
    },
   
};


