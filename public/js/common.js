const logoutUrl = 'http://localhost:3001/api/logout'

const userData = JSON.parse(window.localStorage.getItem('userLoginData'))

if (!userData && window.location.pathname !== '/') {
    window.location.replace('/')
}

// eslint-disable-next-line no-unused-vars
const logout = () => {
    if (userData) {
        $.ajax({
            url: logoutUrl,
            headers: { 'Authorization': `Bearer ${userData.access_token}` },
            type: 'POST',
            success: () => {
                localStorage.removeItem('userLoginData')
                sessionStorage.removeItem('userLoginData')
                window.location.assign('/')
            },
            error: () => {
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

const generateAlert = (className, alertText) => {
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