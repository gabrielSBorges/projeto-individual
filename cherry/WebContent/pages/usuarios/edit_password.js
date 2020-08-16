const template = /*html*/`
	
	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="form" v-model="valid" class="pt-0">
				<v-row>
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Senha"
							type="password"
							v-model="dadosUsuario.senha"
							:rules="senhaRules"
						/>
					</v-col>
					
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Confirmar Senha"
							type="password"
							v-model="dadosUsuario.senhaConfirm"
							:rules="senhaConfirmRules"
						/>
					</v-col>
			
					<v-col cols="12" class="text-right py-0">
						<app-btn success block :disabled="!valid" label="Cadastrar" :on-click="editarSenhaUsuario" />
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

		 	senhaRules: [
				v => !!v || 'Senha é obrigatório',
			],
			senhaConfirmRules: [
				v => !!v || 'Confirmar a senha é obrigatório',
			],
			
			usuario_id: this.$route.query.id,

			dadosUsuario: {
				senha: '',
				senhaConfirm: ''
			}
		}
	},
	methods: {
		editarSenhaUsuario() {
			this.$refs.form.validate()
		}
	},
	mounted() {
		$bus.$on('reset-form', () => {
			this.$refs.form.reset()	
		})
	}
}