function generateCode() {
    var length = 8,
        charset = "ITUV56789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

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
    generarCodigoPromocional(numero) {
      if (this.userId) {

        let codigo = generateCode();

        CodigosPromocionales.insert({
          numero: numero,
          codigo: codigo,
          createdAt: new Date()
        })
      } else {
        return;
      }
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

            if (datos.codigo !== '') {

              if (CodigosPromocionales.findOne({codigo: dato.codigo}).numero !== undefined) {
                let descuento = CodigosPromocionales.findOne({codigo: dato.codigo}).numero;

                let desc = (total / 100) * descuento
                total = total - desc;
              }



            }

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

            let cliente = Clientes.findOne({userId: this.userId}).nombre;
            let tot = parseFloat(Math.round(total * 100) / 100).toFixed(2);

            Meteor.defer( () => {
                Email.send({
                  to: Meteor.users.find({_id: this.userId}).emails[0].address, //"danieldelgadilloh@gmail.com",
                  from: 'dexcim@links.com.pe', //Meteor.users.find({_id: this.userId}).emails[0].address,
                  subject: "Pedido recibido",
                  html: `
                        <p><strong>${cliente}</strong></p>
                        <br>
                        <p>¡Muchas gracias por su compra!</p>
                        <br>
                        <p>Hemos generado un ticket de compra por S/.${tot}. Adjunto encontrará la boleta de su pedido.</p>
                        <br>
                        <p>En caso de un pedido a crédito, uno de nuestros representantes se contactará con usted.</p>
                        <br>
                        <br>
                        <p>Sinceramente,</p>
                        <br><br><br>
                        <p>DexCim S.A.C.</p>
                        <p>pedidos@dexcim.com</p>
                        <p>+(51-1) 424-3477</p>
                    `
                });
            });




        } else {
            return;
        }

    },
    eliminarPromocion(id) {
      CodigosPromocionales.remove({_id: id})
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
