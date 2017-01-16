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
					alert('No esta registrado');
				} else {
					console.log('Bienvenido');
				}
			});	
		} else {
			alert('Complete los datos');
		}

		

	}
});

