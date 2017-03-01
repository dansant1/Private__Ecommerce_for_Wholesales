Bert.defaults.style = 'growl-bottom-right';

Template.menu.onCreated(function () {
  var self = this;

  self.autorun(function () {
    self.subscribe('Logos1');
    self.subscribe('Logos2');
    self.subscribe('Colores');
    self.subscribe('Footer');

  });
});

Template.menu.helpers({
  logo1: function () {

    return Logos1.find();
  },
  logo2: function () {
    return Logos2.find();
  },
  colorone: function () {
    console.log('funca');
    return Colores.find().fetch()[0].color1;
  },
  colortwo: function () {
    return Colores.find().fetch()[0].color2;
  },
  footer: function () {
    return Contenido.find();
  }
});

Template.carrito.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('carrito');
		template.subscribe( 'fotos' );
	});
});

Template.pedido.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('carrito');
		template.subscribe('condiciones');

	});
});

Template.slider.onRendered(function () {
	let template = Template.instance();

	template.autorun( () => {

		if (Banners.find().fetch().length > 0) {
			var mySwiper = new Swiper ('.swiper-container', {
    										direction: 'horizontal',
    										loop: true,
											effect: 'fade',
											pagination: '.swiper-pagination',
											nextButton: '.swiper-button-next',
											prevButton: '.swiper-button-prev',
											scrollbar: '.swiper-scrollbar',
											autoplay: 10000
  										})
		}


	});

});

Template.pedido.helpers({
	carrito: function () {
		return Carrito.find({ordenado: false, userId: Meteor.userId()});
	},
  numero: function (precio) {
    let t = precio;
    console.log(precio)
    let total = parseFloat(Math.round(t * 100) / 100).toFixed(2);
    return total;
  },
	sinIGV: function () {
		let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

  		let sinIGV = (total / 118) * 100;

      total = parseFloat(Math.round(sinIGV * 100) / 100).toFixed(2);

  		return total
	},
	igv: function () {
		let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

  		let igv =  total - ( ( total / 118) * 100 )
      total = parseFloat(Math.round(igv * 100) / 100).toFixed(2);
		  return total
	},
	supertotal: function () {
		  let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

      total = parseFloat(Math.round(total * 100) / 100).toFixed(2);

  		return total
	},
	condiciones: function () {
		return CondicionesDePago.find();
	},
	asesor: function () {
		return Clientes.findOne({userId: Meteor.userId()}).vendedor.nombre;
	},
	emailAsesor: function () {
		return Clientes.findOne({userId: Meteor.userId()}).vendedor.email;
	},
	telefonoAsesor: function () {
		return Clientes.findOne({userId: Meteor.userId()}).vendedor.telefono;
	},
	correo: function () {
		return Clientes.findOne({userId: Meteor.userId()}).email
	},
	df: function () {
		return Clientes.findOne({userId: Meteor.userId()}).direccionCobranza
	},
	de: function () {
		return Clientes.findOne({userId: Meteor.userId()}).direccionEnvio
	},
	telefono: function () {
		return Clientes.findOne({userId: Meteor.userId()}).telefono
	},
	rs: function () {
		return Clientes.findOne({userId: Meteor.userId()}).rs
	},
	ruc: function () {
		return Clientes.findOne({userId: Meteor.userId()}).ruc
	}

});

Template.pedido.events({
	'click .ordenar': function (e, t) {
		e.preventDefault();

		let datos = {
			carrito: Carrito.findOne({userId: Meteor.userId()})._id,
			condicionPago: $( "input.pago:checked" ).val(),
			comentario: t.find("[name='comentario']").value,
      codigo: t.find("[name='codigo']").value
		}

    if (t.find("[name='codigo']").value !==) {
      datos.codigo = t.find("[name='codigo']").value
    } else {
      datos.codigo = ''
    }

    if ( $('input.pago:checked').length > 0 ) {

      let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
      let total = 0;
      carrito.forEach(function (e) {
        let t = e.precio * e.cantidad;
        total = total + t;
      });

      if (total < 300) {
        Bert.alert('Pedido mínimo de S/.300.00', 'danger');
      } else {
         Meteor.call('ordenar', datos, function (err) {
        if (err) {
          console.log(err);
        } else {
          swal(
            '¡Gracias!',
            'Su pedido ha sido enviado, en cualquier momento recibirá una confirmación a su correo',
            'success'
            )
          analytics.track( 'El usuario hizo un orden', {
              title: 'El usuario hizo un orden definitiva para ser despachada por la empresa'
            });
          FlowRouter.go('/')
        }
        });
      }


    } else {
      swal(
        'Oops...',
        'Tienes que seleccionar un método de pago',
        'error'
        )
    }


	}
});

