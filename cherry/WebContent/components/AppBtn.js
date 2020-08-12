export default {
	name: 'AppBtn',
	props: {
		label: { type: String, default: '' },
		outlined: { type: Boolean, default: false },
		onClick: { type: Function, default: null },
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
	},
	template: `
		<v-btn
			:outlined="outlined"
			:color="btnColor"
			:class="btnText"
			@click="onClick"
		>
			{{ label }}
		</v-btn>
	`
}