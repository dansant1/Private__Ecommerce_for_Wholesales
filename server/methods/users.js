Meteor.methods({
    create_user(username, password) { 
        check(username, String)
        check(password, String)
        let _id = Accounts.createUser({
            password,
            username,
            profile: {
                id: username
            }
        })

        return _id
    }
})