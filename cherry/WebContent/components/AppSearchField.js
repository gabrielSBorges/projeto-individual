const template = /*html*/`
	
	<v-row no-gutters :class="this.$vuetify.breakpoint.xl ? 'mr-n4' : 'mr-4'">
		<v-col cols="10">
			<v-text-field
				v-model="text"
				:placeholder="placeholder"
				solo
				dense
				@input="$emit('input', text)"
				:style="textFieldStyle"
				hide-details
			/>
		</v-col>

		<v-col cols="2">
			<v-btn :style="buttonStyle" color="info" class="white--text">
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
		</v-col>			
	</v-row>

`

export default {
	template,
	props: {
		placeholder: { type: String, default: 'Digite para buscar...' },
		onClick: { type: Function, default: null }
	},
	data() {
		return {
			text: '',
			rowStyle: ''
		}
	},
	computed: {
		textFieldStyle() {
			return `
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			`
		},
		
		buttonStyle() {
			return `
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				height: 38px;
				margin-left: -2px;
			`
		},
	}
}