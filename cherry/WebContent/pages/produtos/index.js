const template = /*html*/`
	
	<v-row>
		<v-col cols="12" class="pb-0">
			<v-row no-gutters>
				<v-col cols="6">
					<app-btn normal label="Novo Produto" :on-click="cadastrarProduto" />
				</v-col>
				
				<v-col cosl="3" offset="3">
					<app-search-field v-model="filterProduto" placeholder="Digite para buscar um produto..." />
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
							{{ item.valor }}
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

// Componentes
import AppTable from '../../components/AppTable.js'
import AppDropdown from '../../components/AppDropdown.js'
import AppModal from '../../components/AppModal.js'
import AppSearchField from '../../components/AppSearchField.js'
import AppBtn from '../../components/AppBtn.js'

Vue.component("AppTable", AppTable)
Vue.component("AppDropdown", AppDropdown)
Vue.component("AppModal", AppModal)
Vue.component("AppSearchField", AppSearchField)
Vue.component("AppBtn", AppBtn)

// Modais
import ModalView from './view.js'
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
		buscarProdutos() {
			this.loadingProdutos = true
			
			let produtos = [ // FIXME - susbstituir pelo get em produtos
				{
					id: 4,
					nome: 'Pão Francês',
					valor: '4.00'
				},
				{
					id: 5,
					nome: 'Rosca',
					valor: '4.00'
				},
				{
					id: 7,
					nome: 'Bolo',
					valor: '4.00'
				},
				{
					id: 10,
					nome: 'Sonho',
					valor: '4.00'
				},
			]
			
			produtos.map(produto => {
				const { id, nome, valor } = produto
				
				const btns = [
					{
						title: 'Detalhes',
						function: () => this.visualizarDetalhesProduto(produto)
					},
					{
						title: 'Editar',
						function: () => this.atualizarDadosProduto(produto)
					},
					{
						title: 'Excluir',
						function: () => this.excluirProduto(produto)
					}
				]
				
				this.produtos.push({ nome, valor, btns })
			})
			
			this.loadingProdutos = false
		},
		
		cadastrarProduto() {
			this.modalAtual = ModalAdd
			this.modalTitle = "CADASTRAR PRODUTO"
			this.modalSubtitle = ""
			$bus.$emit('open-modal')
		},
		
		visualizarDetalhesProduto(produto) {
			this.modalAtual = ModalView
			this.modalTitle = 'DETALHES DO PRODUTO'
			this.modalSubtitle = produto.nome
			$bus.$emit('open-modal')
		},
		
		atualizarDadosProduto(produto) {
			this.modalAtual = ModalEdit
			this.modalTitle = 'EDITAR PRODUTO'
			this.modalSubtitle = produto.nome
			$bus.$emit('open-modal')
		},
		
		excluirProduto(produto) {
			this.modalAtual = ModalDelete
			this.modalTitle = 'EXCLUIR PRODUTO'
			this.modalSubtitle = produto.nome
			$bus.$emit('open-modal')
		},
	},
	mounted() {
		this.buscarProdutos()
	}
}