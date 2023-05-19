const loginPostUrl = 'http://localhost:3001/api/login'
const nextPageUrl = '/misTurnos.html'

const params = new URLSearchParams(new URL(document.documentURI).search)

let userData = loadUserLoginData()
if (userData) {
    window.location.replace(nextPageUrl)
}

const form = document.getElementById('login-form')
form.onsubmit = (event) => {
    event.preventDefault()

    userData = loadUserLoginData()
    if (!userData) {
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
                localStorage.setItem('userLoginData', JSON.stringify(response.data))

                // redirect user to new page
                window.location.replace(params.get('redirect') || nextPageUrl)
            },
            error: (response) => {
                if (response.responseText.includes('not found')) {
                    notify('error', 'El usuario no existe')
                }
                else if (response.responseText.includes('password')) {
                    notify('error', 'Contraseña incorrecta')
                }
                else {
                    notify('error', 'Ocurrio un error inesperado')
                }
            }
        })
    }
    else {
        window.location.reload()
    }
}