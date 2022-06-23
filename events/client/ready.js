module.exports = {
    name: 'ready',
    once: true,
    async execute(client){
        console.log('im ready');

        //const devGuild = await client.guilds.cache.get('981493939154599956');
        //devGuild.commands.set(client.commands.map(cmd => cmd));
        client.application.commands.set(client.commands.map(cmd => cmd));

    },
};
