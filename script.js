// @ts-check

const API_KEY = 'HFTST5Q8RHJGYBD5';

// Arrays con Developer Akademie
// let month = ['2021-03-31', '2021-04-30', '2021-05-31', '2021-06-30', '2021-07-31', '2021-08-31', '2021-09-30', '2021-10-31', '2021-11-30', '2021-12-31', '2022-01-31', '2022-02-28', '2022-03-31', '2022-04-30', '2022-05-31', '2022-06-30', '2022-07-31', '2022-08-31', '2022-09-30', '2022-10-31', '2022-11-30', '2022-12-31', '2023-01-31', '2023-02-28', '2023-03-31', '2023-04-30', '2023-05-31', '2023-06-30', '2023-07-31', '2023-08-31', '2023-09-30'];
// let course = [];

// Arrays von Stefan Droste
const dataArray = [];
const labelArray = [];

const currencyExchangeRateParams = {
    function: 'CURRENCY_EXCHANGE_RATE',
    from_currency: 'BTC',
    to_currency: 'EUR',
    apikey: API_KEY
}

const digitalCurrencyMonthlyParams = {
    function: 'DIGITAL_CURRENCY_MONTHLY',
    symbol: 'BTC',
    market: 'EUR',
    apikey: API_KEY
}


/**
 * Generate the URL
 * @param {Object} params 
 * @returns {Object} url address
 */
function createUrl(params) {
    const url = new URL('https://www.alphavantage.co/query');
    for (const key of Object.keys(params)) {
        url.searchParams.set(key, params[key]);
    }
    return url;
}


/**
 * Loading the current Bitcoin rate from the website www.alphavantage.co via API
 */
async function loadCourse() {
    // Original - URL and fetch query from Developer Akademie
    // let url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=EUR&apikey=${API_KEY}`;
    // let response = await fetch(url);

    // fetch from DW/Stefan Droste
    let url = createUrl(currencyExchangeRateParams);
    let response = await fetch(url.toJSON());
    let responseAsJson = await response.json();

    // Original from Developer Akademie
    // let currentCourse = (Math.round(responseAsJson['Realtime Currency Exchange Rate']['5. Exchange Rate']));
    // console.log(typeof(currentCourse));
    // document.getElementById('course').innerHTML = `<b>${currentCourse} €</b>`;

    // Optional - Stefan Droste
    if (responseAsJson) {
        const exchangeRateInfo = responseAsJson['Realtime Currency Exchange Rate'];
        const currentBitcoinRate = exchangeRateInfo["5. Exchange Rate"];
        setCurrentBitcoinRate(currentBitcoinRate);
    }
}


/**
 * Loading the current Bitcoin rate from the website www.alphavantage.co via API
 */
async function loadMonthlyCourse() {

    // Original - URL and fetch query from Developer Akademie
    // let url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_MONTHLY&symbol=BTC&market=EUR&apikey=${API_KEY}`;
    // let response = await fetch(url);

    // fetch from DW/Stefan Droste
    let url = createUrl(digitalCurrencyMonthlyParams);
    let response = await fetch(url.toJSON());
    let responseAsJson = await response.json();

    // Original from Developer Akademie
    // let monthlyCourse = responseAsJson['Time Series (Digital Currency Monthly)'];
    // for (let i = 0; i < month.length; i++) {
    //     const courseEachMonth = monthlyCourse[month[i]]['4a. close (EUR)'];
    //     course.push(courseEachMonth);
    // }

    // Optional - Stefan Droste
    if (responseAsJson) {
        const currentlyMonthlyRate = responseAsJson['Time Series (Digital Currency Monthly)'];   
        for (const date in currentlyMonthlyRate) {
            if (currentlyMonthlyRate.hasOwnProperty(date)) {
                const closePriceEUR = currentlyMonthlyRate[date]['4a. close (EUR)'];
                dataArray.push(closePriceEUR);
                labelArray.push(date);
            }
        }        
    }    
    const chartLabel = `Kursverlauf auf Monatsbasis ${labelArray[labelArray.length - 1]} - ${labelArray[0]} (Grundlage sind die Schlusskurs)`;
    chartDate(chartLabel);
}


/**
 * Drawing the Line Chat
 * @param {string} chartLabel 
 */
function chartDate(chartLabel) {
    const ctx = getElementById('myChart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelArray,
            datasets: [{
                label: chartLabel,
                data: dataArray,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    reverse: true
                }
            }
        }
    });
}


/**
 * Output of the current Bitcoin rate in HTML
 * @param {number} currentBitcoinRate 
 */
function setCurrentBitcoinRate(currentBitcoinRate) {
    if (currentBitcoinRate) {
        getElementById('course').innerHTML = numberToEuroString(currentBitcoinRate);
    }
}


/**
 * Convert a number into a EURO currency format (returns a string)
 * @param {number} currentBitcoinRate 
 * @returns {string} Formatted EU currency issue
 */
function numberToEuroString(currentBitcoinRate) {
    return Intl.NumberFormat('de-DE', { currency: 'EUR', style: 'currency', }).format(currentBitcoinRate);
}


/**
 * Checks whether the passed ID exists and returns the element.
 * @param {string} id 
 * @returns {HTMLElement | HTMLImageElement | HTMLInputElement } 
 */
function getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} not found!`);
    }
    return element;
}
