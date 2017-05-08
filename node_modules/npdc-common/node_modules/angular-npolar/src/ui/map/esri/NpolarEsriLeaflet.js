'use strict';
let L = require('leaflet');
let esri = require('esri-leaflet');

require('proj4leaflet');
require('leaflet-fullscreen');
require('leaflet.heat/dist/leaflet-heat');

// http://kartena.github.io/Proj4Leaflet/examples/wmts/
// http://kartena.github.io/Proj4Leaflet/examples/wmts/script.js
// Using-LDS-XYZ-tile-services-in-Leaflet-and-OpenLayers.pdf

// Inject esri into Leaflet's L
L.esri = esri;
L.Icon.Default.imagePath = '/assets/images';

let NpolarEsriLeaflet = function(NpolarMessage) {
  'ngInject';

  let self = this;

  this.L = () => { return L; };

  this.epsg = 3857;

  this.element = 'npolar-esri-leaflet-map'; // The map's html element @id

  this.base = '//geodata.npolar.no/arcgis/rest/services';

  this.configFor = (area='Svalbard', config = { epsg: self.epsg, zoom: 0, view: [], element: self.element, area } ) => {
    let epsg = config.epsg;
    let zoom = config.zoom;
    let view = config.view;
    let element = config.element;

    switch (area) {
      case 'Arktis':
      case 'Arctic':
        epsg = 32661;
        zoom = 2;
        area = 'Arctic';
        view = [75, 0];
        break;

      case 'Svalbard':
        epsg = 25833;
        zoom = 10;
        area = 'Svalbard';
        view = [77.98455, 18.477247];
        break;

      case 'Jan Mayen':
        epsg = 25833;
        zoom = 9;
        area = 'Jan Mayen';
        view = [70.98455, -8.477247];
        break;

      case 'Antarktis':
      case 'Antarctica':
        epsg = 3031;
        zoom = 11;
        area = 'Antarctica';
        view = [-90, 0];
        break;

      case 'Dronning Maud Land':
        epsg = 3031;
        zoom = 6;
        area = 'Dronning Maud Land';
        view = [-75, 0];
        break;

      case 'Peter I Øy':
        epsg = 3857;
        zoom = 11;
        area = 'Peter I Øy';
        view = [-68.82667, -90.721664];
        break;

      case 'Bouvetøya':
        epsg = 3857;
        zoom = 11;
        area = 'Bouvetøya';
        view = [-54.407, 3.3033333];
        break;

      default:
        epsg = 3857;
        zoom = 3;
        area = null;
        view = [0,0];
    }
    config = { area, epsg, zoom, view, element };
    return config;
  };

  self.mapFor = (area, config=self.configFor(area)) => {
    return self.mapFactory(self.uri(config));
  };

  self.attributionFor = (uri) => {
    let attr = `<a href="http://npolar.no">Norsk Polarinstitutt</a>`;
    if ((/server\.arcgisonline\.com/).test(uri)) {
      attr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if ((/NP_Satellitt/).test(uri)) {
      attr = [attr, `<a href="https://landsat.usgs.gov/ ">USGS</a>`, `<a href="https://landsat.gsfc.nasa.gov/">NASA Landsat</a>`];
    }
    return attr;
  };

  this.uri = function(arg={ epsg: self.epsg }) {
    let uri = self.base.replace(/\/$/, '');

    if (arg && arg.epsg) {
      let epsg = parseInt(arg.epsg);
      let area = arg.area;

      if (epsg === 25833) {
        if (area === "Svalbard") {
          //uri += `/Basisdata/NP_Basiskart_Svalbard_WMTS_25833/MapServer`;
          uri = '//geodata.npolar.no/arcgis/rest/services/Basisdata/NP_Satellitt_Svalbard_WMTS_25833/MapServer';
        } else if (area === "Jan Mayen") {
          uri += `/Basisdata/NP_Basiskart_JanMayen_WMTS_25833/MapServer`;
        }
      } else if (epsg === 32661) {
        uri += `/Basisdata_Intern/NP_Arktis_WMTS_32661/MapServer`;
      } else if (epsg === 53032) {
        uri += `/Basisdata_Intern/NP_Verden_WMTS_53032/MapServer`;
      } else if (epsg === 3857) {
        uri = '//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      } else if (epsg === 3031) {
        if (area === "Dronning Maud Land") {
          uri = '//geodata.npolar.no/arcgis/rest/services/Basisdata_Intern/NP_Satellitt_DronningMaudLand_WMTS_3031/MapServer';
        } else {
          uri = '//services.arcgisonline.com/arcgis/rest/services/Polar/Antarctic_Imagery/MapServer/tile/{z}/{y}/{x}';
        }

      } else {
        console.error(`Unsupported EPSG ${epsg}`);
      }
      console.debug('epsg', epsg, '->', uri);
    }
    return uri;
  };

  // @return instance of Proj4Leaflet CRS (L.Proj.CRS)
  this.crsFactory = function(uri) {
    let crs;
    let path = uri;

    if ((/(WMTS_25833|25833)/).test(path)) {
      crs = self.UTM_33N_CRSFactory();

    } else if ((/(WMTS_32661|UPSN|32661)/).test(path)) {
      crs = self.UPSN_CRSFactory();

    } else if ((/53032/).test(path)) {
      crs = self.WMTS_53032_CRSFactory();

    } else if (/Antarctic_Imagery|3031/.test(path)) {
      let resolutions;
      let transformation;
      if (area === 'Dronning Maud Land') {
        resolutions = [2116.670900008467, 1058.3354500042335, 529.1677250021168, 264.5838625010584, 132.2919312505292, 66.1459656252646, 26.458386250105836, 15.000052916772502, 6.614596562526459];
        transformation = new L.Transformation(1, 30636100, -1, 30636100);
      } else {
        resolutions = [238810.81335399998, 119405.40667699999, 59702.70333849987, 29851.351669250063, 14925.675834625032, 7462.837917312516, 3731.4189586563907, 1865.709479328063, 932.8547396640315, 466.42736983214803, 233.21368491607402, 116.60684245803701, 58.30342122888621, 29.151710614575396, 14.5758553072877, 7.28792765351156, 3.64396382688807, 1.82198191331174, 0.910990956788164, 0.45549547826179, 0.227747739130895, 0.113873869697739, 0.05693693484887, 0.028468467424435];
        transformation = new L.Transformation(1, 33699550.99203, -1, 33699551.01703);
      }
      let crsConfig = {
        resolutions,
        transformation
      };
      crs = new L.Proj.CRS('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs', crsConfig);
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
  // WARNING: https://osgeo-org.atlassian.net/browse/GEOS-7778
  this.WMTS_53032_CRSFactory = function () {
    console.warn('Do not use, will offset positions, see: https://osgeo-org.atlassian.net/browse/GEOS-7778');
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

  this.esriBaseUri = function(arg={ epsg: self.epsg }) {
    return self.uri(arg);
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
    attribution: self.attributionFor(esriBase) }) {

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
    
    // Disable zoom handlers.
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();

    console.debug('NpolarEsriLeaflet.mapFactory L.version', L.version, 'config', mapConfig);

    return map;
  };

  return this;
};

module.exports = NpolarEsriLeaflet;