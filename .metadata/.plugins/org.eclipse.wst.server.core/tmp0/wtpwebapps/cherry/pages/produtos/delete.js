const template = /*html*/`

	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="form" v-model="valid">
				<v-row>
					<v-col cols="12" class="py-0">					
						<div class="text-h6">Quer mesmo excluir (Nome do Produto)?</div>
					</v-col>

					<v-col cols="12" class="py-0">					
						<v-checkbox
							v-model="confirm"
							label="Sim, tenho certeza."
							:rules="[v => !!v || 'Confirme para dar continuidade.']"
						></v-checkbox>
					</v-col>

					<v-col cols="12" class="pb-0">					
						<app-btn alert block :disabled="!valid" label="Excluir" :on-click="deletarProduto" />
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>

`

import { $bus } from '../../js/eventBus.js'

export default {
	template,
	data() {
		return {
			valid: false,
			confirm: false,
			produto_id: this.$route.query.id
		}
	},
	methods: {
		deletarProduto() {

		}
	},
	mounted() {
		$bus.$on('reset-form', () => {
			this.$refs.form.reset()	
		})
	}	
}