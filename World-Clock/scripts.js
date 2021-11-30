const local_display = document.getElementById('local_time')
const UTC_display = document.getElementById('UTC_time')
const local_date = document.getElementById('local_date')
const UTC_date = document.getElementById('UTC_date')


// Leap year algorithm explanation:

// Every year takes approximately 365.2425 days
// Since the gregorian calendar only takes in account 365 days,
// every 4 years we accumulate one uncounted day + a small error(0.0025).
// Since leap years have started being counted since
// 1582 then every 4 years is a leap year, that is, a year is a leap year
// if it is divisible by 4.
// But to account for the small error, we must consider that every
// 100 years we've accumulated an additional of 0.25 of a day of error.
// and in 400 years, we accumulate 1 day of error.
// Therefore, if a number is divisible by 4, 100 and 400 then it also
// is a leap year.

function leap_year(year){
    if(year % 4 == 0){
        if(year % 100 == 0){
            if(year % 400 == 0)
                return true
        }
        else return true
    }
    return false
}
// tests
// console.log(`is 2020 a leap year? ${leap_year(2020)}`) // true
// console.log(`is 2019 a leap year? ${leap_year(2019)}`) // false

// sums the current date and hour by a number of hours(negative or positive)

function clock_arithmetic(year, month, day, hour, offset_in_hours){
    if(offset_in_hours > 24 || offset_in_hours < -24 ){ // we restrict the number of hours that can be added at a time
        return "Can not add or subtract more than 24 hours!"
    }
    year = parseInt(year, 10)
    month = parseInt(month, 10)
    day = parseInt(day, 10)
    hour = parseInt(hour, 10)
    hour = hour + offset_in_hours
    if(hour >= 24){
        hour = hour % 24
        day += 1 // since no more than 24 hours can be added at a time, we can only add one day at a time
    }
    if(hour < 0){
        hour = 24 + hour
        day -= 1 // since no more than 24 hours can be added at a time, we can only subtract one day at a time
    }
    // day > month_days[month % 2], so if month is february,
    // then we subtract 2 from month_days[month % 2],
    // which is the same as adding 1 to day:
        // day > month_days[month % 2] - 2
        // day + 2 > month_days[month % 2]
    if(month == 2) {day += 2 
    if(leap_year(year)) day -= 1} // same reasoning above, but we check for leap year

    month_days = [30,31] // even months have month % 2 = 0, therefore month_days[month % 2] = 30
                         // odd months have month % 2 = 1, therefore month_days[month % 2] = 31
    if(day > month_days[month % 2] ){
        day = 1 
        month += 1 // since no more than 1 day can be added at a time, we can only add one month at a a time
    }
    if(day < 1 ){
        month -= 1 // since no more than 1 day can be subtracted at a time, we can only subtract one month at a a time
        if(month == 2){ day = 28
        if(leap_year(year)) day += 1}
        day = month_days[(month + 1)% 2] // parity of month changes
    }
    if(month > 12){
        month = 1
        year += 1 // since no more than 1 month can be added at a time, we can only add one year at a a time
    }
    if(month < 1){
        month = 12
        year -= 1 // since no more than 1 month can be subtracted at a time, we can only subtract one year at a a time
    }
    return [year, month, day, hour]
}

number_to_month = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}

// Does NOT check for daylight saving time on local
// since  I couldn't find the rules for daylight saving time 
// Many sources said that daylight saving time  depended
// on the location and time of the year and that it is
// prone to changing every year.
// Therefore, I've simply ignored it.


var intervalID = window.setInterval(myCallback, 500);

function myCallback(){
    fetch('http://worldclockapi.com/api/json/utc/now')
    .then(response => response.json())
    .then(data => {
        // 2021-11-30T06:07Z
        const separator = /[-TZ:]/
        let [UTC_year, UTC_month, UTC_day, UTC_hour, UTC_minute] = data['currentDateTime'].split(separator)
        let date = new Date()
        let [local_year, local_month, local_day, local_hour] = clock_arithmetic(UTC_year, UTC_month, UTC_day, UTC_hour, -(date.getTimezoneOffset()/60) )
        if (local_hour - 10 < 0){
            local_hour = `0${local_hour}`
        } 
        local_display.innerText = `${local_hour}:${UTC_minute}`
        local_date.innerText = `${number_to_month[local_month]} ${local_day}, ${local_year}`
        UTC_display.innerText = `${UTC_hour}:${UTC_minute}`
        UTC_date.innerText = `${number_to_month[UTC_month]} ${UTC_day}, ${UTC_year}`
    })
}