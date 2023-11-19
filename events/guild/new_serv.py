from kubernetes import client, config
import sys
import os
# Récupérer l'argument discordid à partir de la ligne de commande
discordid = sys.argv[1]

#cree le dossier de stockage

os.system(f"mkdir /mnt/data/{discordid}")

# Charger la configuration du cluster Kubernetes depuis le fichier kubeconfig
config.load_kube_config()

# Utiliser discordid pour rendre chaque ressource unique
unique_name_suffix = f"-{discordid}"

# Créer un objet PersistentVolume
volume = client.V1PersistentVolume(
    metadata=client.V1ObjectMeta(name=f"task-pv-volume{unique_name_suffix}"),
    spec=client.V1PersistentVolumeSpec(
        storage_class_name="manual",
        capacity={"storage": "20Gi"},
        access_modes=["ReadWriteOnce"],
        host_path=client.V1HostPathVolumeSource(path=f"/mnt/data/{unique_name_suffix}")
    )
)

# Créer un objet PersistentVolumeClaim
volume_claim = client.V1PersistentVolumeClaim(
    metadata=client.V1ObjectMeta(name=f"task-pv-claim{unique_name_suffix}"),
    spec=client.V1PersistentVolumeClaimSpec(
        storage_class_name="manual",
        access_modes=["ReadWriteOnce"],
        resources=client.V1ResourceRequirements(requests={"storage": "1Gi"})
    )
)

# Créer un objet Pod pour code-server
pod_vscode = client.V1Pod(
    metadata=client.V1ObjectMeta(name=f"code-server-pod{unique_name_suffix}", labels={"ingress": "common", "app": "vscode"}),
    spec=client.V1PodSpec(
        volumes=[
            client.V1Volume(
                name="task-pv-storage",
                persistent_volume_claim=client.V1PersistentVolumeClaimVolumeSource(claim_name=f"task-pv-claim{unique_name_suffix}")
            )
        ],
        containers=[
            client.V1Container(
                name="code-server",
                image="visnu04/vscode-zagot",
                volume_mounts=[
                    client.V1VolumeMount(mount_path="/config/workspace", name="task-pv-storage")
                ],
                ports=[client.V1ContainerPort(container_port=8443)],
                env=[
                    client.V1EnvVar(name="CODE_SERVER_PASSWORD", value="jg8fr8f41"),
                    client.V1EnvVar(name="DEFAULT_WORKSPACE", value="/config/workspace"),
                ]
            )
        ]
    ),
)

# Créer un objet Pod pour Memos
pod_memo = client.V1Pod(
    metadata=client.V1ObjectMeta(name=f"memo{unique_name_suffix}", labels={"ingress": "common", "app": "memo"}),
    spec=client.V1PodSpec(
        volumes=[
            client.V1Volume(
                name="task-pv-storage",
                persistent_volume_claim=client.V1PersistentVolumeClaimVolumeSource(claim_name=f"task-pv-claim{unique_name_suffix}")
            )
        ],
        containers=[
            client.V1Container(
                name="memos",
                image="ghcr.io/usememos/memos:latest",
                volume_mounts=[
                    client.V1VolumeMount(mount_path="/var/opt/memos", name="task-pv-storage")
                ],
                ports=[client.V1ContainerPort(container_port=5230)],
            )
        ]
    ),
)

# Créer un objet Pod pour GitLab
# pod_gitlab = client.V1Pod(
#     metadata=client.V1ObjectMeta(name=f"gitlab-pod{unique_name_suffix}", labels={"ingress": "gitlab", "app": "gitlab"}),
#     spec=client.V1PodSpec(
#         volumes=[
#             client.V1Volume(
#                 name="task-pv-storage",
#                 persistent_volume_claim=client.V1PersistentVolumeClaimVolumeSource(claim_name=f"task-pv-claim{unique_name_suffix}")
#             ),
#             client.V1Volume(name="gitlab-config", empty_dir={}),
#             client.V1Volume(name="gitlab-logs", empty_dir={}),
#             client.V1Volume(name="gitlab-data", empty_dir={}),
#         ],
#         containers=[
#             client.V1Container(
#                 name="gitlab",
#                 image="gitlab/gitlab-ee:latest",
#                 volume_mounts=[
#                     client.V1VolumeMount(mount_path="/etc/gitlab", name="gitlab-config"),
#                     client.V1VolumeMount(mount_path="/var/log/gitlab", name="gitlab-logs"),
#                     client.V1VolumeMount(mount_path="/var/opt/gitlab", name="gitlab-data"),
#                 ],
#                 ports=[
#                     client.V1ContainerPort(container_port=443),
#                     client.V1ContainerPort(container_port=80),
#                     client.V1ContainerPort(container_port=22)
#                 ],
#             )
#         ],
#         restart_policy="Always",
#     ),
# )

# Créer un objet Pod pour Filebrowser
pod_filebrowser = client.V1Pod(
    metadata=client.V1ObjectMeta(name=f"filebrowser-pod{unique_name_suffix}", labels={"ingress": "common", "app": "filebrowser"}),
    spec=client.V1PodSpec(
        volumes=[
            client.V1Volume(
                name="task-pv-storage",
                persistent_volume_claim=client.V1PersistentVolumeClaimVolumeSource(claim_name=f"task-pv-claim{unique_name_suffix}")
            )
        ],
        containers=[
            client.V1Container(
                name="filebrowser",
                image="filebrowser/filebrowser",
                volume_mounts=[
                    client.V1VolumeMount(mount_path="/srv", name="task-pv-storage")
                ],
                ports=[client.V1ContainerPort(container_port=80)],
                env=[
                    client.V1EnvVar(name="FB_NOAUTH", value="true"),
                ]
            )
        ]
    )
)

