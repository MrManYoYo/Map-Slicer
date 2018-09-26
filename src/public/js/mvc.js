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