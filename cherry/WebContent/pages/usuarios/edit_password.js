const template = /*html*/`
	
	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="form" v-model="valid" class="pt-0">
				<v-row>
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Senha"
							type="password"
							v-model="dadosUsuario.senha"
							:rules="senhaRules"
						/>
					</v-col>
					
					<v-col cols="6" class="pt-0">
						<v-text-field
							label="Confirmar Senha"
							type="password"
							v-model="dadosUsuario.senhaConfirm"
							:rules="senhaConfirmRules"
						/>
					</v-col>
			
					<v-col cols="12" class="text-right py-0">
						<app-btn success block :disabled="!valid" label="Alterar Senha" :on-click="editarSenhaUsuario" />
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

			senhaRules: [
				v => !$gm.isEmpty(v) || 'Senha é obrigatório.',
				v => $gm.validPassword(v) || 'Digite uma senha válida.',
			],
			senhaConfirmRules: [
				v => !$gm.isEmpty(v) || 'Confirmar a senha é obrigatório',
				v => v == this.dadosUsuario.senha || 'As senhas não coincidem.'
			],

			loadingUsuario: false,
			dadosUsuario: {
				id: '',
				senha: '',
				senhaConfirm: ''
			}
		}
	},
	computed: {
		usuario_id() {
			return this.$route.query.id
		}
	},
	methods: {
		async buscarUsuario() {
			this.loadingUsuario = true

			await axios.get(`/usuario/buscarPorId?id=${this.usuario_id}`)
			.then((retorno) => {
				this.dadosUsuario = retorno.data;
			})
			.catch(() => {
				console.log("Ocorreu um erro ao tentar buscar informações desse usuário")
			})
			.finally(() => {
				this.loadingUsuario = false;
			});
		},
		
		async editarSenhaUsuario() {
			this.$refs.form.validate()

			if (this.valid) {
				const { id, senha } = this.dadosUsuario

				const body = {
					id,
					senha
				}

				await axios.put('/usuario/alterar-senha', body)
				.then(retorno => {
					$bus.$emit("close-modal");
					$bus.$emit("atualizar-tabela");
				})
				.catch(erro => {
					console.log('Ocorreu um erro ao tentar editar o usuário')
				})
			}
		}
	},
	mounted() {
		this.$refs.form.reset()
		this.$refs.form.resetValidation()

		this.buscarUsuario()

		$bus.$on("load-content", () => {
      this.buscarUsuario();
    });

    $bus.$on("reset-modal", () => {
			this.dadosUsuario = {
				id: '',
				senha: '',
				senhaConfirm: ''
			}
			
      this.$refs.form.reset()
    });
  },
  beforeDestroy() {
    $bus.$off("load-content")
    $bus.$off("reset-modal")
  },
}