const template = /*html*/`

  <v-row no-gutters>
    <v-col cols="12">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="4" class="pt-0">
            <v-autocomplete
              :search-input.sync="buscaProduto"
              v-model="produtoSelecionado.produto" 
              :items="produtos"
              label="Produto *"
              item-text="nome"
              item-value="id"
              return-object
              :no-data-text="(loadingProdutos) ? 'Buscando...' : 'Nenhum produto encontrado.'"
              hide-details
              :rules="[ v => !!v || 'Campo obrigatório' ]"
            />
          </v-col>

          <v-col cols="4" class="pt-0">
            <v-text-field label="Quantidade *" type="number" :rules="[ v => !!v || 'Campo obrigatório', v => v > 0 || 'Digite um valor acima de 0' ]" v-model="produtoSelecionado.quantidade"></v-text-field>
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

                <td>
                  R$ {{ valorFormatado(item.valor) }}
                </td>
                
                <td>
                  {{ item.quantidade }}
                </td>

                <!-- <td>
                  R$ {{ valorFormatado(item.quantidade * item.valor) }}
                </td> -->
                
                <td class="text-center">
                  <app-btn alert small tooltip="Remover Produto" :disabled="cadastrando" :on-click="() => removeProduto(item.id)" icon="mdi-delete" />
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
      <app-btn success block label="Lançar" :on-click="lancarVenda" />
    </v-col>
  </v-row>

`

import { $bus } from '../../js/eventBus.js'
import { $gm } from '../../js/globalMethods.js'

export default {
  template,
  data() {
    return {
      buscaProduto: "",
      loadingProdutos: false,
      produtos: [],

      valid: false,

      produtoSelecionado: {
        produto: null,
        quantidade: null,
      },

      cabecalho: [
        { text: 'Produto', sortable: false, value: 'nome' },
        { text: 'Valor Unitário', sortable: false, value: 'valor' },
        { text: 'Quantidade', sortable: false, value: 'quantidade' },
        // { text: 'Total', sortable: false, value: 'total' },
        { text: '', sortable: false, value: 'btns' },
      ],
      produtosSelecionados: [],
      totalVenda: 0,

      cadastrando: false,
    }
  },
  watch: {
    buscaproduto(v) {
      this.buscarUsuarios()
    }
  },
  methods: {
    async buscarProdutos() {
      this.loadingProdutos = true

      this.produtos = [];

      const filtroProdutos = this.buscaProduto ? `nome=${this.buscaProduto}` : "nome"

      await axios.get(`/produto/buscar?${filtroProdutos}`)
        .then(retorno => {
          this.produtos = JSON.parse(retorno.data)
        })
        .catch(erro => {
          console.log('Erro ao listar produtos')
        })
        .finally(() => {
          this.loadingProdutos = false
        })
    },

    async lancarVenda() {
      this.cadastrando = true

      const body = {
        valor: this.totalVenda,
        dt_realizado: moment().format("YYYY-MM-DD HH:mm:ss"),
        usuario_id: 2,
        produtos: this.produtosSelecionados
      }

      await axios.post('/venda/inserir', body)
        .then(retorno => {
          $bus.$emit('close-modal')
          $bus.$emit('atualizar-tabela')
        })
        .catch(erro => {
          console.log("Erro ao cadastrar")
        })
        .finally(() => {
          this.cadastrando = false
        })
    },

    addProduto() {
      this.$refs.form.validate()

      if (this.valid) {
        const { id, nome, valor } = this.produtoSelecionado.produto
        const { quantidade } = this.produtoSelecionado

        const produtoIgual = this.produtosSelecionados.find(produto => produto.id == id)

        if (!$gm.isEmpty(produtoIgual)) {
          this.produtosSelecionados.map(produto => {
            if (produto.id == id) {
              produto.quantidade = parseInt(produto.quantidade) + parseInt(quantidade)
            }
          })
        }
        else {
          this.produtosSelecionados.push({
            id,
            nome,
            valor,
            quantidade
          })
        }


        this.$refs.form.reset()

        this.produtoSelecionado = {
          produto: null,
          quantidade: null,
        }

        this.$refs.form.resetValidation()

        this.setVendaValor()
      }
    },

    removeProduto(produto_id) {
      this.produtosSelecionados = this.produtosSelecionados.filter(produto => produto.id !== produto_id)

      this.setVendaValor()
    },

    setVendaValor() {
      this.totalVenda = 0

      this.produtosSelecionados.map(produto => {
        this.totalVenda += produto.valor * produto.quantidade
      })
    },

    valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
    },
  },
  mounted() {
    this.buscarProdutos()

    $bus.$on('reset-form', () => {
      this.produtosSelecionados = []
      this.totalVenda = 0
      this.$refs.form.reset()
    })
  }
}