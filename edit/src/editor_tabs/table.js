var Handsontable = require('handsontable');

module.exports = function(context) {

  // Variables
  var container = null,
      confirmButton = null,
      table = null,
      dirty = false,
      rowIndex = {};

  // API functions
  function init(selection, cb) {
    container = selection;
    confirmButton = cb;
    table = new Handsontable(container.node(), {
      rowHeaders: true,
      stretchH: 'all',
      autoColumnSize: false,
      contextMenu: {
        items: {
          'col_left': {
            name: context.texts.addColumnLeft,
            callback: function(key, selection) {
              var addedColumn = selection.start.col;
              this.alter('insert_col', addedColumn);
              var headers = this.getSettings().colHeaders;
              var columnName = window.prompt(context.texts.newColumnMsg);
              if (columnName) {
                headers[addedColumn] = columnName;
              }
              this.updateSettings({ colHeaders: headers });
            }
          },
          'col_right': {
            name: context.texts.addColumnRight,
            callback: function(key, selection) {
              var addedColumn = selection.start.col + 1;
              this.alter('insert_col', addedColumn);
              var headers = this.getSettings().colHeaders;
              var columnName = window.prompt(context.texts.newColumnMsg);
              if (columnName) {
                headers[addedColumn] = columnName;
              }
              this.updateSettings({ colHeaders: headers });
            }
          },
          'rename_column': {
            name: context.texts.renameColumn,
            callback: function(key, selection) {
              var headers = this.getSettings().colHeaders;
              var columnName = window.prompt(context.texts.newNameColumnMsg + ' ' + headers[selection.start.col]);
              if (columnName) {
                headers[selection.start.col] = columnName;
              }
              this.updateSettings({ colHeaders: headers });
              onDataChanged();
            },
            disabled: function() {
              var selected = this.getSelected();

              if (!selected || selected[0] < 0) {
                return true;
              }

              var entireRowSelection = [selected[0], 0, selected[0], this.countCols() - 1];
              var rowSelected = entireRowSelection.join(',') == selected.join(',');

              return selected[1] < 0 || this.countCols() >= this.getSettings().maxCols || rowSelected;
            },
          },
          'clear_column': {
            name: context.texts.clearColumn,
          },
          'remove_col': {
            name: context.texts.deleteColumn
          },
        }
      }
    });
    Handsontable.hooks.add('afterChange', onDataChanged, table);
    Handsontable.hooks.add('afterRemoveCol', onDataChanged, table);
  }

  function show() {
    container.style({display: 'block'});
    updateTable();
  }

  function hide() {
    confirmChanges();
    container.style({display: 'none'});
  }

  function destroy() {
    Handsontable.hooks.remove('afterChange', onDataChanged, table);
    Handsontable.hooks.remove('afterRemoveCol', onDataChanged, table);
    table.destroy();
    table = null;
    confirmButton = null;
    container = null;
  }

  function getTitle() {
    return "table";
  }

  function confirmChanges() {
    if (isDirty()) {
      var geojson = context.data.get('map'),
          tableData = table.getData(),
          headers = table.getSettings().colHeaders;

      geojson.features.forEach(function(feature, i) {
        var row = tableData[i];
        feature.properties = {};
        row.forEach(function(col, j) {
          if (col === null) {
            col = '';
          }
          feature.properties[headers[j]] = col;
        });
      });

      context.data.set({map: geojson}, 'table');
      markClean();
    }
  }

  function updateTable() {
    var rawData = context.data.get('map'),
        data = rawData.features.map(function(f) { return f.properties }),
        headers = getHeaders(data),
        tableData = [];

    rowIndex = {};

    data.forEach(function(it, i) {
      var row = headers.map(function(header) { return it[header] || '' });
      tableData.push(row);
      rowIndex[it['SHEET']] = i;
    });

    table.updateSettings({
      colHeaders: headers,
      data: tableData
    });
    markClean();
  }

  function getHeaders(data) {
    var headers = new Set();
    data.forEach(function(it) {
      for (var key in it) {
        headers.add(key);
      }
    });
    if (headers.size == 0) {
      return ['TITLE', 'SCALE', 'SHEET'];
    } else {
      return Array.from(headers);
    }
  }

  function selectLayer(layer) {
    table.selectCell(rowIndex[layer], 0);
  }

  function onDataChanged() {
    markDirty();
  }

  function markDirty() {
    dirty = true;
    confirmButton.classed('disabled', false);
  }

  function markClean() {
    dirty = false;
    confirmButton.classed('disabled', true);
  }

  function isDirty() {
    return dirty;
  }

  return {
    init: init,
    show: show,
    hide: hide,
    destroy: destroy,
    getTitle: getTitle,
    confirmChanges: confirmChanges,
    selectLayer: selectLayer
  };
};
