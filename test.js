const puppeteer = require('puppeteer');

const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfB6EbJiLaQdLC3-DOA_P5dd2H6ncFf6T_ecaxjQ6kzBN8R3A/viewform';

async function fillForm() {
    const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
    const page = await browser.newPage();
    
    await page.goto(formUrl);

    // Wait for the form to load
    await page.waitForSelector('form');

    // Select all radio button containers for the "What is your age?" question
    const radioButtonGroups = await page.$$('[role="radiogroup"]');

    for (const group of radioButtonGroups) {
        const options = await group.$$('div[role="radio"]'); // Select all the radio button options

        if (options.length > 0) {
            // Choose a random radio button from the available options
            const randomIndex = Math.floor(Math.random() * options.length);
            await options[randomIndex].click();
        }
    }

    // Submit the form after filling it out
    const submitButton = await page.$('div[role="button"][aria-label="Submit"]');
    if (submitButton) {
        await submitButton.click();
    }

    // Wait for the form to be submitted and the response page to load
    await page.waitForNavigation();

    console.log('Form submitted successfully!');

    // Close the browser
    await browser.close();
}

fillForm().catch(console.error);
