
// For consistency only
// will edit this soon -> Ask proctor
// For Navigation only

class BasePage {
    constructor()
    {
        this.EC = protractor.ExpectedConditions; 
        this.registerTab = $("a[href='/register']");

        this.adminTab = $("a[href='/admin']");
        this.branchesTab = $("a[href='/branches']");
        this.moviesTab = $("a[href='/movies']");
    }

    get = (url) => {
        browser.get(url);
    }
    
    clickRegister = () => {
        this.registerTab.click();
    }

    clickLogout = async() => {
        let logoutTab = element(by.cssContainingText("app-main-navigation li","Logout"));
        let visible = this.EC.visibilityOf(logoutTab);
        browser.wait(await visible, 8000);   
        browser.executeScript('arguments[0].scrollIntoView()', logoutTab); 
        logoutTab.click();
    }

    clickAdmin = () => {
        this.adminTab.click();
        browser.sleep(1000);        
    }

    clickBranches = () => {
        this.branchesTab.click();
    }

    getUrl = async() => {
        return await browser.getCurrentUrl();
    }

    clickMovies = async() => {
        await this.moviesTab.click();
        browser.sleep(1000); 
    }
}

module.exports = BasePage;