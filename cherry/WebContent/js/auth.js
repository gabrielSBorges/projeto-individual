var auth = {
  isLoggedIn() {
    return localStorage.user ? true : false
  },
  getUser() {
    return JSON.parse(localStorage.user)
  },
  setUser(usuario) {
    localStorage.user = JSON.stringify(usuario)
  },
  setToken(token) {
    axios.defaults.headers.common['Authorization'] = token
  },
  logout() {
    delete localStorage.user
    axios.defaults.headers.common['Authorization'] = ''
  }
}