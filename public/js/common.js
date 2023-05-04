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
                window.location.reload()
            },
            error: (error) => {
                localStorage.removeItem('userLoginData')
                sessionStorage.removeItem('userLoginData')
                window.location.reload()
            }
        })
    }
    else {
        window.location.reload()
    }
}