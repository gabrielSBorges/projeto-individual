const template = /*html*/`

	<v-row>
		<v-col cols="12" class="pb-0">
			<v-row no-gutters>
				<v-col cols="6">
					<app-btn normal label="Novo Usuário" :on-click="abrirModalAdd" />
				</v-col>
				
				<v-col cosl="3" offset="3">
					<app-search-field v-model="filterUsuario" placeholder="Digite para buscar um usuário..." />
				</v-col>
			</v-row>
		</v-col>
		
		<v-col cols="12" class="pt-0">
			<app-table 
				:headers="cabecalho" 
				:content="usuarios" 
				:loading="loadingUsuarios" 
				loading-text="Buscando usuários..." 
				no-data-text="Nenhum usuário encontrado."
			>
				<template v-slot:content>
					<tr v-for="(item, i) in usuarios" :key="i">
						<td>
							{{ item.nome }}
						</td>
						
						<td>
							{{ item.email }}
						</td>
						
						<td>
							{{ item.tipo }}
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
import AppSearchField from '../../components/AppSearchField.js'
import AppBtn from '../../components/AppBtn.js'
import AppPageHeader from '../../components/AppPageHeader.js'

Vue.component("AppTable", AppTable)
Vue.component("AppDropdown", AppDropdown)
Vue.component("AppModal", AppModal)
Vue.component("AppSearchField", AppSearchField)
Vue.component("AppBtn", AppBtn)

Vue.component("AppPageHeader", AppPageHeader)

// Modais
// import ModalView from './view.js'
import ModalAdd from './add.js'
import ModalEdit from './edit.js'
import ModalEditPassword from './edit_password.js'
import ModalDisable from './disable.js'

export default {
	template,
	data() {
		return {
			// Filtro
			filterUsuario: '',
			
			// Tabela de usuários
			loadingUsuarios: false,
			cabecalho: [
				{ text: 'Nome', sortable: false, value: 'nome' },
				{ text: 'E-mail', sortable: false, value: 'email' },
				{ text: 'Tipo', sortable: false, value: 'tipo' },
				{ text: '', sortable: false, value: 'btns' },
			],
			usuarios: [],
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
		buscarUsuarios() {
			this.loadingUsuarios = true
			
			let usuarios = [ // FIXME - susbstituir pelo get em usuários
				{
					id: 4,
					nome: 'Gabriel Borges',
					email: 'gabriel@gmail.com',
					tipo: 'Gestor',
					tipo_id: 2
				},
				{
					id: 5,
					nome: 'Reiner Brawn',
					email: 'reiner@gmail.com',
					tipo: 'Caixa',
					tipo_id: 3
				},
				{
					id: 7,
					nome: 'Eren Yeager',
					email: 'pnc@gmail.com',
					tipo: 'Caixa',
					tipo_id: 3
				},
				{
					id: 10,
					nome: 'Jailson Mendes',
					email: 'delicia@gmail.com',
					tipo: 'Caixa',
					tipo_id: 3
				},
			]
			
			usuarios.map(usuario => {
				const { id, nome, email, tipo, tipo_id } = usuario
				
				const btns = [
					{
						title: 'Editar',
						function: () => this.abrirModal('edit', "EDITAR USUÁRIO", ModalEdit, id, nome)
					},
					{
						title: 'Alterar Senha',
						function: () => this.abrirModal('edit_password', "EDITAR SENHA DO USUÁRIO", ModalEditPassword, id, nome)
					},
					{
						title: 'Desativar',
						function: () => this.abrirModal('disable', "DESATIVAR USUÁRIO", ModalDisable, id, nome)
					}
				]
				
				this.usuarios.push({ nome, email, tipo, btns })
			})
			
			this.loadingUsuarios = false
		},

		abrirModal(metodo, titulo, componente, usuario_id, usuario_nome) {
			this.modalAtual = componente	
			this.modalTitle = titulo

			if (metodo == 'add') {
				this.modalSubtitle = ""
			}
			else {
				this.modalSubtitle = usuario_nome
				
				this.$router.push({ path: '/usuarios', query: { id: usuario_id } })
			}

			$bus.$emit('open-modal')
		},

		abrirModalAdd() {
			this.abrirModal('add', 'CADASTRAR USUÁRIO', ModalAdd)
		}
	},
	mounted() {
		this.buscarUsuarios()
	}
}