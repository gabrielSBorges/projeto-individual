const template = /*html*/`
	
	<div class="mt-1 mb-10">
		<v-container>
			<div style="user-select: none" class="text-h5 mx-16 px-16" color="primary">{{ pageTitle }} &nbsp; ></div>
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