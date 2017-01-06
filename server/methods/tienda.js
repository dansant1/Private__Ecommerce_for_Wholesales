Meteor.methods({
    agregarAlCarrito: function (datos) {
      
        if (this.userId) {

            //if ( Carrito.find({productoId: datos.productoId}).fetch().length === 0 ) {

                Carrito.insert({
                    productoId: datos.productoId,
                    producto: datos.producto,
                    cantidad: datos.cantidad,
                    nombre: datos.nombre,
                    precio: datos.precio,
                    createdAt: new Date(),
                    userId: this.userId,
                    ordenado: false
                });
          
            }           

        //} else {
         //   return;
        //}

    },
    actualizarCantidadCarrito: function (cantidad, productoId) {
        if (this.userId) {

            Carrito.update({productoId: productoId}, {
                $inc: {
                    cantidad: cantidad  
                }
            });

        } else {
            return;
        }
    },
    eliminarCarrito: function (id) {
        Carrito.remove({_id: id});
    },
    ordenar: function (datos) {

        if (this.userId) {

            let total = 0;

            let ordenes = [];

            let carrito = Carrito.find({ordenado: false, userId: this.userId});

            carrito.forEach( function (c) {
                total = total + ( c.precio * c.cantidad );

                ordenes.push({
                    producto: c.producto,
                    precio: c.precio,
                    cantidad: c.cantidad
                });

                Carrito.update({_id: c._id}, {
                    $set: {
                        ordenado: true
                    }
                });

            });

            let codigo = Ordenes.find().fetch().length;

            Ordenes.insert({
                ordenes: ordenes,
                codigo: codigo++,
                createdAt: new Date(),
                status: "pendiente",
                total: total,
                condicionPago: datos.condicionPago,
                comentario: datos.comentario,
                clienteId: this.userId
            });

            
        } else {
            return;
        }

    },
    actualizarCuenta: function (datos, id) {
        Clientes.update({_id: id}, {
            $set: {
                nombre: datos.nombre,
                direccionCobranza: datos.direccionCobranza,
                direccionEnvio: datos.direccionEnvio
            }
        });

        Meteor.users.update({_id: this.userId}, {
            $set: {
                'profile.nombre': datos.nombre
            }
        });
    }
});