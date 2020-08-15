const template = /*html*/`
	
	<div class="mt-1 mb-10">
		<v-container>
			<div style="user-select: none" class="text-h5 grey--text text--darken-1">{{ pageTitle }} &nbsp; ></div>
		</v-container>
		
		<v-divider />
	</div>

`

import telas from '../js/telas.js'

export default {
	template,
	computed: {
		pageTitle() {
			const currentPath = this.$route.path
			
			let pageTitle = telas.find(tela => tela.path == currentPath).title
			
			return pageTitle
		}
	}
}