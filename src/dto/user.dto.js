
class UserDto {
    constructor(user) {
        this.fullName = `${user.first_name} ${user.last_name}`
        this.age = user.age
        this.role = user.role
    }
}

module.exports = UserDto