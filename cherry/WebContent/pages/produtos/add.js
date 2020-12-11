const template = /*html*/`
	
	<v-row>
		<v-col cols="12" class="py-0">
			<v-form ref="form" v-model="valid">
				<v-row>
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Nome"
							v-model="dadosProduto.nome"
							:rules="rules.nome"
						/>
					</v-col>

					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Valor"
							v-model="dadosProduto.valor"
							type="number"
							prefix="R$"
							:rules="rules.valor"
						/>
					</v-col>

					<v-col cols="12" class="text-right py-0">
						<app-btn success block :disabled="!valid" label="Cadastrar" :on-click="cadastrarProduto" v-if="!cadastrando" />
						<app-btn block disabled label="Cadastrar" v-else />
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

			rules: {
				nome: [v => !!v || "Digite o nome do produto."],
				valor: [v => !!v || "Digite o valor do produto."]
			},
			
			cadastrando: false,

			dadosProduto: {
				nome: '',
				valor: ''
			}
		}
	},
	methods: {
		async cadastrarProduto() {
			this.$refs.form.validate()

			if (this.valid) {
				this.cadastrando = true
				
				const { nome, valor } = this.dadosProduto
				
				const body = {
					nome,
					valor: parseFloat(valor),
					usuario_id: auth.user.id
				}

				await axios.post('/produto/inserir', body)
				.then(retorno => {
					this.$toasted.global.success(retorno.data.message)
					$bus.$emit('close-modal')
					$bus.$emit('atualizar-tabela')
				})
				.catch(erro => {
					this.$toasted.global.error(erro.response.data.message)
				})
				.finally(() => {
					this.cadastrando = false
				})
			}
		}
	},
	mounted() {
		$bus.$on('reset-modal', () => {
			this.$refs.form.reset()
			
			this.dadosProduto = {
				nome: '',
				valor: ''
			}
		})
	}
}