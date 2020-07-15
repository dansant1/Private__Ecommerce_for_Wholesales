

Meteor.method("sell_item", function (steamID, items) {

    check(steamID, String)
    check(items, Array)

    let userId = Meteor.users.findOne({ "profile.id": data.steamID }).profile.id;

        if (userId) {
            let items = data.items;

            items.forEach( item => {
                item.userId = Meteor.users.findOne({ "profile.id": data.steamID })._id
                item.activo = true
                item.steamid = data.steamID
                Items.insert(item)
            })

        } else {
            throw new Meteor.Error('ERROR: ', 'USUARIO NO ENCONTRADO');
        }    

}, {
    getArgsFromRequest: function (request) {
     
      var content = request.body;
  
      // Since form enconding doesn't distinguish numbers and strings, we need
      // to parse it manually
      return [ content.steamID, content.items ];
    }
})

Meteor.method("sold_items", function (steamID, item) {

    check(steamID, String)
    check(item, Object)

    let userId = Meteor.users.findOne({ "profile.id": data.steamID }).profile.id;

        if (userId) {
           
            Items.update({steamid: steamID, assetid: item.assetid}, {
                $set: {
                    activo: false
                }
            })

            

        } else {
            throw new Meteor.Error('ERROR: ', 'USUARIO NO ENCONTRADO');
        }    

}, {
    getArgsFromRequest: function (request) {
     
      var content = request.body;
  
      // Since form enconding doesn't distinguish numbers and strings, we need
      // to parse it manually
      return [ content.steamID, content.item ];
    }
})