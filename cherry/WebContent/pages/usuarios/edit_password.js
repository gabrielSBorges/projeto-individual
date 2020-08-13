const template = /*html*/`
	
	<v-row>
		<v-col cols="12" class="py-0">
			<v-form ref="form" v-model="valid">
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
			
					<v-col cols="12" class="pb-0 text-right" align-self="center">
						<app-btn normal :disabled="!valid" label="Cadastrar" :on-click="editarSenhaUsuario" class="mb-n2" />
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>

`

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
	}
}