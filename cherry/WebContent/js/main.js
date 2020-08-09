import telas from './telas.js'

let routes = []

telas.map(tela => {
	const { path, component } = tela
	
	routes.push({ path, component })
})

const router = new VueRouter({
	routes
})


import LayoutDefault from '../layouts/LayoutDefault.js'

Vue.component("LayoutDefault", LayoutDefault)

new Vue({
	router,
	el: '#app',
	vuetify: new Vuetify(),
	data: {
		
	},
	methods: {
		
	}
}).$mount('#app')