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
					
					<v-col cols="6">
						<v-autocomplete
							:search-input.sync="buscaTipo"
							v-model="dadosUsuario.tipo_id" 
							:items="tipos"
							label="tipo"
							item-text="nome"
							item-value="id"
							:no-data-text="(loadingTipos) ? 'Buscando...' : 'Nenhum tipo encontrado.'"
						/>
					</v-col>
					
					<v-col cols="6">
						<v-text-field
							label="Senha"
							type="password"
							v-model="dadosUsuario.senha"
							:rules="senhaRules"
						/>
					</v-col>
					
					<v-col cols="6" class="pb-0">
						<v-text-field
							label="Confirmar Senha"
							type="password"
							v-model="dadosUsuario.senhaConfirm"
							:rules="senhaConfirmRules"
						/>
					</v-col>
	
					<v-col cols="12" class="pb-0 text-right" align-self="center">
						<app-btn success block :disabled="!valid" label="Cadastrar" :on-click="cadastrarUsuario" />
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
				v => !$gm.isEmpty(v) || 'Nome é obrigatório.',
			],
			emailRules: [
				v => !$gm.isEmpty(v) || 'E-mail é obrigatório.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
			tipoRules: [
				v => !$gm.isEmpty(v) || 'Tipo é obrigatório.',
			],
		 	senhaRules: [
				v => !$gm.isEmpty(v) || 'Senha é obrigatório.',
				v => $gm.validPassword(v) || 'Digite uma senha válida.',
			],
			senhaConfirmRules: [
				v => !$gm.isEmpty(v) || 'Confirmar a senha é obrigatório',
				v => v == this.dadosUsuario.senha || 'As senhas não coincidem.'
			],

			tipos: [],
			buscaTipo: '',
			loadingTipos: false,
			
			dadosUsuario: {
				nome: '',
				email: '',
				tipo_id: '',
				senha: '',
				senhaConfirm: ''
			},
		}
	},
	watch: {
		buscaTipo(v) {
      const busca = v ? v.replace(/ /g, "") : v

      if (busca == "") {
        this.dadosUsuario.tipo_id = ''
      }

      this.buscarTipos()
    }
	},
	methods: {
		async cadastrarUsuario() {
			this.$refs.form.validate()

			if (this.valid) {
				const { nome, email, senha, tipo_id } = this.dadosUsuario
				
				const body = {
					nome,
					email,
					senha,
					tipo_id,
					ativo: 1
				}

				await axios.post('/usuario/inserir', body)
				.then(() => {
					$bus.$emit('close-modal')
					$bus.$emit('atualizar-tabela')
				})
				.catch(erro => {
					//TODO - Toast
					console.log(erro.response.data)
					console.log("Erro ao cadastrar usuário")
				})
			}
		},

		async buscarTipos() {
			this.loadingTipos = true
			
			this.tipos = [];

			await axios.get(`/tipo/buscar?nome=${this.filterTipo}`)

      const filtroTipo = this.buscaTipo ? `nome=${this.buscaTipo}` : "nome"

      await axios.get(`/tipo/buscar?${filtroTipo}`)
			.then(retorno => {
				this.tipos = retorno.data
			})
			.catch(erro => {
				console.log('Erro ao listar tipos')
			})
			.finally(() => {
				this.loadingTipos = false
			})
		}
	},
	mounted() {
		$bus.$on('reset-modal', () => {
			this.$refs.form.reset()
			
			this.dadosUsuario = {
				nome: '',
				email: '',
				tipo_id: '',
				senha: '',
				senhaConfirm: ''
			}
		})
	}
}