const template = /*html*/`

	<v-row no-gutters>
		<!-- Filtros -->
		<v-col cols="9">
			<v-form ref="form" v-model="valid">
				<v-row>
					<v-col cols="6" class="py-0">
						<v-select
							label="Relatório *"
							:items="relatorios" 
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
	
							<v-date-picker v-model="filtro.periodo" no-title range scrollable>
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

		<!-- Tabela -->
		<v-col cols="12" v-if="items.length > 0">
			<v-card>
				<v-data-table :headers="headers" :items="items" hide-default-footer>
	
				</v-data-table>
			</v-card>
		</v-col>
	</v-row>

`

import produtos_vendidos from '../../mixins/relatorios/produtos_vendidos.js'
import lucro_diario from '../../mixins/relatorios/lucro_diario.js'

export default {
	template,
	data() {
		return {
			valid: false,
			menu: false,

			gerandoRelatorio: false,

			relatorios: [
				{ nome: "Lucro Diário", tipo: 'lucro_diario' },
				{ nome: "Produtos Mais Vendidos", tipo: 'produtos_vendidos' }
			],

			filtro: {
				relatorio: '',
				periodo: [
					moment().format("YYYY-MM-DD")
				],
				usuarios: [],
			},

			items: []
		}
	},
	computed: {
		periodoSelecionado() {
			const dt_inicio = moment(this.filtro.periodo[0], "YYYY-MM-DD").format("DD/MM/YYYY")
			const dt_fim = moment(this.filtro.periodo[1], "YYYY-MM-DD").format("DD/MM/YYYY")

			return this.filtro.periodo[1] ? `${dt_inicio} ~ ${dt_fim}` : dt_inicio
		}
	},
	methods: {
		async gerarRelatorio() {
			const { relatorio, periodo } = this.filtro

			this.gerandoRelatorio = true

			await axios.get(`/relatorio/${relatorio.replace("_", "-")}?periodo=${periodo}`)
				.then(retorno => {
					this.headers = [relatorio].headers
					this.items = retorno.data
				})
				.catch(erro => {
					console.log('Ocorreu um erro ao tentar gerar o relatório!')
				})
				.finally(() => this.gerandoRelatorio = false)
		}
	}
}