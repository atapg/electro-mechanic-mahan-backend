module.exports = ({ email, password, phone, name, lastName }) => {
    if (!email || !password || !phone || !name || !lastName) {
        return false
    } else {
        return true
    }
}
