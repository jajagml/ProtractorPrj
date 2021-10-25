class AdminPage {
    constructor()
    {
        this.EC = protractor.ExpectedConditions;
        this.maintainModule = $(".form-control");
        this.maintainModuleOptions = $$(".form-control option");
        this.branchCards = $$("app-branch-card");
        this.addBranchBtn = element(by.cssContainingText("button","Add Branch"));
        this.branchNameInput = $("app-branch-add [formcontrolname='name']");
        this.branchAddressTextArea = $("app-branch-add [formcontrolname='address']");
        this.branchAddBtn = $("app-branch-add [type='submit']");
        this.branchNameList = $$("app-branch-card .text-center a");
        this.branchAddressList = $$("app-branch-card .text-center p");
        this.branchImgLink = $$("app-branch-card div img");
        this.addCinemaBtn = element(by.cssContainingText("button","Add Cinema"));
        this.cinemaNameInput = $("app-cinema-add [formcontrolname='name']");
        this.cinemaAddBtn = element(by.cssContainingText("button","Add"));
        this.cinemaList = $$("app-cinema-list a");
        this.viewScheduleBtn = $("app-branch-edit [class='btn btn-outline-info mr-2']");
        this.addMovieSchedBtn = $("app-schedule-list [class='btn btn-outline-primary mr-3']");
        this.cinemaDropdown = $("app-schedule-add [name='cinema']");
        this.cinemaOptionDropdown = $$("app-schedule-add select[name='cinema'] option");
        this.rowInput = $("app-seat-plan [name='rows']");
        this.columnInput = $("app-seat-plan [name='columns']");
        this.updateBtn = $("app-cinema-edit [class='btn btn-primary']");
        this.screenDiv = $("app-seat-plan [class='col-md-7 screen']");
        this.appSeat = $$("app-seat > div");
        this.cinemaNameEdit = $("app-cinema-edit [formcontrolname='name']");
        this.appSeatDisabled = $$("app-seat [class='seat disabled']");
        this.viewSchedulesBtn = element(by.cssContainingText("button","View Schedules"));
        this.addMovieScheduleBtn = element(by.cssContainingText("button","Add Movie Schedule"));
        this.movieOptionDropDown = $$("app-schedule-add [name='movie'] option");
        this.startDateInput = $("app-schedule-add [name='startDate']");
        this.hourInput = $("app-schedule-add [placeholder='HH']");
        this.minuteInput = $("app-schedule-add [placeholder='MM']");
        this.ticketPriceInput = $("app-schedule-add [name='ticketPrice']");
        this.addScheduleBtn = element(by.cssContainingText("button","Add"));
        this.cinemaOptionDropdownInSchedule = $$("app-schedule-list select[name='cinema'] option");
        this.schedList = $("app-schedule-list");
        this.itemPageInSchedule = $$("app-schedule-list select[name='itemsPerPage'] option");
        this.movieSchedule = $$("app-schedule-card p");
        this.movieName = $$("app-schedule-card h6");
        this.branchNameInSchedAdd = $("app-schedule-add form h5");
        this.branchNameEdit = $("app-branch-edit [formcontrolname='name']");

        this.paymentTable = $("app-payment-list tbody");
        this.paymentTableTr = $$("app-payment-list tbody tr");
    }

    selectMainTainModule = async (option) => {
        await this.maintainModuleOptions.each(function(elem, index) {
            elem.getText().then(function(text) {
                if(text.includes(option))
                {
                    elem.click();
                }
            });
        });
    }

    verifyExistingBranches = async () => {        
        return await this.branchCards.count() > 0;        
    }

    addNewBranch = (name, address) =>{
        this.addBranchBtn.click();
        this.branchNameInput.sendKeys(name);
        this.branchAddressTextArea.sendKeys(address);
        this.branchAddBtn.click();
        browser.sleep(1000);
    }

    VerifyNewBranchesInAdminTab = (name, address) => {

        var isNameExist = this.branchNameList.filter(function(elem, index){
            return elem.getText().then(function(text) {
                return text === name;
              });
       }).isPresent();

       var isAddressExist = this.branchAddressList.filter(function(elem, index){
        return elem.getText().then(function(text) {
            return text === address;
          });
        }).isPresent();

        return isNameExist && isAddressExist;        
    }

    clickRandomBranch = () => {

        let randomNum = this.branchImgLink.count().then(function(num){
            return Math.floor(Math.random() * num);
        });

        this.branchImgLink.get(randomNum).click();
    }

    clickAddCinema = () => {
        this.addCinemaBtn.click();
    }

    specifyCinemaName = (cinema) => {
        this.cinemaNameInput.sendKeys(cinema);
    }

    clickAddCinemaButton = () =>{
        this.cinemaAddBtn.click();
    }

    isNewCinemaDisplayed = (cinema) => {
        
        var returnVal = this.cinemaList.filter(function(elem, index){
            return elem.getAttribute('innerText').then(function(text){
                return text === cinema;
            });
        }).first().isDisplayed();

        return returnVal;
    }

    clickViewScheduleButton = () => {
        this.viewScheduleBtn.click();
    }

    clickMovieScheduleButton = () => {
        this.addMovieSchedBtn.click();
    }

    selectCinemaDropdown = () => {
         this.cinemaDropdown.click();
    }

    chooseCinema = async(cinema) => {
        await this.cinemaOptionDropdown.each(function(elem, index) {
            elem.getText().then(function(text) {
                if(text.includes(cinema))
                {
                    elem.click();
                }
            });
        });
    }

    isNewCinemaDisplayedInDropdown = async(cinema) => {
        this.chooseCinema(cinema);
        var returnVal = await this.cinemaDropdown.getText();
        return returnVal.includes(cinema);
    }
   
    VerifyIfCinemaExistIfNoneThenCreate = async(cinema) => {
    
        browser.sleep(1000);
        var returnVal = await this.cinemaList.count().then(async function(prom){
            return prom;
        });
        
        if(returnVal === 0)
        {
            this.addCinemaBtn.click();
            this.cinemaNameInput.sendKeys(cinema);
            this.cinemaAddBtn.click();                
        }
    }

    ClickRandomCinema = async() => {
        browser.sleep(1000);
        let randomNum = await this.cinemaList.count().then(function(num){
            return Math.floor(Math.random() * num);
        });

        await this.cinemaList.get(randomNum).click();
    }

    ClickExistingCinema = async() => {
        browser.sleep(1000);
        await this.cinemaList.first().click();
    }

    setRowAndColumn = (rowNum, colNum) => {
        browser.sleep(1000);
        this.rowInput.clear();
        this.rowInput.sendKeys(rowNum);
        this.columnInput.clear();
        this.columnInput.sendKeys(colNum);
        this.screenDiv.click();
        browser.sleep(1000);
        
        //clicker
        var index = 0;
        for(var i = 1; i <= rowNum; i++)
        {
            for(var j = 7; j >= i; j--)
            {
             this.appSeat.get(index).click();
             index++;
            }
            for(var k = 1; k <= 4+(i*2); k++)
            {
              // skip
              index++; 
            }
            for(var l = 7; l >= i; l--)
            {
                this.appSeat.get(index).click();
                index++;
            }
        }
        browser.sleep(1000);
    }

    getCinemaName = () => {
        return this.cinemaNameEdit.getAttribute('value').then(function(elem){
            return elem;
        });

    }

    getMovieName = (movie) => {
        return this.movieOptionDropDown.get(movie).getText();
    }

    clickUpdateButton = () => {
        this.updateBtn.click();
    }

    clickSpecificCinema = (cinema) => {
        browser.sleep(1000);        
        this.cinemaList.filter(function(elem, index){
            return elem.getText().then(function(text) {
                return text === cinema;
            });
        }).click();
    }

    getSeatClass = async() => {
        var index = 0;
        var toVerify = [];
        for(var i = 1; i <= 5; i++)
        {
            for(var j = 7; j >= i; j--)
            {
                toVerify.push(await this.appSeat.get(index).getAttribute('class'));
                index++;
            }
            for(var k = 1; k <= 4+(i*2); k++)
            {
              // skip
                toVerify.push(await this.appSeat.get(index).getAttribute('class'));
                index++; 
            }
            for(var l = 7; l >= i; l--)
            {
                toVerify.push(await this.appSeat.get(index).getAttribute('class'));
                index++;
            }
        }
        return toVerify;
    }

    verifyCountOfDisableSeat = () => {
        return this.appSeatDisabled.count();        
    }

    verifyTextOfDisableSeat = () => {
        return this.appSeatDisabled.getText();
    }

    VerifyIfThreeCinemaExistIfLessThanThreeThenCreate = async() => {

        browser.sleep(1000);
        var returnVal = await this.cinemaList.count().then(async function(num){
            return await num;
        });
        
        var numToAdd = 3 - returnVal;

        if(!numToAdd == 0)
        {
            for(let i = 1; i<=numToAdd; i++){  
                let uniqueNum = Math.floor(Math.random() * 30);
                let cinemaName = `Cinema ${uniqueNum}`; 

                this.addCinemaBtn.click();
                await this.cinemaNameInput.sendKeys(cinemaName);
                await this.cinemaAddBtn.click();
                browser.sleep(1000);                
            }
        }
    }

    clickViewSchedulesButton = async() => {
        browser.sleep(1000);
        await this.viewSchedulesBtn.click();
    }


    clickAddMovieSchedule = async() => {
        await this.addMovieScheduleBtn.click();
    }

    populateCinema = async(cinema) => {
        await this.cinemaOptionDropdown.get(cinema).click();
    }

    populateMovie = async(movie) => {
        await this.movieOptionDropDown.get(movie).click();
    }

    populateDate = async(date) => {
        await this.startDateInput.sendKeys(date);
    }

    populateTime = async(hr, min) => {
        await this.hourInput.clear();
        await this.hourInput.sendKeys(hr);
        await this.minuteInput.clear();
        await this.minuteInput.sendKeys(min);        
    }

    populatePrice = async(price) => {
        await this.ticketPriceInput.clear();
        await this.ticketPriceInput.sendKeys(price);        
    }

    getScheduleDetails = async (item) => {
        
        var schedDetails = {branch:null, cinema:null, movie:null, startDate:null, time:null, ticketPrice:null};
    
        schedDetails.branch = await this.branchNameInSchedAdd.getText();
        schedDetails.cinema = await this.cinemaOptionDropdown.get(item.cinema).getText();
        schedDetails.movie = await this.movieOptionDropDown.get(item.movie).getText();
        schedDetails.startDate = item.startDate;
    
        var timeIndicator = 'PM';
        if(item.hour === '11')
        {
            timeIndicator = 'AM';
        }

        schedDetails.time = `${item.hour}:${item.minute} ${timeIndicator}`;
        schedDetails.ticketPrice = `${item.ticketPrice}`;

        return schedDetails;
    }

    clickAddSchedule = async () => {
        await this.addScheduleBtn.click();
    }

    isNewlyCreatedMovieScheduleDisplay = async(item, movie) => {
   
        await this.cinemaOptionDropdownInSchedule.get(item.cinema).click();
        await this.itemPageInSchedule.last().click();
        this.schedList.click();

        var returnVal2 = this.movieSchedule.filter(function(elem, index){
            return elem.getText().then(function(text){
                return text.includes(`${item.startDate} ${item.hour}:${item.minute}`);
            });
        }).first().isDisplayed();

        var returnVal1 = this.movieName.filter(function(elem, index){
            return elem.getText().then(function(text){
                return text.includes(movie.trim());
            });
        }).first().isDisplayed();

        return returnVal1 && returnVal2;
    }

    updateSeatPlan = (rowNum,colNum) => {

        browser.sleep(1000);
        this.rowInput.clear();
        this.rowInput.sendKeys(rowNum);
        this.columnInput.clear();
        this.columnInput.sendKeys(colNum);
        this.screenDiv.click();
        browser.sleep(1000);
        
    }

    clickDateTime = async(desc) => {
        browser.sleep(4000);
        await this.paymentTableTr.filter((elem) => {
            return elem.$$("td").get(1).getText().then(async(text)=> {
                return await text.includes(await desc.trim());
            });
        }).$$("a").click();

        let invisible = this.EC.invisibilityOf(this.paymentTable);
        browser.wait(await invisible, 8000,'Table is still visible');


    }

    isUserDisplayCorrect = async(user) => {
        const userElem = $("app-payment-detail div:nth-child(2) span");
        let visible = this.EC.visibilityOf(userElem);
        browser.wait(await visible, 8000,'element for user is not found');       

        var returnVal =  await userElem.getAttribute('innerText');
        return await returnVal.includes(await user);
    }

    isDescriptionDisplayCorrect = async(desc) => {
        const descElem = $("app-payment-detail div:nth-child(3) span");
        let visible = this.EC.visibilityOf(descElem);
        browser.wait(await visible, 8000,'element for description is not found');       

        var returnVal =  await descElem.getAttribute('innerText');
        return await returnVal.includes(await desc);
    }

    isCardHolderNameDisplayCorrect = async(cName) => {
        const nameElem = $("app-payment-detail div:nth-child(4) span");
        let visible = this.EC.visibilityOf(nameElem);
        browser.wait(await visible, 8000,'element for card holder is not found');       

        var returnVal =  await nameElem.getAttribute('innerText');
        return await returnVal.includes(await cName);
    }

    isAmountDisplayCorrect = async(amount) => {
        const amountElem = $("app-payment-detail div:nth-child(5) span");
        let visible = this.EC.visibilityOf(amountElem);
        browser.wait(await visible, 8000,'element for amount is not found');       

        var returnVal =  await amountElem.getAttribute('innerText');
        return await returnVal.includes(await amount);
    }

    navigateBackToScheduleTable = () => {     
        let backToList = element(by.cssContainingText("app-payment-detail a","Back to list"));
        backToList.click();

        let invisible = this.EC.invisibilityOf(backToList);
        browser.wait(invisible, 8000,'Back To List is still visible');       
    }

    getBranchName = async() => {
        return await this.branchNameEdit.getAttribute('value');
    }

    clickSpecificBranch = async(name) => {

    await this.branchNameList.filter(function(elem, index){
        return elem.getText().then(async function(text) {
            return await text === await name;
        });
    }).click();

    }

}
module.exports = AdminPage;