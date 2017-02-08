Meteor.publish( 'tienda', function( search) {
  //check( search, Match.OneOf( String, null, undefined ) );

  let query      = {},
      projection = { limit: 100, sort: { nombre: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    
      query = {
      $or: [
        { nombre: regex },
        { descripcion: regex },
        { precio: regex}
      ]
      };
    
    

    

    projection.limit = 100;
  }

  return Productos.find( query, projection );
});

Meteor.publish('fotos', function () {
  if (this.userId) {
    return FotosProducto.find();
  }
});

Meteor.publish('carrito', function () {
    if (this.userId) {
      return Carrito.find({userId: this.userId});
    } else {
      this.stop();
      return;
    }
});

Meteor.publish('novedades', function () {
    if (this.userId) {
      return Productos.find({novedad: true});
    } else {
      this.stop();
      return;
    }
});

Meteor.publish('banners', function () {
   
      return Banners.find();
    
});

Meteor.publish('vendedores', function () {
    if (this.userId) {
      return Vendedores.find();
    } else {
      this.stop();
      return;
    }
});

Meteor.publish('Logos1', function () {
    console.log('hola');
    return Logos1.find();
    
});

Meteor.publish('Logos2', function () {
    
    return Logos2.find();
    
});

Meteor.publish('Colores', function () {
    
    return Colores.find();
    
});

Meteor.publish('Secciones', function () {
    console.log('holasss');
    return Secciones.find();
    
});