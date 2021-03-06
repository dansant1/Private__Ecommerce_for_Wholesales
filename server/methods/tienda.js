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
          createdAt: new Date(),
          users : [ ]
        });
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
      let userId = this.userId;

        if (userId) {

            let total = 0;

            let ordenes = [];

            let carrito = Carrito.find({ordenado: false, userId: this.userId});

            carrito.forEach( function (c) {
                total = total + ( c.precio * c.cantidad );

                ordenes.push({
                    producto: c.producto,
                    precio: c.precio,
                    cantidad: c.cantidad,
                    subtotal: (c.precio * c.cantidad).toFixed(2)
                });

                Carrito.update({_id: c._id}, {
                    $set: {
                        ordenado: true
                    }
                });

            });

            let codigo = Ordenes.find().fetch().length;
            let desc = 0;

            let codigoPromocional = CodigosPromocionales.findOne({
              codigo: datos.codigo,
              users : { $nin : [ this.userId ] }
            });

            if (datos.codigo !== '') {

              if (codigoPromocional !== undefined ) {

                let descuento = codigoPromocional.numero;

                desc = (total / 100) * descuento;
                total = total - desc;

                CodigosPromocionales.update({ _id: codigoPromocional._id }, { $push: { users: this.userId } });

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

            let cliente = Clientes.findOne({userId: this.userId});
            let tot = parseFloat(Math.round(total * 100) / 100).toFixed(2);

            let fechaCompra = new Date();
            let mm = fechaCompra.getMonth() + 1; // getMonth() is zero-based
            let dd = fechaCompra.getDate();

            let stringDate =  [
              (dd>9 ? '' : '0') + dd,
              (mm>9 ? '' : '0') + mm,
              fechaCompra.getFullYear(),
            ].join('/');


            let htlmData = {
              nombreCliente : cliente.nombre,
              direccionCliente: cliente.direccionEnvio,
              fechaCompra: stringDate,
              telefonoCliente: cliente.telefono,
              emailCliente: cliente.email,
              numeroFactura: codigo,
              orden:{
                items: ordenes,
                subtotalSinIgv: "",
                descuento: desc.toFixed(2),
                subtotalSinIgv: (total - total*0.18).toFixed(2),
                impuestos: (total*0.18).toFixed(2),
                montoTotal: total.toFixed(2),
                terminos: datos.condicionPago
              }
            };

            let userId = this.userId;
            let user = Meteor.users.findOne({_id: userId});
            let userEmail = user.emails[0].address;

            Meteor.defer( () => {
                Email.send({
                  to: [userEmail, "mariuscalmet@gmail.com"],
                  from: 'dexcim@links.com.pe',
                  subject: "Pedido recibido",
                  html: `
                        <p><strong>${cliente.nombre}</strong></p>
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

                SSR.compileTemplate('htmlEmail', Assets.getText('emailFactura.html'));

                Email.send({
                  to: [userEmail, "mariuscalmet@gmail.com"],
                  from: 'dexcim@links.com.pe',
                  subject: "Factura DexCim",
                  html: SSR.render('htmlEmail', htlmData )
                });
                console.log( 'se envio un correo' );
            });


        } else {
            return;
        }

    },
    eliminarPromocion(id) {
      console.log( id );
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
