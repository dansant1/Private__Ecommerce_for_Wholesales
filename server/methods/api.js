

Meteor.method("consultar_inventario", function (steamID, items) {

    check(steamID, String)
    check(items, Array)

    ConsultasDeInventario.upsert( {steamID}, {
        $set: {
            items
        }
    } )

}, {
    getArgsFromRequest: function (request) {
     
      var content = request.body;
  
      // Since form enconding doesn't distinguish numbers and strings, we need
      // to parse it manually
      return [ content.steamID, content.items ];
    }
})