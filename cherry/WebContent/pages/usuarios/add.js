const template = /*html*/`
	
	<v-row>
		<v-col cols="12" class="py-0">
			<v-form ref="form" v-model="valid">
				<v-row>
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Nome"
							v-model="dadosUsuario.nome"
							:rules="nomeRules"
						/>
					</v-col>
					
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="E-mail"
							v-model="dadosUsuario.email"
							:rules="emailRules"
						/>
					</v-col>
					
					<v-col cols="6">
						<v-select
							v-model="dadosUsuario.tipo"
							:items="tipos"
							item-value="id"
							item-text="nome"
							label="tipo"
							:rules="tipoRules"
						></v-select>
					</v-col>
					
					<v-col cols="6">
						<v-text-field
							label="Senha"
							type="password"
							v-model="dadosUsuario.senha"
							:rules="senhaRules"
						/>
					</v-col>
					
					<v-col cols="6" class="pb-0">
						<v-text-field
							label="Confirmar Senha"
							type="password"
							v-model="dadosUsuario.senhaConfirm"
							:rules="senhaConfirmRules"
						/>
					</v-col>
			
					<v-col cols="6" class="pb-0 text-right" align-self="center">
						<app-btn normal :disabled="!valid" label="Cadastrar" :on-click="cadastrarUsuario" class="mb-n2" />
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

			nomeRules: [
				v => !!v || 'Nome é obrigatório',
			],
			emailRules: [
				v => !!v || 'E-mail é obrigatório',
			],
			tipoRules: [
				v => !!v || 'Tipo é obrigatório',
			],
		 	senhaRules: [
				v => !!v || 'Senha é obrigatório',
			],
			senhaConfirmRules: [
				v => !!v || 'Confirmar a senha é obrigatório',
			],

			tipos: [ { id: 1, nome: 'Gestor' } , { id: 2, nome: 'Caixa' } ],
			
			dadosUsuario: {
				nome: '',
				email: '',
				tipo: '',
				senha: '',
				senhaConfirm: ''
			}
		}
	},
	methods: {
		cadastrarUsuario() {
			this.$refs.form.validate()
		}
	}
}