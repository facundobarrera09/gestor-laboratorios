const logoutUrl = 'http://localhost:3001/api/logout'

const logout = () => {
    if (userData) {
        $.ajax({
            url: logoutUrl,
            headers: { 'Authorization': `Bearer ${userData.access_token}` },
            type: 'POST',
            success: (response) => {
                localStorage.removeItem('userLoginData')
                sessionStorage.removeItem('userLoginData')
                window.location.assign('/')
            },
            error: (error) => {
                localStorage.removeItem('userLoginData')
                sessionStorage.removeItem('userLoginData')
                window.location.assign('/')
            }
        })
    }
    else {
        window.location.assign('/')
    }
}

const loadUserLoginData = () => {
    return JSON.parse(localStorage.getItem('userLoginData'))
}

const generateAlert = (className, alertText) => {
    console.log('generating:', className, alertText)
    const div = document.createElement('div')
    const text = document.createTextNode(alertText)

    div.className = `alert ${className}`
    div.role = 'alert'
    div.appendChild(text)

    return div
}
const createNotification = (type, message) => {
    const notificationField = document.getElementById('notification')

    if (notificationField) {
        console.log('notificating:', type, ' ', message)

        const div = generateAlert(
            type === 'error' ? 'alert-danger' :
                type === 'info' ? 'alert-info' :
                    'alert-primary',
            message
        )
        notificationField.appendChild(div)

        setTimeout(() => {
            div.remove()
        }, 5000)
    }
    else {
        console.log('notification field not defined')
    }
}
const notify = async () => {
    const info = localStorage.getItem('notify')
    const error = localStorage.getItem('error')

    console.log(info, error)

    localStorage.removeItem('notify')
    localStorage.removeItem('error')

    if (error) {
        createNotification('error', error)
        await new Promise(r => (setTimeout(r, 5000)))
    }
    if (info) {
        createNotification('info', info)
    }
}

notify()