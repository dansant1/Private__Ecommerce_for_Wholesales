Clientes = new Mongo.Collection('clientes');

Productos = new Mongo.Collection('productos');

Categorias = new Mongo.Collection('categorias');

Carrito = new Mongo.Collection('carrito');

Ordenes = new Mongo.Collection('ordenes');

Vendedores = new Mongo.Collection('vendedores');

CondicionesDePago = new Mongo.Collection('condicionesdepago');

// Definimos el storage adapter GridFS
let docStore = new FS.Store.GridFS("fotos", {
  maxTries: 3
});


// Creamos la DB para Documentos
FotosProducto = new FS.Collection("fotos", {
  stores: [docStore]
});

// agregamos los permisos allow/deny
FotosProducto.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});


// Banners
// Definimos el storage adapter GridFS
let docStoreB = new FS.Store.GridFS("banners", {
  maxTries: 3
});


// Creamos la DB para Documentos
Banners = new FS.Collection("banners", {
  stores: [docStoreB]
});

// agregamos los permisos allow/deny
Banners.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

// Logos
// Definimos el storage adapter GridFS
let docStore3 = new FS.Store.GridFS("logos", {
  maxTries: 3
});


// Creamos la DB para Documentos
Logos = new FS.Collection("lgoos", {
  stores: [docStore3]
});

// agregamos los permisos allow/deny
Logos.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});

