FlowRouter.route('/', {
	name: 'Inicio',
	action() {
		BlazeLayout.render('index', { contenido: "tienda"});
	}
});

FlowRouter.route('/carrito', {
	name: 'Carrito',
	action() {
		BlazeLayout.render('index', { contenido: "carrito"});
	}
});


FlowRouter.route('/orden/:orden', {
	name: 'Carrito',
	action() {
		BlazeLayout.render('index', { contenido: "OrdenDetalle"});
	}
});


FlowRouter.route('/pedido', {
	name: 'Pedido',
	action() {
		BlazeLayout.render('index', { contenido: "pedido"});
	}
});


FlowRouter.route('/cuenta', {
	name: 'Cuenta',
	action() {
		BlazeLayout.render('index', { contenido: "miCuenta"});
	}
});


FlowRouter.route('/admin', {
	name: 'Admin',
	action() {
		BlazeLayout.render('layoutAdministrador', { contenido: "clientes"});
	}
});

FlowRouter.route('/admin/productos', {
	name: 'Admin.Productos',
	action() {
		console.log('hols');
		BlazeLayout.render('layoutAdministrador', { contenido: "productos"});
	}
});


FlowRouter.route('/admin/ordenes', {
	name: 'Admin.Ordenes',
	action() {
		BlazeLayout.render('layoutAdministrador', { contenido: "ordenesAdmin"});
	}
});

FlowRouter.route('/admin/apariencia', {
	name: 'Admin.apariencia',
	action() {
		BlazeLayout.render('layoutAdministrador', { contenido: "apariencia"});
	}
});

FlowRouter.route('/admin/ordenes/:orden', {
	name: 'Admin.Orden',
	action() {
		BlazeLayout.render('layoutAdministrador', { contenido: "ordenesAdmin"});
	}
});
