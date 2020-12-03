const template = /*html*/`

	<div>
		<v-app-bar app clipped-left style="z-index: 10" color="primary">
			<v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
			
			<v-spacer></v-spacer>
			
			<v-avatar @click="loadPage('/')" style="cursor: pointer; user-select: none;">
				<img
					src="./images/cereja.png"
					alt="Logo do sistema Cherry"
				>
			</v-avatar>
			
			<v-spacer></v-spacer>
			
			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<div class="white--text app-btn-text" v-bind="attrs" v-on="on">
						{{ usuario }}
					</div>
				</template>

				<v-list class="pa-0">
					<v-list-item v-for="(item, index) in btnsUsuario" :key="index" @click="item.function" class="app-btn-usuario">
						<v-list-item-title>{{ item.title }}</v-list-item-title>

						<v-icon class="ml-4">{{ item.icon }}</v-icon>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		
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
		
		<v-main>
			<app-page-header />
			
			<v-container>
				<div class="mx-12">
					<slot />
				</div>
			</v-container>
		</v-main>
	</div>

`

import telas from '../js/telas.js'

export default {
	template,
	data() {
		return {
			drawer: false,
			telas,
			btnsUsuario: [
				{
					icon: 'mdi-cog',
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