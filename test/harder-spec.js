let BasePage = require('../page/BasePage');
let LoginPage = require('../page/loginPage');
let AdminPage = require('../page/AdminPage');
let MoviesPage = require('../page/MoviesPage');
let PaymentPage = require('../page/PaymentPage');
let TestData = require('../dataHelpers/TestData');
const { browser } = require('protractor');

describe('Harder Specs', () => {

    it('Test Case 6: Manage Cinema Seat Plan', async() => {
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const adminPage = new AdminPage();
        const testData = new TestData();         
        
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

        //4. Click random Branch name link 
        adminPage.clickRandomBranch();

        //5. Verify if there is/are a cinema/s existing under Cinemas. If no cinema name is existing, click Add Cinema, fill out name, and click Add, else proceed to next step 
        var url = await basePage.getUrl(); // -> will be use for step 9
        let newCinema = testData.generateCinemaName();
        adminPage.VerifyIfCinemaExistIfNoneThenCreate(newCinema); //-> newCinema will only be used if there's no exsiting cinema

        //6. Click random Cinema name link under Cinemas
        await adminPage.ClickRandomCinema();

        //7. Set rows and columns following below order, Enable / Disable seats accordingly (5 row and 20 columns)  
        adminPage.setRowAndColumn(5,20);

        //8. Click Update button
        let cinemaName = await adminPage.getCinemaName(); //-> for step 10
        adminPage.clickUpdateButton();
        browser.sleep(1000);

        //9. VERIFY if user is navigated back to branch page 
        expect(basePage.getUrl()).toBe(url);

        //10. Click the updated cinema link
        adminPage.clickSpecificCinema(cinemaName);
        browser.sleep(1000);

        //11. Verify the 1st added cinema seating arrangement should be same as created
        var seat = await adminPage.getSeatClass();
        var index = 0;
        for(var i = 1; i <= 5; i++)
        {
            for(var j = 7; j >= i; j--)
            {
                expect(seat[index]).toBe('seat disabled');
                index++;
            }
            for(var k = 1; k <= 4+(i*2); k++)
            {
                expect(seat[index]).toBe('seat');
                index++;
            }
            for(var l = 7; l >= i; l--)
            {
                expect(seat[index]).toBe('seat disabled');
                index++;
            }
        }

        //a. Verify the count of disabled seat
        expect(adminPage.verifyCountOfDisableSeat()).toBe(50);

        //b. Verify each disabled seats text 
        var text = await adminPage.verifyTextOfDisableSeat();
        text.forEach(function(item){
            expect(item).toBe('');
        });

    });
    
    it('Test Case 7: Add Movie Schedule', async() => {    
       // browser.waitForAngularEnabled(true);
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const adminPage = new AdminPage();
        const moviesPage = new MoviesPage();
        const testData = new TestData(); 
        
        //12. Repeat steps 6-11 adding two more movies (total 3 movies), with details varying between the three as specified below: 
        var sched = testData.generatedDataForSchedule();

        basePage.get('http://localhost:4200/login'); 

        //1. Login Admin
        await loginPage.loginToApp("admin@admin.com","password");
        browser.sleep(3000);   

        //2. Click Admin menu
        basePage.clickAdmin();
        browser.sleep(1000);

        //3. Select Branch from dropdown
        adminPage.selectMainTainModule('Branch');
        browser.sleep(1000);
        
        //4. Click random Branch name link 
        adminPage.clickRandomBranch();
        var branchName = await adminPage.getBranchName();
        
        //5. Check if there are at least three existing cinemas under Cinemas. If not, click Add Cinema, fill out name, and click Add until there are three cinemas available. 
        await adminPage.VerifyIfThreeCinemaExistIfLessThanThreeThenCreate();

        //6. Click View Schedules button
        adminPage.clickViewSchedulesButton();
        var url = await basePage.getUrl(); // -> will be use for step 11

        for(let a = 0; a < sched.length; a++)
        {
            //7. Click Add Movie Schedule 
            await adminPage.clickAddMovieSchedule();
            browser.sleep(1000);

            //8. Populate following fields (check step 12 for details)
            //await adminPage.populateDetailsForAddSchedule(schedule[a]);
            await adminPage.populateCinema(sched[a].cinema);        
            //b. Movie
            await adminPage.populateMovie(sched[a].movie);
            //c. Date
            await adminPage.populateDate(sched[a].startDate);
            //d. Time
            await adminPage.populateTime(sched[a].hour,sched[a].minute);
            //e. Price
            await adminPage.populatePrice(sched[a].ticketPrice);

            var movieName = await adminPage.getMovieName(sched[a].movie); // -> use for step 10 and step 14
            //9. Click Add button  
            await adminPage.clickAddSchedule();
            browser.sleep(500);

            //10. VERIFY the newly created movie schedule is displayed (You can select specific cinema from the dropdown to ensure the right cinema is used) 
            expect(await adminPage.isNewlyCreatedMovieScheduleDisplay(sched[a], movieName)).toBe(true);
            browser.sleep(1000);

            //11. VERIFY if user is navigated back to Schedule Page 
            expect(await basePage.getUrl()).toBe(url);

            //13. Navigate to Movies Tab 
            await basePage.clickMovies();

            //14. VERIFY that the Movie Titles where schedules are added for from previous steps are displayed. 
            expect(await moviesPage.verifyAddedMovieInMoviesPage(movieName)).toBe(true);

            //to go back
            basePage.clickAdmin();
            browser.sleep(1000);
            await adminPage.selectMainTainModule('Branch');
            browser.sleep(1000);            
            await adminPage.clickSpecificBranch(branchName);
            browser.sleep(3000); 
            await adminPage.clickViewSchedulesButton();
        }
    });

    it('Test Case 9: Admin and 1 Customer Reservation', async() => { 
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const adminPage = new AdminPage(); 
        const moviesPage = new MoviesPage();
        const paymentPage = new PaymentPage();
        const testData = new TestData();

        var sched = testData.generateSingleSchedule();
        var payment = testData.paymentDetails();

        basePage.get('http://localhost:4200/login'); 

        //1. Login Admin
        await loginPage.loginToApp("admin@admin.com","password");
        browser.sleep(1000);        

        //2. Click Admin menu 
        basePage.clickAdmin();
        browser.sleep(1000);

        //3. Select Branch from dropdown
        await adminPage.selectMainTainModule('Branch');
        browser.sleep(1000);

        //4. Click random Branch name link 
        adminPage.clickRandomBranch();
        
        //5. Verify if there a cinema existing under Cinemas. If no cinema name is existing, click Add Cinema, fill out name, and click Add, else proceed to next step
        let newCinema = testData.generateCinemaName();
        adminPage.VerifyIfCinemaExistIfNoneThenCreate(newCinema); //-> newCinema will only be used if there's no exsiting cinema

        //6. Click an existing cinema. Input 5 on rows, 20 on columns, and click Update
        await adminPage.ClickExistingCinema();
        adminPage.updateSeatPlan(5,20);
        adminPage.clickUpdateButton();

        //7. Click View Schedules button
        adminPage.clickViewSchedulesButton(); 

        //8. Click Add Movie Schedule 
        await adminPage.clickAddMovieSchedule();
        browser.sleep(1000);        

        //9. Populate following fields      
        //a. Cinema (the one from step 6)
        await adminPage.populateCinema(sched.cinema);        
        //b. Movie
        await adminPage.populateMovie(sched.movie);
        //c. Date
        await adminPage.populateDate(sched.startDate);
        //d. Time
        await adminPage.populateTime(sched.hour,sched.minute);
        //e. Price
        await adminPage.populatePrice(sched.ticketPrice);

        var details = await adminPage.getScheduleDetails(sched); //-> for step 13 

        //10. Click Add button
        await adminPage.clickAddSchedule();
        browser.sleep(500);

        //11. Navigate to Movies Tab
        await basePage.clickMovies(); 

        //12. Click "Get Ticket" for the movie schedule created from step 9

        var url = await basePage.getUrl(); //-> for step 34

        await moviesPage.clickGetTicketButton(details.movie);
        
        //13. Select the branch and cinema (selected from previous steps) 
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);
        
        //14. Choose date and time (from step) 
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //15. Reserve 10 seats and confirm reservation 
        await moviesPage.reserveSeat(10);
        var seatsAdmin = await moviesPage.getSeatText();
        await moviesPage.clickConfirmReservation();
        
        //16. Proceed to payment 
        await moviesPage.proceedToPayment();
        browser.sleep(3000);
        
        //17. Input Cardholder name, credit card no., cvv and expiry 
        await paymentPage.inputCardHolderName(payment[0].name);
        await paymentPage.inputCreditCardNumber(payment[0].cardNumber);
        await paymentPage.inputCVV(payment[0].cvv);
        await paymentPage.inputExpiryDate(payment[0].expiryDate);

        //18. Proceed  to payment 
        await paymentPage.clickProceed();
        await paymentPage.waitForCloseDialogBox();
        
        //19. Close the Confirmed Reservation
        await paymentPage.clickCloseButton();

        //20. Logout Admin
        await basePage.clickLogout();
        browser.sleep(1000);

        //21. Login Customer Account (user the pre-existing user account 1
        await loginPage.loginToApp("user@user.com","password");
        browser.sleep(1000);

        //22. Verify there is/are existing movie/s in the Movies Tab
        expect(await moviesPage.isThereAMovieExist()).toBe(true);
        browser.sleep(1000);

        //23. Click "Get Ticket" for the same movie schedule created from step 9
        await moviesPage.clickGetTicketButton(details.movie);

        //24. Select the branch and cinema  (from schedule created on step 9) 
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);

        //25. Choose date and time (from schedule created on step 9)
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //26. Reserve 9 available seats and confirm reservation
        await moviesPage.reserveSeat(9);
        var seatsCustomer = await moviesPage.getSeatText();
        await moviesPage.clickConfirmReservation();
        browser.sleep(1000);

        //27. Verify the ff details from reservation should be displayed
        //a. Ticket Summary dialog box with Ticket Summary text is displayed 
        expect(await moviesPage.isTicketSummaryDialogBoxDisplay()).toBe(true);
        browser.sleep(3000);
        //b. Branch name
        expect(await moviesPage.isTicketSummaryDetailsCorrect(details.branch)).toBe(true);
        //c. Cinema name
        expect(await moviesPage.isTicketSummaryDetailsCorrect(details.cinema.trim())).toBe(true);
        //d. Movie name
        expect(await moviesPage.isTicketSummaryDetailsCorrect(details.movie.trim())).toBe(true);
        //e. Date
        var schedDate = testData.ticketSummaryDateFormat(details.startDate);
        expect(await moviesPage.isTicketSummaryDetailsCorrect(schedDate)).toBe(true);
        //f. Time
        expect(await moviesPage.isTicketSummaryDetailsCorrect(details.time)).toBe(true);
        //g. Price 
        expect(await moviesPage.isTicketSummaryDetailsCorrect(details.ticketPrice)).toBe(true);
        //h. Seats selected 
        expect(await moviesPage.isTicketSummaryDetailsCorrect(seatsCustomer)).toBe(true);

        //28. Proceed to payment 
        await moviesPage.proceedToPayment();        

        //29. Verify payment summary details are correct base from the previous inputs (description and total amount)
        //b. Branch name
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.branch)).toBe(true);
        //c. Cinema name
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.cinema)).toBe(true);
        //d. Movie name
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.movie.trim())).toBe(true);
        //e. Date
        var paymentDate = testData.paymentDateFormat(details.startDate);
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(paymentDate)).toBe(true);
        //f. Time
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.time.toLowerCase())).toBe(true);
        //h. Seats selected 
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(seatsCustomer)).toBe(true);
        //Total Amount
        var paymentTotal = testData.paymentPriceFormat(details.ticketPrice * 9);
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(paymentTotal)).toBe(true);

        //30. Input Cardholder name, credit card no., cvv and expiry 
        await paymentPage.inputCardHolderName(payment[1].name);
        await paymentPage.inputCreditCardNumber(payment[1].cardNumber);
        await paymentPage.inputCVV(payment[1].cvv);
        await paymentPage.inputExpiryDate(payment[1].expiryDate);        
        
        //31. Proceed  to payment 
        await paymentPage.clickProceed();
        await paymentPage.waitForCloseDialogBox();

        //32. Verify the ff details from reservation should be displayed
        //a. Confirmed Reservation dialog box with text "Your receipt has been sent to your email."
        expect(await paymentPage.isEmailConfirmationDisplayInDialogBox()).toBe(true);
        //b. Branch name
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.branch)).toBe(true);
        //c. Cinema name
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.cinema.trim())).toBe(true);
        //d. Movie title
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.movie.trim())).toBe(true); 
        //e. Date
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(schedDate)).toBe(true);
        //f. Time
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.time)).toBe(true);
        //g. Price
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.ticketPrice)).toBe(true);
        //h. Seats selected
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(seatsCustomer)).toBe(true);
        //i. # of seats 
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(9)).toBe(true);
        //j. Total
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.ticketPrice * 9)).toBe(true);

        //33. Close the Confirmed Reservation
        await paymentPage.clickCloseButton();        
        
        //34. Verify the customer should navigated to Movies tab
        browser.sleep(1000);
        expect(await basePage.getUrl()).toBe(url);
        browser.sleep(1000);
        
        //35. Click "Get Ticket" for the movie schedule created from step 9 
        await moviesPage.clickGetTicketButton(details.movie);

        //36. Select the same branch, cinema, date, and time from the previous steps 
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //37. Verify the 9 and 10 seats selected from steps 26 and 15 are already reserved
        browser.sleep(3000);
        var seats = [seatsAdmin,seatsCustomer];
        var combinedSeats = testData.combineAllSeats(seats);
        expect(await moviesPage.getSeatReserved(combinedSeats)).toBe(true);
        browser.sleep(3000);
    });

    it('Test Case 10: Admin and Two Customers Reservation', async() => {
        const basePage = new BasePage();
        const loginPage = new LoginPage();
        const adminPage = new AdminPage(); 
        const moviesPage = new MoviesPage();
        const paymentPage = new PaymentPage();
        const testData = new TestData();

        var sched = testData.generateSingleSchedule();
        var payment = testData.paymentDetails();
        var user = testData.getUsers();
        var amountTotal = testData.getTotal(sched.ticketPrice);
        var cName = testData.getCardName();

        basePage.get('http://localhost:4200/login'); 

        //1. Login Admin
        await loginPage.loginToApp("admin@admin.com","password");
        browser.sleep(1000);        

        //2. Click Admin menu 
        basePage.clickAdmin();
        browser.sleep(1000);

        //3. Select Branch from dropdown
        await adminPage.selectMainTainModule('Branch');
        browser.sleep(1000);

        //4. Click random Branch name link 
        adminPage.clickRandomBranch();
        
        //5. Verify if there a cinema existing under Cinemas. If no cinema name is existing, click Add Cinema, fill out name, and click Add, else proceed to next step
        let newCinema = testData.generateCinemaName();
        adminPage.VerifyIfCinemaExistIfNoneThenCreate(newCinema); //-> newCinema will only be used if there's no exsiting cinema

        //6. Click an existing cinema. Input 5 on rows, 20 on columns, and click Update
        await adminPage.ClickExistingCinema();
        adminPage.updateSeatPlan(5,20);
        adminPage.clickUpdateButton();

        //7. Click View Schedules button
        adminPage.clickViewSchedulesButton(); 

        //8. Click Add Movie Schedule 
        await adminPage.clickAddMovieSchedule();
        browser.sleep(1000);        

        //9. Populate following fields      
        //a. Cinema (the one from step 6)
        await adminPage.populateCinema(sched.cinema);        
        //b. Movie
        await adminPage.populateMovie(sched.movie);
        //c. Date
        await adminPage.populateDate(sched.startDate);
        //d. Time
        await adminPage.populateTime(sched.hour,sched.minute);
        //e. Price
        await adminPage.populatePrice(sched.ticketPrice);

        var details = await adminPage.getScheduleDetails(sched); //-> for step 13 

        //10. Click Add button
        await adminPage.clickAddSchedule();
        //browser.sleep(500);

        //11. Navigate to Movies Tab
        await basePage.clickMovies();
        browser.sleep(3000); 

        //12. Click "Get Ticket" for the movie schedule created from step 9
        await moviesPage.clickGetTicketButton(details.movie);

        //13. Select the branch and cinema (selected from previous steps) 
        browser.sleep(3000);
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);
        
        // //14. Choose date and time (from step) 
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //15. Reserve 10 seats and confirm reservation 
        await moviesPage.reserveSeat(10);
        var seatsAdmin = await moviesPage.getSeatText();
        await moviesPage.clickConfirmReservation();
        
        // //16. Proceed to payment 
        await moviesPage.proceedToPayment();
        
        //17. Input Cardholder name, credit card no., cvv and expiry 
        await paymentPage.inputCardHolderName(payment[0].name);
        await paymentPage.inputCreditCardNumber(payment[0].cardNumber);
        await paymentPage.inputCVV(payment[0].cvv);
        await paymentPage.inputExpiryDate(payment[0].expiryDate);

        //18. Proceed  to payment 
        await paymentPage.clickProceed();
        await paymentPage.waitForCloseDialogBox();
        
        //19. Close the Confirmed Reservation
        await paymentPage.clickCloseButton();

        //20. Logout Admin
        await basePage.clickLogout();
        browser.sleep(1000);
        
        //21. Login Customer Account (user the pre-existing user account 1
        await loginPage.loginToApp("user@user.com","password");
        browser.sleep(1000);

        //22. Click "Get Ticket" for the same movie schedule created from step 9
        await moviesPage.clickGetTicketButton(details.movie);

        //23. Select the branch and cinema  (from schedule created on step 9)
        browser.sleep(3000);
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);

        //24. Choose date and time (from schedule created on step 9) 
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //25. Reserve 9 available seats and confirm reservation
        await moviesPage.reserveSeat(9);
        var seatsCustomer1 = await moviesPage.getSeatText();
        await moviesPage.clickConfirmReservation();

        //26. Click Proceed to payment 
        await moviesPage.proceedToPayment(); 

        //27. Input Cardholder name, credit card no., cvv and expiry
        await paymentPage.inputCardHolderName(payment[1].name);
        await paymentPage.inputCreditCardNumber(payment[1].cardNumber);
        await paymentPage.inputCVV(payment[1].cvv);
        await paymentPage.inputExpiryDate(payment[1].expiryDate); 

        //28. Proceed to payment 
        await paymentPage.clickProceed();
        await paymentPage.waitForCloseDialogBox();

        //29. Close the Confirmed Reservation (Steps 1-29 can be reused from "Admin and 1 Customer Reservation" test case) 
        await paymentPage.clickCloseButton(); 

        //30. Logout user 1 
        await basePage.clickLogout();
        browser.sleep(1000);       

        //31. Login Customer Account 2 (pre-existing supplied user account 2)
        await loginPage.loginToApp("user2@user.com","password");
        browser.sleep(1000);

        //32. Verify that there is/are existing movie/s displayed
        expect(await moviesPage.isThereAMovieExist()).toBe(true);

        //33. Click "Get Ticket" for the movie schedule created from step 9
        browser.sleep(1000);
        var url = await basePage.getUrl(); //-> for step 43 
        browser.sleep(1000);
        await moviesPage.clickGetTicketButton(details.movie);

        //34. Select the branch and cinema (from schedule created on step 9)
        browser.sleep(3000);
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);

        //35. Choose date and time (from schedule created on step 9)
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //36. Reserve 8 seats and confirm reservation 
        await moviesPage.reserveSeat(8);
        var seatsCustomer2 = await moviesPage.getSeatText();
        await moviesPage.clickConfirmReservation();

        //37. Click Proceed to payment
        await moviesPage.proceedToPayment();  

        //38. Verify payment summary details are correct base from the previous inputs (description and total amount) 
        //b. Branch name
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.branch)).toBe(true);
        //c. Cinema name
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.cinema)).toBe(true);
        //d. Movie name
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.movie.trim())).toBe(true);
        //e. Date
        var paymentDate = testData.paymentDateFormat(details.startDate);
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(paymentDate)).toBe(true);
        //f. Time
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(details.time.toLowerCase())).toBe(true);
        //h. Seats selected 
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(seatsCustomer2)).toBe(true);
        //Total Amount
        var paymentTotal = testData.paymentPriceFormat(details.ticketPrice * 8);
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(paymentTotal)).toBe(true);

        //39. Input Cardholder name, credit card no., cvv and expiry 
        await paymentPage.inputCardHolderName(payment[2].name);
        await paymentPage.inputCreditCardNumber(payment[2].cardNumber);
        await paymentPage.inputCVV(payment[2].cvv);
        await paymentPage.inputExpiryDate(payment[2].expiryDate);  

        //40. Proceed to payment 
        await paymentPage.clickProceed();
        await paymentPage.waitForCloseDialogBox();

        //41. Verify the ff details from reservation should be displayed
        //a. Confirmed Reservation dialog box with text "Your receipt has been sent to your email."
        expect(await paymentPage.isEmailConfirmationDisplayInDialogBox()).toBe(true);
        //b. Branch name
        browser.sleep(2000);
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.branch)).toBe(true);
        //c. Cinema name
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.cinema.trim())).toBe(true);
        //d. Movie title
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.movie.trim())).toBe(true); 
        //e. Date
        var schedDate = testData.ticketSummaryDateFormat(details.startDate);
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(schedDate)).toBe(true);
        //f. Time
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.time)).toBe(true);
        //g. Price
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.ticketPrice)).toBe(true);
        //h. Seats selected
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(seatsCustomer2)).toBe(true);
        //i. # of seats 
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(8)).toBe(true);
        //j. Total
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.ticketPrice * 8)).toBe(true);

        //42. Close the Confirmed Reservation
        await paymentPage.clickCloseButton(); 

        //43. Verify the customer should navigated to Movies tab
        expect(await basePage.getUrl()).toBe(url);
        browser.sleep(1000);
        //44. Click "Get Ticket" for the movie schedule created from step 8 
        await moviesPage.clickGetTicketButton(details.movie);

        //45. Select the same branch, cinema, date, and time from the previous steps
        await moviesPage.selectBranch(details.branch);
        await moviesPage.selectCinema(details.cinema);
        await moviesPage.selectDate(details.startDate);
        await moviesPage.selectTime(details.time);

        //46. Verify the 10 admin reserved seats, 9 user 1 reserved seats, and 8 user 2 reserved seats are already reserved from the grid
        var seats = [seatsAdmin,seatsCustomer1,seatsCustomer2];
        var combinedSeats = testData.combineAllSeats(seats);
        expect(await moviesPage.getSeatReserved(combinedSeats)).toBe(true);
        browser.sleep(3000);

        //47. Logout User Account 2 
        await basePage.clickLogout();
        browser.sleep(1000); 

        //48. Login Admin account 
        await loginPage.loginToApp("admin@admin.com","password");
        browser.sleep(1000);        

        //49. Click Admin tab 
        basePage.clickAdmin();
        browser.sleep(1000);

        //50. Select the Payment in dropdown menu 
        await adminPage.selectMainTainModule('Payment');
        browser.sleep(1000);

        var description = testData.generatePaymentDescription(details, seats);

        for(let i = 0; i < 3; i++)
        {
        //51. Click the date and time link of the date from the reservations above (use filter date or pagination buttons if many schedules are displayed) 
        await adminPage.clickDateTime(description[i]);

        //52. Verify the reservation details displayed are correct based from previous inputs (user, description, cardholder name and amount) should be displayed.
        //user
        expect(await adminPage.isUserDisplayCorrect(user[i])).toBe(true);
        //description
        expect(await adminPage.isDescriptionDisplayCorrect(description[i])).toBe(true);
        //cardholdername
        expect(await adminPage.isCardHolderNameDisplayCorrect(cName[i])).toBe(true);
        //amount
        expect(await adminPage.isAmountDisplayCorrect(amountTotal[i])).toBe(true);
        
        //To navigate back to Payment table
        adminPage.navigateBackToScheduleTable();
        }
    });
});