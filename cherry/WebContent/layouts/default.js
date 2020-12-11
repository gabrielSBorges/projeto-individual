const template = /*html*/`

	<div>
		<v-app-bar app clipped-left style="z-index: 10" color="primary">
			<v-row no-gutters>
				<!-- Menu lateral -->
				<v-col cols="4" class="text-left">
					<v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>

					<v-navigation-drawer v-model="drawer" clipped app clipped :style="navigationDrawerStyle" temporary just disable-resize-watcher>			
						<v-list dense class="pa-2">
							<v-list-item v-for="(item, i) in telas" :key="i" v-if="item.inMenu"
								exact  
								@click="loadPage(item.path)" 
								:style="currentPath(item.path) ? listStyle : ''"
							>
								<v-list-item-icon>
									<v-icon :class="currentPath(item.path) ? 'white--text' : ''">{{ item.icon }}</v-icon>
								</v-list-item-icon>

								<v-list-item-content>
									<v-list-item-title v-text="item.title" class="text-button pt-1" :class="currentPath(item.path) ? 'white--text' : ''" />
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-navigation-drawer>
				</v-col>

				<!-- Logo do sistema -->
				<v-col cols="4" class="text-center">
					<v-avatar @click="loadPage('/')" style="cursor: pointer; user-select: none;">
						<img
							src="./images/cereja.png"
							alt="Logo do sistema Cherry"
						>
					</v-avatar>
				</v-col>

				<!-- Menu usuário -->
				<v-col cols="4" align-self="center" class="text-right">
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<span class="white--text app-btn-text" v-bind="attrs" v-on="on">
								{{ usuario }}
								
								<v-icon color="white" class="ml-1">mdi-cog</v-icon>
							</span>
						</template>

						<v-list class="pa-0">
							<v-list-item v-for="(item, index) in btnsUsuario" :key="index" @click="item.function" class="app-btn-usuario">
								<v-list-item-title>{{ item.title }}</v-list-item-title>

								<v-icon class="ml-4">{{ item.icon }}</v-icon>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-col>
			</v-row>
		</v-app-bar>
		
		<!-- Conteúdo da página -->
		<v-main>
			<app-page-header />
			
			<v-container>
				<div class="mx-16 px-16">
					<slot />
				</div>
			</v-container>
		</v-main>
	</div>

`

import pages from '../js/telas.js'

export default {
	template,
	data() {
		return {
			drawer: false,
			telas: pages.getPages,
			btnsUsuario: [
				{
					icon: 'mdi-account',
					title: 'Meu Perfil',
					function: this.openProfile
				},
				{
					icon: 'mdi-logout',
					title: 'Sair',
					function: this.logout
				}
			]
		}
	},
	computed: {
		navigationDrawerStyle() {
			return `margin-top: ${this.$vuetify.application.top}px`
		},

		listStyle() {
			return {
				'background-color': 'var(--v-secondary-base)',
				'border-radius': '5px'
			}
		},

		usuario() {
			return auth.user.nome
		}
	},
	methods: {
		async logout() {
			await auth.logout()
			this.$router.push('/login')
		},

		openProfile() {
			this.$router.push('/meus_perfil')
		},

		loadPage(path) {
			this.drawer = false
			
			if (this.$route.path !== path) {
				this.$router.push(path)				
			}
		},

		currentPath(caminho) {
			if (this.$route.path == caminho) {
				return true
			}
			else {
				return false
			}
		}
	}
}