'use strict';

let L = require('leaflet');
let EsriLeaflet = require('esri-leaflet');
let Proj4Leaflet = require('proj4leaflet');
require('leaflet-fullscreen');
require('leaflet.heat/dist/leaflet-heat');

// http://kartena.github.io/Proj4Leaflet/examples/wmts/
// http://kartena.github.io/Proj4Leaflet/examples/wmts/script.js
// Using-LDS-XYZ-tile-services-in-Leaflet-and-OpenLayers.pdf

// Inject esri and Proj4Leaflet plugins into Leaflet's L
L.esri = EsriLeaflet;
L.Proj = Proj4Leaflet;
L.Icon.Default.imagePath = '/assets/images';

let NpolarEsriLeaflet = function($http, $location, NpolarMessage) {
  'ngInject';

  let self = this;

  const EPSG = 4326;

  this.element = 'npolar-esri-leaflet-map'; // The map's html element @id

  this.base = '//geodata.npolar.no/arcgis/rest/services';

  this.uri = function(arg={ epsg: EPSG }) {
    let uri = self.base.replace(/\/$/, '');

    if (arg && arg.epsg) {
      let epsg = parseInt(arg.epsg);

      if (epsg === 25833) {
        uri += `/Basisdata/NP_Basiskart_Svalbard_WMTS_25833/MapServer`;
      } else if (epsg === 32661) {
        uri += `/Basisdata_Intern/NP_Arktis_WMTS_32661/MapServer`;
      } else if (epsg === 53032) {
        uri += `/Basisdata_Intern/NP_Verden_WMTS_53032/MapServer`;
      } else if (epsg === 4326) {
        uri = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      } else {
        console.error(`Unsupported EPSG ${epsg}`);
      }
      console.log('epsg', epsg, '->', uri);
    }
    return uri;
  };

  // @return instance of Proj4Leaflet CRS (L.Proj.CRS)
  this.crsFactory = function(uri) {
    let crs;
    let path = uri.split(`${self.base}`)[1];

    if ((/(WMTS_25833|25833)/).test(path)) {
      crs = self.UTM_33N_CRSFactory();

    } else if ((/(WMTS_32661|UPSN|32661)/).test(path)) {
      crs = self.UPSN_CRSFactory();

    } else if ((/53032/).test(path)) {
      crs = self.WMTS_53032_CRSFactory();

    } else {
      crs = null; //new L.Proj.CRS("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
    }
    return crs;
  };

  // Polar stereographic north / WGS84
  // Projection definition for EPSG:32661 from http://epsg.io/32661.js
  // http://jsfiddle.net/12c9vheh/22/
  this.UPSN_CRSFactory = function() {
    let resolutions = [21674.7100160867, 10837.35500804335, 5418.677504021675, 2709.3387520108377, 1354.6693760054188, 677.3346880027094, 338.6673440013547, 169.33367200067735, 84.66683600033868, 42.33341800016934];
    let transformation = new L.Transformation(1, 28567900, -1, 32567900);
    return new L.Proj.CRS('EPSG:32661','+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
      {transformation, resolutions});
  };

  // UTM zone 33N / ETRS89
  // Projection definition for EPSG:25833 from http://epsg.io/25833.js
  // http://jsfiddle.net/9ozgfLg7/125/
  this.UTM_33N_CRSFactory = function() {
    return new L.Proj.CRS(
      'EPSG:25833',
      '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs',
      {
        transformation: new L.Transformation(1, 5120900, -1, 9998100),
        resolutions: [21674.7100160867,10837.35500804335,5418.677504021675,2709.3387520108377,1354.6693760054188,677.3346880027094,338.6673440013547,169.33367200067735,84.66683600033868,42.33341800016934,21.16670900008467,10.583354500042335,5.291677250021167,2.6458386250105836,1.3229193125052918,0.6614596562526459,0.33072982812632296,0.16536491406316148]
      }
    );
  };

  // ESRI:53032
  // Sphere Azimuthal Equidistant
  this.WMTS_53032_CRSFactory = function () {
    let resolutions = [173397.6801286936, 86698.8400643468, 43349.4200321734, 21674.7100160867, 10837.35500804335, 5418.677504021675, 2709.3387520108377, 1354.6693760054188, 677.3346880027094, 338.6673440013547];
    let origin = [-21986016.870795302, 21986016.870795317];

    return new L.Proj.CRS(
      'EPSG:53032', // or ESRI:53032?
      '+proj=aeqd +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs',
      {
        transformation: new L.Transformation(1, -21986016.870795302, -1, 21986016.870795317),
        resolutions,
        origin
      }
    );
  };

  this.esriBaseUri = function() {
    return self.uri({ epsg: EPSG });
  };

  this.heatLayerFactory = function(points, heatConfig = {
    minOpacity: 0.9,
    useLocalExtrema: true,
    scaleRadius: true,
    radius: 6,
    }) {
    return L.heatLayer(points, heatConfig);
  };

  this.tileLayerFactory = function(esriBase = self.esriBaseUri(), config = {
    url: esriBase,
    //maxZoom: 7,
    //minZoom: 2,
    continuousWorld: true,
    attribution: null }) {
    if ((/server\.arcgisonline\.com/).test(esriBase)) {
      config.attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }
    return new L.esri.tiledMapLayer(config);
  };

  this.mapFactory = function(esriBase = self.esriBaseUri(), mapConfig={
      attributionControl: true,
      scrollWheelZoom: true,
      fullscreenControl: true,
      crs: self.crsFactory(esriBase)
    }, tileLayerConfig = undefined) {

    if (!(mapConfig.crs instanceof L.Proj.CRS)) {
      delete mapConfig.crs;
    }

    let map = new L.Map(self.element, mapConfig);
    map.addLayer(self.tileLayerFactory(esriBase, tileLayerConfig));
    map.setView([80, 0], 0);

    // Disable zoom handlers.
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();

    return map;
  };

  return this;
};

module.exports = NpolarEsriLeaflet;