#!/bin/bash

# Se déplacer dans le répertoire du code
cd $CODE_DIR

# Exécuter git pull
git pull origin master  # Assurez-vous de spécifier la branche correcte

# Autres tâches de déploiement (reconstruction, redémarrage de services, etc.) si nécessaire
cd 