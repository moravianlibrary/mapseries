var mapseries = {};
mapseries.config = {
  formatFunctionsTemplate: {
    addDegrees: function (stringValue, sheet) {
      stringValue += '';
      if(stringValue.length==4) {
        stringValue = stringValue.substr(0,2)+'°'+stringValue.substr(2)+'°';
      }
      return stringValue;
    }
  },
  series: [
    {
      title: "Austria-Hungary: 3rd Military Survey, 1:75 K (RDA 2015)",
      layer: "austria-hungary--3rd-military-survey--75",
      template: "ah-ms3-75_rda2015.txt",
      formatFunctions: {
        addDegrees: function (stringValue, sheet) {
          stringValue += '';
          if(stringValue.length==4) {
            stringValue = stringValue.substr(0,2)+'°'+stringValue.substr(2)+'°';
          }
          return stringValue;
        }
      }
    },
    {
      title: "Austria-Hungary: 3rd Military Survey, 1:200 K (RDA 2015)",
      layer: "austria-hungary--3rd-military-survey--200",
      template: "ah-ms3-200_rda2015.txt",
      formatFunctions: {
        addDegrees: function (stringValue, sheet) {
          stringValue += '';
          if(stringValue.length==4) {
            stringValue = stringValue.substr(0,2)+'°'+stringValue.substr(2)+'°';
          }
          return stringValue;
        }
      }
    },
    {
      title: "Austria-Hungary: 3rd Military Survey, 1:200 K",
      layer: "austria-hungary--3rd-military-survey--200",
      template: "ah-ms3-200.txt",
      formatFunctions: {
        addDegrees: function (stringValue, sheet) {
          stringValue += '';
          if(stringValue.length==4) {
            stringValue = stringValue.substr(0,2)+'°'+stringValue.substr(2)+'°';
          }
          return stringValue;
        }
      }
    }
  ]
}