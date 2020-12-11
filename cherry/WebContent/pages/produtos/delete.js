const template = /*html*/ `

	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="form" v-model="valid">
				<v-row v-if="loadingProduto">
					<v-col cols="12">
						<v-alert type="info" class="ma-0">
							Carregando...
						</v-alert>
					</v-col>
				</v-row>
				
				<v-row v-else>
					<v-col cols="12" class="py-0">					
						<div class="text-h6">Quer mesmo excluir {{ produto.nome }}?</div>
					</v-col>

					<v-col cols="12" class="py-0">					
						<v-checkbox
							v-model="confirm"
							label="Sim, tenho certeza."
							:rules="[v => !!v || 'Confirme para dar continuidade.']"
						></v-checkbox>
					</v-col>

					<v-col cols="12" class="pb-0">					
						<app-btn alert block :disabled="!valid" label="Excluir" :on-click="deletarProduto" v-if="!excluindo" />
						<app-btn block disabled label="Excluir" v-else />
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>

`;

import { $bus } from "../../js/eventBus.js";

export default {
  template,
  data() {
    return {
      valid: false,
      confirm: false,
      loadingProduto: false,
      produto: {},
      excluindo: false,
    };
  },
  computed: {
    produto_id() {
      return this.$route.query.id;
    },
  },
  methods: {
    async buscarProduto() {
      this.loadingProduto = true;

      await axios
        .get(`/produto/buscarPorId?id=${this.produto_id}`)
        .then((retorno) => {
          this.produto = retorno.data;
        })
        .catch(erro => {
          this.$toasted.global.error(erro.response.data.message)
          $bus.$emit("close-modal")
        })
        .finally(() => {
          this.loadingProduto = false;
        });
    },

    async deletarProduto() {
      this.excluindo = true;

      await axios
        .delete(`/produto/excluir/${this.produto_id}`)
        .then(retorno => {
          this.$toasted.global.success(retorno.data.message)
          $bus.$emit("close-modal");
          $bus.$emit("atualizar-tabela");
        })
        .catch(erro => {
          this.$toasted.global.error(erro.response.data.message)
        })
        .finally(() => {
          this.excluindo = false;
        });
    },
  },
  mounted() {
    this.buscarProduto();

    $bus.$on("load-content", () => {
      this.buscarProduto();
    });

    $bus.$on("reset-modal", () => {
      this.dadosProduto = {};
      this.$refs.form.reset();
    });
  },
  beforeDestroy() {
    $bus.$off("load-content");
    $bus.$off("reset-modal");
  },
};