Template.menuTienda.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('carrito');
		template.subscribe('clientes');
    template.subscribe('Logos');
    template.subscribe('Colores');
    console.log('HOLA');
	});
});

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

Template.miCuenta.helpers({
  tot: function () {
    return this.total.toFixed(2);
  }
});

Template.miCuenta.onCreated( () => {

	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('MisOrdenes');
	});

});

Template.miCuenta.events({
	'click .editar': function () {
		Modal.show('editarCuenta');
	},
	'click .ver': function () {
		FlowRouter.go('/orden/' + this._id);
	}
});

Template.editarCuenta.helpers({
	cliente: function () {
		return Clientes.findOne({userId: Meteor.userId()});
	}
});

Template.editarCuenta.events({
	'submit form': function (e, t) {
		e.preventDefault()
		let datos = {
			nombre: t.find("[name='nombre']").value,
			direccionCobranza: t.find("[name='dc']").value,
			direccionEnvio: t.find("[name='de']").value
		}

		Meteor.call('actualizarCuenta', datos, this._id, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('funciona');
			}
		});
		Modal.hide('editarCuenta');
	}
});

Template.OrdenDetalle.onCreated(() => {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('ordenes');
	});
});

Template.OrdenDetalle.helpers({
	orden: function () {
		return Ordenes.findOne({_id: FlowRouter.getParam('orden')});
	},
	total: function () {
    let total = parseFloat(Math.round(this.precio * this.cantidad * 100) / 100).toFixed(2);
		return total;
	},
	superTotal: function () {
		let total = 0;
		this.ordenes.forEach( function (o) {
			total = total + (o.precio * o.cantidad)
		});

    total = parseFloat(Math.round(total * 100) / 100).toFixed(2);
		return total;
	},
  price: function () {
    total = parseFloat(Math.round(this.precio * 100) / 100).toFixed(2);
    return total;
  }
});

Template.miCuenta.helpers({
	email: function () {
		return Meteor.user().emails[0].address;
	},
	cobranza: function () {
		return Clientes.findOne({userId: Meteor.userId()}).direccionCobranza;
	},
	envio: function () {
		return Clientes.findOne({userId: Meteor.userId()}).direccionEnvio;
	},
	ordenes: function () {
		return Ordenes.find();
	},
	fecha: function () {
		/*var monthNames = [
  			"Enero", "Febrero", "Marzo",
  			"Abril", "Mayo", "Junio", "Julio",
  			"Agosto", "Septiembre", "Octubre",
  			"Noviembre", "Diciembre"
		];

		var date = this.createdAt;
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;*/

    var d = this.createdAt,
      dformat = [(d.getMonth()+1).padLeft(),
               d.getDate().padLeft(),
               d.getFullYear()].join('/') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');
        return dformat;

	}
});

Template.menuTienda.helpers({
	total: function () {
  		let carrito = Carrito.find();
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

  		return total.toFixed(2);
  	},
  	productos: function () {
  		return Carrito.find({ordenado: false}).fetch().length;
  	},
  	vendedor: function () {
  		return Clientes.findOne({userId: Meteor.userId()}).vendedor.nombre
  	},
  	telefono: function () {
  		return Clientes.findOne({userId: Meteor.userId()}).vendedor.telefono
  	},
  	emailVendedor: function () {
  		return Clientes.findOne({userId: Meteor.userId()}).vendedor.email
  	},
    foto: function () {
      var vid = Clientes.findOne({userId: Meteor.userId()}).vendedor.id;

      var foto = Logos.find({'metadata.vendedorId': vid});

      return foto;

    },
    color: function () {
      return Colores.find().fetch()[0].color1;
    }
});

Template.slider.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {

		template.subscribe( 'banners' );
	});
});

Template.slider.helpers({
	imagenes() {
		return Banners.find();
	}
});

Template.carrito.helpers({
	productos: function () {
		return Carrito.find({ordenado: false, userId: Meteor.userId()});
	},
	fotosproducto(productoId) {
  		return FotosProducto.find({'metadata.productoId': productoId});
  },
  superTotal: function () {
      let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
      let total = 0;
      carrito.forEach(function (e) {
        let t = e.precio * e.cantidad;
        total = total + t;
      });

      total = parseFloat(Math.round(total * 100) / 100).toFixed(2);

      return total;
  },
  tot: function () {
    let total = parseFloat(Math.round(this.precio * this.cantidad * 100) / 100).toFixed(2);
    return total;
  },
  price: function () {
    let total = parseFloat(Math.round(this.precio * 100) / 100).toFixed(2);
    return total;
  }
});


