
const loginPostUrl = 'http://localhost:3001/api/login'
const nextPageUrl = './misTurnos.html'  

let userData = JSON.parse(window.localStorage.getItem('userLoginData'))
console.log(userData)
if (userData.username) {
    window.location.href = nextPageUrl
}

let form = document.getElementById('login-form')
form.onsubmit = (event) => {
    event.preventDefault()

    const xhr = new XMLHttpRequest();
    xhr.open("POST", loginPostUrl);
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // save user data
            window.localStorage.setItem('userLoginData', xhr.responseText)

            // redirect user to new page
            window.location.href = nextPageUrl

        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };

    xhr.send(JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value
    }))
}