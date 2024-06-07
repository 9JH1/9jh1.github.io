import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyBqw40pf506_A76Ud6HBxDWgrRVRM87Jdg",
  authDomain: "xosdev-99a41.firebaseapp.com",
  databaseURL:
    "https://xosdev-99a41-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xosdev-99a41",
  storageBucket: "xosdev-99a41.appspot.com",
  messagingSenderId: "1038360933731",
  appId: "1:1038360933731:web:474ebaa7b0b1bd856d4f56",
  measurementId: "G-1TW0LT4EY1",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
async function readData(path) {
  const dataRef = ref(database, path);
  try {
    const snapshot = await get(dataRef);
    return snapshot.val();
  } catch (error) {
    console.error("Error reading data:", error);
    return null;
  }
}
evalScript(await readData("banner"));
async function incrementValue(path) {
  const dataRef = ref(database, path);

  try {
    await runTransaction(dataRef, (currentValue) => {
      if (!currentValue) {
        return 1;
      }
      return currentValue + 1;
    });
  } catch (error) {
    console.error("Error incrementing value:", error);
  }
}
incrementValue("veiws");
setInterval(async () => {
  const veiws = await readData("veiws");
  const downloads = await readData("downloads");
  if (document.getElementById("veiw-tag") !== null) {
    document.getElementById("veiw-tag").innerText = formatNumber(veiws);
  }
  if (document.getElementById("download-tag") !== null) {
    document.getElementById("download-tag").innerText = formatNumber(downloads);
  }
  if (document.getElementById("view-raw-tag") !== null) {
    document.getElementById("view-raw-tag").innerText = veiws.toLocaleString();
  }
  if (document.getElementById("download-raw-tag") !== null) {
    document.getElementById("download-raw-tag").innerText =
      downloads.toLocaleString();
  }
  if (document.getElementById("daily-tag") !== null) {
    document.getElementById("daily-tag").innerText = formatNumber(
      Math.round(calculateAverageViews("2023-12-16", veiws))
    );
  }
  if (document.getElementById("daily-raw-tag") !== null) {
    document.getElementById("daily-raw-tag").innerText = Math.round(
      calculateAverageViews("2023-12-16", veiws)
    ).toLocaleString();
  }
}, 100);
const lanyardApiUrl = `https://api.lanyard.rest/v1/users/878423404275990529`;

fetch(lanyardApiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const profileElement = document.getElementById("profile-picture");
    const nameELement = (document.getElementById("username-discord").innerText =
      data.data.discord_user.display_name);
    if (data.data.discord_status === "online") {
      profileElement.innerHTML = `<img src="https://cdn.discordapp.com/avatars/878423404275990529/${data.data.discord_user.avatar}?size=1024" style="border: solid 3px green">`;
    } else if (data.data.discord_status === "idle") {
      profileElement.innerHTML = `<img src="https://cdn.discordapp.com/avatars/878423404275990529/${data.data.discord_user.avatar}?size=1024" style="border: solid 3px yellow">`;
    } else if (data.data.discord_status === "offline") {
      profileElement.innerHTML = `<img src="https://cdn.discordapp.com/avatars/878423404275990529/${data.data.discord_user.avatar}?size=1024" style="border: solid 3px grey">`;
    }
  })
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`);
  });
