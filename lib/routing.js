FlowRouter.route('/depositar', {
	action() {
		BlazeLayout.render('nav', {page: "pago"});

	}
});

FlowRouter.route('/', {
	action(params, queryParams) {
		BlazeLayout.render('nav', {page: "index"});
	}
});

FlowRouter.route('/sala-privada', {
	action(params, queryParams) {
		BlazeLayout.render('nav', {page: "salaPrivada"});
	}
});

FlowRouter.route('/vender', {
	action(params, queryParams) {
		BlazeLayout.render('nav', {page: "vender"});
	}
});
