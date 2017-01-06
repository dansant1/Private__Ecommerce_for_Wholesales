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
	sinIGV: function () {
		let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

  		let sinIGV = (total / 118) * 100;

  		return sinIGV.toFixed(1);
	},
	igv: function () {
		let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

  		let igv =  total - ( ( total / 118) * 100 ) 
		return igv.toFixed(1);
	},
	supertotal: function () {
		let carrito = Carrito.find({ordenado: false, userId: Meteor.userId()});
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

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
			comentario: t.find("[name='comentario']").value
		}

		Meteor.call('ordenar', datos, function (err) {
			if (err) {
				console.log(err);
			} else {
				alert('Tu pedido ha sido enviado');
				FlowRouter.go('/')
			}
		});
	}
});

Template.menuTienda.onCreated( () => {
	let template = Template.instance();

	template.autorun( () => {
		template.subscribe('carrito');
		template.subscribe('clientes');
    template.subscribe('Logos');
	});
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
		return this.precio * this.cantidad;
	},
	superTotal: function () {
		let total = 0;
		this.ordenes.forEach( function (o) {
			total = total + (o.precio * o.cantidad)
		});

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
		var monthNames = [
  			"Enero", "Febrero", "Marzo",
  			"Abril", "Mayo", "Junio", "Julio",
  			"Agosto", "Septiembre", "Octubre",
  			"Noviembre", "Diciembre"
		];

		var date = this.createdAt;
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	
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

  		return total;
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
  		let carrito = Carrito.find();
  		let total = 0;
  		carrito.forEach(function (e) {
  			let t = e.precio * e.cantidad;
  			total = total + t;
  		});

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
  	});
});


Template.ProductosDeLaTienda.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
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

    productos = Productos.find({categoriaId: categoriaId}, query);
 
    if (query) {
        if ( productos ) {
          return productos;
        }
    } else {
      	return Productos.find({categoriaId: categoriaId});
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
		return this.cantidad * this.precio;
	}
});

Template.carrito.events({
	'click .eliminar': function () {
		Meteor.call('eliminarCarrito', this._id, function (err) {
			if (err) {
				console.log(err);
			}
		});
	},
	'click .ordenar': function () {
		Modal.hide('carrito');
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
  					t.find('[name=' + id + ']').value = 1;
  				}
  			});
  		}
  }
});

Template.menuTienda.events({
	'click .carritos': function () {
		console.log('hola');
		Modal.show('carrito');
	}
});