Template.Novedades.onCreated( () => {

	let template = Template.instance();

  	template.autorun( () => {

    	template.subscribe( 'novedades' );
    	template.subscribe( 'fotos' );
  	});
});


Template.Novedades.helpers({
  productos() {
    let productos = Productos.find({novedad: true});
    if ( productos ) {
      return productos;
    }
  },
  fotosproducto(productoId) {
  	return FotosProducto.find({'metadata.productoId': productoId});
  }
});

Template.Novedades.events({
  'click .agregar-carrito': function (e, t) {

      let id = this._id;

      let cantidad = t.find('[name=' + id + ']').value;


      let datos = {
        cantidad: cantidad,
        productoId: id,
        producto: this.descripcion,
        precio: this.precio,
        nombre: this.nombre
      }

      console.log(datos);

      if (cantidad !== 0) {

        Meteor.call('agregarAlCarrito', datos, function (err) {
          if (err) {
            console.log(err);
          } else {
            Bert.alert( {
              icon: 'fa-shopping-cart',
              message: 'Agregaste un Producto al Carrito',
              type: 'carrito'
            });
            console.log('listo');
          }
        });
      }
  }
});

Template.ProductosDeLaTienda.onCreated( () => {

	let template = Template.instance();

  	template.searchQuery = new ReactiveVar();
    //template.searchCategoria = new ReactiveVar();
  	template.searching   = new ReactiveVar( false );

  	template.autorun( () => {
    	template.subscribe( 'tienda', template.searchQuery.get(), () => {
      		setTimeout( () => {
        		template.searching.set( false );
      		}, 300 );
    	});


    	template.subscribe( 'categorias' );
    	template.subscribe( 'fotos' );
      template.subscribe('Colores');
  	});

    Session.set('pid', '');
});


Template.ProductosDeLaTienda.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  color: function () {
    return Colores.find().fetch()[0].color1;
  },
  productos(categoriaId) {

   	let productos;
    let query;
    let regex = new RegExp( Template.instance().searchQuery.get() , 'i' );

    query = {
      $or: [
        { nombre: regex },
        { descripcion: regex },
        { precio: regex}
      ]
    };

    productos = Productos.find({categoriaId: categoriaId}, { sort: {descripcion: 1} }, query);

    if (query) {
        if ( productos ) {
          return productos;
        }
    } else {
      	return Productos.find({categoriaId: categoriaId}, { sort: {descripcion: 1} });
    }

  },
  hayResultado(categoriaId) {
	let productos;
    let query;
    let regex = new RegExp( Template.instance().searchQuery.get() , 'i' );

    query = {
      $or: [
        { nombre: regex },
        { descripcion: regex },
        { precio: regex}
      ]
    };

	productos = Productos.find({categoriaId: categoriaId}, query).fetch().length;

    if (query) {
        if ( productos > 0 ) {
			//if ( Template.instance().searching.get() ) {
				return true;
			//} else {
				//return false;
			//}

        } else {
			return false
		}
    } else {
      	return true;
    }
  },
  productosn() {
	  if (Template.instance().searching.get() === false) {
		  return Productos.find({novedad: true});
	  } else {
		  return;
	  }

  },
  nombreCategoria(categoriaId) {
	  return Categorias.findOne({_id: categoriaId}).nombre;
  },
  fotosproducto(productoId) {
  	return FotosProducto.find({'metadata.productoId': productoId});
  },
  categorias() {
  	return Categorias.find();
  }
});

Template.carrito.helpers({
	total: function () {
		return this.cantidad * this.precio;
	}
});

Template.pedido.helpers({
	total: function () {
		let t = this.cantidad * this.precio;
    total = parseFloat(Math.round(t * 100) / 100).toFixed(2);
    return total
  }
});

Template.carrito.events({
	'click .eliminar': function () {
		Meteor.call('eliminarCarrito', this._id, function (err) {
			if (err) {
				console.log(err);
			} else {
        analytics.track( 'Elimino un producto', {
              title: 'El usuario eliminó un producto desde su carrito'
        });
      }
		});
	},
	'click .ordenar': function () {

    let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
    let total = 0;
      carrito.forEach(function (e) {
        let t = e.precio * e.cantidad;
        total = total + t;
      });

    if (total === 0) {
      Modal.hide('carrito');
      swal(
        'Oops...',
        'Tu carrito está vacío',
        'error'
      )
    } else {
      Modal.hide('carrito');
      analytics.track( 'Inicio proceso de ordenar', {
              title: 'El usuario comenzó el proceso de ordenar un producto'
      });
      FlowRouter.go('/pedido');
    }

	}
});

