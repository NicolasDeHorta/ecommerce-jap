var usersList = [
    {
        mail: "dummy@correo.com",
        pass: "hola1234"
    },
    {
        mail: "admin",
        pass: "admin"
    }
]

var getLoginInfo = () => {
    let mail = $("[name='email-address']").val();
    let pass = $("[name='password']").val();

    return {
        mail: mail,
        pass: pass
    }
}


var login = () => {
    let tryUser = getLoginInfo()
    let registeredUser = usersList.filter(user => (user.mail === tryUser.mail && user.pass === tryUser.pass))

    //registeredUser.length > 0 ? window.location.href = "./home.html" : alert("Quizas quieras mirar la esquina inferior derecha en busca de alguna pista")
}


$("#login-button").click(login)
