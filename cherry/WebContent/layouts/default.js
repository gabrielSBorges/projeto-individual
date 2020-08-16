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
			
			<v-btn icon @click="logout()" class="white--text">
				<v-icon>mdi-logout</v-icon>
			</v-btn>
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
				<slot />
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
	},
	methods: {
		logout() {
			this.$router.push('/login')
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