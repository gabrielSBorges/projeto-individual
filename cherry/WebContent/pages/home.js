import AppBlock from '../componentes/AppBlock.js'
import telas from '../js/telas.js'

Vue.component("AppBlock", AppBlock)

export default {
	name: 'Home',
	data() {
		return {
			telas
		}
	},
	methods: {
		loadPage(path) {
			this.$router.push(path)
		}
	},
	template: `
		<v-row align="center" justify="center" class="mt-12">
            <v-col cols="4" v-for="(tela, i) in telas" :key="i" v-if="tela.inHome">
                <app-block :title="tela.title" :description="tela.description" @click.native="loadPage(tela.path)" />
            </v-col>
        </v-row>
	`
}