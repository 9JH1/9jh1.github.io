const base_main = document.getElementById("main").clientHeight;
document.addEventListener("scroll", () => {
  const scrollbar = document.getElementsByClassName("scrollbar")[0];
  const scrollbarInn = document.getElementsByClassName("scrollbar-inn")[0];
  const scroll_ = window.scrollY;
  const limit = () => {
    const body = document.body;
    const html = document.documentElement;
    const documentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowHeight = window.innerHeight;
    return documentHeight - windowHeight;
  };
  const percentage = Math.round((scroll_ / limit()) * 100);
  scrollbar.style.marginTop = `${
    (scrollbarInn.clientHeight / 100) * percentage - 20
  }px`; // Assigning marginTop in pixels;
  if (window.scrollY >= 10) {
    document.getElementById("navbar").style.transform = "translateY(-60px)";
    document.getElementById("extra-nav").style.transform = "translateY(60px)";
    document.getElementById("projects").style.opacity = 0;
  } else {
    document.getElementById("navbar").style.transform = "translateY(0px)";
    document.getElementById("extra-nav").style.transform = "translateY(0px)";
    document.getElementById("projects").style.opacity = 1;
  }
  document.getElementById("main").style.opacity =
    (100 - window.scrollY / 3) / 100;
  document.getElementById("main").style.height =
    base_main - window.scrollY / 3 + "px";
});

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);
document
  .getElementById("text-animate-welcome-to")
  .addEventListener("click", () => {
    window.scroll({
      top: document.getElementById("about").offsetTop,
      left: 0,
      behavior: "smooth",
    });
  });

(function () {
  let lastDevicePixelRatio = window.devicePixelRatio;

  function checkZoom() {
    const currentDevicePixelRatio = window.devicePixelRatio;
    if (currentDevicePixelRatio !== lastDevicePixelRatio) {
      lastDevicePixelRatio = currentDevicePixelRatio;
      onZoomChange(currentDevicePixelRatio);
    }
  }
  function onZoomChange(ratio) {
    location.reload;
  }
  setInterval(checkZoom, 100);
  window.addEventListener("resize", checkZoom);
})();
