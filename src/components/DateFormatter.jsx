import React from 'react';

const calculateTimeDifference = (date) => {
    const now = new Date();
    const givenDate = new Date(date);

    const diffInMs = now - givenDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    const isToday = now.toDateString() === givenDate.toDateString();
 
    let years = now.getFullYear() - givenDate.getFullYear();
    let months = now.getMonth() - givenDate.getMonth();
    let days = now.getDate() - givenDate.getDate();

    if (days < 0) {
        months--;
        const daysInPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += daysInPreviousMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days, isToday, diffInSeconds, diffInMinutes, diffInHours };
};

const formatTimeDifference = ({ years, months, days, isToday, diffInSeconds, diffInMinutes, diffInHours  }) => {
    if (isToday) {
        if (diffInSeconds < 60) {
            return 'Just now';
        }else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }else{
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }
    }

    let formattedString = '';

    if (years > 0) {
        formattedString += `${years} year${years > 1 ? 's' : ''}`;
    }

    if (months > 0) {
        if (formattedString) formattedString += ', ';
        formattedString += `${months} month${months > 1 ? 's' : ''}`;
    }

    if (days > 0) {
        if (formattedString) formattedString += ', ';
        formattedString += `${days} day${days > 1 ? 's' : ''}`;
    }

    return formattedString ? `${formattedString} ago` : 'Just Now';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Months array to get the month abbreviation
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Get the month, day, year, hours, and minutes
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Add leading zero if minutes less than 10
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Determine if it's AM or PM
    const period = hours < 12 ? 'AM' : 'PM';

    // Convert hours from 24-hour time to 12-hour time
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    // Construct the formatted date string
    const formattedDate = `${month} ${day}, ${year} at ${hours}:${minutes} ${period}`;

    return formattedDate;
};

const DateFormatter = ({ date, withMinutes = false }) => {
    const timeDifference = calculateTimeDifference(date);
    const formattedTimeDifference = formatTimeDifference(timeDifference);
    const formattedFullDate = formatDate(date);

    return (
        <span>{withMinutes ? formattedFullDate : formattedTimeDifference}</span>
    );
};

export default DateFormatter;


/**
 * Let's walk through an example to clarify this process:

Current Date: 2024-07-05
Given Date: 2024-06-25

[Initial Calculation]
years = 2024 - 2024 = 0
months = 7 - 6 = 1
days = 5 - 25 = -20 (negative value)
Since days is negative, we need to adjust it.

[Adjustment Steps]
Decrement Months

months-- means months = 1 - 1 = 0
Calculate Days in Previous Month

new Date(2024, 7, 0).getDate() gives us 30 (since June has 30 days)
Adjust Days

days += 30 means days = -20 + 30 = 10
Final Adjusted Values
years = 0
months = 0
days = 10

This means the final result correctly represents the difference as 0 years, 0 months, and 10 days.
 */