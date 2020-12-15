const template = /*html*/`

	<v-row no-gutters>
		<!-- Filtros -->
		<v-col cols="9">
			<v-form ref="form" v-model="valid">
				<v-row>
					<v-col cols="6" class="py-0">
						<v-select
							v-model="filtro.relatorio"
							label="Relatório *"
							:items="tiposRelatorios" 
							item-value="tipo" 
							item-text="nome"
							:rules="[v => !!v || 'Selecione um tipo de relatório.']"
						/>
					</v-col>
	
					<v-col cols="6" class="py-0">
						<v-menu
							ref="menu"
							v-model="menu"
							:close-on-content-click="false"
							:return-value.sync="filtro.periodo"
							transition="scale-transition"
							offset-y
							min-width="290px"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="periodoSelecionado"
									label="Período *"
									readonly
									v-bind="attrs"
									v-on="on"
									:rules="[v => filtro.periodo.length > 0 || 'Selecione um período.']"
								></v-text-field>
							</template>
	
							<v-date-picker v-model="filtro.periodo" no-title range scrollable :max="currentDate">
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="menu = false">Cancel</v-btn>
								<v-btn text color="primary" @click="$refs.menu.save(filtro.periodo)">OK</v-btn>
							</v-date-picker>
						</v-menu>
					</v-col>
				</v-row>
			</v-form>
		</v-col>

		<v-col cols="3" align-self="center" class="pb-2 pl-6 text-right">
			<app-btn info label="Gerar" :disabled="!valid" :on-click="gerarRelatorio" />
		</v-col>

		<v-col cols="12" class="my-3 text-right" v-if="items.length > 0">
			<app-export-table :title="relatorioSelecionado" :table="table" />
		</v-col>

		<!-- Tabela -->
		<v-col cols="12" v-if="items.length > 0">
			<app-table 
				:headers="headers" 
				:content="items"
			>
				<template v-slot:content v-if="relatorioGerado == 'lucro_diario'">
					<tr v-for="(item, i) in items" :key="i">
						<td>
							{{ dataFormatada(item.data) }}
						</td>

						<td>
							{{ item.qtd_vendas }}
						</td>

						<td>
							R$ {{ valorFormatado(item.total) }}
						</td>
					</tr>
				</template>	

				<template v-slot:content v-else>
					<tr v-for="(item, i) in items" :key="i">
						<td>
							{{ item.nome }}
						</td>

						<td>
							{{ item.quantidade }}
						</td>

						<td>
							R$ {{ valorFormatado(item.valor_unit) }}
						</td>
						
						<td>
						R$ {{ valorFormatado(item.valor_total) }}
						</td>
					</tr>
				</template>

				<template v-slot:footer>
					<v-footer style="width: 100%">
						<v-row class="text-right">
							<v-col offset="4" cols="5" v-if="relatorioGerado == 'lucro_diario'">
								<span class="h6">Total de Vendas: {{ totalVendas }}</span>
							</v-col>
							<v-col class="py-1">
								<span class="h6">Lucro Total: R$ {{ valorFormatado(lucro) }}</span>
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
			valid: false,
			menu: false,

			gerandoRelatorio: false,

			relatorioGerado: '',

			tiposRelatorios: [
				{ nome: "Faturamento", tipo: 'lucro_diario' },
				{ nome: "Produtos Mais Vendidos", tipo: 'produtos_vendidos' }
			],

			relatorios: {
				produtos_vendidos: {
					headers: [
						{ text: 'Produto', value: 'nome', sortable: false },
						{ text: 'Quantidade', value: 'quantidade', sortable: false },
						{ text: 'Valor', value: 'valor_unit', sortable: false },
						{ text: 'Total', value: 'valor_total', sortable: false }
					]
				},
				lucro_diario: {
					headers: [
						{ text: 'Data', value: 'data', sortable: false },
						{ text: 'Quantidade de Vendas', value: 'qtd_vendas', sortable: false },
						{ text: 'Total', value: 'total', sortable: false },
					]
				}
			},

			filtro: {
				relatorio: '',
				periodo: [
					moment().format("YYYY-MM-DD")
				],
			},

			headers: [],
			items: [],
			lucro: 0,
			totalVendas: 0
		}
	},
	computed: {
		periodoSelecionado() {
			this.filtro.periodo.sort((a, b) => {
				return new Date(a) - new Date(b);
			});
			
			const dt_inicio = moment(this.filtro.periodo[0], "YYYY-MM-DD").format("DD/MM/YYYY")
			const dt_fim = moment(this.filtro.periodo[1], "YYYY-MM-DD").format("DD/MM/YYYY")

			return this.filtro.periodo[1] ? `${dt_inicio} ~ ${dt_fim}` : dt_inicio
		},

		table() {
			const { lucro, totalVendas } = this

			const footer = this.relatorioGerado == 'lucro_diario' ? { lucro, totalVendas } : { lucro }

			return {
				headers: this.headers,
				items: this.items,
				footer
			}
		},

		relatorioSelecionado() {
			if (this.filtro.relatorio == "lucro_diario") {
				return "Lucro Diário"
			}
			else {
				return "Produtos Mais Vendidos"
			}
		},

		currentDate() {
			return moment().format('YYYY-MM-DD')
		}
	},
	methods: {
		async gerarRelatorio() {
			const { relatorio, periodo } = this.filtro

			this.gerandoRelatorio = true
			this.lucro = 0
			this.totalVendas = 0

			await axios.get(`/relatorio/${relatorio.replace("_", "-")}?dt_inicio=${periodo[0]}&dt_fim=${periodo[periodo.length - 1]}`)
				.then(retorno => {
					this.headers = this.relatorios[relatorio].headers
					this.items = retorno.data.sort((a, b) => (a.quantidade > b.quantidade) ? -1 : 1)

					if (this.items.length == 0) {
						this.$toasted.global.success("Nenhuma venda realizada no período selecionado!")
					}

					this.items.forEach(item => {
						if (relatorio == "lucro_diario") {
							this.relatorioGerado = "lucro_diario"
							this.lucro += item.total
							this.totalVendas += item.qtd_vendas
						}
						else {
							this.relatorioGerado = "produtos_vendidos"
							this.lucro += item.valor_total
						}
					})
				})
				.catch(erro => {
					this.$toasted.global.error(erro.response.data.message)
				})
				.finally(() => this.gerandoRelatorio = false)
		},

		valorFormatado(valor) {
      return ((Math.round(valor * 100) / 100).toFixed(2)).replace(".", ",")
		},
		
		dataFormatada(data) {
			return moment(data, "YYYY-MM-DD").format("DD/MM/YYYY")
		}
	}
}