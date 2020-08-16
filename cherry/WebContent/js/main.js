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

import AppBlock from '../components/AppBlock.js'
import AppBtn from '../components/AppBtn.js'
import AppDropdown from '../components/AppDropdown.js'
import AppModal from '../components/AppModal.js'
import AppPageHeader from '../components/AppPageHeader.js'
import AppSearchField from '../components/AppSearchField.js'
import AppTable from '../components/AppTable.js'

Vue.component("AppBlock", AppBlock)
Vue.component("AppBtn", AppBtn)
Vue.component("AppDropdown", AppDropdown)
Vue.component("AppModal", AppModal)
Vue.component("AppPageHeader", AppPageHeader)
Vue.component("AppSearchField", AppSearchField)
Vue.component("AppTable", AppTable)

new Vue({
	router,
	el: '#app',
	vuetify: new Vuetify({
		theme: {
			themes: {
				light: {
					primary: '#212121',
					secondary: '#6c757d',
					accent: '#3ea2fb',
					error: '#dc3545',
					petrol: '#17a499',
					background: '#F5F5F5',
				}
			},
			options: {
					customProperties: true
			},
		},
	}),
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