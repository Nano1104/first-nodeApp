const ROLES = ["user", "admin", "premium"]

class UserDto {
    constructor(user) {
        if (!user.first_name || !user.last_name) throw new Error("first_name and last_name are required");

        if (typeof user.age !== "number" || user.age < 0) throw new Error("User age must be a number and cannot be negative");

        if(!ROLES.includes(user.role)) throw new Error("User has an invalid role"); 

        this.id = user._id
        this.fullName = `${user.first_name} ${user.last_name}`
        this.age = user.age
        this.role = user.role
    }
}

module.exports = UserDto