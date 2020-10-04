const template = /*html*/`

	<v-row>
		<v-col cols="12" class="pb-0">
			<v-row no-gutters class="pb-5">
				<v-col cols="6">
					<app-btn normal label="Novo Usuário" :on-click="abrirModalAdd" />
				</v-col>
				
				<v-col cosl="3" offset="3">
					<app-search-field v-model="filterUsuario" :on-click="buscarUsuarios" placeholder="Buscar um usuário..." />
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
							<app-btn v-for="(btn, b) in item.btns" :key="b" v-bind="btn" class="d-inline ml-2" />
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
				{ text: '', sortable: false, value: 'btns', width: "40%" },
			],
			usuarios: [],
			
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
		async buscarUsuarios() {
			this.loadingUsuarios = true
			
			this.usuarios = []

			await axios.get(`/usuario/buscar?nome=${this.filterUsuario}`)
			.then(retorno => {
				const usuarios = retorno.data

				usuarios.map(usuario => {
					const { id, nome, email, tipo } = usuario
					
					const btns = [
						{
							label: 'Editar',
							warning: true,
							onClick: () => this.abrirModal('edit', "EDITAR USUÁRIO", ModalEdit, id, nome)
						},
						{
							label: 'Alterar Senha',
							warning: true,
							onClick: () => this.abrirModal('edit_password', "EDITAR SENHA DO USUÁRIO", ModalEditPassword, id, nome)
						},
						{
							label: 'Desativar',
							alert: true,
							onClick: () => this.abrirModal('disable', "DESATIVAR USUÁRIO", ModalDisable, id, nome)
						}
					]
					
					this.usuarios.push({ nome, email, tipo, btns })
				})
			})
			.catch(erro => {
				console.log('Ocorreu um erro ao buscar os usuários.')
			})
			.finally(() => {
				this.loadingUsuarios = false
			})
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