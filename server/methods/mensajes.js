Meteor.methods({
    add_mensaje(datos) { 
        
        if (this.userId) { 
            datos.userId = this.userId;
            datos.user_id = Meteor.users.findOne({ _id: this.userId }).profile.id
            datos.addedAt = new Date()
            Mensajes.insert(datos)
        }        
    
    }
})