import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	
	ServiceConfiguration.configurations.upsert(
	  { service: 'steam' },
	  {
		$set: {
		  loginStyle: 'redirect',
		  timeout: 10000
		}
	  }
	);

	if ( Items.find().count() === 0 ) {
		
		let data = {
			steamID: "76561199073124482",
			items: [ {	assetid: "000011", 
						url_image: "https://cs.deals/steamItems/MzQ3Njk=_2.png",
						name: "DragonClaw Hook",
						
					}, {	
						assetid: "000013", 
						url_image: "https://cs.deals/steamItems/NzM5_2.png",
						name: "Nitro Hook",
						
					}, {	
						assetid: "000012", 
						url_image: "https://cs.deals/steamItems/MTQw_2.png",
						name: "ManCoo Suply",
						
					}]
		}

		Meteor.call("sell_item", data.steamID, data.items, function (error) {
			if (error) {
				console.log(error)
			}
		})

	}

});

