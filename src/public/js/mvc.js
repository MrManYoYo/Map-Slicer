// 监听对象属性变化
const observe = obj => {
  if (!obj || typeof obj != 'object') {
    return
  }
  for (var i in obj) {
    definePro(obj, i, obj[i]);
  }
}
const definePro = (obj, key, value) => {
  observe(value);
  Object.defineProperty(obj, key, {
    get: function () {
      return value;
    },
    set: function (newval) {
      console.log('检测变化', newval);
      value = newval;
    }
  })
}

// 监听数组变化
const subscribeArray = () => {
  const arr = []
  return new Proxy(arr, {
    get: function (target, key, receiver) {
      return target[key]
    },
    set: function (target, key, value, receiver) {
      target[key] = value;
      console.log(`修改了key:${key},新值：${value}, arr: ${arr}`)
      return true
    }
  })
}