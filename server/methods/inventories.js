Meteor.methods({
    getInventory() { 
        if (this.userId) { 

            let steamid = Meteor.users.findOne({ _id: this.userId }).profile.id

            let appid = 570
            
            let call = Meteor.wrapAsync(HTTP.call, HTTP);

            let content = { 
                steamid,
                appid
            }

            let res = call( "POST", "http://localhost:8000/inventory", { 
                content: JSON.stringify(content),
                headers: {
                    "Content-type": "application/json",
    
                }
            })

            return res

        } else {
            throw new Meteor.Error('ERROR: ', 'USUARIO NO ENCONTRADO');
        }
    },
    vender(assets) {
        if (this.userId) { 

            let steamid = Meteor.users.findOne({ _id: this.userId }).profile.id
            
            let call = Meteor.wrapAsync(HTTP.call, HTTP);

            let content = { 
                steamid,
                assets
            }

            //let res = call( "POST", "http://localhost:8000/marketplace", { 
            //    content: JSON.stringify(content),
            //    headers: {
            //        "Content-type": "application/json",
            //    }
            //})

            //return res

        } else {
            throw new Meteor.Error('ERROR: ', 'USUARIO NO ENCONTRADO');
        }
    }
})