# Créer des objets Service
service = client.V1Service(
    metadata=client.V1ObjectMeta(name=f"common-service{unique_name_suffix}"),
    spec=client.V1ServiceSpec(
        selector={"ingress": "common"},
        ports=[
            client.V1ServicePort(port=80, target_port=80, name="http-upload"),
            client.V1ServicePort(port=8443, target_port=8443, name="http-view"),
            client.V1ServicePort(port=5230, target_port=5230, name="http-memo"),
        ]
    )
)

# Créer un objet Service pour GitLab
# service_gitlab = client.V1Service(
#     metadata=client.V1ObjectMeta(name=f"gitlab-service{unique_name_suffix}"),
#     spec=client.V1ServiceSpec(
#         selector={"ingress": "gitlab"},
#         ports=[
#             client.V1ServicePort(port=80, target_port=80, name="http-gitlab"),
#             client.V1ServicePort(port=443, target_port=443, name="https-gitlab"),
#             client.V1ServicePort(port=22, target_port=22, name="ssh-gitlab"),
#         ]
#     )
#)

# Créer des objets Ingress
ingress = client.NetworkingV1Api().create_namespaced_ingress(
    namespace="default",
    body=client.V1Ingress(
        metadata=client.V1ObjectMeta(name=f"ingress{unique_name_suffix}", annotations={"nginx.ingress.kubernetes.io/rewrite-target": "/", "kubernetes.io/ingress.class": "nginx"}),
        spec=client.V1IngressSpec(
            rules=[
                client.V1IngressRule(
                    host=f"upload-{unique_name_suffix}.vsnu.fr",
                    http=client.V1HTTPIngressRuleValue(
                        paths=[
                            client.V1HTTPIngressPath(
                                path="/",
                                path_type="Prefix",
                                backend=client.V1IngressBackend(
                                    service=client.V1IngressServiceBackend(
                                        port=client.V1ServiceBackendPort(
                                            number=80
                                        ),
                                        name=f"common-service{unique_name_suffix}"
                                    )
                                )
                            )
                        ]
                    )
                ),
                client.V1IngressRule(
                    host=f"code-{unique_name_suffix}.vsnu.fr",
                    http=client.V1HTTPIngressRuleValue(
                        paths=[
                            client.V1HTTPIngressPath(
                                path="/",
                                path_type="Prefix",
                                backend=client.V1IngressBackend(
                                    service=client.V1IngressServiceBackend(
                                        port=client.V1ServiceBackendPort(
                                            number=8443
                                        ),
                                        name=f"common-service{unique_name_suffix}"
                                    )
                                )
                            )
                        ]
                    )
                ),
                client.V1IngressRule(
                    host=f"memo-{unique_name_suffix}.vsnu.fr",
                    http=client.V1HTTPIngressRuleValue(
                        paths=[
                            client.V1HTTPIngressPath(
                                path="/",
                                path_type="Prefix",
                                backend=client.V1IngressBackend(
                                    service=client.V1IngressServiceBackend(
                                        port=client.V1ServiceBackendPort(
                                            number=5230
                                        ),
                                        name=f"common-service{unique_name_suffix}"
                                    )
                                )
                            )
                        ]
                    )
                ),
                # client.V1IngressRule(
                #     host=f"gitlab-{unique_name_suffix}.vsnu.fr",
                #     http=client.V1HTTPIngressRuleValue(
                #         paths=[
                #             client.V1HTTPIngressPath(
                #                 path="/",
                #                 path_type="Prefix",
                #                 backend=client.V1IngressBackend(
                #                     service=client.V1IngressServiceBackend(
                #                         port=client.V1ServiceBackendPort(
                #                             number=80
                #                         ),
                #                         name=f"gitlab-service{unique_name_suffix}"
                #                     )
                #                 )
                #             )
                #         ]
                #     )
                # ),
                # client.V1IngressRule(
                #     host=f"gitlab{unique_name_suffix}.mondomaine.fr",
                #     http=client.V1HTTPIngressRuleValue(
                #         paths=[
                #             client.V1HTTPIngressPath(
                #                 path="/",
                #                 path_type="Prefix",
                #                 backend=client.V1IngressBackend(
                #                     service=client.V1IngressServiceBackend(
                #                         port=client.V1ServiceBackendPort(
                #                             number=443
                #                         ),
                #                         name=f"gitlab-service{unique_name_suffix}"
                #                     )
                #                 )
                #             )
                #         ]
                #     )
                #),
                # client.V1IngressRule(
                #     host=f"gitlab{unique_name_suffix}.mondomaine.fr",
                #     http=client.V1HTTPIngressRuleValue(
                #         paths=[
                #             client.V1HTTPIngressPath(
                #                 path="/",
                #                 path_type="Prefix",
                #                 backend=client.V1IngressBackend(
                #                     service=client.V1IngressServiceBackend(
                #                         port=client.V1ServiceBackendPort(
                #                             number=22
                #                         ),
                #                         name=f"gitlab-service{unique_name_suffix}"
                #                     )
                #                 )
                #             )
                #         ]
                #     )
                # ),
            ]
        )
    )
)

# Créer des objets à l'aide de l'API Kubernetes
api_instance = client.CoreV1Api()
api_instance.create_persistent_volume(volume)
api_instance.create_namespaced_persistent_volume_claim(body=volume_claim, namespace="default")
api_instance.create_namespaced_pod(body=pod_vscode, namespace="default")
api_instance.create_namespaced_pod(body=pod_memo, namespace="default")
#api_instance.create_namespaced_pod(body=pod_gitlab, namespace="default")
api_instance.create_namespaced_pod(body=pod_filebrowser, namespace="default")
api_instance.create_namespaced_service(body=service, namespace="default")
#api_instance.create_namespaced_service(body=service_gitlab, namespace="default")
