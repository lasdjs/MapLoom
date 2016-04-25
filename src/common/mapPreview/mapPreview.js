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
        runMap();
        //mapService.runMap('maapa');
        map = true;
      }
    });

    function runMap() {

      var geojsonFormat = new ol.format.GeoJSON();

      var vectorSource = new ol.source.Vector({
        loader: function(extent, resolution, projection) {
          var url = 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/' +
              'Petroleum/KSFields/FeatureServer/0/query?f=json&returnGeometry=' +
              'true&spatialRel=esriSpatialRelIntersects&geometry=' +
              encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                  extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                  ',"spatialReference":{"wkid":102100}}') +
              '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
              '&outSR=102100&callback=loadFeatures';
          // use jsonp: false to prevent jQuery from adding the "callback"
          // parameter to the URL
          $.ajax({url: url, dataType: 'jsonp', jsonp: false});
        },
        strategy: ol.loadingstrategy.tile(new ol.tilegrid.createXYZ({
          maxZoom: 19,
          tileSize: 512
        }))
      });

      var loadFeatures = function(response) {
        var features = [];
        for (var i = 0, ii = response.features.length; i < ii; ++i) {
          var primitive = Terraformer.ArcGIS.parse(response.features[i]);
          var olFeature = geojsonFormat.readFeature(primitive);
          features.push(olFeature);
        }
        if (features.length > 0) {
          vectorSource.addFeatures(features);
        }
      };

      var styleCache = {
        'ABANDONED': [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(225, 225, 225, 255)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 255)',
              width: 0.4
            })
          })
        ],
        'GAS': [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 0, 0, 255)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(110, 110, 110, 255)',
              width: 0.4
            })
          })
        ],
        'OIL': [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(56, 168, 0, 255)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(110, 110, 110, 255)',
              width: 0
            })
          })
        ],
        'OILGAS': [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(168, 112, 0, 255)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(110, 110, 110, 255)',
              width: 0.4
            })
          })
        ]
      };

      var vector = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature, resolution) {
          var classify = feature.get('activeprod');
          return styleCache[classify];
        }
      });

      var attribution = new ol.Attribution({
        html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
      });

      var raster = new ol.layer.Tile({
        source: new ol.source.XYZ({
          attributions: [attribution],
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
              'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        })
      });

      map = new ol.Map({
        target: 'maapa',
        layers: [raster, vector],
        view: new ol.View({
          center: ol.proj.transform([-97.6114, 38.8403], 'EPSG:4326', 'EPSG:3857'),
          zoom: 7
        })
      });
      map.on('dragend', function() {
      });
    }
  }

})();
