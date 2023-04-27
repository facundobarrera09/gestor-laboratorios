const loginPostUrl = 'http://localhost:3001/api/login'
const nextPageUrl = '/misTurnos.html'

let userData = JSON.parse(window.localStorage.getItem('userLoginData'))
try {
    if (userData.username) {
        window.location.replace(nextPageUrl)
    }
} catch (e) { /* empty */ }


let form = document.getElementById('login-form')
const notifyError = (error) => {

    // <div class="alert alert-danger" role="alert">
    //     ALERT!
    // </div>

    const div = document.createElement('div')
    const text = document.createTextNode(error)

    div.className = 'alert alert-danger'
    div.role = 'alert'
    div.appendChild(text)

    form.insertBefore(div, form.firstChild)

    setTimeout(() => {
        div.remove()
    }, 5000)
}

if (window.localStorage.getItem('error') === 'expired') {
    window.localStorage.removeItem('error')
    notifyError('La sesión a expirado')
}

form.onsubmit = (event) => {
    event.preventDefault()

    const xhr = new XMLHttpRequest()
    xhr.open('POST', loginPostUrl)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')

    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // save user data
            localStorage.setItem('userLoginData', xhr.responseText)

            // redirect user to new page
            window.location.replace(nextPageUrl)

        } else {
            notifyError('Usuario o contraseña incorrectos')
        }
    }

    xhr.send(JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value
    }))
}