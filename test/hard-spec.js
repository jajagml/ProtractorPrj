let BasePage = require('../page/BasePage');
let LoginPage = require('../page/loginPage');
let AdminPage = require('../page/AdminPage');
let MoviesPage = require('../page/MoviesPage');
let PaymentPage = require('../page/PaymentPage');
let TestData = require('../dataHelpers/TestData');

describe('Hard Specs', () => {
    it('Test Case 8: Admin Reservation', async() => {
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
        adminPage.selectMainTainModule('Branch');
        browser.sleep(1000);

        //4. Click random Branch name link 
        adminPage.clickRandomBranch();
        
        //5. Verify if there a cinema existing under Cinemas. If no cinema name is existing, click Add Cinema, fill out name, and click Add, else proceed to next step
        let newCinema = testData.generateCinemaName();
        adminPage.VerifyIfCinemaExistIfNoneThenCreate(newCinema); //-> newCinema will only be used if there's no exsiting cinema;

        //6. Click an existing cinema. Input 5 on rows, 20 on columns, and click Update
        await adminPage.ClickExistingCinema();
        adminPage.updateSeatPlan(5,20);
        adminPage.clickUpdateButton();

        //7. Click View Schedules button
        adminPage.clickViewSchedulesButton(); 

        //8. Click Add Movie Schedule 
        await adminPage.clickAddMovieSchedule();
        browser.sleep(1000);        

        //9. Populate following fields a. Cinema (the one from step 6)  b. Movie  c. Date d. Time e. Price
        //await adminPage.populateDetailsForAddSchedule(sched[0]);
        await adminPage.populateCinema(sched.cinema);
        await adminPage.populateMovie(sched.movie);
        await adminPage.populateDate(sched.startDate);
        await adminPage.populateTime(sched.hour,sched.minute);
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
        var seats = await moviesPage.getSeatText();
        await moviesPage.clickConfirmReservation();
        browser.sleep(1000);

        //16. Verify the ff details from reservation should be displayed
        //a. Ticket Summary dialog box with Ticket Summary text is displayed 
        expect(await moviesPage.isTicketSummaryDialogBoxDisplay()).toBe(true);
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
        expect(await moviesPage.isTicketSummaryDetailsCorrect(seats)).toBe(true);
        
        //17. Proceed to payment 
        await moviesPage.proceedToPayment();

        //18. Verify payment summary details are correct base from the previous inputs (description and total amount)
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
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(seats)).toBe(true);
        //Total Amount
        var paymentTotal = testData.paymentPriceFormat(details.ticketPrice * 10);
        expect(await paymentPage.isPaymentSummaryDetailsCorrect(paymentTotal)).toBe(true);
        
        //19. Input Cardholder name, credit card no., cvv and expiry 
        await paymentPage.inputCardHolderName(payment[0].name);
        await paymentPage.inputCreditCardNumber(payment[0].cardNumber);
        await paymentPage.inputCVV(payment[0].cvv);
        await paymentPage.inputExpiryDate(payment[0].expiryDate);

        //20. Proceed  to payment 
        await paymentPage.clickProceed();
        await paymentPage.waitForCloseDialogBox();

        //21. Verify the ff details from reservation should be displayed
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
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(seats)).toBe(true);
        //i. # of seats 
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(10)).toBe(true);
        //j. Total
        expect(await paymentPage.isConfirmedReservationDetailsCorrect(details.ticketPrice)).toBe(true);
        
        //22. Close the Confirmed Reservation
        await paymentPage.clickCloseButton();

        //23. Verify the admin user should navigated to Movies tab
        expect(await basePage.getUrl()).toBe(url);
    });
});