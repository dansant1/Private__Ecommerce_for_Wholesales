import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  
  process.env.MAIL_URL = "smtp://postmaster@grupoddv.com:faf68e2df2f77397baf3a38e8cd9f209@smtp.mailgun.org:587";

	/*var users = [
      {email:"admin@gmail.com", roles:['admin']}
    ];

	_.each(users, function (user) {
  
  		var id;

  		id = Accounts.createUser({
    		email: user.email,
    		password: "20dejunio"
  		});
    	
    	Roles.addUsersToRoles(id, user.roles, 'fundador');
  
	}); */
});
