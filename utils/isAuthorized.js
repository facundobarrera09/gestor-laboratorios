const isAuthorized = (request, response, next) => {
    let status = 'unauthorized'
    const cb = () => {
        if (status !== 'active') {
            console.log(status)
            response.redirect(`/index.html?redirect=${encodeURIComponent(request.originalUrl)}`)
        }
    }

    if (request.session.accessToken) {
        request.oauth2.model.accessToken.fetchByToken(request.session.accessToken, (err, accessToken) => {
            if (err) {
                status = 'accessToken not found'
                cb()
            }
            else {
                request.oauth2.model.accessToken.checkTTL(accessToken, (err, isTokenActive) => {
                    if (isTokenActive)
                        status = 'active'
                    cb()
                })
            }
        })
        next()
    }
    else cb()
}

module.exports = isAuthorized