const template = /*html*/`
	
	<v-row>
		<v-col cols="12" class="py-0">
			<v-form ref="form" v-model="valid">
				<v-row v-if="loadingProduto">
					<v-col cols="12">
						<v-alert type="info" class="ma-0">
							Carregando...
						</v-alert>
					</v-col>
				</v-row>
				
				<v-row v-else-if="error">
					<v-col cols="12">
						<v-alert type="error" class="ma-0">
							{{ error }}
						</v-alert>
					</v-col>
				</v-row>
				
				<v-row v-else>
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

					<v-col cols="12" class="py-0">
						<app-btn success block :disabled="!valid" label="Salvar Alterações" :on-click="editarProduto" v-if="!editando" />
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
			
			dadosProduto: {},
			
			loadingProduto: false,
			editando: false,
			error: '',
		}
	},
	computed: {
		produto_id() {
			return this.$route.query.id
		}
	},
	methods: {
		async buscarProduto() {
			this.loadingProduto = true
			
			await axios.get(`/produto/buscarPorId?id=${this.produto_id}`)
			.then(retorno => {
				this.dadosProduto = retorno.data
			})
			.catch(() => {
				this.error = "Ocorreu um erro ao tentar buscar informações desse produto"
			})
			.finally(() => {
				this.loadingProduto = false
			})
		},
		
		async editarProduto() {
			this.$refs.form.validate()
			
			if (this.valid) {
				this.editando = true
				
				this.dadosProduto.valor = parseFloat(this.dadosProduto.valor) 
				
				await axios.put('/produto/alterar', this.dadosProduto)
				.then(() => {
					$bus.$emit('close-modal')
					$bus.$emit('atualizar-tabela')
				})
				.catch(() => {
					this.error = "Ocorreu um erro ao tentar editar as informações desse produto"
				})
				.finally(() => {
					this.editando = false
				})
			}
		}
	},
	mounted() {
		this.buscarProduto()
		
		$bus.$on('load-content', () => {
			this.buscarProduto()
		})
		
		$bus.$on('reset-modal', () => {
			this.dadosProduto = {}
			this.error = ''
			this.$refs.form.reset()
		})
	},
	beforeDestroy() {
		$bus.$off('load-content')
		$bus.$off('reset-modal')
	}
}