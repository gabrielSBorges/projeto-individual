import telas from './telas.js'

let routes = []

telas.map(tela => {
	const { path, component } = tela
	
	routes.push({ path, component })
})

const router = new VueRouter({
	routes
})

import Default from '../layouts/default.js'

Vue.component("Default", Default)

new Vue({
	router,
	el: '#app',
	vuetify: new Vuetify(),
	data() {
		return {
			telas			
		}
	},
	watch: {
		'$route'() {
			this.changePageTitle()
		}
	},
	methods: {
		loadPage(path) {
			this.$router.push(path)
		},
		
		changePageTitle() {
			let currentPath = this.$route.path
						
			let currentPage = telas.filter(tela => tela.path == currentPath)[0]
			
			document.title = `Cherry - ${currentPage.title}`
		}
	},
	mounted() {
		this.changePageTitle()
	}
}).$mount('#app')