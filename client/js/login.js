Template.login.events({
    'click #login': (e, t) => {

        let datos = {
            steamid:t.find("[name='steamid']").value,
            password: t.find("[name='password']").value
        }

        if (datos.steamid !== "" && datos.password !== "") {
            Meteor.call("create_user", datos.steamid, datos.password, function (error) {
                if (error) {
                    Bert.alert(error, "danger")
                } else {
                    Bert.alert("Bienvenido", "success")
                    Meteor.loginWithPassword(datos.steamid, datos.password, function (err) { 

                        if (err) {
                            Bert.alert(error, "danger")
                        } else {
                            Modal.hide("login")
                        } 
                    })
                   
                } 
            })
        } else {
            Bert.alert("Complete los datos", "warning")
            
        } 
    }
})

Template.login2.events({
    'click #login': (e, t) => {

        let datos = {
            steamid:t.find("[name='steamid']").value,
            password: t.find("[name='password']").value
        }

        if (datos.steamid !== "" && datos.password !== "") {
           
            Meteor.loginWithPassword(datos.steamid, datos.password, function (err) { 

                if (err) {
                    Bert.alert(error, "danger")
                } else {
                    Modal.hide("login")
                } 
            })
                   
          
        } else {
            Bert.alert("Complete los datos", "warning")
            
        } 
    }
})