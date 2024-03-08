function setDateTime() {
    document.getElementById("date").innerText = new Date().toLocaleDateString();
    document.getElementById("time").innerText = new Date().toLocaleTimeString(
        'en-US', {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
    });
    document.getElementById("time").innerHTML = String(document.getElementById("time").innerHTML).replace(":", "<span class='blink'>:</span>")
}

setDateTime()



setInterval(() => {
    setDateTime()
}, 60000)