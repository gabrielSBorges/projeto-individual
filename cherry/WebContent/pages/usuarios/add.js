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
	
					<v-col cols="12" class="pb-0 text-right" align-self="center">
						<app-btn success block :disabled="!valid" label="Cadastrar" :on-click="cadastrarUsuario" class="mb-n2" />
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>

`

import { $bus } from '../../js/eventBus.js'
import { $gm } from '../../js/globalMethods.js'

export default {
	template,
	data() {
		return {
			valid: false,
			nomeRules: [
				v => !$gm.isEmpty(v) || 'Nome é obrigatório.',
			],
			emailRules: [
				v => !$gm.isEmpty(v) || 'E-mail é obrigatório.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
			tipoRules: [
				v => !$gm.isEmpty(v) || 'Tipo é obrigatório.',
			],
		 	senhaRules: [
				v => !$gm.isEmpty(v) || 'Senha é obrigatório.',
				v => $gm.validPassword(v) || 'Digite uma senha válida.',
			],
			senhaConfirmRules: [
				v => !$gm.isEmpty(v) || 'Confirmar a senha é obrigatório',
				v => v == this.dadosUsuario.senha || 'As senhas não coincidem.'
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
	},
	mounted() {
		$bus.$on('reset-form', () => {
			this.$refs.form.reset()	
		})
	}
}