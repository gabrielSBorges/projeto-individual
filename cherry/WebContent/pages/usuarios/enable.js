const template = /*html*/`

	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="formConfirm" v-model="valid">
				<v-row>
					<v-col cols="12" class="py-0">					
						<div class="text-h6">Quer mesmo ativar {{ dadosUsuario.nome }}?</div>
					</v-col>

					<v-col cols="12" class="py-0">					
						<v-checkbox
							v-model="confirm"
							label="Sim, tenho certeza."
							:rules="[v => !!v || 'Confirme para dar continuidade.']"
						></v-checkbox>
					</v-col>

					<v-col cols="12" class="text-right pb-0">					
						<app-btn success block :disabled="!valid" label="Ativar" :on-click="ativarUsuario" />
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>

`

import { $bus } from '../../js/eventBus.js'

export default {
	template,
	data() {
		return {
			valid: false,
			confirm: false,
			loadingUsuario: false,
			dadosUsuario: {}
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
			.catch(erro => {
				this.$toasted.global.error(erro.response.data.message)
				$bus.$emit("close-modal")
			})
			.finally(() => {
				this.loadingUsuario = false;
			});
		},

		async ativarUsuario() {
			this.$refs.formConfirm.validate()

			if (this.valid) {
				const { id, nome, email, tipo_id } = this.dadosUsuario

				const body = {
					id,
					nome,
					email,
					tipo_id,
					ativo: 1
				}

				await axios.put('/usuario/alterar', body)
				.then(retorno => {
					this.$toasted.global.success(retorno.data.message)
					$bus.$emit("close-modal");
					$bus.$emit("atualizar-tabela");
				})
				.catch(erro => {
					this.$toasted.global.error(erro.response.data.message)
				})
			}
		},
	},
	mounted() {
		this.buscarUsuario()

		$bus.$on("load-content", () => {
      this.buscarUsuario();
    });

    $bus.$on("reset-modal", () => {
			this.dadosUsuario = {}
			this.confirm = false,
      this.$refs.formConfirm.reset()
    });
  },
  beforeDestroy() {
    $bus.$off("load-content")
    $bus.$off("reset-modal")
  },
}