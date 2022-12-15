var serializer = require('./serializer'),
    flash = require('../ui/flash'),
    loading = require('../ui/loading'),
    S = require('string');

module.exports = function(context) {

  var github = require('../source/github')(context);

  function loadConfig() {

    return github.readFile(getConfigPath())
    .then((data) => {
      context.data.set({config: data, dirty: false}, 'config');
      return new Promise((resolve, reject) => { resolve() });
    });
  }

  function getAreas() {
    var areas = new Set();
    var config = getConfig();
    config.series.forEach(function(serie) {
      var area = serie.title.split(';', 1)[0].trim();
      areas.add(area);
    });
    return areas;
  }

  function getGrids() {
    var grids = new Set();
    var config = getConfig();
    config.series.forEach(function(serie) {
      var grid = serie.title.split(';', 2)[1].trim();
      console.log(grid);
      grids.add(grid)
    })
    return grids;
  }

  function getConfig() {
    var config = context.data.get('config');
    try {
      return eval(config);
    } catch(err) {
      loading.hide();
      flash(context.container, config.texts.configParseError);
      return null;
    }
  }

  function setConfig(data, dirty) {
    if (dirty === undefined) {
      dirty = true;
    }
    var prefix = 'var mapseries = {};\nmapseries.config = ';
    context.data.set({config: prefix + serializer(data), dirty: dirty}, 'config');
  }

  function createSerie(title, area, grid) {
    var serieTitle = area + '; ' + grid + '; ' + title;
    var layerTitle = area + '; ' + title;  
    var layer = S(layerTitle).slugify().s;
    var template = layer + '.txt';

    var config = getConfig();
    config.series.push({
      title: serieTitle,
      layer: layer,
      template: template,
      formatFunctions: config.formatFunctionsTemplate,
      edited: true
    });
    setConfig(config);
  }

  function getGroupedByArea() {
    var series = {};
    var config = getConfig();
    config.series.forEach(function(serie, i, arr) {
      var tmp = serie.title.split(';');
      var area = tmp[0].trim(); // Area
      var grid = tmp[1].trim(); // Grid
      var title = tmp[2].trim(); // Serie title
      series[area] = series[area] || {};
      series[area][grid] = series[area][grid] || [];
      series[area][grid].push({
        id: i,
        title: title,
        grid: grid,
        layer: serie.layer,
        template: serie.template,
        formatFunctions: serie.formatFunctions
      });
    });
    return series;
  }

  function getJsTreeData() {
    var seriesTree = [];
    var data = getGroupedByArea();
    var tmp = [];
    for (var area in data) {
      var grids = data[area];
      for (var grid in grids) {
        grids[grid].forEach(function(serie, i, arr) {
          arr[i] = {
            id: serie.id,
            text: serie.title,
            icon: 'jstree-file',
            grid: serie.grid,
            layer: serie.layer,
            template: serie.template,
            formatFunctions: serie.formatFunctions
          };
        });
        tmp.push({
          text: grid,
          children: grids[grid]
        });
      }
      seriesTree.push({
        text: area,
        children: tmp
      });
      tmp = [];
    }
    return seriesTree;
  }

  function markEdited(pos) {
    var config = getConfig();
    config.series[pos].edited = true;
    setConfig(config, false);
  }

  function getGeoJsonPath() {
    var config = getConfig();
    var result = null;
    config.series.every(function(serie) {
      if (serie.edited === true) {
        result = 'geojson/' + serie.layer + '.json';
        return false;
      }
      return true;
    });
    return result;
  }

  function getTemplatePath() {
    var config = getConfig();
    var result = null;
    config.series.every(function(serie) {
      if (serie.edited === true) {
        result = 'template/' + serie.template;
        return false;
      }
      return true;
    });
    return result;
  }

  function getTitle() {
    var config = getConfig();
    var result = null;
    config.series.every(function(serie) {
      if (serie.edited === true) {
        result = serie.title;
        return false;
      }
      return true;
    });
    return result;
  }

  function getConfigPath() {
    return 'config.js';
  }

  function getStringData() {
    var config = getConfig();
    config.series.forEach(function(serie) {
      if (serie.edited === true) {
        delete serie.edited;
      }
    });
    var prefix = 'var mapseries = {};\nmapseries.config = ';
    return prefix + serializer(config);
  }

  return {
    loadConfig: loadConfig,
    getAreas: getAreas,
    getGrids: getGrids,
    createSerie: createSerie,
    getJsTreeData: getJsTreeData,
    markEdited: markEdited,
    getGeoJsonPath: getGeoJsonPath,
    getTemplatePath: getTemplatePath,
    getTitle: getTitle,
    getConfigPath: getConfigPath,
    getStringData: getStringData
  };
};
