const usernames = [];

const DELAY = 1500;

(async function processAll() {
  const searchBox = document.querySelector("#SearchBox4");
  if (!searchBox) {
    console.error("Search box not found!");
    return Promise.resolve(); // Continue to the next email
  }
  for (const username of usernames) {
    const normalUsername = username.replace(/^_(2|7)?/, "");
    await searchAndGetEmail(searchBox, normalUsername, username);
  }
  console.log("All emails processed!");
})();

async function searchAndGetEmail(searchBox, username, printUsername) {
  // Set search box value and trigger 'input' event
  searchBox.value = username;
  searchBox.dispatchEvent(new Event("input", { bubbles: true }));

  // Wait for search results to populate and click the result
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultDiv = document.querySelector(
        'div[data-testid="resultMessage"]'
      );
      if (!resultDiv) {
        console.error(`Unable to load: ${username}`);
      } else {
        // success case
        if (resultDiv.innerHTML[0] == "1") {
          const email = document.querySelector(
            'div[data-automation-key="mail"]'
          );
          console.log(printUsername, email.innerText.split("\n")[0]);
        } else if (resultDiv.innerHTML[0] == "0") {
          console.log(`${printUsername} Not Found`);
        } else {
          const pUsernames = document.querySelectorAll(
            'div[data-automation-key="userPrincipalName"]'
          );
          for (e of pUsernames) {
            const uname = e.innerText.split("\n")[0];
            if (uname && uname.includes(username)) {
              const email = e.querySelector('div[data-automation-key="mail"]');
              console.log(printUsername, email?.innerText.split("\n")[0] ?? "");
              break;
            }
          }
        }
      }
      resolve();
    }, DELAY);
  });
}
