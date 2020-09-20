const template = /*html*/`
  
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters class="pb-5">
        <v-col cols="2">
          <app-data-info title="Código" :description="venda.id" />
        </v-col>

        <v-col cols="4">
          <app-data-info title="Data de Lançamento" :description="venda.dt_lancamento" />
        </v-col>

        <v-col cols="4">
          <app-data-info title="Usuário" :description="venda.usuario" />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <app-table 
        :headers="cabecalho" 
        :content="produtosDaVenda"
      >
        <template v-slot:content>
          <tr v-for="(item, i) in produtosDaVenda" :key="i">
            <td>
              {{ item.nome }}
            </td>

            <td class="text-right">
              R$ {{ valorFormatado(item.valor_unit) }}
            </td>
            
            <td class="text-right">
              {{ item.quantidade }}
            </td>

            <td class="text-right">
            R$ {{ valorFormatado(item.valor_unit * item.quantidade) }}
            </td>
          </tr>
        </template>

        <template v-slot:footer>
          <v-footer style="width: 100%">
            <v-row class="text-right">
              <v-col class="py-1">
                <span class="h6">Total da Venda: R$ {{ valorFormatado(venda.valor_total) }}</span>
              </v-col>  
            </v-row>
          </v-footer>
        </template>
      </app-table>
    </v-col>
  </v-row>

`

export default {
  template,
  data() {
    return {
      venda: {
        id: this.$route.query.id,
        dt_lancamento: '05/10/2020 11:20',
        usuario: 'Gabriel Borges',
        valor_total: 12.5
      },

      cabecalho: [
				{ text: 'Produto', sortable: false, value: 'nome' },
				{ text: 'Valor Unitário', sortable: false, value: 'valor_unit' },
        { text: 'Quantidade', sortable: false, value: 'quantidade' },
        { text: 'Total', sortable: false, value: 'total' },
			],
      produtosDaVenda: [
        { nome: 'Pão Francês', valor_unit: 0.50, quantidade: 5 },
        { nome: 'Rosca', valor_unit: 2.0, quantidade: 5 },
      ]
    }
  },
  methods: {
    valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
    },
  },
  mounted() {
		this.buscarProduto()
		
		$bus.$on('load-content', () => {
			this.buscarProduto()
		})
		
		$bus.$on('reset-modal', () => {
			this.dadosProduto = {}
			this.error = ''
			this.$refs.form.reset()
		})
	},
	beforeDestroy() {
		$bus.$off('load-content')
		$bus.$off('reset-modal')
	}
}