Meteor.methods({
    add_balance(token, monto, email) {
        
        check(token, String)
        check(monto, String)
        check(email, String)
        
        if (this.userId) {


            var call = Meteor.wrapAsync(HTTP.call, HTTP);

            let private_key = "sk_test_8Y7FnhML0oLYfx5p"

            let content = { 
                "amount": monto,
                "currency_code": "PEN",
                "email": email,//Meteor.users.findOne({_id: this.userId}).emails[0].address,
                "source_id": token
            }

            let res = call( "POST", "https://api.culqi.com/v2/charges", { 
                content: JSON.stringify(content),
                headers: {
                    "Content-type": "application/json",
                    'Authorization': "Bearer " + private_key
                }
            })

            if (res.statusCode == 201) {
                console.log("exitoso!!!")
                Meteor.users.update({_id: this.userId}, {
                    $inc: {
                        "profile.balance": parseFloat(monto)
                    }
                });
        
                Recargas.insert({
                    userId: this.userId,
                    monto,
                    addedAt: new Date()
                })
            } else {
                throw new Meteor.Error('ERROR: ', "PROCESO DE PAGO NO COMPLETADO");
            }

            
        } else {
            throw new Meteor.Error('ERROR: ', 'USUARIO NO ENCONTRADO');
        }
    },
    update_balance(monto){
        Meteor.users.update({_id: this.userId}, {
            $inc: {
                "profile.balance": parseFloat(monto)
            }
        });

        Recargas.insert({
            userId: this.userId,
            monto,
            addedAt: new Date()
        })
    }
})

