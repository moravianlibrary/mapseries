
class Grid
  constructor: ->
    @title = null
    @mainSeries = null
    @seriess = null

  getTitle: -> @title

  getShortTitle: -> @title.split(';')[2].trim()

export default Grid
