const template = /*html*/`

	<v-menu offset-y>
		<template v-slot:activator="{ on, attrs }">
			<v-btn small v-bind="attrs" v-on="on">
				<v-icon>mdi-dots-horizontal</v-icon>
			</v-btn>
		</template>

		<v-list class="py-0">
			<v-list-item v-for="(btn, b) in btns" :key="b" @click="btn.function">
				<v-list-item-title>{{ btn.title }}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-menu>

`

export default {
	template,
	props: {
		btns: { type: Array, default: () => [] }
	}
}