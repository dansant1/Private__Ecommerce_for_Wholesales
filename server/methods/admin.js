Meteor.methods({
	crearCliente: function (datos) {
		
		if (this.userId) {

			let userId = Accounts.createUser({
    			email: datos.email,
    			password: datos.password,
          profile: {
            nombre: datos.nombre
          }
  			}); 

  			if (userId) {
  				
          let clienteId = Clientes.insert({
  					negocio: datos.negocio,
  					email: datos.email,
  					createdAt: new Date(),
            nombre: datos.nombre,
            telefono: datos.telefono,
            rs: datos.rs,
            ruc: datos.ruc,
            userId: userId,
            direccionCobranza: datos.direccionCobranza,
            direccionEnvio: datos.direccionEnvio,
            vendedor: {
              id: datos.vendedor.id,
              nombre: Vendedores.findOne({_id: datos.vendedor.id}).nombre,
              telefono: Vendedores.findOne({_id: datos.vendedor.id}).telefono,
              email: Vendedores.findOne({_id: datos.vendedor.id}).email
            }
  				});



  			}

		} else {
			return;
		}

	},
  ToggleNovedad: function (id) {

    if ( Productos.findOne({_id: id}).novedad === true ) {
      Productos.update({_id: id}, {
        $set: {
          novedad: false
        }
      });  
    } else {
      Productos.update({_id: id}, {
        $set: {
          novedad: true
        }
      });
    }

    
  },
  EditarProducto: function (datos) {
    Productos.update({_id: datos.id}, {
      $set: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: datos.precio
      }
    });
  },
  crearProducto: function (datos) {
    
    if (this.userId) {

      let productoId = Productos.insert({
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        precio: datos.precio,
        createdAt: new Date,
        novedad: datos.novedad,
        categoriaId: datos.categoriaId
      });

      return {
        productoId: productoId
      }

    } else {
      return;
    }
  },
  crearCaterogia: function (nombre) {
    if (this.userId) {
      Categorias.insert({
        nombre: nombre,
        createdAt: new Date()
      });
    } else {
      return;
    }
  },
  agregarCondicionDePago: function (condicion) {
    if (this.userId) {
      CondicionesDePago.insert({
        nombre: condicion,
        createdAt: new Date()
      });
    } else {
      return;
    }
  },
  agregarVendedor: function (datos) {
    if (this.userId) {
      let id = Vendedores.insert({
        nombre: datos.nombre,
        telefono: datos.telefono,
        email: datos.email,
        createdAt: new Date(),
        direccion: datos.direccion
      });

      return {
        id: id
      }
    } else {
      return;
    }
  },
  enviar: function (id) {
    Ordenes.update({_id: id}, {
      $set: {
        status: "enviado"
      }
    });
  },
  pendiente: function (id) {
    Ordenes.update({_id: id}, {
      $set: {
        status: "pendiente"
      }
    });
  },
  eliminarCliente: function (id) {
    Clientes.remove({_id: id});
  },
  eliminarProducto: function (id) {
    Productos.remove({_id: id});
  },
  eliminarCategoria: function (id) {
    Categorias.remove({_id: id});
  },
  eliminarPago: function (id) {
    CondicionesDePago.remove({_id: id});
  },
  eliminarAsesor: function (id) {
    Vendedores.remove({_id: id});
  },
  eliminarBanner: function (id) {
    Banners.remove({_id: id})
  },
  setColor1: function (color) {
    if (Colores.find().fetch().length > 0 ) {
      Colores.update({_id: Colores.find().fetch()[0]._id}, {
        $set: {
          color1: color
        }
      });  
    } else {
      Colores.insert({
        color1: color
      });
    }
  },
  setColor2: function (color) {
    if (Colores.find().fetch().length > 0 ) {
      Colores.update({_id: Colores.find().fetch()[0]._id}, {
        $set: {
          color2: color
        }
      });  
    } else {
      Colores.insert({
        color2: color
      });
      console.log('gu');
    }
  },
  setFooter: function (telefono, email, direccion) {
    if (Contenido.find().fetch().length > 0) {
      Contenido.update({_id: Contenido.find().fetch()[0]._id}, {
        $set: {
          telefono: telefono,
          email: email,
          direccion: direccion
        }
      });
    } else {
      Contenido.insert({
        telefono: telefono,
        direccion: direccion,
        email: email,
        createdAt: new Date()
      });
    }
  },
  agregarSeccion: function (titulo, contenido) {
    Secciones.insert({
      titulo: titulo,
      contenido: contenido,
      createdAt: new Date()
    });
  },
  editarSeccion: function (titulo, contenido, id) {
    Secciones.update({_id: id}, {
      titulo: titulo,
      contenido: contenido
    });
  },
  eliminarSeccion: function (id) {
    Secciones.remove({_id: id});
  }
});