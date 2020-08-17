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
					
					<v-col cols="6" class="pb-0">
						<v-select
							v-model="dadosUsuario.tipo"
							:items="tipos"
							item-value="id"
							item-text="nome"
							label="tipo"
							:rules="tipoRules"
						></v-select>
					</v-col>
			
					<v-col cols="12" class="pb-0 text-right" align-self="center">
						<app-btn success block :disabled="!valid" label="Salvar" :on-click="editarUsuario" class="mb-n2" />
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
				v => !!v || 'Nome é obrigatório',
			],
			emailRules: [
				v => !$gm.isEmpty(v) || 'E-mail é obrigatório.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
			tipoRules: [
				v => !!v || 'Tipo é obrigatório',
			],

			tipos: [ { id: 1, nome: 'Gestor' } , { id: 2, nome: 'Caixa' } ],
			
			usuario_id: this.$route.query.id,

			dadosUsuario: {
				nome: '',
				email: '',
				tipo: '',
			}
		}
	},
	methods: {
		editarUsuario() {
			this.$refs.form.validate()
		}
	},
	mounted() {
		$bus.$on('reset-form', () => {
			this.$refs.form.reset()	
		})
	}
}