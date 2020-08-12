const template = /*html*/`

	<v-card>
		<v-data-table
			:headers="headers"
			:items="content"
			:loading="loading"
			loading-text="loadingText"
			no-data-text="noDataText"
			hide-default-footer
		>
			<template v-if="temSlotConteudo" v-slot:body>
				<tbody>
					<slot name="content" />
				</tbody>
			</template>
			
			<template v-if="temSlotFooter" v-slot:footer>
				<footer>
					<slot name="footer" />
				</footer>
			</template>
		</v-data-table>
	</v-card>

`

export default {
	template,
	props: {
		headers: { type: Array, default: () => [] },
		content: { type: Array, default: () => [] }, 
		loading: { type: Boolean, default: false },
		loadingText: { type: String, default: 'Carregando...' },
		noDataText: { type: String, default: 'Nada encontrado.' },
	},
	computed: {
		temSlotConteudo() {
			return !!this.$slots.content
		},

		temSlotFooter() {
			return !!this.$slots.footer
		},
	}
}