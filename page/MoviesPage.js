const { browser } = require("protractor");

class MoviesPage{
  constructor()
  {
    this.EC = protractor.ExpectedConditions;
    this.menuTabs = $$("app-main-navigation li a[routerlinkactive='active']");
    this.navigationBars = $$("app-main-navigation ul[class='navbar-nav'] li");
    this.appSeatSelected = $$("app-seat [class='seat ng-star-inserted selected'] span");       

  }

  verifyMenuTabs = (tab) => {
    var returnVal = this.menuTabs.filter(function(elem, index) {
    return elem.getText().then(function(text) {
        return text === tab;
      });
    }).isPresent();

    return returnVal;
  }
  
  verifyNavigationBars = (tab) => {
    var returnVal = this.navigationBars.filter(function(elem, index) {
      return elem.getText().then(function(text) {
          return text === tab;
        });
      }).isPresent();

    return returnVal;
  }

  verifyAddedMovieInMoviesPage = async(movie) => {
    const appMovieCard = $$("[class='movie-card']");
    
    var returnVal  = await appMovieCard.filter(function(elem, index) {
      return elem.getText().then(async function(text) {          
        if(text.trim().includes(await movie.trim())){
          return await elem;
        }
      });
    }).first().isDisplayed();

    return returnVal;

  }

  clickGetTicketButton = async(movie) => {
    browser.sleep(2000);
    const appMovieCard = $$("[class='movie-card']");
    const btn = element(by.cssContainingText("button","Get Ticket"));

    var filteredElem = await appMovieCard.filter(function(elem, index) {
      return elem.getText().then(async function(text) {          
        if(text.trim().includes(await movie.trim())){
          return await elem.element(by.cssContainingText("button","Get Ticket"));
        }
      });
    }).first();

    await filteredElem.click();
  }


  // Select Branch in Movies Page
  selectBranch = async(branch)  => {

    let matSelectBranch = $("[formcontrolname='branchId']");
    let matOptions = $$("[class='cdk-overlay-pane'] mat-option span");

    let clickable = this.EC.elementToBeClickable(matSelectBranch);
    browser.wait(await clickable, 10000,'Select Branch filed is not clickable');    

    browser.executeScript('arguments[0].scrollIntoView()', matSelectBranch);  
    matSelectBranch.click();

    await element(by.cssContainingText('mat-option span', branch)).click();

    let staleness = this.EC.stalenessOf(matOptions.first());
    browser.wait(await staleness, 10000,'Branch options is still visible');    
  }

  // Select Cinema in Movies Page
  selectCinema = async(cinema)  => {
    let matSelectCinema = $("[formcontrolname='cinemaId']");
    let matOptions = $$("[class='cdk-overlay-pane'] mat-option span");

    let clickable = this.EC.elementToBeClickable(matSelectCinema);
    browser.wait(await clickable, 10000,'Select Cinema filed is not visible');

    browser.executeScript('arguments[0].scrollIntoView()', matSelectCinema);  
    matSelectCinema.click();

    await element(by.cssContainingText('mat-option span', cinema)).click();
    
    let staleness = this.EC.stalenessOf(matOptions.first());
    browser.wait(await staleness, 10000,'Cinema options is still visible'); 
  }

  // Select Date in Movies Page
  selectDate = async(date)  => {
    let matSelectDate = $("[formcontrolname='watchDate']");
    let matOptions = $$("[class='cdk-overlay-pane'] mat-option span");

    let clickable = this.EC.elementToBeClickable(matSelectDate);
    browser.wait(await clickable, 10000,'Select Date filed is not visible');

    browser.executeScript('arguments[0].scrollIntoView()',matSelectDate);

    await matSelectDate.sendKeys(date);

    let staleness = this.EC.stalenessOf(matOptions.first());
    browser.wait(await staleness, 10000,'Date options is still visible'); 
  }

  // Select Time in Movies Page
  selectTime = async(time)  => {
    let matSelectTime = $("[formcontrolname='scheduleId']");;
    let matOptions = $$("[class='cdk-overlay-pane'] mat-option span");

    let clickable = this.EC.elementToBeClickable(matSelectTime);
    browser.wait(await clickable, 10000,'Select Time filed is not visible');

    browser.executeScript('arguments[0].scrollIntoView()',matSelectTime);

    browser.sleep(1500);
    matSelectTime.click();
    browser.sleep(500);

    await matOptions.filter(function(elem, index) {
      return elem.getText().then(async function(text) {          
        if(text.trim().includes(await time.toLowerCase())){
          return await elem;
        }
      });
    }).first().click();

    let staleness = this.EC.stalenessOf(matOptions.first());
    browser.wait(await staleness, 10000,'Time options is still visible'); 

  }

  // Reserve seat
  reserveSeat = async(num) => {
    const appSeat = $$(".seat-plan app-seat [class='seat ng-star-inserted']");
    let visible = this.EC.visibilityOf(await appSeat.first());
    browser.wait(visible, 8000);

    await appSeat.filter(function(option, index) {
      return index < num;
    }).each(function(option) {
      option.click();
    });
  }

  getSeatText = async() => {     
    browser.sleep(1000);
    var count = await this.appSeatSelected.count().then(function(num){
      return num;
    });

    var seatText = [];
    for(var j = 0; j < count; j++)
    {
      seatText.push(await this.appSeatSelected.get(j).getText());
    }

    return seatText.join(", ");
  }

  clickConfirmReservation = async() => {
    let confirmReservationBtn = element(by.cssContainingText("button","Confirm Reservation"));
    let visible = this.EC.visibilityOf(await confirmReservationBtn);
    browser.wait(visible, 8000,'Confirm Reservation is not visible');

    await confirmReservationBtn.click();
  } 


  isTicketSummaryDialogBoxDisplay = async() => {

    const dialogBox = $("[role='dialog']");

    let visible = this.EC.visibilityOf(dialogBox);
    browser.wait(await visible, 3000);  

    dialogBox.click();
    return await dialogBox.isDisplayed();
  }

  isTicketSummaryDetailsCorrect = async(item) => {
    browser.sleep(1000);
    const divDetails = $$("app-reservation-summary div div");
    
    var returnVal = await divDetails.filter(function(elem, index){
      return elem.getText().then(async function(text){
          return text.trim().includes(await item);
      });
    }).first().isDisplayed();
    return await returnVal;
  }

  proceedToPayment = async() => {
    const proceedToPaymentBtn = element(by.cssContainingText("button","Proceed to Payment"));
    let visible = this.EC.visibilityOf(await proceedToPaymentBtn);
    browser.wait(visible, 8000);  

    await proceedToPaymentBtn.click();

    let staleness = this.EC.stalenessOf(proceedToPaymentBtn);
    browser.wait(await staleness, 10000,'Proceed to Payment button is still visible'); 
  }

  isThereAMovieExist = async() => {
    const appMovieCard = $("[class='movie-card']");
    let visible = this.EC.visibilityOf(appMovieCard);
    browser.wait(visible, 8000);      

    return await appMovieCard.isDisplayed();
  }

  getSeatReserved = async(combinedSeat) => {     
    const appSeatReserved = $$("app-seat [class='seat ng-star-inserted taken'] span");

    var count = await appSeatReserved.count().then(function(num){
      return num;
    });

    var seatText = [];
    for(var j = 0; j < count; j++)
    {
      seatText.push(await appSeatReserved.get(j).getText());
    }
    var returnVal = seatText.join(", ");

    return returnVal.includes(combinedSeat);
  }

}
module.exports = MoviesPage;
