Template.vender.onCreated( () => {
    
    let template = Template.instance()

    template.inventario = new ReactiveVar([])

    template.loading_inventory = new ReactiveVar(false)

    template.items_seleccionados = new ReactiveVar([])

    template.autorun( () => {
        
        const inventario = template.subscribe("inventario")

        let data = []

        if ( inventario.ready() ) {
            
            ConsultasDeInventario.find().forEach( function (inv) {
            
                inv.items.forEach( function (item) {
                    data.push(item)   
                })
            
            })

            template.inventario.set(data)

        }
    })

})

Template.vender.helpers({
    load_inventory() {

        return Template.instance().loading_inventory.get()

    },
    category_url() {
        if (this.appid === 240) {
            return "/img/cs.jpg"
        }

        if (this.appid === 540) {
            return "/img/cs2.jpg"
        }

        if (this.appid === 570) {
            return "/img/cs3.jpg"
        }

        if (this.appid === 433850) {
            return "/img/cs4.jpg"
        }

        if (this.appid === 252490) {
            return "/img/cs5.jpg"
        }
    },
    items_vender() {
        let total = 0;

        let items_seleccionados = Template.instance().items_seleccionados.get()

        items_seleccionados.forEach( function (e) {
            total++
        })

        return total;
    },
    inventario() {
        return Template.instance().inventario.get()
    },
    items_seleccionados() {
        return Template.instance().items_seleccionados.get()
    },
    total() {
        let items_seleccionados = Template.instance().items_seleccionados.get()
        let total = 0
        items_seleccionados.forEach( item => {
            total += parseFloat(item.precio) 
        });

        return total
    }
})

const filterInPlace = (array, predicate) => {
    let end = 0;

    for (let i = 0; i < array.length; i++) {
        const obj = array[i];

        if (predicate(obj)) {
            array[end++] = obj;
        }
    }

    array.length = end;
};


Template.vender.events({
    "click .load_inventory"(event, template) {

        template.loading_inventory.set(true)

        Meteor.call("getInventory", function (error) {
            if (error) {
                Bert.alert(error, "danger")
            } else {
                template.loading_inventory.set(false)
            }
        })
    },
    "click .upload"(e, t) {
        
        this.precio = document.getElementById("precio" + this.assetid).value

        if ( this.precio !== "" ) {

            let items_seleccionados = t.items_seleccionados.get()

            items_seleccionados.push(this)

            t.items_seleccionados.set(items_seleccionados)

            const toDelete = new Set([this.assetid]);

            let inventario = t.inventario.get() 

            filterInPlace(inventario, obj => !toDelete.has(obj.assetid));

            t.inventario.set(inventario)
        
        } else {
            Bert.alert("Ingrese el precio del ITEM", "warning")
        }
    
    },
    "click #vender"(e, t) {

        

        let items_seleccionados = t.items_seleccionados.get()

        if ( typeof items_seleccionados !== 'undefined' && items_seleccionados.length > 0 ) {
            Modal.show("ventaExitosa")
            Meteor.call("vender", t.items_seleccionados.get(), function (error) {
                if (error) {
                    Bert.alert(error)
                }
            })
            t.items_seleccionados.set([])
            
        } else {
            Bert.alert("Seleccione al menos un item para vender", "warning")
        }

        
    }
})