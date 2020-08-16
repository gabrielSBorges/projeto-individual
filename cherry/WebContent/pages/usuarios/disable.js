const template = /*html*/`

	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="formConfirm" v-model="valid">
				<v-row>
					<v-col cols="12" class="py-0">					
						<div class="text-h6">Quer mesmo desativar (Nome do Usuario)?</div>
					</v-col>

					<v-col cols="12" class="py-0">					
						<v-checkbox
							v-model="confirm"
							label="Sim, tenho certeza."
							:rules="[v => !!v || 'Confirme para dar continuidade.']"
						></v-checkbox>
					</v-col>

					<v-col cols="12" class="text-right pb-0">					
						<app-btn alert block :disabled="!valid" label="Desativar" :on-click="desativarUsuario" />
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
			usuario_id: this.$route.query.id
		}
	},
	methods: {
		desativarUsuario() {
			this.$refs.formConfirm.validate()
		},
	},
	mounted() {
		$bus.$on('reset-form', () => {
			this.$refs.form.reset()	
		})
	}
}