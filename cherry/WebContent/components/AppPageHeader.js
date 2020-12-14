const template = /*html*/`
	
	<div class="mt-1 mb-10">
		<v-container>
			<div style="user-select: none" class="text-h5 mx-16 px-16" color="primary">{{ pageTitle }} &nbsp; ></div>
		</v-container>
		
		<v-divider />
	</div>

`

import pages from '../js/telas.js'

export default {
	template,
	data() {
		return {
			telas: pages.getPages
		}
	},
	computed: {
		pageTitle() {
			const currentPath = this.$route.path
			
			return auth.isLoggedIn() ? this.telas.find(tela => tela.path == currentPath).title : ''
		}
	}
}