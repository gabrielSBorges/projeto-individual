const template = /*html*/`

  <v-row no-gutters>
    <v-col cols="12">
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col cols="4" class="pt-0">
            <v-select 
              :items="produtos"
              item-text="nome"
              return-object
              label="Produto *" 
              v-model="produtoSelecionado.produto"
            />
          </v-col>

          <v-col cols="4" class="pt-0">
            <v-text-field label="Quantidade *" type="number" v-model="produtoSelecionado.quantidade"></v-text-field>
          </v-col>

          <v-col cols="4" class="text-right">
            <app-btn normal label="Adicionar" :on-click="addProduto" />
          </v-col>
        </v-row>
      </v-form>
    </v-col>

    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <app-table 
            :headers="cabecalho" 
            :content="produtosSelecionados"  
            no-data-text="Adicione ao menos um produto."
          >
            <template v-slot:content>
              <tr v-for="(item, i) in produtosSelecionados" :key="i">
                <td>
                  {{ item.nome }}
                </td>

                <td class="text-right">
                  R$ {{ valorFormatado(item.valor_unit) }}
                </td>
                
                <td>
                  {{ item.quantidade }}
                </td>
                
                <td class="text-center">
                  <app-btn alert small tooltip="Remover Produto" :on-click="() => removeProduto(item.id)" icon="mdi-delete" />
                </td>
              </tr>
            </template>

            <template v-slot:footer>
              <v-footer style="width: 100%">
                <v-row class="text-right">
                  <v-col class="py-1">
                    <span class="h6">Total: R$ {{ valorFormatado(totalVenda) }}</span>
                  </v-col>  
                </v-row>
              </v-footer>
            </template>
          </app-table>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <app-btn normal block label="Lançar" :on-click="lancarVenda" />
    </v-col>
  </v-row>

`

import AppBtn from '../../components/AppBtn.js'
import AppTable from '../../components/AppTable.js'

Vue.component("AppBtn", AppBtn)
Vue.component("AppTable", AppTable)

export default {
  template,
  data() {
    return {
      produtos: [
        {
					id: 4,
					nome: 'Pão Francês',
					valor: '4.00'
				},
				{
					id: 5,
					nome: 'Rosca',
					valor: '4.00'
				},
				{
					id: 7,
					nome: 'Bolo',
					valor: '4.00'
				},
				{
					id: 10,
					nome: 'Sonho',
					valor: '4.00'
				},
      ],

      valid: false,

      produtoSelecionado: {
        produto: null,
        quantidade: null,
      },

      cabecalho: [
				{ text: 'Produto', sortable: false, value: 'nome' },
				{ text: 'Valor Unitário', sortable: false, value: 'valor_unit' },
				{ text: 'Quantidade', sortable: false, value: 'quantidade' },
				{ text: '', sortable: false, value: 'btns' },
			],
      produtosSelecionados: [],
      totalVenda: 0,
    }
  },
  methods: {
    addProduto() {
      const { id, nome, valor } = this.produtoSelecionado.produto
      const { quantidade } = this.produtoSelecionado

      this.produtosSelecionados.push({
        id,
        nome,
        valor_unit: valor,
        quantidade
      })

      this.produtoSelecionado = {
        produto: null,
        quantidade: null,
      }

      this.setVendaValor()
    },

    removeProduto(produto_id) {
      this.produtosSelecionados = this.produtosSelecionados.filter(produto => produto.id !== produto_id)

      this.setVendaValor()
    },

    setVendaValor() {
      this.produtosSelecionados.map(produto => {
        this.totalVenda += produto.valor_unit * produto.quantidade
      })
    },

    valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
    },

    async lancarVenda() {

    }
  },
}