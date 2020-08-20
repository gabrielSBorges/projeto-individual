const template = /*html*/`

	<v-row>
		<v-col cols="12" class="pb-0">
			<v-row dense align="center" :class="this.$vuetify.breakpoint.xl ? 'pb-5' : 'pb-5 pr-1'">
				<v-col cols="2">
					<app-btn normal label="LANÇAR VENDA" :on-click="abrirModalAdd" />
				</v-col>
				
				<v-col offset="5" cols="2">
					<v-text-field label="Data" dense solo hide-details>
					</v-text-field>
				</v-col>

				<v-col cols="2">
					<v-text-field label="Usuario" dense solo hide-details>
					</v-text-field>
				</v-col>

				<v-col cols="1" align-self="center" class="text-right">
					<app-btn info label="FILTRAR" :on-click="buscarVendas" />
				</v-col>
			</v-row>
		</v-col>
		
		<v-col cols="12" class="pt-0">
			<app-table 
				:headers="cabecalho" 
				:content="vendas" 
				:loading="loadingVendas" 
				loading-text="Buscando vendas..." 
				no-data-text="Nenhuma venda encontrada."
			>
				<template v-slot:content>
					<tr v-for="(item, i) in vendas" :key="i">
						<td>
							{{ item.id }}
						</td>

						<td>
							{{ item.dt_lancamento }}
						</td>
						
						<td>
							{{ item.usuario }}
						</td>
						
						<td>
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
import AppTable from '../../components/AppTable.js'
import AppDropdown from '../../components/AppDropdown.js'
import AppModal from '../../components/AppModal.js'
import AppBtn from '../../components/AppBtn.js'

Vue.component("AppTable", AppTable)
Vue.component("AppDropdown", AppDropdown)
Vue.component("AppModal", AppModal)
Vue.component("AppBtn", AppBtn)

// Modais
import ModalView from './view.js'
import ModalAdd from './add.js'

export default {
	template,
	data() {
		return {
			// Tabela de usuários
			loadingVendas: false,
			cabecalho: [
				{ text: 'Código', sortable: false, value: 'id' },
				{ text: 'Data de Lançamento', sortable: false, value: 'dt_lancamento' },
				{ text: 'Usuário', sortable: false, value: 'usuario' },
				{ text: 'Valor', sortable: false, value: 'valor' },
				{ text: '', sortable: false, value: 'btns' },
			],
			vendas: [],
			filtro: {
				data: '',
				usuario: ''
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
		buscarVendas() {
			this.loadingVendas = true
			
			let vendas = [ // FIXME - susbstituir pelo get em usuários
				{
					id: 4,
					dt_lancamento: '05/10/2020 11:20',
					usuario: 'Gabriel Borges',
					valor: 12.5,
				},
				{
					id: 2,
					dt_lancamento: '06/10/2020 07:20',
					usuario: 'Ricardo Eletro',
					valor: 5.0,
				},
				{
					id: 10,
					dt_lancamento: '05/10/2020 15:26',
					usuario: 'Mike Azevedo',
					valor: 10.0,
				},
				{
					id: 1,
					dt_lancamento: '05/10/2020 10:20',
					usuario: 'Orlando Bloom',
					valor: 25.5,
				},
			]
			
			vendas.map(venda => {
				const { id, dt_lancamento, usuario, valor } = venda
				
				const btns = [
					{
						title: 'Detalhes',
						function: () => this.abrirModal('view', "DETALHES DA VENDA", ModalView, id)
					},
				]
				
				this.vendas.push({ id, dt_lancamento, usuario, valor, btns })
			})
			
			this.loadingVendas = false
		},

		abrirModal(metodo, titulo, componente, venda_id) {
			this.modalAtual = componente	
			this.modalTitle = titulo

			if (metodo == 'add') {
				this.modalSubtitle = ""
			}
			else {
				this.modalSubtitle = venda_id.toString()
				
				this.$router.push({ path: '/vendas', query: { id: venda_id } })
			}

			$bus.$emit('open-modal')
		},

		abrirModalAdd() {
			this.abrirModal('add', 'LANÇAR VENDA', ModalAdd)
		}
	},
	mounted() {
		this.buscarVendas()
	}
}