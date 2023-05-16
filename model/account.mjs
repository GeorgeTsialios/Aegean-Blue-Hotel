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

    changeAccountInfo(newFirstName, newLastName, newPhoneNumber) {
        this.firstName = newFirstName;
        this.lastName = newLastName;
        this.phoneNumber = newPhoneNumber;
    }

    changeEmail(newEmail) {
        this.email = newEmail;
    }

    changePassword(newPassword) {
        this.password = newPassword;
    }

    changeProfilePicture(newProfilePicture) {
        this.photo = newProfilePicture;
    }
}

export { Account }