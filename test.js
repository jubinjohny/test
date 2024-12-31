const puppeteer = require('puppeteer');

(async () => {
  // Launch browser in non-headless mode with slow motion enabled
  const browser = await puppeteer.launch({
    headless: false, // Run with browser UI
    slowMo: 2000, // Adds a 100ms delay to every action
    defaultViewport: null, // Use full screen
  });
  const page = await browser.newPage();

  // Navigate to the Google Form
  const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfB6EbJiLaQdLC3-DOA_P5dd2H6ncFf6T_ecaxjQ6kzBN8R3A/viewform';
  await page.goto(formURL, { waitUntil: 'networkidle2' });

  console.log('Page loaded successfully.');

  // Function to select random radio buttons
  const selectRandomRadioButtons = async () => {
    // Find all groups of radio buttons
    const radioGroups = await page.$$('.freebirdFormviewerComponentsQuestionRadioChoice');

    for (const group of radioGroups) {
      const radios = await group.$$('div[role="radio"]'); // Get all radio buttons in the group
      if (radios.length > 0) {
        const randomIndex = Math.floor(Math.random() * radios.length); // Select a random index
        await radios[randomIndex].click(); // Click the random radio button
        console.log(`Clicked radio button in group: ${randomIndex}`);
      }
      // Add a delay between each radio button selection
      await page.waitForTimeout(500); // 500ms delay
    }
  };

  // Select random radio buttons in the form
  await selectRandomRadioButtons();
  console.log('Random radio buttons selected.');

  // Add a delay before submitting
  await page.waitForTimeout(1000); // 1-second delay

  // Click the submit button
  const submitButton = await page.$('div[role="button"][aria-label="Submit"]');
  if (submitButton) {
    await submitButton.click();
    console.log('Form submitted successfully!');
  } else {
    console.error('Submit button not found.');
  }

  // Wait to observe the results
  await page.waitForTimeout(3000); // 3-second delay

  // Close the browser
//   await browser.close();
})();
