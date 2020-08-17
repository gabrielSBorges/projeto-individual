export const $gm = {
  isArray(value) {
    if (value) {
      if (Object.prototype.toString.call(value) == '[object Array]') {
        return true
      }
    }
    
    return false
  },

  isObject(value) {
    if (Object.prototype.toString.call(value) == '[object Object]') {
      return true
    }
    
    return false
  },

  isEmpty(value) {
    if (Object.prototype.toString.call(value) == '[object String]') {
      value = value.replace(/\s/g,'')
      
      if (value === "") {
        return true
      }
    }
    
    if (Object.prototype.toString.call(value) == '[object Null]' || Object.prototype.toString.call(value) == '[object Undefined]') {
      return true
    }

    if (this.isObject(value)) {
      if (Object.keys(value).length == 0) {
        return true
      }
    }

    if (this.isArray(value)) {
      if (value.length == 0) {
        return true
      }
    }
    
    return false
  },

  typeOf(value) {
    let type = Object.prototype.toString.call(value)

    type = type.split(" ")[1].replace("]", "")

    return type.toLowerCase()
  },

  validEmail(value) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i

    return regex.test(value)
  },

  validPassword(value) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    return regex.test(value)
  },
}