Template.ProductosDeLaTienda.events({
  'keyup [name="search"]' ( event, template ) {
  	console.log('hola');
    let value = event.target.value.trim();

    if ( value !== '' && event.keyCode === 13 ) {
      template.searchQuery.set( value );
      template.searching.set( true );
    }

    if ( value === '' ) {
      template.searchQuery.set( value );
    }
  },
  'click .c': function (e, template) {
    template.searchCategoria.set( this._id );
    console.log(template.searchCategoria.get());
  },
  'click .btn-number': function (e, t) {
  		e.preventDefault();

  		var $this = $(e.target);

   	 	fieldName = $this.attr('data-field');
    	type      = $this.attr('data-type');
    	var input = $("input[name='"+fieldName+"']");
    	var currentVal = parseInt(input.val());

    	console.log(fieldName);

    	if (!isNaN(currentVal)) {

        	if (type == 'minus') {

            	if(currentVal > input.attr('min')) {
                	input.val(currentVal - 1).change();
            	}

            	if ( parseInt(input.val()) == input.attr('min') ) {
                	$this.attr('disabled', true);
            	}

        	} else if (type == 'plus') {

            	if(currentVal < input.attr('max')) {
                	input.val(currentVal + 1).change();
            	}

            	if(parseInt(input.val()) == input.attr('max')) {
                	$this.attr('disabled', true);
            	}

        	}

    } else {
        input.val(0);
    }
  },
  'change .input-number': function (e, t) {

  		var $this = $(e.target);

  		minValue =  parseInt($this.attr('min'));
    	maxValue =  parseInt($this.attr('max'));
    	valueCurrent = parseInt($this.val());

    	name = $this.attr('name');

    	if(valueCurrent >= minValue) {
        	$(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    	} else {
        	alert('Sorry, the minimum value was reached');
        	$this.val($this.data('oldValue'));
    	}

    	if(valueCurrent <= maxValue) {
       	 	$(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    	} else {
        	alert('Sorry, the maximum value was reached');
        	$this.val($this.data('oldValue'));
    	}
  },
  'focusin .input-number': function (e, t) {
  		var $this = $(e.target);
  		console.log($this.val());
  		$this.data('oldValue', $this.val());
  },
  'keydown .input-number': function (e, t) {

  		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
  },
  'click .agregar-carrito': function (e, t) {

  		let id = this._id;

  		let cantidad = t.find('[name=' + id + ']').value;


  		let datos = {
  			cantidad: cantidad,
  			productoId: id,
  			producto: this.descripcion,
  			precio: this.precio,
  			nombre: this.nombre
  		}

  		console.log(datos);

  		if (cantidad !== 0) {

  			Meteor.call('agregarAlCarrito', datos, function (err) {
  				if (err) {
  					console.log(err);
  				} else {

            Bert.alert( {
              icon: 'fa-shopping-cart',
              message: 'Agregaste un Producto al Carrito',
              type: 'carrito'
            });

            analytics.track( 'Agrego un producto', {
              title: 'El usuario agrego un producto.'
            });

  					t.find('[name=' + id + ']').value = 1;
  				}
  			});
  		}
  },
  'click .d': function () {
    Session.set('pid', this.metadata.productoId);
    console.log(Session.get('pid'));
    Modal.show('detalleProducto');
  }
});

Template.detalleProducto.helpers({
  producto: function () {
    return Productos.findOne({_id: Session.get('pid')});
  },
  fotos: function () {
    return FotosProducto.find({'metadata.productoId': Session.get('pid')})
  }
});

Template.carrito.events({
  'click .cc': function () {
    Modal.hide('carrito');
  }
});


Template.detalleProducto.events({
  'click .c': function (e, t) {
      let id = this._id;

      let cantidad = t.find('[name=' + id + ']').value;


      let datos = {
        cantidad: cantidad,
        productoId: id,
        producto: this.descripcion,
        precio: this.precio,
        nombre: this.nombre
      }

      console.log(datos);

      if (cantidad !== 0) {

        Meteor.call('agregarAlCarrito', datos, function (err) {
          if (err) {
            console.log(err);
          } else {
            t.find('[name=' + id + ']').value = 1;
            Modal.hide('detalleProducto');
          }
        });
      }
  },
  'hover #photo': function () {
    /*$('#photo').zoom();
    console.log('hola')*/
    //console.log(this.url);
  }
});

Template.menuTienda.events({
	'click .carritos': function () {
		console.log('hola');
		Modal.show('carrito');
	}
});
