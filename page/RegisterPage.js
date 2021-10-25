class RegisterPage {
    constructor()
    {
        this.emailInput = $("input[formcontrolname='email']");
        this.firstNameInput = $("input[formcontrolname='firstName']");
        this.lastNameInput = $("input[formcontrolname='lastName']");
        this.passwordInput = $("input[formcontrolname='password']");
        this.middleNameInput = $("input[formcontrolname='middleName']");
        this.birthdayInput = $("div input[formcontrolname='birthDay']");
        this.registerBtn = $("button[type='submit']");
    }

    // Enter email
    enterEmail = (emailText) => {
        this.emailInput.sendKeys(emailText);
    }

    // Enter first name
    enterFirstName = (firstNameText) => {
        this.firstNameInput.sendKeys(firstNameText);
    }

    // Enter last name
    enterLastName = (lastNameText) => {
        this.lastNameInput.sendKeys(lastNameText);
    }

    // Enter password
    enterPassword = (passwordText) => {
        this.passwordInput.sendKeys(passwordText);
    }

    // Enter middle name
    enterMiddleName = (middleNameText) => {
        this.middleNameInput.sendKeys(middleNameText);
    }

    // Enter birthday
    enterBirthday = (bdayText) => {
        this.birthdayInput.sendKeys(bdayText);
    }

    // Click register button
    clickRegisterBtn = () => {
        this.registerBtn.click();
    }
}

module.exports = RegisterPage;