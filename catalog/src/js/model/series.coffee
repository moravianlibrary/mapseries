
class Series

  constructor: ->
    @id = null
    @title = null
    @template = null
    @formatFunctions = null
    @overlay = null
    @grid = null

  getShortTitle: -> @title.split(';')[2].trim()

  getRegionTitle: -> @title.split(';')[0].trim()

  getGridTitle: -> @title.split(';')[1].trim()

  @getRegions: (seriess) ->
    regions = new Set()

    for series in seriess
      regions.add series.title.split(';')[0].trim()

    return regions

  @getGrids: (seriess) ->
    grids = new Set()

    for series in seriess
      grids.add series.title.split(';')[1].trim()

    return grids

  # Not used anywhere for now
  @getSeries: (seriess) ->
    series_set = new Set()

    for series in seriess
      series_set.add series.grid
    
    return series_set


export default Series
