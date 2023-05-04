const loginPostUrl = 'http://localhost:3001/api/login'
const nextPageUrl = '/misTurnos.html'

let userData = JSON.parse(window.sessionStorage.getItem('userLoginData'))
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

if (window.sessionStorage.getItem('error') === 'expired') {
    window.localStorage.removeItem('error')
    notifyError('La sesión a expirado')
}

const params = new URLSearchParams(new URL(document.documentURI).search)

form.onsubmit = (event) => {
    event.preventDefault()

    $.ajax({
        url: loginPostUrl,
        headers: { 'Content-Type': 'application/json' },
        type: 'POST',
        data: JSON.stringify({
            grant_type: 'password',
            scope: 'read write',
            username: event.target.username.value,
            password: event.target.password.value
        }),
        success: (response) => {
            // save user data
            sessionStorage.setItem('userLoginData', JSON.stringify(response.data))

            // redirect user to new page
            window.location.replace(params.get('redirect') || nextPageUrl)
        },
        error: (response) => {
            if (response.responseText.includes('not found')) {
                notifyError('El usuario no existe')
            }
            else if (response.responseText.includes('password')) {
                notifyError('Contraseña incorrecta')
            }
            else {
                notifyError('Ocurrio un error inesperado')
            }
        }
    })
}