class Account {
    constructor(firstName, lastName, email, phoneNumber, password, isAdministrator, photo, accountLevel) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.isAdministrator = isAdministrator;
        this.photo = photo;
        this.accountLevel = accountLevel;
    }
}

export { Account }