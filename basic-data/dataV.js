
    window.global = window;
    (function () {
      // main config for this page
      var appConfig = {
        base: '//cdn-service.datav.aliyun.com/datav-static/2.18.9_3/',
        debug: false
      };
      // semantic 需要
      Cube.register('jquery', $);

      window.process = {
        env: {
          NODE_ENV: 'prod'
        },
        staticBase: 'cdn-service.datav.aliyun.com',
        marqueeUrl: 'https://data.aliyun.com/datav/marquee?wh_ttid=pc',
        marqueeJsonpCallback: 'tms_jsonp_156241',
        inner: 'false',
        serviceBase: 'service.datav.aliyun.com',
        staticPath: '//cdn-service.datav.aliyun.com/datav-static/2.18.9_3/'
      }

      window.screenAlias = '09a11942fed46b489fc75876ccc27ccf'
      window.share = { event: new EventEmitter() }

      var share;
      Cube.init({
        base: appConfig.base,
        debug: appConfig.debug,
        version: '',
        enableCss: true,
        strict: false,
        global: window,
        remoteBase: {
          'datav': '//resource.datav.aliyun.com/cube/',
          'main': '/static'
        },
        timeout: 60000
      });

      // 根据 namespace 判断是大屏预览还是合并节点预览
      let namespace = 'share';
      let configPath = '';
      if (namespace === 'screenNodePreview') {
        configPath = 'main:/v3/screen/nodal/09a11942fed46b489fc75876ccc27ccf/config.js';
      } else {
        configPath = 'main:/v3/screen/09a11942fed46b489fc75876ccc27ccf/config.js';
      }
      Cube.use(['/common/share.js', configPath], function (Share, cfg) {
        document.title = cfg.name;
        share = Share({
          status: 'preview',
          datavBase: '',
          id: '09a11942fed46b489fc75876ccc27ccf',
          datacenter: 'https://dc.datav.aliyun.com/',
          config: cfg,
          ratioX: null,
          ratioY: null,
          is4service: 'false',
          source: '',
          locale: 'zh_CN',
          region: 'CN'
        });

        Cube.use(['main:/screens/09a11942fed46b489fc75876ccc27ccf/hook.js', '/preview/index.js'], function (hook, Screen) {
          window.screen = cfg.config || {};
          window.screen.width && $('body').css('width', window.screen.width);
          window.screen.height && $('body').css('height', window.screen.height);
          $('head').append('<meta name="viewport" content="width=' + window.screen.width + '"/>');
          Screen.run('09a11942fed46b489fc75876ccc27ccf', cfg, hook);
        });
        $(window, document).resize(function () {
          resize();
        }).load(function () {
          $('.datav-layout').css('visibility', 'visible');
          resize();
          $('#datav-loading').fadeOut();
        });
        setTimeout(function () {
          $('.datav-layout').css('visibility', 'visible');
          resize();
          $('#datav-loading').fadeOut();
        }, 10 * 1000);
      })

      function resize() {
        if (window.screen.display == 2) {
          resizeCenter();
        } else if (window.screen.display == 3) {
          resizeFull();
        } else {
          resizeWidth();
        }
        window.share.event.emit('ratio-change', {
          ratioX: share.get('ratioX'),
          ratioY: share.get('ratioY')
        })
      }
      function resizeWidth() {
        var ratio = $(window).width() / (window.screen.width || $('body').width());
        share.set('ratioX', ratio)
        share.set('ratioY', ratio)
        $('body').css({
          transform: "scale(" + ratio + ")",
          transformOrigin: "left top",
          backgroundSize: "100%"
        });
      }
      function resizeCenter() {
        if (!window.screen.height || !window.screen.width) return resizeCenterBak();
        var ratio = $(window).height() / window.screen.height;
        share.set('ratioX', ratio)
        share.set('ratioY', ratio)
        $('body').css({
          transform: "scale(" + ratio + ")",
          transformOrigin: "left top",
          backgroundSize: 100 * (window.screen.width / $(window).width() * ratio) + "%" + ' 100%',
          backgroundPosition: ($(window).width() - $('body').width() * ratio) / 2 + "px top",
          marginLeft: ($(window).width() - $('body').width() * ratio) / 2
        });
      }
      function resizeFull() {
        if (!window.screen.height || !window.screen.width) return resizeFullBak();
        var ratioX = $(window).width() / window.screen.width;
        var ratioY = $(window).height() / window.screen.height;
        share.set('ratioX', ratioX)
        share.set('ratioY', ratioY)
        $('body').css({
          transform: "scale(" + ratioX + ", " + ratioY + ")",
          transformOrigin: "left top",
          backgroundSize: "100% 100%",
        });
      }

      function resizeCenterBak() {
        var ratioX = $(window).width() / $('body').width();
        var ratioY = $(window).height() / $('body').height();
        var ratio = Math.min(ratioX, ratioY);
        share.set('ratioX', ratio)
        share.set('ratioY', ratio)
        $('body').css({
          transform: "scale(" + ratio + ")",
          transformOrigin: "left top",
          backgroundSize: (1 / ratioX) * 100 * ratio + "%",
          backgroundPosition: ($(window).width() - $('body').width() * ratio) / 2 + "px top",
          marginLeft: ($(window).width() - $('body').width() * ratio) / 2
        });
      }
      function resizeFullBak() {
        var ratioX = $(window).width() / $('body').width();
        var ratioY = $(window).height() / $('body').height();
        share.set('ratioX', ratioX)
        share.set('ratioY', ratioY)
        $('body').css({
          transform: "scale(" + ratioX + ", " + ratioY + ")",
          transformOrigin: "left top",
          backgroundSize: "100% " + ratioY * 100 + "%",
        });
      }
      function getComList(coms) {
        var result = [];
        var comList = {};
        coms.forEach(function (com, index) {
          if (com.parent) return;
          var idx = com.attr.zIndex || 1000;
          if (!comList[idx]) comList[idx] = [];
          comList[idx].push(com);
        });
        Object.keys(comList).sort(function (a, b) {
          a = a * 1;
          b = b * 1;
          if (a > b) return 1;
          if (a < b) return -1;
          return 0
        }).forEach(function (idx) {
          comList[idx].forEach(function (com) {
            result.push(com.com_id);
          });
        });
        return result;
      }
    })();
  