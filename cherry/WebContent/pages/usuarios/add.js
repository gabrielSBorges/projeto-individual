const template = /*html*/`
	
	<v-row>
		<v-col cols="6">
			<v-text-field
				label="Nome"
				v-model="dadosUsuario.nome"
				:rules="nomeRules"
			/>
		</v-col>
		
		<v-col cols="6">
			<v-text-field
				label="E-mail"
				v-model="dadosUsuario.email"
				:rules="emailRules"
			/>
		</v-col>
		
		<v-col cols="6">
			<v-select
				:items="items"
				label="tipo"
				:rules="tipoRules"
			></v-select>
		</v-col>
		
		<v-col cols="6">
			<v-text-field
				label="Senha"
				type="password"
				v-model="dadosUsuario.senha"
				:rules="senhaRules"
				required
			/>
		</v-col>
		
		<v-col cols="6">
			<v-text-field
				label="Senha"
				type="password"
				v-model="dadosUsuario.senha"
				:rules="senhaRules"
			/>
		</v-col>
	</v-row>

`

export default {
	template,
	data() {
		return {
			nomeRules: [
				v => !!v || 'Nome é obrigatório',
			],
			emailRules: [
				v => !!v || 'E-mail é obrigatório',
			],
			emailRules: [
				v => !!v || 'Tipo é obrigatório',
			],
		 	senhaRules: [
				v => !!v || 'Senha é obrigatório',
			],
			items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
		}
	}
}