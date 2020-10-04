const template = /*html*/`
	
	<div>
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
	</div>

`

export default {
	template,
	props: {
		label: { type: String, default: '' },
		icon: { type: String, default: '' },
		tooltip: { type: String, default: '' },
		outlined: { type: Boolean, default: false },
		onClick: { type: Function, default: () => { return null } },
		disabled: { type: Boolean, default: false },
		small: { type: Boolean, default: false },
		block: { type: Boolean, default: false },
		normal: { type: Boolean, default: false },
		success: { type: Boolean, default: false },
		warning: { type: Boolean, default: false },
		info: { type: Boolean, default: false },
		alert: { type: Boolean, default: false },
	},
	computed: {
		btnColor() {
			if (this.normal) {
				return 'secondary'
			}
			else if (this.success) {
				return 'success'
			}
			else if (this.info) {
				return 'info'
			}
			else if (this.alert) {
				return 'error'
			}
			else if (this.warning) {
				return 'warning'
			}
			else {
				return 'default'
			}
		},
		
		btnText() {
			if (this.normal || this.info || this.alert || this.success || this.warning) {
				return 'white--text'
			}
			else {
				return 'grey--text text--darken-2'
			}
		}
	},
}