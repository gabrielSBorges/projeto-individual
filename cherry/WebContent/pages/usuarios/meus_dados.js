const template = /*html*/`
	
  <v-row dense>
    <v-col offset="3" cols="6">
      <v-form ref="formEdit" v-model="validEdit">
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
            <app-data-info title="Tipo" :description="usuario_logado.tipo" />
          </v-col>

          <v-col cols="6">
            <app-data-info title="Status" :description="usuario_logado.ativo == 1 ? 'Ativo' : 'Desativado'" />
          </v-col>
      
          <v-col cols="12" class="pb-0 text-right" align-self="center">
            <app-btn success block :disabled="!validEdit || editing" label="Salvar Alterações" :on-click="editarUsuario" />
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col offset="3" cols="6" class="mt-12">
      <v-form ref="formEditPassword" v-model="validEditPassword">
        <v-row>
          <v-col cols="6" class="pt-0">
            <v-text-field
              label="Senha"
              type="password"
              v-model="novaSenha.senha"
              :rules="senhaRules"
            />
          </v-col>
          
          <v-col cols="6" class="pt-0">
            <v-text-field
              label="Confirmar Senha"
              type="password"
              v-model="novaSenha.senhaConfirm"
              :rules="senhaConfirmRules"
            />
          </v-col>
      
          <v-col cols="12" class="text-right py-0">
            <app-btn success block :disabled="!validEditPassword || editing" label="Alterar Senha" :on-click="editarSenhaUsuario" />
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>

`

import { $gm } from '../../js/globalMethods.js'

export default {
	template,
	data() {
		return {
      validEdit: false,
      validEditPassword: false,

			nomeRules: [
				v => !!v || 'Nome é obrigatório',
			],
			emailRules: [
				v => !$gm.isEmpty(v) || 'E-mail é obrigatório.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
			tipoRules: [
				v => !!v || 'Tipo é obrigatório',
      ],
      senhaRules: [
				v => !$gm.isEmpty(v) || 'Senha é obrigatório.',
				v => $gm.validPassword(v) || 'Digite uma senha válida.',
			],
			senhaConfirmRules: [
				v => !$gm.isEmpty(v) || 'Confirmar a senha é obrigatório',
				v => v == this.novaSenha.senha || 'As senhas não coincidem.'
			],

      editing: false,
			loadingUsuario: false,
			dadosUsuario: {
				nome: '',
				email: '',
      },
      
      novaSenha: {
        senha: '',
        senhaConfirm: ''
      }
		}
  },
  computed: {
    usuario_logado() {
      return auth.user
    }
  },
	methods: {
		async buscarUsuario() {
			this.loadingUsuario = true

			await axios.get(`/usuario/buscarPorId?id=${this.usuario_logado.id}`)
			.then((retorno) => {
				this.dadosUsuario = retorno.data;
			})
			.catch(erro => {
				this.$toasted.global.error(erro.response.data.message)
			})
			.finally(() => this.loadingUsuario = false)
		},
		
		async editarUsuario() {
			this.$refs.formEdit.validate()

			if (this.validEdit) {
        this.editing = true

				const { nome, email } = this.dadosUsuario

				const body = {
					id: this.usuario_logado.id,
					nome,
					email,
					tipo_id: this.usuario_logado.tipo_id,
					ativo: this.usuario_logado.ativo
        }

				await axios.put('/usuario/alterar', body)
				.then(async retorno => {
          this.$toasted.global.success(retorno.data.message)
          
          await this.updateSession();
				})
				.catch(erro => {
					this.$toasted.global.error(erro.response.data.message)
        })
        .finally(() => this.editing = false)
			}
    },
    
    async editarSenhaUsuario() {
			this.$refs.formEditPassword.validate()

			if (this.validEditPassword) {
        this.editing = true

				const { senha } = this.novaSenha

				const body = {
					id: this.usuario_logado.id,
					senha: btoa(senha)
				}

				await axios.put('/usuario/alterar-senha', body)
				.then(retorno => {
          this.$toasted.global.success(retorno.data.message)
          this.$refs.formEditPassword.reset()
				})
				.catch(erro => {
					this.$toasted.global.error(erro.response.data.message)
        })
        .finally(() => this.editing = false)
			}
    },

    async updateSession() {
      await axios.get("/auth/me")
				.then(retorno => {
					auth.setUser(retorno.data)
				})
				.catch(erro => {
					this.$toasted.global.error(erro.response.data.message)
				})
    }
	},
	mounted() {
		this.buscarUsuario()
  }
}