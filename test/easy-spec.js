let BasePage = require('../page/BasePage');
let LoginPage = require('../page/loginPage');
let MoviesPage = require('../page/MoviesPage');
let RegisterPage =  require('../page/registerPage');
let AdminPage = require('../page/AdminPage');
let BranchesPage = require('../page/BranchesPage');


describe('Easy Specs', () => {

    it('Test Case 1: Create admin acct and verify login', () => {  
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const moviesPage = new MoviesPage();
        const registerPage = new RegisterPage();

        basePage.get('http://localhost:4200/movies');

        //1. Click Register
        basePage.clickRegister();

        //3. Email should have '@admin.com' 
        var unique = Math.floor(Math.random() * 1000);
        let email = `jaja${unique}@admin.com`;
        let password = '1234';

        //2. Specify values
        registerPage.enterEmail(email);
        registerPage.enterPassword(password);
        registerPage.enterFirstName('Jaja Admin');
        registerPage.enterMiddleName('Macalalad');
        registerPage.enterLastName('Gamilla');
        registerPage.enterBirthday('1994-10-25');
        
        //4. Click Register button
        registerPage.clickRegisterBtn();
        browser.sleep(2000);

        //5. Login to App 
        loginPage.enterEmailLogin(email);
        loginPage.enterPasswordLogin(password);
        loginPage.clickLoginBtn();
        browser.sleep(2000);
        
        //6. VERIFY Movies, Branches, Admin menu tabs are displayed 
        expect(moviesPage.verifyMenuTabs('Movies')).toBe(true);
        expect(moviesPage.verifyMenuTabs('Branches')).toBe(true);
        expect(moviesPage.verifyMenuTabs('Admin')).toBe(true);

        //7. VERIFY the registered email in the navigation bar and logout
        expect(moviesPage.verifyNavigationBars(email)).toBe(true);
        expect(moviesPage.verifyNavigationBars('Logout')).toBe(true);
    });
    
    it('Test Case 2: Create normal user and verify login', () => {
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const moviesPage = new MoviesPage();
        const registerPage = new RegisterPage();
        
        //8. Repeat steps 1-7 to create another account with different details 
        for(var i = 0; i < 2; i++)
        {             
            let uniqueNum = Math.floor(Math.random() * 1000);
            let uniqueDate = Math.floor((Math.random() * 30) + 1);   // try o set 0 to test accuracy chaaaR! #RECHECK         
            let uniqueString= Math.random().toString(36).substr(2, 5);

            //3. Email should NOT have '@admin.com', use any email 
            let email = `jaja${uniqueNum}@email.com`;
            let password = `4321${uniqueNum}`;
            let fName = `Ja${uniqueString}`;
            let mName = `Ma${uniqueString}`;
            let lName = `Ga${uniqueString}`;            
            let bDay = `1994-10-${uniqueDate}`;
            
            basePage.get('http://localhost:4200/movies');

            //1. Click Register
            basePage.clickRegister();
            browser.sleep(1000);

           //2. Specify values
            registerPage.enterEmail(email);
            registerPage.enterPassword(password);
            registerPage.enterFirstName(fName);
            registerPage.enterMiddleName(mName);
            registerPage.enterLastName(lName);
            registerPage.enterBirthday(bDay);
            browser.sleep(1000);        

            //4. Click Register button
            registerPage.clickRegisterBtn();
            browser.sleep(1000);

            //5. Login to App 
            loginPage.enterEmailLogin(email);
            loginPage.enterPasswordLogin(password);
            loginPage.clickLoginBtn();
            browser.sleep(1000);

            //6. VERIFY Movies, Branches menu tabs are displayed. Admin tab should NOT display 
            expect(moviesPage.verifyMenuTabs('Movies')).toBe(true);
            expect(moviesPage.verifyMenuTabs('Branches')).toBe(true);
            expect(moviesPage.verifyMenuTabs('Admin')).toBe(false);

            //7. VERIFY the registered email in the navigation bar and logout
            expect(moviesPage.verifyNavigationBars(email)).toBe(true);
            expect(moviesPage.verifyNavigationBars('Logout')).toBe(true);
        }        
    });

    it('Test Case 3: Negative Login Scenarios', async() => {
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        
        let emailRequireMsg = 'Email is required.';
        let passwordRequireMsg = 'Password is required.';
        let invalidEmailMsg = 'Invalid email.';

        basePage.get('http://localhost:4200/login'); 
        
        //1. No email
        loginPage.enterEmailLogin('');
        //2. No password 
        loginPage.enterPasswordLogin('');
        browser.sleep(5000);

        //3. Verify the error message 
        expect(await loginPage.verifyErrorMsgForNoEmail()).toEqual(emailRequireMsg);
        expect(await loginPage.verifyErrorMsgForNoPassword()).toEqual(passwordRequireMsg);

        //4. Verify the login button is disabled 
        expect(loginPage.isLoginButtonDisable()).toBe(true);

        //5. Input email without "@domain.com" 
        loginPage.enterEmailLogin('noDomain');
        browser.sleep(1000);

        //6. Verify the error message
        expect(await loginPage.verifyErrorMsgForEmailWithNoDomain()).toEqual(invalidEmailMsg);
    });

    it('Test Case 4: Add Branches', async() => {
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const adminPage = new AdminPage();
        const branchesPage = new BranchesPage();

        let uniqueString= Math.random().toString(36).substr(2, 5);
        let newBranches = [
            {name:`Name1${uniqueString}`, address:`#10 St, ${uniqueString} City`},
            {name:`Name2${uniqueString}`, address:`#25 St, ${uniqueString} City`}
        ]; 

        basePage.get('http://localhost:4200/login'); 

        //1. Login Admin Account 
        await loginPage.loginToApp("admin@admin.com","password");
        browser.sleep(1000); 
        
        //2. Click the Admin menu tab
        basePage.clickAdmin();
        browser.sleep(1000);

        //3. Select Branch from Maintain Module
        adminPage.selectMainTainModule('Branch');
        browser.sleep(1000);

        //4. Verify there are existing branches -- #RECHECK
        expect(adminPage.verifyExistingBranches()).toBe(true);

        //5. Add 2 new branches
        newBranches.forEach(function(item){
        adminPage.addNewBranch(item.name,item.address);
        });

        //6. Verify newly added branches in admin tab
        newBranches.forEach(function(item){
            expect(adminPage.VerifyNewBranchesInAdminTab(item.name,item.address)).toBe(true);
        });

        //7. Navigate to branches tab
        basePage.clickBranches();
        browser.sleep(1000);

        //8. Verify the newly added branches
        newBranches.forEach(function(item){
            expect(branchesPage.VerifyNewBranchesInBranchesTab(item.name,item.address)).toBe(true);
        });
    });
});