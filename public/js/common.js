const logout = () => {
    localStorage.removeItem('userLoginData')
    sessionStorage.removeItem('userLoginData')
    window.location.reload()
}