#!/bin/sh


kubeconfig_file="config"

# Supprimer le fichier kubeconfig s'il existe
[ -e "$kubeconfig_file" ] && rm "$kubeconfig_file"

# Contenu du fichier kubeconfig
cat <<EOF > "$kubeconfig_file"
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: "$CERTIFICATE_AUTHORITY_DATA"
    server: https://192.168.1.190:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: $CLIENT_CERTIFICATE_DATA
    client-key-data: $CLIENT_KEY_DATA
EOF

echo "Le fichier kubeconfig a été généré avec succès : $kubeconfig_file"


node index.js