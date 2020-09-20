const template = /*html*/`

	<v-row no-gutters>
		<v-col cols="12">
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
					<v-col cols="12" class="py-0">					
						<div class="text-h6">Quer mesmo excluir {{ produto.nome }}?</div>
					</v-col>

					<v-col cols="12" class="py-0">					
						<v-checkbox
							v-model="confirm"
							label="Sim, tenho certeza."
							:rules="[v => !!v || 'Confirme para dar continuidade.']"
						></v-checkbox>
					</v-col>

					<v-col cols="12" class="pb-0">					
						<app-btn alert block :disabled="!valid" label="Excluir" :on-click="deletarProduto" v-if="!excluindo" />
						<app-btn block disabled label="Excluir" v-else />
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
			loadingProduto: false,
			produto: {},
			error: '',
			excluindo: false,
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
				this.produto = retorno.data
			})
			.catch(() => {
				this.error = "Ocorreu um erro ao tentar buscar informações desse produto"
			})
			.finally(() => {
				this.loadingProduto = false
			})
		},
		
		async deletarProduto() {
			this.excluindo = true
			
			await axios.delete(`/produto/excluir/${this.produto_id}`)
			.then(() => {
				$bus.$emit('close-modal')
				$bus.$emit('atualizar-tabela')
			})
			.catch(() => {
				// TODO - Mensagem de erro
				console.log("Erro ao deletar")
			})
			.finally(() => {
				this.excluindo = false
			})
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
	}	
}