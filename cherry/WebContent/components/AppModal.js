const template = /*html*/`

	<v-dialog v-else v-model="showDialog" :max-width="maxWidth" :max-height="maxHeight">
		<v-card :style="modalHeaderStyle" color="primary">
			<v-row dense align="center" class="pl-3 pr-2 py-2">
				<v-col cols="10">
					<span class="text-subtitle-2 white--text">{{ subtitle ? title + ' - ' + subtitle : title }}</span>
				</v-col>
				
				<v-col cols="2" class="text-right">
					<v-btn icon small @click="fechaModal" class="white--text">
						<v-icon>mdi-close-circle</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-card>
		
		<v-card class="r-modal-card" :style="modalBodyStyle">
			<v-container>
				<slot />
			</v-container>
		</v-card>
	</v-dialog>

`
import { $bus } from '../js/eventBus.js'
import { $gm } from '../js/globalMethods.js'

export default {
	template,
	props: {
		title: { type: String, default: '', required: true },
		subtitle: { type: String, default: '', required: false },
		maxWidth: { type: [String, Number], default: '500' },
		maxHeight: { type: [String, Number], default: '450' },
	},
	data() {
		return {
			showDialog: false,
		}
	},
	watch: {
		showDialog(v) {
			if (!v) {
				$bus.$emit('reset-form')
			}
		}
	},
	computed: {
		modalHeaderStyle() {
			return `
				border-bottom-left-radius: 0 !important;
				border-bottom-right-radius: 0 !important;
				overflow: hidden;
			`
		},
		
		modalBodyStyle() {
			return `
				border-top-left-radius: 0 !important;
				border-top-right-radius: 0 !important;
				overflow: hidden;
			`
		},
	},
	methods: {
		fechaModal() {
			this.showDialog = false

			$bus.$emit('reset-form')

			if (!$gm.isEmpty(this.$route.query)) {
				this.$router.push({ path: this.$route.path, query: {} })
			}
		}
	},
	mounted() {
		$bus.$on('open-modal', () => {
			this.showDialog = true
		})
		
		$bus.$on('close-modal', () => {
			$bus.$emit('reset-form')
			this.showDialog = false
		})
	},
	beforeDestroy(){
		$bus.$off('open-modal')
		$bus.$off('close-modal')
	},
}