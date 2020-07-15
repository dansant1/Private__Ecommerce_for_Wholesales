Template.pago.onCreated( () => {
    let template = Template.instance()

    template.monto = new ReactiveVar()

})

Template.pago.helpers({
    monto() {
        return Template.instance().monto.get()
    }
})

Template.pago.events({
    "keyup #monto"(e, t) {
        t.monto.set(t.find("[name='monto']").value)
    },
    "click #deposit"(e, t) {
        
        let content = {
            "card_number": t.find("[name='tarjeta']").value,
            "cvv": t.find("[name='cvv']").value,
            "expiration_month": t.find("[name='month']").value,
            "expiration_year": t.find("[name='year']").value,
            "email": t.find("[name='email']").value
        }

        let public_key = "pk_test_ZutyL9NHjJnFp9ss"

        let monto = t.find("[name='monto']").value

        $("#deposit").text("PROCESANDO PAGO...")
        $("#deposit").prop('disabled', true);

        if (content.card_number !== "" && content.cvv !== "" && content.expiration_month !== "" && content.expiration_year !== "") {
            

            let url = "https://secure.culqi.com/v2/tokens"

            console.log(content)

            HTTP.call( "POST", url, { 
                headers: {
                    "Content-type": "application/json",
                    'Authorization': "Bearer " + public_key
                },
                content: JSON.stringify(content)
                
            }, function (error, response) {
                
                console.log(response.statusCode)
                console.log(response)

                if (response.statusCode === 201) {
                    Meteor.call("add_balance", response.data.id, monto, content.email, function (error) {
                        if (error) {
                            Bert.alert(error, "danger")
                            FlowRouter.go("/")
                        } else {
                            $("#deposit").text("DEPOSITAR")
                            $("#deposit").prop('disabled', false);
                            Bert.alert("Balance Actualizado", "success")
                            FlowRouter.go("/")
                        }
                    })
                } else {
                    Bert.alert("Hubo un error", "danger")
                    t.find("[name='tarjeta']").value = ""
                    t.find("[name='cvv']").value = ""
                    t.find("[name='month']").value = ""
                    t.find("[name='year']").value = ""
                    t.find("[name='email']").value = ""
                    $("#deposit").text("DEPOSITAR")
                    $("#deposit").prop('disabled', false);
                }
            
                

            }) 

        }
    }
})