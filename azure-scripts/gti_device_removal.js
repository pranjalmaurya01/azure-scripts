const devices = [];

const DELAY = 1500;

(async function processAll() {
  const searchBox = document.querySelector("#SearchBox3");
  if (!searchBox) {
    console.error("Search box not found!");
    return Promise.resolve(); // Continue to the next email
  }
  for (const device of devices) {
    await searchAndDeleteDevice(searchBox, device);
  }
  console.log("BYE: All devices processed!");
})();

async function searchAndDeleteDevice(searchBox, device) {
  // Set search box value and trigger 'input' event
  searchBox.value = device;
  searchBox.dispatchEvent(new Event("input", { bubbles: true }));

  return new Promise((resolve) => {
    setTimeout(() => {
      const resultDiv = document.querySelector(
        "div.ms-Shimmer-dataWrapper"
      ).innerText;
      if (resultDiv.charAt(0) == "1") {
        document
          .querySelector('i[data-icon-name="StatusCircleCheckmark"]')
          .click();
        document.querySelector('button[name="Delete"]').click();
        const resp = confirm(`are you sure to delete ? ${device}`);
        if (resp) {
          console.log(device, "delete now");
          document.querySelector("#ModalFocusTrapZone2818 button").click();
        } else {
          console.log(device, "not deleted");
        }
      } else {
        console.log(device, resultDiv);
      }
      resolve();
    }, DELAY);
  });
}
