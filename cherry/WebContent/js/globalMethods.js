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
}