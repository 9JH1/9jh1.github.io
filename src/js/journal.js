if (window.location.search) {
  const searchResults = String(window.location.search).replace("?", "");
  fetch("./src/js/journal.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      Object.keys(data).forEach((key) => {
        if (key == searchResults) {
          document.head.innerHTML = `<title>${location.href}</title>`;
          document.body.id = null;
          document.body.classList = null;
          document.body.style.cssText = null;
          document.body.innerText = JSON.stringify(data[key]);

          setTimeout(() => {
            console.clear();
          }, 3000);
        }
      });
    });
}

function clip(text) {
  navigator.clipboard.writeText(text).then(
    function () {},
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

function lms() {
  fetch("./src/js/journal.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      Object.keys(data).forEach((key) => {
        const newLog = document.createElement("div");
        newLog.classList.add("message");
        newLog.innerHTML = /*html*/ `
        <div class="title">${data[key].title}</div>
        <div class="options">
          <div class="timestamp">${data[key].date}</div>
          <div class="tags"></div>
          <button class="share" onclick="clip('${location.href}?${key}')">share</button>
        </div>
        <div class="content">
        ${data[key].content}
        </div>
      `;
        document.getElementById("journal").append(newLog);
      });
    });
}
lms();
