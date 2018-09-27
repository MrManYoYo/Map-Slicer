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
      subscribeArray()
    }
  });

  class selfCtrl extends BMap.Control {
    constructor() {
      super()
      this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
      this.defaultOffset = new BMap.Size(10, 10);
    }
    initialize(map) {
      const div = document.createElement('div')
      div.appendChild(document.createTextNode('清除'))
      div.className = 'clear-btn'
      div.onclick = (e) => {
        map.clearOverlays()
        // console.log(overlays)
      }
      map.getContainer().appendChild(div);
      return div;
    }
  }
  // 创建控件
  const mySelfCtrl = new selfCtrl();
  // 添加到地图当中
  map.addControl(mySelfCtrl);

  // 弹窗确定按钮事件
  confirmBtn.addEventListener('click', () => {
    popover.style.display = 'none'
  })

})()