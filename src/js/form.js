//import { Email } from "https://smtpjs.com/v3/smtp.js";
const messageEmail = document.getElementById("form-email");
const messageBody = document.getElementById("form-body");
const messageButton = document.getElementById("form-send");

messageButton.addEventListener("click", () => {
  console.log(messageEmail.value);
  messageEmail.value = "";
  console.log(messageBody.value);
  messageBody.value = "Body";
  messageBody.style.color = "var(--text-disabled)";
  // yes I know not encrypted or anything, ah well :)
  /*Email.send({
    Host: "smtp.gmail.com",
    Username: "3hy@gmail.com",
    Password: "#############",
    To: "tkf.x1os@gmail.com",
    From: messageEmail.value,
    Subject: "JOB REQUEST",
    Body: `${messageBody.value}\n Email: ${messageEmail.value}`,
  });*/
});
messageBody.addEventListener("click", () => {
  messageBody.value = "";
});
