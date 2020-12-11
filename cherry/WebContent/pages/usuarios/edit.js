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
					
					<v-col cols="6" class="pb-0">
						<v-autocomplete
							:search-input.sync="buscaTipo"
							v-model="dadosUsuario.tipo_id" 
							:items="tipos"
							label="Tipo"
							item-text="nome"
							item-value="id"
							:no-data-text="(loadingTipos) ? 'Buscando...' : 'Nenhum tipo encontrado.'"
							:rules="tipoRules"
						>
							<template v-slot:selection="data">
								{{ data.item.nome }}
							</template>
						</v-autocomplete>
					</v-col>
			
					<v-col cols="12" class="pb-0 text-right" align-self="center">
						<app-btn success block :disabled="!valid" label="Salvar Alterações" :on-click="editarUsuario" />
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
				v => !!v || 'Nome é obrigatório',
			],
			emailRules: [
				v => !$gm.isEmpty(v) || 'E-mail é obrigatório.',
				v => $gm.validEmail(v) || 'Digite um e-mail válido.',
			],
			tipoRules: [
				v => !!v || 'Tipo é obrigatório',
			],

			tipos: [],
			buscaTipo: '',
			loadingTipos: false,

			loadingUsuario: false,
			dadosUsuario: {
				nome: '',
				email: '',
				tipo_id: '',
			}
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
				this.$toasted.global.error(erro.response.data.message)
				$bus.$emit("close-modal")
			})
			.finally(() => {
				this.loadingTipos = false
			})
		},
		
		async editarUsuario() {
			this.$refs.form.validate()

			if (this.valid) {
				const { id, nome, email, tipo_id, ativo } = this.dadosUsuario

				const body = {
					id,
					nome,
					email,
					tipo_id,
					ativo
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
		}
	},
	mounted() {
		this.buscarUsuario()

		$bus.$on("load-content", () => {
      this.buscarUsuario();
    });

    $bus.$on("reset-modal", () => {
			this.dadosUsuario = {
				id: '',
				nome: '',
				email: '',
				tipo_id: '',
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