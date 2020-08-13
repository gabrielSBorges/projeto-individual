const template = /*html*/`

	<v-row>
		<v-col cols="12" class="pb-0">
			<v-form ref="formConfirm" v-model="valid">
				<v-row>
					<v-col cols="12" class="pt-0">					
						<div class="text-h6">Quer mesmo ecluir (Nome do Produto)?</div>
					</v-col>

					<v-col cols="12" class="py-0">					
						<v-checkbox
							v-model="confirm"
							label="Sim, tenho certeza."
							required
						></v-checkbox>
					</v-col>

					<v-col cols="12" class="py-1 text-right">					
						<app-btn alert label="Excluir" :on-click="deletarProduto" />
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>

`

import AppBtn from '../../components/AppBtn.js'

Vue.component("AppBtn", AppBtn)

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
		console.log(this.$route.query.id)
	},
}