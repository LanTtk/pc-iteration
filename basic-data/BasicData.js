$(function () {
  // test updata
  //切换导航
  $('.nav ul').on('click','li',function(e){
    e.stopImmediatePropagation();
    console.log(this.id)
    $(this).addClass('active').siblings().removeClass('active');
    $('#'+this.id+'Details').show().siblings().hide();
  })

  //仪表盘
  unit = "A";
  var color = [
    [0.22, '#B70811'],
    [0.4, '#F0A72A'],
    [0.6, 'lime'],
    [0.8, '#F0A72A'],
    [1, '#B70811']
  ];
  var formatter = "报警";
  var max = 100;
  var value = 30;
  generateLevelChartSeries(value, max, unit, formatter, color);

  function generateLevelChartSeries(value, max, unit, formatter, color) {
    var dom = document.getElementById("Meter");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
      series: [{
          name: '速度',
          type: 'gauge',
          min: 0,
          max: max,
          splitNumber: 4,
          conter: ["50%", "50%"],
          radius: '100%',
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: color,
              width: "2",
            }
          },
          splitLine: { // 分隔线
            length: "10%", // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
              width: 3,
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          axisLabel: { // 坐标轴小标记
            textStyle: { // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              fontSize: "40%", //字体大小
              shadowBlur: "50"
            }
          },
          axisTick: { // 坐标轴小标记
            length: "10%", // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
              color: 'auto',
              shadowColor: '#fff', //默认透明
              shadowBlur: "50%"
            }
          },
          title: {
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: "40%",
              fontStyle: 'italic',
              color: '#fff',
              shadowColor: '#fff', //默认透明
              shadowBlur: "1%"
            }
          },
          detail: {
            shadowBlur: "0",
            offsetCenter: [0, '50%'], // x, y，单位px
            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: "60%", //字体大小
            },
            formatter
          },
          pointer: {
            color: '#FFFFFF',
            width: '2',
            length: '80%'
          },
          data: [{
            value,
            name: unit
          }]
        },

      ]
    };
    /*setInterval(function (){
        option.series[0].data[0].value = (Math.random()*100).toFixed(2) - 0;
        option.series[1].data[0].value = (Math.random()*7).toFixed(2) - 0;
        option.series[2].data[0].value = (Math.random()*2).toFixed(2) - 0;
        option.series[3].data[0].value = (Math.random()*2).toFixed(2) - 0;
        myChart.setOption(option);
    },2000)
    ;*/
    if (option && typeof option === "object") {
      myChart.setOption(option, true);
    }
  }
  function resizeWidth(){
    // console.log(window.screen.width)
    // console.log(window.screen)
    // console.log(window.innerWidth)
    // console.log(window.innerHeight)
    var ratioX = window.innerWidth / window.screen.availWidth;
    var ratioY = window.innerHeight / window.screen.availHeight;
    console.log(ratioX)
    console.log(ratioY)
    $('html').css('font-size',ratioX*24 + 'px');
    // $('.scale').css('transform',"scale(" + ratioX + ", " + ratioY + ")");
    // $('.frame').css("z-index",'1');
  }
  $(window).resize(()=>{
    resizeWidth();
  })
});