const template = /*html*/`

	<v-row no-gutters>
		<v-col cols="12">
			<v-form ref="form" v-model="valid">
				<v-row>
					<v-col cols="2" class="py-0">
						<v-select
							label="Relatório *"
							:items="relatorios" 
							item-value="tipo" 
							item-text="nome"
							:rules="[v => !!v || 'Selecione um tipo de relatório.']"
						/>
					</v-col>
	
					<v-col cols="2" class="py-0">
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
									v-model="filtro.periodo"
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
	
					<v-col cols="2" class="py-0">
						<v-select
							label="Usuários"
							:items="usuarios" 
							item-value="id" 
							item-text="nome" 
						/>
					</v-col>
	
					<v-col>
						<app-btn info label="Gerar" :disabled="!valid" :on-click="gerarRelatorio" />
					</v-col>
				</v-row>
			</v-form>
		</v-col>

		<v-col cols="12">

		</v-col>
	</v-row>

`

export default {
	template,
	data() {
		return {
			valid: false,
			menu: false,

			relatorios: [
				{ nome: "Lucro Mensal", tipo: 'lucro_mensal' },
				{ nome: "Mais Vendidos", tipo: 'mais_vendidos' }
			],

			usuarios: [
				{
					id: 4,
					nome: 'Gabriel Borges',
				},
				{
					id: 5,
					nome: 'Reiner Brawn',
				},
				{
					id: 7,
					nome: 'Eren Yeager',
				},
				{
					id: 10,
					nome: 'Jailson Mendes',
				},
			],

			filtro: {
				relatorio: '',
				periodo: [],
				usuarios: [],
			}
		}
	},
	methods: {
		async gerarRelatorio() {

		}
	}
}