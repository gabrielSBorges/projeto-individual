import Login from '../pages/auth/login.js'
import RecuperarSenha from '../pages/auth/recuperar_senha.js'
import ResetarSenha from '../pages/auth/resetar_senha.js'
import Home from '../pages/home/index.js'
import Usuarios from '../pages/usuarios/index.js'
import MeusDados from '../pages/usuarios/meus_dados.js'
import Produtos from '../pages/produtos/index.js'
import Vendas from '../pages/vendas/index.js'
import Relatorios from '../pages/relatorios/index.js'

export default new Vue({
	computed: {
		getPages() {
			const pages = [
				{
					path: '*',
					redirect: '/',
					inMenu: false,
					inHome: false
				},
				{
					title: 'Login',
					name: 'login',
					path: '/login',
					component: Login,
					inMenu: false,
					inHome: false
				},
				{
					title: 'Recuperar Senha',
					name: 'recuperar_senha',
					path: '/recuperar_senha',
					component: RecuperarSenha,
					inMenu: false,
					inHome: false
				},
				{
					title: 'Resetar Senha',
					name: 'resetar_senha',
					path: '/resetar_senha',
					component: ResetarSenha,
					inMenu: false,
					inHome: false
				},
				{
					title: 'Meus Dados',
					name: 'meus_dados',
					path: '/meus_perfil',
					component: MeusDados,
					meta: {
						requiresAuth: true,
					},
					inMenu: false,
					inHome: false
				},
				{
					icon: 'mdi-home',
					title: 'Início',
					name: 'home',
					path: '/',
					component: Home,
					meta: {
						requiresAuth: true,
					},
					inMenu: true,
					inHome: false
				},
				{
					icon: 'mdi-cart',
					title: 'Produtos',
					name: 'produtos',
					description: 'Cadastro e consulta de produtos da padaria.',
					path: '/produtos',
					component: Produtos,
					meta: {
						requiresAuth: true,
					},
					inMenu: true,
					inHome: true
				},
				{
					icon: 'mdi-currency-usd',
					title: 'Vendas',
					name: 'vendas',
					description: 'Lançamento e consulta de vendas da padaria.',
					path: '/vendas',
					component: Vendas,
					meta: {
						requiresAuth: true,
					},
					inMenu: true,
					inHome: true
				}
			]
			
			if (auth.loggedIn) {
				if (auth.user.tipo_id == 1 || auth.user.tipo_id == 2) {
					pages.push(
						{
							icon: 'mdi-account-multiple',
							title: 'Usuários',
							name: 'usuarios',
							description: 'Cadastro e consulta de usuários do sistema.',
							path: '/usuarios',
							component: Usuarios,
							meta: {
								requiresAuth: true,
							},
							inMenu: true,
							inHome: true,
						},
						{
							icon: 'mdi-chart-areaspline',
							title: 'Relatórios',
							name: 'relatorios',
							description: 'Consulta de relatórios do sistema.',
							path: '/relatorios',
							component: Relatorios,
							meta: {
								requiresAuth: true,
							},
							inMenu: true,
							inHome: true
						}
					)
				}
			}

			return pages;
		}
	}
})