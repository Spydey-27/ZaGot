const { ChannelType, Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		try {
			client.guilds.cache.forEach(guild => {
				guild.commands.fetch()
				  .then(commands => {
						commands.forEach(command => console.log(`Commande : ${command.name} dans la guilde : ${guild.name}`));
				  })
				  .catch(console.error);
			  });

			  const channel = client.channels.cache.find(channell => channell.name === 'test');

			  // Vérifier si le canal existe et s'il est un canal de texte
			  if (channel && channel.ChannelType === ChannelType.GUILD_TEXT) {
				// Envoyer un message à ce canal
				channel.send('Hello, World!');
			  }
		}
		catch (error) {
			console.error(error);
		}
	},
};
