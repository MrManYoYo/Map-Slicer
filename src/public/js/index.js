(function () {
  const map = new BMap.Map('app', {
      enableMapClick: false,
    }),
    defaultPoint = new BMap.Point(120.138023, 30.279619),
    mapStyle = [
      {
        "featureType": "highway",
        "elementType": "all",
        "stylers": {
          "visibility": "off",
        }
      },
      {
        "featureType": "subway",
        "elementType": "all",
        "stylers": {
          "lightness": -65,
          "visibility": "off"
        }
      },
      {
        "featureType": "railway",
        "elementType": "all",
        "stylers": {
          "lightness": -40,
          "visibility": "off",
        }
      }
    ],
    jsCodeMirror = CodeMirror(document.getElementById('codeMirror'), {
      value: '// point data',
      mode: 'javascript',
      lineNumbers: true,
      tabSize: 2,
      theme: 'monokai'
    }),
    confirmBtn = document.querySelector('.confirm-btn'),
    popover = document.querySelector('.popover')
  map.setMapStyle({
    styleJson: mapStyle
  })
  map.centerAndZoom(defaultPoint, 12)
  map.enableScrollWheelZoom()

  // 扩展工具配置
  const styleOptions = {
    strokeColor: '#0078b7',
    fillColor: '#000',
    strokeWeight: 2,
    strokeOpacity: 0.8,
    fillOpacity: 0.1,
    strokeStyle: 'solid'
  },
    drawingManager = new BMapLib.DrawingManager(map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: true, //是否显示工具栏
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: new BMap.Size(5, 5)
      },
      circleOptions: styleOptions, //圆的样式
      polylineOptions: styleOptions, //线的样式
      polygonOptions: styleOptions, //多边形的样式
      rectangleOptions: styleOptions //矩形的样式
    }),
    overlays = [];

  //添加鼠标绘制工具监听事件，用于获取绘制结果
  drawingManager.addEventListener('overlaycomplete', (e) => {
    const { drawingMode, overlay } = e
    if (drawingMode === BMAP_DRAWING_POLYGON) {
      overlay.enableEditing()
      overlays.push(overlay)
      jsCodeMirror.setValue(JSON.stringify(overlay.getPath()))
    }
  });

  function toggleClass(dom, cls) {
    if (dom.className.indexOf(cls) !== -1) {
      dom.className = dom.className.replace(` ${cls}`, '')
    } else {
      dom.className += ` ${cls}`
    }
  }

  // 自定义工具框事件
  const ctrlCont = document.querySelector('.self-control'),
    clearBtn = document.querySelector('.clear-btn'),
    jsonBtn = document.querySelector('.json-btn')

  clearBtn.addEventListener('click', () => {
    map.clearOverlays()
  })
  jsonBtn.addEventListener('click', () => {
    console.log(overlays)
    if (jsonBtn.className.indexOf('active') !== -1) {
      jsonBtn.className = jsonBtn.className.replace(' active', '')
      toggleClass(popover, 'hide')
    } else {
      jsonBtn.className += ' active'
      // 格式化value
      if (overlays.length !== 0) {
        const formatArr = Array.from(overlays)
        formatArr.forEach((item, index) => {
          let str = JSON.stringify(item.getPath()).replace(/},/ig, '},\n')
          str = str.replace(/\[/ig, '[\n')
          str = str.replace(/{/ig, '\t{')
          str = str.replace(/}]|},]/ig, '}\n]')
          console.log(str)
          formatArr[index] = str
        })
        jsCodeMirror.setValue(formatArr[formatArr.length - 1])
      }
      toggleClass(popover, 'hide')
    }
  })

  class selfCtrl extends BMap.Control {
    constructor() {
      super()
      this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
      this.defaultOffset = new BMap.Size(10, 10);
    }
    initialize(map) {
      // map.getContainer().appendChild(div);
      return ctrlCont;
    }
  }
  // 创建控件
  // const mySelfCtrl = new selfCtrl();
  // 添加到地图当中
  // map.addControl(mySelfCtrl);

  // 弹窗确定按钮事件
  confirmBtn.addEventListener('click', () => {
    jsonBtn.click()
  })


})()