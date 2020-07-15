Mensajes = new Mongo.Collection("mensajes");

Items = new Mongo.Collection("items");

Recargas = new Mongo.Collection("recargas");

ConsultasDeInventario = new Mongo.Collection("consultas_de_inventario");

if ( Meteor.isServer ) {
    Items._ensureIndex( { title: 1, artist: 1, year: 1 } );
}
  
Items.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});
  
Items.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});