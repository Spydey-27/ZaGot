const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');

function recupererMots(nomFichier) {
	try {
		// Lire le contenu du fichier texte de manière synchrone
		const contenuFichier = fs.readFileSync(nomFichier, 'utf-8');

		// Diviser le contenu en mots en utilisant un espace comme séparateur
		const mots = contenuFichier.split('\n');

		return mots;
	}
	catch (erreur) {
		console.error('Une erreur s\'est produite lors de la lecture du fichier :', erreur.message);
		return [];
	}
}

function formatListeMots(mots, server) {
	return mots.map((mot, index) => `${index + 1}. [${mot}](https://${server}.vsnu.fr/${mot})`).join('\n');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('liste l\'ensemble des fichiers stockés sur le serveur')
		.addBooleanOption(option =>
			option
				.setName('confidentiel')
				.setDescription('Affiche pour tout le monde (non) ou seulement pour toi(oui) '),

		),
	info: {
		name: 'list',
		description: 'liste l\'ensemble des fichiers stockés sur le serveur',
		category: 'stockage',
		type: 5,
		group : null,
		sub_command: null,
		nom : 'confidentiel',
		value: false,
		usage: 'list <Affiche pour tout le monde ou seulement pour toi >',
		examples: ['/list confidentiel:false'],
	},
	test:{
		name: 'list',
		options: [
			{
				name: 'confidentiel',
				value: false,
				type: 5,
			},
		],
		expect: 'Voici les fichier : \n -fichier1 \n -fichier2 \n -fichier3',
		toBeEmbed: false,
		toBeMessage: true,
	},
	async execute(interaction) {
		const execPromise = util.promisify(exec);
		const server = interaction.guild.id;

		async function runPythonScript() {
			try {
				await execPromise('ls /mnt/data/' + server + ' > /mnt/data/' + server + '/files.txt');
			}
			catch (error) {
				console.error('Sortie d\'erreur :', error.stderr);
				console.error(`Erreur lors de l'exécution de la commande : ${error}`);
			}
		}
		await runPythonScript();
		const tableauDeMots = recupererMots('/mnt/data/' + server + '/files.txt');

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Liste de Mots')
			.setDescription(formatListeMots(tableauDeMots, server));

		if (!embed) {
			return await interaction.reply({ content: 'erreur lors de la requête api', ephemeral: true });
		}
		await interaction.reply({ embeds: [embed], ephemeral: true });


		console.log(`l'id de la guilde est ${server}`);
	},
};