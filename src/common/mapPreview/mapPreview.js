(function() {
  angular.module('loom_map_preview', [])
  .directive('loomMappreview', loomMappreviewDirective);

  function loomMappreviewDirective() {
    return {
      scope: {},
      template: '<div id="maapa"></div>',
      controller: loomMappreviewCtrl

    };
  }

  function loomMappreviewCtrl(mapService) {

    var map;

    $('#add-layer-dialog').on('shown.bs.modal', function() {
      if (map === undefined) {
        // runMap();
        mapService.runMap('maapa');
        map = true;
      }
    });

    function runMap() {
      // var osmSource = new ol.source.OSM();
      var layers = [
        // new ol.layer.Tile({
        //   source: osmSource
        // }),
        // new ol.layer.Tile({
        //   source: new ol.source.TileDebug({
        //     projection: 'EPSG:3857',
        //     tileGrid: osmSource.getTileGrid()
        //   })
        // }),
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
          })
        }),
        new ol.layer.Tile({
          source: new ol.source.TileJSON({
            url: 'http://api.tiles.mapbox.com/v3/' +
                'mapbox.20110804-hoa-foodinsecurity-3month.jsonp',
            crossOrigin: 'anonymous'
          })
        })
        // new ol.layer.Tile({
        //   source: new ol.source.TileJSON({
        //     url: 'http://api.tiles.mapbox.com/v3/' +
        //         'mapbox.world-borders-light.jsonp',
        //     crossOrigin: 'anonymous'
        //   })
        // })
      ];
      map = new ol.Map({
        target: 'maapa',
        layers: layers,
        view: new ol.View({
          center: [-472202, 7530279],
          zoom: 2
        })
      });
      map.on('dragend', function() {
      });
    }
  }

})();
