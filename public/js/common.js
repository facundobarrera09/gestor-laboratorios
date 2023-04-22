const logout = () => {
    localStorage.removeItem('userLoginData')
    window.location.reload()
}