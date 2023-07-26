
export function setCredentials(credentials) {
    sessionStorage.setItem("token", credentials)
}

export function getCredentials() {
    return sessionStorage.getItem("token")
}

export function isLoggedIn() {
    return getCredentials() !== null
}
