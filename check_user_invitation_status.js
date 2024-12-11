const emails = [];

const DELAY = 1000;

(async function processAll() {
  const searchBox = document.querySelector("#SearchBox4");
  if (!searchBox) {
    console.error("Search box not found!");
    return Promise.resolve(); // Continue to the next email
  }
  for (const email of emails) {
    await searchAndClick(searchBox, email);
  }
  console.log("All emails processed!");
})();

async function searchAndClick(searchBox, email) {
  // Set search box value and trigger 'input' event
  searchBox.value = email;
  searchBox.dispatchEvent(new Event("input", { bubbles: true }));

  // Wait for search results to populate and click the result
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultDiv = document.querySelector(
        'div[data-testid="resultMessage"]'
      );
      if (resultDiv && resultDiv.innerHTML[0] == "1") {
        const invitationState = document.querySelector(
          'div[data-automation-key="externalUserState"]'
        );
        console.log(email, invitationState.innerHTML);
      } else {
        console.warn(`No result found for: ${email}`);
      }
      resolve();
    }, DELAY);
  });
}
