Template.index.onCreated( () => {

    let template = Template.instance();

    template.items = new ReactiveVar()

    template.buscando = new ReactiveVar(false)

    template.items = new ReactiveVar([])

    template.searchQuery = new ReactiveVar("")

    template.categories = new ReactiveVar([])

    template.autorun( () => {

        let mensajes = template.subscribe("mensajes")
        let items = template.subscribe("items", template.searchQuery.get(), () => {
            setTimeout( () => {
              template.buscando.set( false );
            }, 300 )
        })
    })
})

Template.nav.helpers({
    id() {
        return Meteor.user().profile.id;
    },
    balance() { 
        
        return "S/ " + Meteor.user().profile.balance;
        
    }
})

Template.nav.onRendered(function () {
    $('#ver_chat').click( function () {
        //$('.chat-wrapper').toggleClass("hide")
        $('.chat-wrapper').toggleClass("show_chat")
    })
})

Template.index.helpers({
    categories() {
        return Template.instance().categories.get()
    },
    buscando() {
        return Template.instance().buscando.get();
    },
    hayBalance() {
        if ( Meteor.user().profile.balance <= 0 || Meteor.user().profile.balance === undefined ) {
            return false
        } else {
            return true
        }
    },
    total()  {

        let items = Template.instance().items.get()
        let total = 0
        items.forEach( function (item) {
            total += item.precio
        })

        return total;
    },
    carrito() {
        return Template.instance().items.get()
    },
   
    mensajes() {
        return Mensajes.find( {}, {
              sort: { addedAt: -1 }
            })
    },
    items() {
        let template = Template.instance()

        return Items.find()
    }
});

Template.nav.events({
    'click #login': () => {
        Modal.show("login");
    },
    "click #logout":() => {
        Meteor.logout()
    },
    "click .login_":() => {
        Modal.show("login2")
    }
})

Template.index.onRendered( function () {
    
    $(".options img").click(function() {

        $(".options img").each( function () {
            $(this).removeClass("selected")
        })

        $(this).addClass("selected")
    });
         
})

Template.index.events({
    "click .name_category"(event, template) {
        let category = event.target.value;

        console.log(category)

        template.searchQuery.set( category );
    },
    'click [name="search"]'( event, template ) {

        let value = template.find("[name='search_text']").value
    
        if ( value !== '' ) {
          template.searchQuery.set( value );
          template.buscando.set( true );
        } else {
            template.searchQuery.set( "" );
        }
    },
    'click [name="cs"]'( event, template ) {

        let categories = ["agent", "collectible", "container", "gift", "gloves", "graffiti", "key", "knife", "machinegun", "music kit", "pass", "patch", "pistol", "rifle", "shotgun", "smg", "sniper rifle", "sticker", "tag", "tool"]

        template.categories.set(categories)
       
    },
    'click [name="cs2"]'( event, template ) {

        let categories = ["action", "building", "cosmetic", "craft item", "crate", "festivizer", "gift", "killstreak kit", "melee weapon", "package", "party favor", "primary dpa", "primary weapon", "recipe", "secondary pda", "server enchantment", "strange filter", "strange part", "strangiffier", "taunt 1"]

        template.categories.set(categories)
        
    },
    'click [name="cs3"]'( event, template ) {
        let categories = ["announcer", "bundle", "courier", "cursor pack", "emoticon tool", "gem / rune", "hud skin", "league", "loading screen", "misc", "music", "pennant", "player card", "retired chest", "taunt", "tool", "treasure", "ward", "wearable"]

        template.categories.set(categories)
       
    },
    'click [name="cs4"]'( event, template ) {

        let categories = ["common chest skin", "common tier 3 footwear skin", "crate", "emote", "mystery bag", "skin", "standard crate", "standard helmet skin", "ultra-rare face skin"]
        
        template.categories.set(categories)
       
    },
    'click [name="cs5"]'( event, template ) {

        let categories = ["ak47u", "armored metal door", "balaclava", "bandana", "beenie", "bolt rifle", "bone club", "bone knife", "boonie", "boots", "bucket helmet", "burlap gloves", "burlap shirt", "burlap shoes", "burlap trouser", "cap", "cofeecan helment", "collared shirt", "concrete barricade", "crossbow"]
        
        template.categories.set(categories)
       
    },
    "click #vender"() {
        FlowRouter.go("/vender")
    },
    "click #deposit"() {
        FlowRouter.go("/depositar")
    },
    'click #login': () => {
      Modal.show("login")
    },
    'click #logout': () => {
      Meteor.logout();
    },
    "click #add"(e, t) {
        this.precio = 45;
        
        let items = t.items.get()

        items.forEach( item => {
           
            if ( item._id == this._id ) {
                Bert.alert("Producto ya fue agregado al carrito", "danger")
                return
            }

        });

        items.push(this)
        
        t.items.set(items)

        Bert.alert("Item Agregado", "success")

        
    },
    "click #enviar"(e, t) {

            let datos = {
                mensaje: t.find("[name='mensaje']").value
            }

            if ( Meteor.userId() ) {

                if (datos.mensaje !== "") {
                    Meteor.call("add_mensaje", datos, function (error) {
                        if (error) {
                            Bert.alert(error)
                        } else {
                            t.find("[name='mensaje']").value = ""
                        }
                    })
                } else {
                    Bert.alert("Escriba un mensaje", "warning")
                }

            } else {
                Modal.show("login")
            }
        
    },
    "click #comprar"(e, t) {
        let items = t.items.get()

        if ( items.length > 0 ) {
            
            

            Meteor.call("purschase", items, function (error) {
                
                if (error) {
                    Bert.alert(error, "danger")
                } else {
                    Modal.show("purschaseConfirmation")
                }

                t.items.set([])
            })

        } else {
            Bert.alert("Agrega un item al carrito antes de continuar", "warning")
        }
    },
})

