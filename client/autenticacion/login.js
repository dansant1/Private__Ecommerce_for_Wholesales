Template.loginAdmin.events({
	'submit form'(e, t) {

		e.preventDefault();

		let datos = {
			email: t.find('[name="email"]').value,
			password: t.find('[name="password"]').value
		}

		Meteor.loginWithPassword(datos.email, datos.password, function (err) {
			if (err) {
				console.log('No esta registrado');
			} else {
				console.log('Bienvenido');
			}
		});

	}
});

