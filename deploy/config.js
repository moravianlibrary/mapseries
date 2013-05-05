var mapseries = {};
mapseries.config = {
  series: [
    {
      title: "Austria-Hungary: 3rd Military Survey, 1:200 K",
      layer: "austria-hungary--3rd-military-survey--200",
      template: "ah-ms3-200.txt",
      formatFunctions: {
        addDegrees: function(value) {
          value = value+'';
          if(value.length==4) {
            value = value.substr(0,2)+'°'+value.substr(2)+'°';
          }
          return value;
        }
      }
    }
  ]
}
