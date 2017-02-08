Meteor.publish('clientes', function () {
	if (this.userId) {
		return Clientes.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('productos', function () {
	if (this.userId) {
		return Productos.find();
	} else {
		this.stop();
		return;
	}
});


Meteor.publish('categorias', function () {
	if (this.userId) {
		return Categorias.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('condiciones', function () {
	if (this.userId) {
		return CondicionesDePago.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('ordenes', function () {
	if (this.userId) {
		return Ordenes.find();
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('MisOrdenes', function () {
	if (this.userId) {
		return Ordenes.find({clienteId: this.userId});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('Logos', function () {
	if (this.userId) {
		return Logos.find({});
	} else {
		this.stop();
		return;
	}
});

Meteor.publish('Footer', function () {
	console.log('hola2');
	return Contenido.find({});
	
});

Meteor.publish('Landing', function () {
	console.log('hola3');
	return Landing.find({});
	
});