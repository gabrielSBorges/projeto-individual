const template = /*html*/`

	<v-card width="400" class="ma-auto">
		<v-container class="px-6">				
			<v-form ref="form" v-model="valid">
				<v-row no-gutters>
          <v-col cols="12" class="py-2">
            <div class="text-h5 text-center">
              Recuperar Senha
            </div>
          </v-col>
        
          <v-col cols="12" class="mb-4">
						<v-text-field
							label="E-mail"
							v-model="dadosUsuario.email"
							:rules="emailRules"
							required
						/>
					</v-col>
					
					<v-col cols="12" class="mb-3">
						<app-btn success label="Enviar" block :disabled="!valid" :on-click="validate" />	
					</v-col>
					
					<v-col cols="12" class="pb-2 pt-3 text-center">
            <router-link to="/login" class="text-decoration-none grey--text text--lighten-1 caption">
              Voltar para o Login
            </router-link>
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
			emailRules: [
				v => !$gm.isEmpty(v) || 'Digite o seu e-mail.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
		    
			dadosUsuario: {
				email: '',
			}
		}
	},
	methods: {
		async validate() {
			this.$refs.form.validate()

			if (this.valid) {
				await axios.post("/auth/recuperar-senha", this.dadosUsuario)
					.then(async retorno => {
						this.$toasted.global.success(retorno.data.message)
					})
					.catch(erro => {
						this.$toasted.global.error(erro.response.data.message)
					})
			}
		}
	}
}