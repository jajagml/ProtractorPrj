class testData {

    generatedDataForSchedule = () => {
        
        var tDate = [];
        var addDate = 3;        
        for(let a = 0; a<3;a++)
        {
            var dateNow = new Date();
            dateNow.setDate(dateNow.getDate() + addDate);
            tDate[a] = dateNow.toISOString().slice(0, 10);
            addDate+=1;
        }
        
        var tTime = [{hr:null, min:null},{hr:null, min:null},{hr:null, min:null}];
        var addMin = 0;
        for(let a = 0; a<3;a++)
        {
            var dateNow = new Date();
            dateNow.setHours(11,0);
            dateNow.setMinutes(dateNow.getMinutes() + addMin);

            tTime[a].hr = ((dateNow.getHours() % 12 || 12) < 10 ? '0' : '') + (dateNow.getHours() % 12 || 12);
            tTime[a].min = (dateNow.getMinutes() < 10 ? '0' : '') + dateNow.getMinutes();
            addMin+=150;
        }
        
        var tPrice = [];
        for(let a = 0; a<3;a++)
        {
            tPrice[a] = (Math.floor(Math.random() * 500) + 150);
        }

        let dataSchedule =[
            {cinema:1, movie:1, startDate:tDate[0], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:1, movie:1, startDate:tDate[0], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:1, movie:1, startDate:tDate[0], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},
            {cinema:2, movie:2, startDate:tDate[0], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:2, movie:2, startDate:tDate[0], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:2, movie:2, startDate:tDate[0], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},
            {cinema:3, movie:3, startDate:tDate[0], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:3, movie:3, startDate:tDate[0], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:3, movie:3, startDate:tDate[0], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},

            {cinema:1, movie:1, startDate:tDate[1], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:1, movie:1, startDate:tDate[1], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:1, movie:1, startDate:tDate[1], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},
            {cinema:2, movie:2, startDate:tDate[1], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:2, movie:2, startDate:tDate[1], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:2, movie:2, startDate:tDate[1], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},
            {cinema:3, movie:3, startDate:tDate[1], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:3, movie:3, startDate:tDate[1], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:3, movie:3, startDate:tDate[1], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},

            {cinema:1, movie:1, startDate:tDate[2], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:1, movie:1, startDate:tDate[2], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:1, movie:1, startDate:tDate[2], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},
            {cinema:2, movie:2, startDate:tDate[2], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:2, movie:2, startDate:tDate[2], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:2, movie:2, startDate:tDate[2], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]},
            {cinema:3, movie:3, startDate:tDate[2], hour:tTime[0].hr, minute:tTime[0].min, ticketPrice:tPrice[0]},
            {cinema:3, movie:3, startDate:tDate[2], hour:tTime[1].hr, minute:tTime[1].min, ticketPrice:tPrice[1]},
            {cinema:3, movie:3, startDate:tDate[2], hour:tTime[2].hr, minute:tTime[2].min, ticketPrice:tPrice[2]}
        ];
        return dataSchedule;
    }

    generateSingleSchedule = () => {
        let dataShed = this.generatedDataForSchedule();
        dataShed[0].movie = 4;
        return dataShed[0];
    }

    ticketSummaryDateFormat = (date) => {
        return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, ' ');
    }

    paymentDateFormat = (date) => {
        var tempDate = new Date(date);
        return tempDate = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' +  tempDate.getFullYear();
    }

    paymentPriceFormat = (price) => {
        return Number(parseInt(price).toFixed(0)).toLocaleString();
    }

    descriptionFormat = (date) => {
        var tempDate = new Date(date);
        return tempDate = (("0" + (tempDate.getMonth() + 1)).slice(-2)) + '/' + (("0" + tempDate.getDate()).slice(-2)) + '/' +  tempDate.getFullYear();
    }

    paymentDetails = () => {
        let dataSet = [{name:"Admin Admin", cardNumber:"1111111111111111",cvv:"111",expiryDate:"2506"},
                       {name:"User1 User", cardNumber:"2222222222222222",cvv:"222",expiryDate:"2606"},
                       {name:"User2 User", cardNumber:"3333333333333333",cvv:"333",expiryDate:"2706"}];
        return dataSet;
    }

    generateCinemaName = () => {
        let uniqueNum = Math.floor(Math.random() * 30);
        let date = new Date;
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let cName = `Cinema ${uniqueNum}${min}${sec}`;
        
        return cName;
    }

    combineAllSeats = (seat) => {
        var combinedSeats = [];

        for(var i = 0; i < seat.length; i++)
        {
            combinedSeats.push(seat[i]);
        }
        browser.sleep(1000);
        return combinedSeats.join(", ");
    }

    generatePaymentDescription = (sched, seat) => {
        var temp = [];
        for(var i=0; i<3; i++)
        {
            var t1 = `${sched.movie.trim()} | ${sched.branch} | ${sched.cinema.trim()} | ${this.descriptionFormat(sched.startDate)} ${sched.time.toLowerCase()} | ${seat[i]}`;
            temp.push(t1);
        }
        return temp;
    }

    getUsers = () => {
        var user = ['admin@admin.com','user@user.com','user2@user.com'];
        return user;
    }

    getTotal = (price) => {
        var total = [];

        total.push(price * 10);
        total.push(price * 9);
        total.push(price * 8);

        return total;
    }

    getCardName = () => {
        var name = [];
        var t = this.paymentDetails();
        name.push(t[0].name);
        name.push(t[1].name);
        name.push(t[2].name);

        return name;
    }
}

module.exports = testData;