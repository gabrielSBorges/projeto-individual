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

						<td>
							{{ item.status }}
						</td>
						
						<td class="text-center">
							<app-dropdown block label="Ações" :btns="item.btns" />
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
import ModalEnable from './enable.js'

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
				{ text: 'Status', sortable: false, value: 'status' },
				{ text: '', sortable: false, value: 'btns' },
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
					const { id, nome, email, tipo, ativo } = usuario
					
					const status = ativo == 1 ? "Ativo" : "Desativado"

					const btns = [
						{
							title: 'Editar',
							function: () => this.abrirModal('edit', "EDITAR USUÁRIO", ModalEdit, id, nome)
						},
						{
							title: 'Alterar Senha',
							function: () => this.abrirModal('edit_password', "EDITAR SENHA DO USUÁRIO", ModalEditPassword, id, nome)
						}
					]

					if (ativo == 1) {
						btns.push({
							title: 'Desativar',
							function: () => this.abrirModal('disable', "DESATIVAR USUÁRIO", ModalDisable, id, nome)
						})
					}
					else {
						btns.push({
							title: 'Ativar',
							function: () => this.abrirModal('enable', "ATIVAR USUÁRIO", ModalEnable, id, nome)
						})
					}
					
					this.usuarios.push({ nome, email, tipo, status, btns })
				})
			})
			.catch(erro => {
				this.$toasted.global.error(erro.response.data.message)
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

		$bus.$on('atualizar-tabela', () => {
      this.filterUsuario = ""

			this.buscarUsuarios()
    })
	},
	beforeDestroy() {
		$bus.$off('atualizar-tabela')
	}
}