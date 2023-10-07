// @ts-check

const API_KEY = 'HFTST5Q8RHJGYBD5';

const currencyExchangeRateParams = {
    function: 'CURRENCY_EXCHANGE_RATE',
    from_currency: 'BTC',
    to_currency: 'EUR',
}

const digitalCurrencyMonthlyParams = {
    function: 'DIGITAL_CURRENCY_MONTHLY',
    symbol: 'BTC',
    market: 'EUR',
}


/**
 * Generate the URL
 * @param {Object} params 
 * @returns {Promise<*>} url address
 */
async function $fetch(params) {
    const url = new URL('https://www.alphavantage.co/query');
    for (const key of Object.keys(params)) {
        url.searchParams.set(key, params[key]);
    }
    url.searchParams.set('apikey', API_KEY);
    const res = await fetch(url.toJSON());
    return await res.json();
}


/**
 * Loading the current Bitcoin rate from the website www.alphavantage.co via API
 */
async function loadCourse() {
    const responseAsJson = await $fetch(currencyExchangeRateParams);
    if (responseAsJson) {
        const exchangeRateInfo = responseAsJson['Realtime Currency Exchange Rate'];
        const currentBitcoinRate = exchangeRateInfo["5. Exchange Rate"];
        getElementById('course').innerHTML = numberToEuroString(currentBitcoinRate);
    }
}


/**
 * Loading the current Bitcoin rate from the website www.alphavantage.co via API
 */
async function loadMonthlyCourse() {

    const result = await $fetch(digitalCurrencyMonthlyParams);
    const monthlyRates = result['Time Series (Digital Currency Monthly)'];
    const datasets = Object.keys(monthlyRates).map((date) => {
        return {
            label: monthlyRates[date]['4a. close (EUR)'],
            data: date            
        }
    });
    const chartTitle = `Kursverlauf auf Monatsbasis ${datasets[datasets.length - 1].data} - ${datasets[0].data} (Grundlage sind die Schlusskurs)`;
    renderChart(chartTitle, datasets);
}


/**
 * Drawing the Line Chat
 * @param {string} chartTitle 
 * @param {Array<{ label: string, data: string }>} datasets
 */
function renderChart(chartTitle, datasets) {

    const ctx = getElementById('myChart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datasets.map((item) => item.data),
            datasets: [{
                label: chartTitle,
                data: datasets.map((item) => item.label),
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

async function init() {
    await loadCourse();
    await loadMonthlyCourse();
}
