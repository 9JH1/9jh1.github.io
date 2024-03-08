window.addEventListener("DOMContentLoaded", addCustomKeyframe);

function addCustomKeyframe() {
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