const template = /*html*/`

	<v-card width="400" class="ma-auto">
		<v-container class="px-6">
      <v-col cols="12" class="py-2">
        <div class="text-h5 text-center">
          Alterar Senha
        </div>
      </v-col>
				
			<v-form ref="form" v-model="valid">
				<v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              label="Nova Senha"
              type="password"
              v-model="dadosUsuario.senha"
              :rules="senhaRules"
            />
          </v-col>
          
          <v-col cols="12" class="mb-3">
            <v-text-field
              label="Confirmar Nova Senha"
              type="password"
              v-model="dadosUsuario.senhaConfirm"
              :rules="senhaConfirmRules"
            />
          </v-col>
					
					<v-col cols="12" class="mb-4">
						<app-btn success label="Enviar Nova Senha" block :disabled="!valid" :on-click="validate" />	
					</v-col>
				</v-row>
			</v-form>
		</v-container>
	</v-card>

`

import { $gm } from '../../js/globalMethods.js'

export default {
	template,
	data() {
		return {
			valid: false,
      senhaRules: [
				v => !$gm.isEmpty(v) || 'Este campo é obrigatório.',
				v => $gm.validPassword(v) || 'Digite uma senha válida.',
			],
			senhaConfirmRules: [
				v => !$gm.isEmpty(v) || 'Este campo é obrigatório',
				v => v == this.dadosUsuario.senha || 'As senhas não coincidem.'
			],
		    
			dadosUsuario: {
        senha: '',
        senhaConfirm: ''
			}
		}
  },
  computed: {
		token_id() {
			return this.$route.query.code
		}
	},
	methods: {
		async validate() {
			this.$refs.form.validate()
      
      const { senha } = this.dadosUsuario

      const body = {
        senha: btoa(senha)
      }

			if (this.valid) {
				await axios.post(`/auth/resetar-senha?code=${this.token_id}`, body)
					.then(async retorno => {
						this.$toasted.global.success(retorno.data.message)
						
						this.$router.push('/login')
					})
					.catch(erro => {
						this.$toasted.global.error(erro.response.data.message)
					})
			}
		}
	}
}