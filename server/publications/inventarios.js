Meteor.publish( "inventario", function () {

    if (this.userId) {
        const _id = this.userId;

        const steamID = Meteor.users.findOne({_id}).profile.id

        return ConsultasDeInventario.find({steamID})
    
    } else {
        this.stop()
        return;
    }

})