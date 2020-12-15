const auth = new Vue({
  data() {
    return {
      user: this.isLoggedIn() ? JSON.parse(atob(sessionStorage.getItem('user'))) : {},
      loggedIn: false
    }
  },
  methods: {
    setUser(usuario) {
      this.user = usuario
      sessionStorage.setItem('user', btoa(JSON.stringify(usuario)))
    },

    setToken(token) {
      sessionStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = token
    },

    isLoggedIn() {
      if (sessionStorage.getItem('user')) {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
        return true
      }
      
      return false
    },

    async logout() {
      this.loggedIn = false
      await axios.delete('/auth/logout')
        .then(() => {
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('user')
          axios.defaults.headers.common['Authorization'] = ''
        })
    }
  }
})