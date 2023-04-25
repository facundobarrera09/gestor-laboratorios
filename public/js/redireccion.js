let userData = JSON.parse(window.localStorage.getItem('userLoginData'))
try {
    if (!userData.username) {}
} catch (e) {
    window.location.replace(loginPageUrl)
}