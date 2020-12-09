const template = /*html*/ `

	<v-row>
		<v-col cols="12" class="pb-0">
			<v-row dense align="center" :class="this.$vuetify.breakpoint.xl ? 'pb-5' : 'pb-5 pr-1'">
				<v-col cols="2">
					<app-btn normal label="LANÇAR VENDA" :on-click="abrirModalAdd" />
				</v-col>
				
				<v-col offset="5" cols="2">
					<v-text-field label="Data" v-mask="'##/##/####'" v-model="filtro.data" dense solo hide-details>
					</v-text-field>
				</v-col>

				<v-col cols="2">
          <v-autocomplete
            dense
            solo
            :search-input.sync="buscaUsuario"
            v-model="filtro.usuario_id" 
            :items="usuarios"
            label="Usuário"
            item-text="nome"
            item-value="id"
            :no-data-text="(loadingUsuarios) ? 'Buscando...' : 'Nenhum usuário encontrado.'"
            hide-details
          />
				</v-col>

				<v-col cols="1" align-self="center" class="text-right">
					<app-btn info label="FILTRAR" :on-click="buscarVendas" />
				</v-col>
			</v-row>
		</v-col>
		
		<v-col cols="12" class="pt-0">
			<app-table 
				:headers="cabecalho" 
				:content="vendas" 
				:loading="loadingVendas" 
				loading-text="Buscando vendas..." 
				no-data-text="Nenhuma venda encontrada."
			>
				<template v-slot:content>
					<tr v-for="(item, i) in vendas" :key="i">
						<td>
							{{ item.id }}
						</td>

						<td>
							{{ dataFormatada(item.dt_realizado) }}
						</td>
						
						<td>
							{{ item.usuario_nome }}
						</td>
						
						<td>
							{{ valorFormatado(item.valor) }}
						</td>
						
						<td class="text-right">
              <app-btn label="Detalhes" info outlined small :on-click="() => abrirModal('view', 'DETALHES DA VENDA', null, item.id)" />
							<!-- <app-dropdown :btns="item.btns" /> -->
						</td>
					</tr>
				</template>
			</app-table>
		</v-col>
		
		<app-modal :title="modalTitle" :subtitle="modalSubtitle">
			<modal />
		</app-modal>
	</v-row>

`;

import { $bus } from '../../js/eventBus.js'

Vue.directive('mask', VueMask.VueMaskDirective);

// Modais
import ModalView from "./view.js";
import ModalAdd from "./add.js";

export default {
  template,
  data() {
    return {
      // Tabela de usuários
      loadingVendas: false,
      loadingUsuarios: false,
      cabecalho: [
        { text: "Código", sortable: false, value: "id" },
        { text: "Data de Lançamento", sortable: false, value: "dt_lancamento" },
        { text: "Usuário", sortable: false, value: "usuario" },
        { text: "Valor", sortable: false, value: "valor" },
        { text: "", sortable: false, value: "btns" },
      ],
      vendas: [],
      usuarios: [],
      buscaUsuario: '',
      filtro: {
        data: "",
        usuario_id: "",
      },

      // Modais
      modalAtual: null,
      modalTitle: "",
      modalSubtitle: "",
    };
  },
  watch: {
    modalAtual(modal) {
      this.$options.components.Modal = modal;
    },

    buscaUsuario(v) {
      const busca = v ? v.replace(/ /g, "") : v

      if (busca == "") {
        this.filtro.usuario_id = null
      }

      this.buscarUsuarios()
    }
  },
  methods: {
    async buscarVendas() {
      this.loadingVendas = true;

      this.vendas = [];

      const { data, usuario_id } = this.filtro;

      const filtroData = data ? "dt_realizado=" + moment(data, "DD/MM/YYYY").format("YYYY-MM-DD") : "dt_realizado";
      const filtroUsuario = usuario_id ? "usuario_id=" + usuario_id : "usuario_id";

      await axios
        .get(`/venda/listar?${filtroData}&${filtroUsuario}`)
        .then((retorno) => {
          const vendas = retorno.data;

          vendas.map((venda) => {
            const { id, valor, dt_realizado, usuario_nome } = venda;

            const btns = [
              {
                title: "Detalhes",
                function: () =>
                  this.abrirModal("view", "DETALHES DA VENDA", ModalView, id),
              },
            ];

            this.vendas.push({ id, valor, dt_realizado, usuario_nome, btns });
          });
        })
        .catch((erro) => {
          console.log(erro.response);
        })
        .finally(() => {
          this.loadingVendas = false;
        });
    },

    async buscarUsuarios() {
      this.loadingUsuarios = true

      this.usuarios = [];

      const filtroUsuario = this.buscaUsuario ? `nome=${this.buscaUsuario}` : "nome"

      await axios.get(`/usuario/buscar?${filtroUsuario}`)
        .then(retorno => {
          this.usuarios = retorno.data
        })
        .catch(erro => {
          console.log('Erro ao listar usuarios')
        })
        .finally(() => {
          this.loadingUsuarios = false
        })
    },

    abrirModal(metodo, titulo, componente, venda_id) {
      if (metodo == 'view') {
        this.modalAtual = ModalView;
      }
      else {
        this.modalAtual = componente;
      }

      this.modalTitle = titulo;

      if (metodo == "add") {
        this.modalSubtitle = "";
      } else {
        this.modalSubtitle = venda_id.toString();

        this.$router.push({ path: "/vendas", query: { id: venda_id } });
      }

      $bus.$emit("open-modal");
    },

    abrirModalAdd() {
      this.abrirModal("add", "LANÇAR VENDA", ModalAdd);
    },

    valorFormatado(valor) {
      return `R$ ${(valor.toFixed(2)).replace(".", ",")}`
    },

    dataFormatada(data) {
      return moment(data, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YY HH:mm")
    }
  },
  mounted() {
    this.buscarVendas();

    $bus.$on('atualizar-tabela', () => {
      this.filtro = {
        data: "",
        usuario_id: "",
      },

        this.buscarVendas()
    })
  },
};
