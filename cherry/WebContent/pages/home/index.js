const template = /*html*/`

	<v-row align="center" justify="center">
		<v-col :cols="colSize" v-for="(tela, i) in telas" :key="i" v-if="tela.inHome">
			<app-block :title="tela.title" :description="tela.description" @click.native="loadPage(tela.path)" />
		</v-col>
	</v-row>

`

import pages from '../../js/telas.js'

export default {
	template,
	data() {
		return {
			telas: pages.getPages
		}
	},
	computed: {
		colSize() {
			switch (this.$vuetify.breakpoint.name) {
				case 'xs':
					return 12
					break
				case 'sm':
					return 6
					break
				case 'md':
					return 6
					break
				default:
					return 4
					break
			}
		},
		
		large() {
			if (this.$vuetify.breakpoint.name !== 'xs' && this.$vuetify.breakpoint.name !== 'sm') {
				return true
			}
			
			return false
		}
	},
	methods: {
		loadPage(path) {
			if (this.$route.path !== path) {
				this.$router.push(path)				
			}
		}
	}
}