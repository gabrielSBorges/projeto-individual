var auth = {
  isLoggedIn() {
	if (sessionStorage.getItem('user')) {
		axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
		return true
	}
	
	return false
  },
  getUser() {
    return JSON.parse(atob(sessionStorage.getItem('user')))
  },
  setUser(usuario) {
    sessionStorage.setItem('user', btoa(JSON.stringify(usuario)))
  },
  setToken(token) {
	sessionStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = token
  },
  async logout() {
    await axios.delete('/auth/logout')
      .then(() => {
		sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        axios.defaults.headers.common['Authorization'] = ''
      })
  }
}