class LoginPage {
    constructor()
    {
        this.EC = protractor.ExpectedConditions; 
        this.loginEmail = $("app-login input[formcontrolname='email']");
        this.loginPassword = $("app-login input[formcontrolname='password']");
        this.loginBtn = element(by.cssContainingText("button","Login"));
        this.h4Tag = $("h4");
        this.errorMsg = $$(".text-danger");
    }

    enterEmailLogin = async(emailText) => {
        this.loginEmail.sendKeys(emailText);
        this.clickSomewhere();
    }

    enterPasswordLogin = (passwordText) => {
        this.loginPassword.sendKeys(passwordText);
        this.clickSomewhere();
    }

    clickLoginBtn = () => {
        this.loginBtn.click();
    }

    loginToApp = async(user,pword) => {
        await this.loginEmail.sendKeys(user);
        await this.loginPassword.sendKeys(pword);

        let clickable = this.EC.elementToBeClickable(this.loginBtn);
        browser.wait(await clickable, 10000,'Login button is not clickable');        

        await this.loginBtn.click();
        browser.sleep(1000);
    }


    clickSomewhere = () => {
        this.h4Tag.click();
    }

    isLoginButtonDisable = () => {
        let returnVal = true;
        if(this.loginBtn.isEnabled())
        {
            returnVal = true;
        }
        return returnVal;
    }

    verifyErrorMsgForNoEmail = async() => {
        let errorMsg = $("app-login div:nth-child(1) span");
        return await errorMsg.getText();
    }

    verifyErrorMsgForNoPassword = async() => {
        let errorMsg = $("app-login form div:nth-child(2) div.text-danger div");
        return await errorMsg.getText();
    }

    verifyErrorMsgForEmailWithNoDomain = async() => {
        let errorMsg = $("app-login div:nth-child(1) span");
        return await errorMsg.getText();
    }
}
module.exports = LoginPage;