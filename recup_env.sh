#!/bin/sh

# Répertoire contenant les fichiers secrets
secrets_dir="/secrets"

# Chemin du fichier .env
env_file="/usr/src/bot/ZaGot/.env"

# Supprimer le fichier .env s'il existe
[ -e "$env_file" ] && rm "$env_file"

# Boucle à travers les fichiers dans le répertoire /secrets
for secret_file in "$secrets_dir"/*; do
    # Extraire le nom de la clé du nom du fichier
    key=$(basename "$secret_file")
    # Lire la valeur depuis le fichier
    value=$(cat "$secret_file" | tr -d '[:space:]')

    # Ajouter la clé et la valeur au fichier .env
    echo "$key=$value" >> "$env_file"
done

echo "Les valeurs ont été écrites dans $env_file"
node index.js