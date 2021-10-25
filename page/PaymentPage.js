const { browser } = require("protractor");

class PaymentPage{
    constructor()
    {
        this.EC = protractor.ExpectedConditions; 
    }

    isPaymentSummaryDetailsCorrect = async(item) => {
        const paymentSummary = $("app-payment-summary [class='container rounded']");
        let visible = this.EC.visibilityOf(paymentSummary);
        browser.wait(visible, 1000);          
        
        var returnVal =  await paymentSummary.getAttribute('innerText');
        return await returnVal.includes(await item);
    }

    inputCardHolderName = async(cName) => {
       let cardHolderName = $("app-payment [formcontrolname='cardholderName']");
       let visible = this.EC.visibilityOf(cardHolderName);
       browser.wait(visible, 8000);  

       await cardHolderName.sendKeys(cName);
    }

    inputCreditCardNumber = async(cNumber) => {
        const creditCardNum = $("app-payment [formcontrolname='cardNumber'] input");
        let visible = this.EC.visibilityOf(creditCardNum);
        browser.wait(visible, 8000); 

        await creditCardNum.sendKeys(cNumber);
    }

    inputCVV = async(cvv) => {
        const cvvInput = $("app-payment [formcontrolname='cvv'] input");
        let visible = this.EC.visibilityOf(cvvInput);
        browser.wait(visible, 8000); 

        await cvvInput.sendKeys(cvv);
    }

    inputExpiryDate = async(xDate) => {
        const expiryDate = $("app-payment [formcontrolname='expiryDate'] input");
        let visible = this.EC.visibilityOf(expiryDate);
        browser.wait(visible, 8000);     

        expiryDate.click();
        await expiryDate.sendKeys(xDate);
    }

    clickProceed = async() => {      
        let proceedBtn = element(by.cssContainingText("button","Proceed"));
        let clickable = this.EC.elementToBeClickable(await proceedBtn);
        browser.wait(clickable, 8000);    

        await proceedBtn.click();
    }

    waitForCloseDialogBox = async() => {
        let dialogBox = element(by.css("[header='Confirmed Reservation']"));

        let visible = this.EC.visibilityOf(await dialogBox);
        browser.wait(visible, 10000);

        let invisible = this.EC.invisibilityOf(await dialogBox);
        browser.wait(invisible, 10000);
    }

    isEmailConfirmationDisplayInDialogBox = async() => {
        let dialogBox = $("[header='Confirmed Reservation'] p-footer");
        let visible = this.EC.visibilityOf(dialogBox);
        browser.wait(visible, 8000);
        
        let emailTextConfirmation = $("p-dialog div p");
        let text = "Your receipt has been sent to your email.";
        var returnVal =  await emailTextConfirmation.getAttribute('innerText');
        return await returnVal.includes(text);
    }
    
    isConfirmedReservationDetailsCorrect = async(item) => {
        const divDetails = $$("app-reservation-summary div div");

        var returnVal = await divDetails.filter(function(elem, index){
            return elem.getText().then(async function(text){
                return text.trim().includes(await item);
            });
        }).first().isDisplayed();
        
        return returnVal;
    }
    
    clickCloseButton = async() => {
        let closeBtn = element(by.cssContainingText("button","Close"));
        let visible = this.EC.presenceOf(closeBtn);
        browser.wait(visible, 8000); 
        
        await closeBtn.click();
        
        let staleness = this.EC.stalenessOf(closeBtn);
        browser.wait(staleness, 8000);
    }
    

}
module.exports = PaymentPage;