const template = /*html*/`

	<v-card width="400" class="ma-auto">
		<v-container class="px-6">
			<v-img 
				src="./images/logo.png" 
				width="200" 
				height="80" 
				aspect-ration="1" 
				class="mx-auto"
			></v-img>
				
			<v-form ref="form" v-model="valid">
				<v-row no-gutters>
					<v-col cols="12">
						<v-text-field
							label="E-mail"
							v-model="dadosUsuario.email"
							:rules="emailRules"
							required
						/>
					</v-col>
					
					<v-col cols="12">
						<v-text-field
							label="Senha"
							type="password"
							v-model="dadosUsuario.senha"
							:rules="senhaRules"
							required
						/>
					</v-col>
					
					<v-col cols="12" class="py-2">
						<v-checkbox
							v-model="dadosUsuario.manter_conectado"
							label="Mantenha-me conectado."
						></v-checkbox>
					</v-col>
					
					<v-col cols="12">
						<app-btn success label="Entrar" block :disabled="!valid" :on-click="validate" />	
					</v-col>
					
					<v-col cols="12" class="pb-2 pt-5 text-center">
						<a href="#" class="text-decoration-none grey--text text--lighten-1 caption">Esqueci a senha</a>
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
			valid: true,
			emailRules: [
				v => !$gm.isEmpty(v) || 'Digite o seu e-mail.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
		 	senhaRules: [
				v => !$gm.isEmpty(v) || 'Digite a sua senha.',
			],
		    
			dadosUsuario: {
				email: '',
				senha: '',
				manter_conectado: false,
			}
		}
	},
	methods: {
		validate() {
			this.$refs.form.validate()
			
			this.$router.push('/')
		}
	}
}