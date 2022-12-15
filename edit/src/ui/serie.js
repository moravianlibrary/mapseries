module.exports = function(context) {

  var loading = require('./loading'),
      flash = require('./flash'),
      github = require('../source/github')(context),
      config = require('../lib/config')(context),
      meta = require('../lib/meta.js');

  function newOne(title, area, grid) {
    config.createSerie(title, area, grid);
    meta.clear(context);

    github.readFile('template/template.txt')
    .then((data) => {
      context.data.set({template: data}, 'serie');
      context.dispatch.open_serie();
    })
    .catch((err) => {
      console.error(err);
      flash(context.container, context.texts.unexpectedError);
    });
  }

  function open(id) {
    loading.show();

    config.markEdited(id);

    var errmsg = context.texts.unexpectedError;
    var geojsonPath = config.getGeoJsonPath();
    var templatePath = config.getTemplatePath();

    context.dispatch.beforeclear();
    context.dispatch.clear();

    github.readFile(geojsonPath)
    .then((data) => {
      context.data.set({map: data, dirty: false}, 'serie');
      return github.readFile(templatePath);
    })
    .then((data) => {
      loading.hide();
      context.data.set({template: data, dirty: false}, 'serie');
      meta.zoomextent(context);
      context.dispatch.open_serie();
    })
    .catch((err) => {
      loading.hide();
      console.error(err);
      flash(context.container, errmsg);
    });
  }

  function save() {
    if (!context.data.dirty) {
      return new Promise((resolve, reject) => { resolve() });
    }

    context.dispatch.before_save();

    var geojsonData = JSON.stringify(context.data.get('map'), null, 2);
    var templateData = context.data.get('template');
    var configData = config.getStringData();

    var geojsonPath = config.getGeoJsonPath();
    var templatePath = config.getTemplatePath();
    var configPath = config.getConfigPath();

    var files = [
      {path: geojsonPath, content: geojsonData},
      {path: templatePath, content: templateData},
      {path: configPath, content: configData}
    ];

    return github.writeFiles(files,"Updated " + config.getTitle() + " serie")
    .then(() => {
      context.data.dirty = false;
      context.dispatch.change({obj: {}, source: 'serie'});
      context.dispatch.save_serie();

      return new Promise((resolve, reject) => { resolve() });
    });
  }

  return {
    newOne: newOne,
    open: open,
    save: save
  };
};
