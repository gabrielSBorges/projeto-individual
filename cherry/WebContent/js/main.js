import pages from "./telas.js"

let routes = []

pages.getPages.map(tela => {
	const { name, path, component, redirect, meta } = tela

	let pathObj = {
		name,
		path,
		component,
		meta: meta || {}
	}

	if (redirect) {
		pathObj.redirect = redirect 
	}

	routes.push(pathObj)
})

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	const requiresAuth = to.meta.requiresAuth

	if (requiresAuth && !auth.isLoggedIn()) {
		next({ name: 'login' })
	}
	else if (!requiresAuth && auth.isLoggedIn()) {
		next({ name: 'home' })
	}
	else {
		next()
	}
})

Vue.use(Toasted)

Vue.toasted.register('error',
	(payload) => {
		return payload
	},
	{
		type: 'error',
		duration: 4000
	}
)

Vue.toasted.register('success',
	(payload) => {
		return payload
	},
	{
		type: 'success',
		duration: 3000
	}
)

Vue.toasted.register('info',
	(payload) => {
		return payload
	},
	{
		type: 'info',
		duration: 3000
	}
)

import Default from '../layouts/default.js'
import AppBlock from '../components/AppBlock.js'
import AppBtn from '../components/AppBtn.js'
import AppExportTable from '../components/AppExportTable.js'
import AppDataInfo from '../components/AppDataInfo.js'
import AppDropdown from '../components/AppDropdown.js'
import AppModal from '../components/AppModal.js'
import AppPageHeader from '../components/AppPageHeader.js'
import AppSearchField from '../components/AppSearchField.js'
import AppTable from '../components/AppTable.js'

Vue.component("Default", Default)
Vue.component("AppBlock", AppBlock)
Vue.component("AppBtn", AppBtn)
Vue.component("AppExportTable", AppExportTable)
Vue.component("AppDataInfo", AppDataInfo)
Vue.component("AppDropdown", AppDropdown)
Vue.component("AppModal", AppModal)
Vue.component("AppPageHeader", AppPageHeader)
Vue.component("AppSearchField", AppSearchField)
Vue.component("AppTable", AppTable)

axios.defaults.baseURL = 'http://localhost:8080/cherry/rest'

new Vue({
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
					warning: '#FFB300',
					error: '#E57373',
					default: '#E0E0E0',
				}
			},
			options: {
				customProperties: true
			},
		},
	}),
	data() {
		return {
			telas: pages.getPages,
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

			let currentPage = this.telas.filter(tela => tela.path == currentPath)[0]

			document.title = `Cherry - ${currentPage.title}`
		}
	},
	mounted() {
		this.changePageTitle()
	}
}).$mount('#app')