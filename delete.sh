#!/bin/sh

# Récupérer l'argument Discord ID depuis la ligne de commande
discordid=$1


# Supprimer les Pods
kubectl delete pod code-server-pod${discordid} --grace-period=0 --force
kubectl delete pod memo${discordid} --grace-period=0 --force
kubectl delete pod filebrowser-pod${discordid} --grace-period=0 --force
kubectl delete pod httpd-pod${discordid} --grace-period=0 --force

# Supprimer le Service
kubectl delete service filebrowser-service${discordid} 
kubectl delete service memo-service${discordid}
kubectl delete service vscode-service${discordid}
kubectl delete service httpd-service${discordid}

# Supprimer l'Ingress
kubectl delete ingress ingress${discordid}

# Supprimer le PersistentVolume
kubectl delete pvc task-pv-claim${discordid} 

kubectl delete pv task-pv-volume${discordid} 

# Supprimer le PersistentVolumeClaim

# Supprimer le dossier de stockage
rm -rf /mnt/data/${discordid}

echo "Tous les objets associés à Discord ID ${discordid} ont été supprimés."
