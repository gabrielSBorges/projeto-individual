const template = /*html*/`
	
	<v-row>
		<v-col cols="12" class="pb-0">
			<v-row no-gutters class="pb-5">
				<v-col cols="6">
					<app-btn normal label="Novo Produto" :on-click="abrirModalAdd" />
				</v-col>
				
				<v-col cosl="3" offset="3">
					<app-search-field v-model="filterProduto" :on-click="buscarProdutos" placeholder="Digite para buscar um produto..." />
				</v-col>
			</v-row>
		</v-col>
		
		<v-col cols="12" class="pt-0">
			<app-table 
				:headers="cabecalho" 
				:content="produtos" 
				:loading="loadingProdutos" 
				loading-text="Buscando produtos..." 
				no-data-text="Nenhum produto encontrado."
			>
				<template v-slot:content>
					<tr v-for="(item, i) in produtos" :key="i">
						<td>
							{{ item.nome }}
						</td>
						
						<td class="text-right">
							{{ valorFormatado(item.valor) }}
						</td>
						
						<td class="text-right">
							<app-dropdown :btns="item.btns" />
						</td>
					</tr>
				</template>
			</app-table>
		</v-col>
		
		<app-modal :title="modalTitle" :subtitle="modalSubtitle">
			<modal />
		</app-modal>
	</v-row>
	
`

import { $bus } from '../../js/eventBus.js'

// Modais
import ModalAdd from './add.js'
import ModalEdit from './edit.js'
import ModalDelete from './delete.js'

export default {
	template,
	data() {
		return {
			// Filtro
			filterProduto: '',
			
			// Tabela de produtos
			loadingProdutos: false,
			cabecalho: [
				{ text: 'Nome', sortable: false, value: 'nome' },
				{ text: 'Valor', sortable: false, value: 'valor' },
				{ text: '', sortable: false, value: 'btns' },
			],
			produtos: [],
			filtro: {
				like: ''
			},
			
			// Modais
			modalAtual: null,
			modalTitle: '',
			modalSubtitle: '',
		}
	},
	watch: {
		modalAtual(modal) {
			this.$options.components.Modal = modal
		}
	},
	methods: {
		async buscarProdutos() {
			this.loadingProdutos = true
		
			this.produtos = []

			await axios.get(`/produto/buscar?nome=${this.filterProduto}`)
			.then(retorno => {
				const produtos = JSON.parse(retorno.data)

				produtos.map(produto => {
					const { id, nome, valor } = produto
					
					const btns = [
						{
							title: 'Editar',
							function: () => this.abrirModal('edit', 'EDITAR PRODUTO', ModalEdit, id, nome)
						},
						{
							title: 'Excluir',
							function: () => this.abrirModal('delete', 'EXCLUIR PRODUTO', ModalDelete, id, nome)
						}
					]
					
					this.produtos.push({ nome, valor, btns })
				})
			})
			.catch(erro => {
				console.log(erro.response)
			})
			.finally(() => {
				this.loadingProdutos = false
			})
		},

		abrirModal(metodo, titulo, componente, produto_id, produto_nome) {
			this.modalAtual = componente	
			this.modalTitle = titulo

			if (metodo == 'add') {
				this.modalSubtitle = ""
			}
			else {
				this.modalSubtitle = produto_nome
				
				this.$router.push({ path: '/produtos', query: { id: produto_id } })
			}

			$bus.$emit('open-modal')
		},

		abrirModalAdd() {
			this.abrirModal('add', 'CADASTRAR PRODUTO', ModalAdd)
		},

		valorFormatado(valor) {
			return `R$ ${(valor.toFixed(2)).replace(".", ",")}`
		}
	},
	mounted() {
		this.buscarProdutos()

		$bus.$on('atualizar-tabela', () => {
			this.filterProduto = ""
			this.buscarProdutos()
		})
	}
}