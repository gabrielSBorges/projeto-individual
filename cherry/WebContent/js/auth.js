const auth = new Vue({
  data() {
    return {
      user: this.isLoggedIn() ? JSON.parse(atob(sessionStorage.getItem('user'))) : {}
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
      await axios.delete('/auth/logout')
        .then(() => {
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('user')
          axios.defaults.headers.common['Authorization'] = ''
        })
    }
  }
})