const template = /*html*/`

	<v-hover v-slot:default="{ hover }" open-delay="100" close-delay="100">
		<v-card :elevation="hover ? 8 : 2" style="cursor: pointer;">
			<v-row no-gutters class="pa-5">
				<v-col cols="12" class="mb-4">
					<span class="text-h6" style="user-select: none;">{{ title }}</span>
				</v-col>

				<v-col cols="12">
					<span class="text-body-2 grey--text text--darken-1" style="user-select: none;">{{ description }}</span>
				</v-col>
			</v-row>
		</v-card>
	</v-hover>

`

export default {
	template,
	props: {
		title: { type: String, default: '' },
		description: { type: String, default: '' },
	},
}