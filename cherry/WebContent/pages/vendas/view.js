const template = /*html*/`
  
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters class="pb-5">
        <v-col cols="2">
          <app-data-info title="Código" :description="venda.id" />
        </v-col>

        <v-col cols="4">
          <app-data-info title="Data de Lançamento" :description="dataFormatada(venda.dt_realizado)" />
        </v-col>

        <v-col cols="4">
          <app-data-info title="Usuário" :description="venda.usuario_nome" />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <app-table 
        :headers="cabecalho" 
        :content="venda.produtos"
      >
        <template v-slot:content>
          <tr v-for="(item, i) in venda.produtos" :key="i">
            <td>
              {{ item.nome }}
            </td>

            <td class="text-right">
              R$ {{ valorFormatado(item.valor) }}
            </td>
            
            <td class="text-right">
              {{ item.quantidade }}
            </td>

            <td class="text-right">
            R$ {{ valorFormatado(item.valor * item.quantidade) }}
            </td>
          </tr>
        </template>

        <template v-slot:footer>
          <v-footer style="width: 100%">
            <v-row class="text-right">
              <v-col class="py-1">
                <span class="h6">Total da Venda: R$ {{ valorFormatado(venda.valor) }}</span>
              </v-col>  
            </v-row>
          </v-footer>
        </template>
      </app-table>
    </v-col>
  </v-row>

`

import { $bus } from '../../js/eventBus.js'

export default {
  template,
  data() {
    return {
      loadingVenda: false,
      venda: {},

      error: "",

      cabecalho: [
        { text: 'Produto', sortable: false, value: 'nome' },
        { text: 'Valor Unitário', sortable: false, value: 'valor_unit' },
        { text: 'Quantidade', sortable: false, value: 'quantidade' },
        { text: 'Total', sortable: false, value: 'total' },
      ],
    }
  },
  computed: {
    venda_id() {
      return this.$route.query.id;
    },
  },
  methods: {
    async buscarVenda() {
      this.loadingVenda = true

      this.venda = {}
      this.produtosDaVenda = []

      await axios
        .get(`/venda/buscarPorId?id=${this.venda_id}`)
        .then((retorno) => {
          this.venda = retorno.data
        })
        .catch(() => {
          this.error = "Ocorreu um erro ao tentar buscar informações dessa venda";
        })
        .finally(() => {
          this.loadingProduto = false;
        });
    },

    valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
    },

    dataFormatada(data) {
      return moment(data, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YY HH:mm")
    }
  },
  mounted() {
    this.buscarVenda()

    $bus.$on("load-content", () => {
      this.buscarVenda();
    });

    $bus.$on("reset-modal", () => {
      this.venda = {};
      this.error = "";
    });
  },
  beforeDestroy() {
    $bus.$off("load-content");
    $bus.$off("reset-modal");
  },
}