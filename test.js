const puppeteer = require('puppeteer');

const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfB6EbJiLaQdLC3-DOA_P5dd2H6ncFf6T_ecaxjQ6kzBN8R3A/viewform';

async function fillForm() {
    const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
    const page = await browser.newPage();

    await page.goto(formUrl);

    // Wait for the form to load
    await page.waitForSelector('form');

    // Select all radio button containers for the form
    const radioButtonGroups = await page.$$('[role="radiogroup"]');

    for (const group of radioButtonGroups) {
        // Select all the radio button options
        const options = await group.$$('div[role="radio"]');

        if (options.length > 0) {
            // Filter options with values "3", "4", or "5"
            const filteredOptions = [];
            for (const option of options) {
                const value = await option.evaluate((el) => el.getAttribute('data-value'));
                if (['3', '4', '5'].includes(value)) {
                    filteredOptions.push(option);
                }
            }

            // Choose an option from the filtered list or fallback to random
            const selectedOption =
                filteredOptions.length > 0
                    ? filteredOptions[Math.floor(Math.random() * filteredOptions.length)]
                    : options[Math.floor(Math.random() * options.length)];

            // Click the selected option
            await selectedOption.click();
        }
    }

    // Submit the form by clicking the button with aria-label "Submit"
    const submitButton = await page.$('[aria-label="Submit"]');
    if (submitButton) {
        await submitButton.click();
    }

    // Wait for the form to be submitted and the response page to load
    await page.waitForNavigation();

    console.log('Form submitted successfully!');

    // Close the browser
    // await browser.close();
}

fillForm().catch(console.error);
