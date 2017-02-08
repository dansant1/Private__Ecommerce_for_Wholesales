Template.loginAdmin.onCreated(function () {
	var self = this;

	self.autorun(function () {
		self.subscribe('Colores');
		console.log('hola');
		self.subscribe('Footer');
		console.log('go');
		self.subscribe('Secciones');
		self.subscribe('Landing');
	});
});

Template.loginAdmin.helpers({
	color: function () {
		return Colores.find().fetch()[0].color1;
	},
	footer: function () {
		return Contenido.find();
	},
  	secciones: function () {
  		console.log('ue');
    	return Secciones.find();
  	},
  	landing: function () {
  		return Landing.find();
  	}
});

Template.loginAdmin.events({
	'submit form'(e, t) {

		e.preventDefault();

		let datos = {
			email: t.find('[name="email"]').value,
			password: t.find('[name="password"]').value
		}

		if (datos.email !== "" && datos.password !== "") {
			Meteor.loginWithPassword(datos.email, datos.password, function (err) {
				if (err) {
					Bert.alert('Ingrese los datos correctamente', 'danger');
				} else {
					analytics.identify( Meteor.userId(), {
      					email: Meteor.user().emails[0].address,
      					name: Meteor.user().profile.nombre
    				});
					console.log('Bienvenido');
				}
			});	
		} else {
			alert('Complete los datos');
		}

	},
	'click .feedback': function () {
		Modal.show('Feedback');
	}
});

