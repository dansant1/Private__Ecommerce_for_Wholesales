Meteor.publish( "mensajes", function () {

    if ( Mensajes.find().count() > 0) {
        return Mensajes.find()   
    } else {
        this.stop()
        return
    }
})