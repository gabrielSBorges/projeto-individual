const template = /*html*/`

	<v-tooltip bottom :disabled="!tooltip">
		<template v-slot:activator="{ on }">
			<v-btn
				:disabled="disabled"
				:small="small"
				:block="block"
				:outlined="outlined"
				:color="btnColor"
				:class="btnText"
				@click="onClick"
			>
				<template v-if="label !== ''">
					{{ label }}
				</template>

				<template v-else-if="icon !== ''">
					<v-icon>{{ icon }}</v-icon>
				</template>
			</v-btn>
		</template>

		<span>{{ tooltip }}</span>
	</v-tooltip>

`

export default {
	template,
	props: {
		label: { type: String, default: '' },
		icon: { type: String, default: '' },
		tooltip: { type: String, default: '' },
		outlined: { type: Boolean, default: false },
		onClick: { type: Function, default: null },
		disabled: { type: Boolean, default: false },
		small: { type: Boolean, default: false },
		block: { type: Boolean, default: false },
		normal: { type: Boolean, default: false },
		info: { type: Boolean, default: false },
		alert: { type: Boolean, default: false },
	},
	computed: {
		btnColor() {
			if (this.normal) {
				return 'green lighten-2'
			}
			else if (this.info) {
				return 'blue lighten-2'
			}
			else if (this.alert) {
				return 'red lighten-2'
			}
			else {
				return 'grey lighten-2'
			}
		},
		
		btnText() {
			if (this.normal || this.info || this.alert) {
				return 'white--text'
			}
			else {
				return 'grey--text text--darken-2'
			}
		}
	}
}