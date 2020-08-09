import Login from '../pages/login.js'
import Home from '../pages/home.js'
import Usuarios from '../pages/usuarios.js'
import Produtos from '../pages/produtos.js'
import Vendas from '../pages/vendas.js'
import Relatorios from '../pages/relatorios.js'

export default [
	{
		path: '/login',
		component: Login,
		inMenu: false,
		inHome: false
	},
	{
		icon: 'mdi-home',
		title: 'Tela Inicial',
		path: '/',
		component: Home,
		inMenu: true,
		inHome: false
	},
	{
		icon: 'mdi-account-multiple',
		title: 'Usuários',
		description: 'Cadastro e consulta de usuários do sistema.',
		path: '/usuarios',
		component: Usuarios,
		inMenu: true,
		inHome: true,
	},
	{
		icon: 'mdi-cart',
		title: 'Produtos',
		description: 'Cadastro e consulta de produtos da padaria.',
		path: '/produtos',
		component: Produtos,
		inMenu: true,
		inHome: true
	},
	{
		icon: 'mdi-currency-usd',
		title: 'Vendas',
		description: 'Lançamento e consulta de vendas da padaria.',
		path: '/vendas',
		component: Vendas,
		inMenu: true,
		inHome: true
	},
	{
		icon: 'mdi-chart-areaspline',
		title: 'Relatórios',
		description: 'Consulta de relatórios do sistema.',
		path: '/relatorios',
		component: Relatorios,
		inMenu: true,
		inHome: true
	}
]