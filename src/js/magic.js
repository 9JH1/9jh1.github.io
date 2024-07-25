// standard lib written by 3hy @9JH1 on github
//------------------------------------------------------
//                      MAIN VARS
//------------------------------------------------------
const effectRes = [10, 10];
let effectResCount = effectRes[0] * effectRes[1];
const effectEle = document.getElementById("effect");
const scrollbar = document.getElementsByClassName("scrollbar")[0];
const scrollbarInn = document.getElementsByClassName("scrollbar-inn")[0];
const projects = document.getElementById("projects");
const about = document.getElementById("about");
const welcomeBanner = document.getElementById("text-animate-welcome-to");
const projectsTitleAnimateLoader = document.getElementsByClassName(
  "projects-title-animate-loader"
)[0];

const messageEmail = document.getElementById("form-email");
const messageBody = document.getElementById("form-body");
const messageButton = document.getElementById("form-send");
const mouseMover = document.getElementById("mouse-move-cursor-dialog");
const loader_page = document.getElementsByClassName("loader")[0];
const navbarExtra = document.getElementById("extra-nav");
const loader = document.getElementById("loader");
const navbar = document.getElementById("navbar");
const time = document.getElementById("time");
const main = document.getElementById("main");
const date = document.getElementById("date");
const handShakeElement = document.getElementById("hand-shake");
//------------------------------------------------------
//                    MAIN FUNCTIONS
//------------------------------------------------------
// turn on observer animations
function addCustomKeyframe() {
  const style = document.createElement("style");
  style.innerHTML = `
        .hidden {
            visibility: hidden;
        }

        .custom-animation {
            opacity: 0;
        }

        .custom-animation.from-left {
            animation-name: fromLeft;
        }

        .custom-animation.from-right {
            animation-name: fromRight;
        }

        .custom-animation.from-bottom {
            animation-name: fromBottom;
        }

        .custom-animation.from-top {
            animation-name: fromTop;
        }

        .custom-animation.opacity {
            animation-name: opacity;
        }

        @keyframes fromLeft {
            0% {
            transform: translateX(-100px);
            opacity: 0;
            }

            100% {
            transform: translateX(0);
            opacity: 1;
            }
        }

        @keyframes fromRight {
            0% {
            transform: translateX(100px);
            opacity: 0;
            }

            100% {
            transform: translateX(0);
            opacity: 1;
            }
        }

        @keyframes fromBottom {
            0% {
            transform: translateY(100px);
            opacity: 0;
            }

            100% {
            transform: translateY(0);
            opacity: 1;
            }
        }

        @keyframes fromTop {
            0% {
            transform: translateY(-100px);
            opacity: 0;
            }

            100% {
            transform: translateY(0);
            opacity: 1;
            }
        }

        @keyframes opacity {
            0% {
            opacity: 0;
            }

            100% {
            opacity: 1;
            }
        }
    `;

  document.head.appendChild(style);
  const elements = document.querySelectorAll("[data-animation]");
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animationName = element.getAttribute("data-animation");
        const animationDuration =
          element.getAttribute("data-animation-duration") || "1s";
        const animationDelay =
          element.getAttribute("data-animation-delay") || "0s";
        element.classList.remove("hidden");
        element.classList.add("custom-animation");
        element.classList.add(animationName);
        element.style.animationDuration = animationDuration;
        element.style.animationDelay = animationDelay;
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  elements.forEach((element) => {
    // Hide the element initially by adding the 'hidden' class
    element.classList.add("hidden");
    observer.observe(element);
  });

  // Add event listener to reset opacity after animation completes
  elements.forEach((element) => {
    element.addEventListener("animationend", () => {
      element.style.opacity = "1";
    });
  });
}
// animate text in ( this probably wont be used in this website )
function animateTextPar(element, duration) {
  const mainE = document.getElementsByClassName(element)[0];
  const mainE_text = mainE.innerText.replace(/\n/g, "").split(" ");
  mainE.innerHTML = "";
  // this some bs man
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateText();
        observer.unobserve(mainE);
      }
    });
  });
  observer.observe(mainE);

  function animateText() {
    for (let item = 0; item < mainE_text.length; item++) {
      const nc = document.createElement("div");
      nc.innerHTML = `<div class="inner-active-text-item"> ${mainE_text[item]}</div>`;
      nc.classList.add("active-text-item");
      nc.firstChild.style.animation = `text-ani 0.3s ease-out forwards ${(item * duration) / 1000
        }s`;
      mainE.append(nc);
    }
  }
}
// parallax function makes elements move with the mouse
function parallax(elementId, divider) {
  const parallax = document.getElementById(elementId);
  parallax.classList.add("parallax-Element");
  // finally fixed this bs
  if (window.innerWidth >= 770) {
    document.addEventListener("mousemove", (event) => {
      let _mouseX =
        (event.clientX - document.documentElement.clientWidth / 2) / divider;
      let _mouseY =
        (event.clientY - document.documentElement.clientHeight / 2) / divider;

      parallax.style.transform = `translate(${_mouseX}px, ${_mouseY}px)`;
      parallax.style.webkitTransform = `translate(${_mouseX}px, ${_mouseY}px)`;
      parallax.style.mozTransform = `translate(${_mouseX}px, ${_mouseY}px)`;

      setTimeout(() => {
        parallax.style.transition = "all  0s";
      }, 300);
    });
  }
}
// animates text in
function coolTextFunc(element, text) {
  element.style.opacity = 1;
  let virtual_origin = String(text);
  let render_list = [];
  charSet = "1234567890#@$&%";
  for (let letter = 0; letter < virtual_origin.length; letter++) {
    let virtual_string_letter = virtual_origin.slice(0, letter);
    for (
      let randomLetter = 0;
      randomLetter < Math.random() * 3;
      randomLetter++
    ) {
      let vslt = virtual_string_letter;
      vslt += charSet.charAt(Math.floor(Math.random() * charSet.length));
      render_list.push(vslt);
    }
    render_list.push(virtual_origin.slice(0, letter + 1));
  }
  // this tool SOOOOO LONNG but it kinda slaps ngl
  for (let renderFor = 0; renderFor < render_list.length; renderFor++) {
    setTimeout(() => {
      element.innerHTML = `<span class="hover-prefix">[</span>${render_list[renderFor]}<span class="hover-prefix">]</span>`;
    }, 20 * renderFor);
  }
}
// makes a element tilt and transform perspective with the mouse
function setTiltEffect(element, tiltEffectSettings) {
  // im'a let some other chump organize this code. oh wait, its a solo project :(
  const card = element;
  document.addEventListener("mouseenter", cardMouseEnter);
  document.addEventListener("mousemove", cardMouseMove);
  document.addEventListener("mouseleave", cardMouseLeave);

  function cardMouseEnter(event) {
    setTransition();
  }

  function cardMouseMove(event) {
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const centerX = card.offsetLeft + cardWidth / 2;
    const centerY = card.offsetTop + cardHeight / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const rotateXUncapped =
      +1 * ((tiltEffectSettings.max * mouseY) / (cardHeight / 2));
    const rotateYUncapped =
      -1 * ((tiltEffectSettings.max * mouseX) / (cardWidth / 2));
    const rotateX =
      rotateXUncapped < -tiltEffectSettings.max
        ? -tiltEffectSettings.max
        : rotateXUncapped > tiltEffectSettings.max
          ? tiltEffectSettings.max
          : rotateXUncapped;
    const rotateY =
      rotateYUncapped < -tiltEffectSettings.max
        ? -tiltEffectSettings.max
        : rotateYUncapped > tiltEffectSettings.max
          ? tiltEffectSettings.max
          : rotateYUncapped;

    card.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) 
                          scale3d(${tiltEffectSettings.scale}, ${tiltEffectSettings.scale}, ${tiltEffectSettings.scale})`;
  }

  function cardMouseLeave(event) {
    setTransition();
  }

  function setTransition() {
    clearTimeout(card.transitionTimeoutId);
    card.style.transition = `transform ${tiltEffectSettings.speed}ms ${tiltEffectSettings.easing}`;
    card.transitionTimeoutId = setTimeout(() => {
      card.style.transition = "";
    }, tiltEffectSettings.speed);
  }
}
// add the main page loader
function addLoaderAnimation() {
  for (let i = 0; i < effectRes[0]; i++) {
    const newLine = document.createElement("div");
    newLine.classList.add("line");
    effectEle.append(newLine);
    for (let ii = 0; ii < effectRes[1]; ii++) {
      const newUnit = document.createElement("div");
      newUnit.classList.add("unit");
      newLine.append(newUnit);
      // wtf why doesn't this work
      newUnit.style.width =
        effectEle.getBoundingClientRect().width / Number(effectRes[1]) + "px";
      newUnit.style.height =
        effectEle.getBoundingClientRect().height / Number(effectRes[0]) + "px";
      newLine.style.height =
        effectEle.getBoundingClientRect().height / Number(effectRes[0]) + "px";

      setTimeout(() => {
        newUnit.style.opacity = 0;
        effectResCount--;
        if (effectResCount == 0) {
          setTimeout(() => {
            effectEle.remove();
            document.body.style.background = "var(--background)";
            loadAll();
          }, 700);
        }
      }, 1000 + Math.random() * 1000);
    }
  }
}
//set scrollbar script propertys
function setScrollBarScript() {
  document.addEventListener("scroll", () => {
    const base_main = main.clientHeight;
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
    scrollbar.style.marginTop = `${(scrollbarInn.clientHeight / 100) * percentage - 20
      }px`; // Assigning marginTop in pixels;
    if (window.scrollY >= 10) {
      navbar.style.transform = "translateY(-60px)";
      navbarExtra.style.transform = "translateY(60px)";
    } else {
      navbar.style.transform = "translateY(0px)";
      navbarExtra.style.transform = "translateY(0px)";
    }
    main.style.opacity = (100 - window.scrollY / 7) / 100;
    projects.style.opacity = (100 - window.scrollY / 7) / 100;
    //main.style.height = base_main - window.scrollY / 3 + "px";
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  welcomeBanner.addEventListener("click", () => {
    window.scroll({
      top: about.offsetTop,
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
        location.reload();
      }
    }
    setInterval(checkZoom, 100);
    window.addEventListener("resize", checkZoom);
  })();
}
// load #main and all its effects
async function loadAll() {
  function daysSince(dateStr) {
    // Split the date string into day, month, and year components
    var parts = dateStr.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript Date object
    var year = parseInt(parts[2], 10);

    // Create a Date object for the input date
    var inputDate = new Date(year, month, day);

    // Get the current date
    var currentDate = new Date();

    // Calculate the difference in milliseconds
    var timeDiff = currentDate.getTime() - inputDate.getTime();

    // Convert milliseconds to days
    var daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  }
  loader_page.style.opacity = 0;
  setTimeout(() => {
    loader_page.remove();
    animate("lar-1", 20);
    setTimeout(() => {
      animate("lar-2", 20);
      setTimeout(() => {
        navbar.style.transform = "translateY(0%)";
        navbarExtra.style.transform = "translateY(0%)";
        setTimeout(() => {
          projectsTitleAnimateLoader.style.opacity = 1;
          //------------------------------------------------------
          fetch("src/js/projects.json")
            .then((response) => response.json())
            .then((json) => {
              json
                .sort((a, b) => b[0].length - a[0].length)
                .forEach((element, index) => {
                  const newProjectButton = document.createElement("button");
                  const newItemProject = document.createElement("div");
                  newProjectButton.innerText = "made by 3hy";
                  newItemProject.classList.add("item");
                  newProjectButton.addEventListener("click", () => {
                    newProjectButton.innerHTML = "";
                    coolTextFunc(newProjectButton, element[0]);
                    setTimeout(() => {
                      window.open(String(element[1]));
                    }, 400);
                  });
                  newProjectButton.classList.add("project-project");
                  newItemProject.append(newProjectButton);
                  projects.append(newItemProject);
                  setTimeout(() => {
                    coolTextFunc(newProjectButton, element[0]);
                  }, 300 * index);
                  if (daysSince(element[2]) < 20) {
                    newItemProject.classList.add("new");
                    newProjectButton.title = `NEW ( ${daysSince(
                      element[2]
                    )} Days Ago )`;
                  } else {
                    newProjectButton.title = element[2];
                  }
                  if (element[3]) {
                    newProjectButton.title =
                      newProjectButton.title + element[3];
                  }
                });
            });
          document.body.style.overflowY = "scroll";
          //------------------------------------------------------
        }, 500);
      }, 500);
    }, 200);
    setTimeout(() => {
      document.getElementById("text-lar-1").innerText = "MY";
      document.getElementById("text-lar-2").innerText = "WEBSITE";
    }, 3000);
  }, 300);
}
// animate in the MY WEBSITE text
function animate(class_, delay_) {
  const ele_ = document.getElementsByClassName(class_)[0];
  ele_.style.opacity = 1;
  const list_ = ele_.textContent.split("");
  ele_.innerHTML = "";
  list_.forEach((char, index) => {
    const new_0 = document.createElement("div");
    const new_1 = document.createElement("div");
    new_1.innerHTML = char;
    new_1.classList.add("inn");
    new_0.classList.add("animate-item");
    setTimeout(() => {
      new_0.append(new_1);
      ele_.append(new_0);
    }, index * delay_);
  });
}
//observer for hand shake
function checkHandShakeObserve() {
  if (handShakeElement.getBoundingClientRect().y < window.innerHeight) {
    document.removeEventListener("scroll", checkHandShakeObserve);
    handShakeElement.style.animation = "hand-shake 1s 1s ease";
  }
}
//set the time widget
function setTime() {
  time.innerHTML = String(
    new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  ).replace(":", "<span class='blink'>:</span>");
}
// load the loaders triggers and loader
function baseWebsite() {
  //load the loader :D
  addLoaderAnimation();
  // observer animations trigger
  window.addEventListener("DOMContentLoaded", addCustomKeyframe);
  // window frame tilt settings and trigger
  setTiltEffect(document.getElementsByClassName("lin-inn")[0], {
    max: 10,
    perspective: 1500,
    scale: 1.0,
    speed: 1000,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  });
  // parallax triggers
  parallax("noise", 100);
  parallax("text-lar-1", 30);
  parallax("text-lar-2", 30);
  setTiltEffect(document.getElementById("text-subtle"), {
    max: 10,
    perspective: 1500,
    scale: 1.0,
    speed: 5000,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  });
  //message button triggers
  messageBody.value = "Body";
  messageButton.addEventListener("click", () => {
    window.open(`
      https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(
      "tkf.x1os@gmail.com"
    )}&su=${encodeURIComponent(
      "HIRE-ME-CALLBACK from " + messageEmail.value
    )}&body=${encodeURIComponent(messageBody.value)}`);
    messageEmail.value = "";
    messageBody.style.color = "var(--text-disabled)";
  });
  messageBody.addEventListener("focus", () => {
    messageBody.value = "";
  });

  //set the current status of the clock
  setTime();
  setInterval(setTime, 60000);

  // change the mouse move view
  document.addEventListener("mousemove", (event) => {
    date.innerHTML = `${event.clientX}x-${event.clientY}y`;
  });
  date.innerHTML = "0x-0y";
  setScrollBarScript();
  document.addEventListener("scroll", checkHandShakeObserve);
}

baseWebsite();
