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
import AppBlock from '../components/AppBlock.js'
import AppBtn from '../components/AppBtn.js'
import AppDataInfo from '../components/AppDataInfo.js'
import AppDropdown from '../components/AppDropdown.js'
import AppModal from '../components/AppModal.js'
import AppPageHeader from '../components/AppPageHeader.js'
import AppSearchField from '../components/AppSearchField.js'
import AppTable from '../components/AppTable.js'

axios.defaults.baseURL = 'http://localhost:8080/cherry/rest'

const vm = new Vue({
	router,
	el: '#app',
	vuetify: new Vuetify({
		theme: {
			themes: {
				light: {
					primary: '#212121',
					secondary: '#424242',
					background: '#F5F5F5',

					success: '#81C784',
					info: '#64B5F6',
					error: '#E57373',
					default: '#E0E0E0',
				}
			},
			options: {
				customProperties: true
			},
		},
	}),
	components: {
		Default,
		AppBlock,
		AppBtn,
		AppDataInfo,
		AppDropdown,
		AppModal,
		AppPageHeader,
		AppSearchField,
		AppTable
	},
	data() {
		return {
			telas,
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