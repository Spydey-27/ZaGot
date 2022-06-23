const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);



module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        if(!cmd.name || !cmd.description) return console.log(`-------\nCommande non-chargée: pas de nom et ou description\nFichier -> ${cmdFile}\n--------`);   

        if(!cmd.category) return console.log(`-------\nCommande non-chargée: pas de category\nFichier -> ${cmdFile}\n--------`)
        client.commands.set(cmd.name, cmd);
        console.log(`Commande chargée: ${cmd.name}`);

       
    });
};
