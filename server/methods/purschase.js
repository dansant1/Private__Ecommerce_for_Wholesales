Meteor.methods({
    purschase(items) {
        check(items, Array)

        if (this.userId) {

            let monto = 0

            let steamID = Meteor.users.findOne({_id: this.userId}).profile.id
            
            items.forEach( item => {
                monto += parseFloat(item.precio)
            });

            // add HTTP POST req to send the items the bot has to send to the user

            Meteor.users.update({_id: this.userId}, {
                $inc: {
                    "profile.balance": -parseFloat(monto)
                }
            })

        } else {
            throw new Meteor.Error('ERROR: ', 'USUARIO NO ENCONTRADO');
        }
    
    }
})