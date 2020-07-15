Meteor.publish( "items", function (search) {

    check( search, Match.OneOf( String, null, undefined ) );

  let query      = { activo: true },
      projection = { limit: 100, sort: { name: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { name: regex },
        { category: regex },
        { activo: true }

      ]
    };

    projection.limit = 100;
  }

  return Items.find( query, projection );

    
})
