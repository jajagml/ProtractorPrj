let BasePage = require('../page/BasePage');
let LoginPage = require('../page/loginPage');
let AdminPage = require('../page/AdminPage');

describe('Medium Specs', () => {

    it('Test Case 5: Add Cinema to branch', async() => {     
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const adminPage = new AdminPage();

        let uniqueNum = Math.floor(Math.random() * 30);
        let cinemaName = `Cinema ${uniqueNum}`;  


        basePage.get('http://localhost:4200/login'); 

        //1. Login Admin
        await loginPage.loginToApp("admin@admin.com","password");
        browser.sleep(1000); 

        //2. Click Admin menu
        basePage.clickAdmin();
        browser.sleep(1000);

        //3. Select Branch from dropdown
        adminPage.selectMainTainModule('Branch');
        browser.sleep(1000);

        //4. Click random Branch name link (your code should be flexible on what branch to select from the available list)
        adminPage.clickRandomBranch();

        //5. Click Add Cinema button 
        adminPage.clickAddCinema();

        //6. Specify Cinema name
        adminPage.specifyCinemaName(cinemaName);

        //7. Click Add button #RECHECK
        adminPage.clickAddCinemaButton();

        //8. VERIFY newly created cinema is displayed on Branch page 
        browser.sleep(1000);
        expect(adminPage.isNewCinemaDisplayed(cinemaName)).toBe(true);

        //9. Click View Schedules button
        adminPage.clickViewScheduleButton();

        //10. Click Add Movie Schedule button 
        adminPage.clickMovieScheduleButton();

        //11. Click Select Cinema dropdown
        adminPage.selectCinemaDropdown();

        //12. VERIFY newly created cinema is displayed on dropdown menu
        expect(adminPage.isNewCinemaDisplayedInDropdown(cinemaName)).toBe(true);     
    });    
});