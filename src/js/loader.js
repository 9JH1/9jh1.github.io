
window.onload = async () => {
    const loader = document.getElementById("loader");
    const loader_page = document.getElementsByClassName("loader")[0];
    const list_ = ["---------------------<br>loading webpage", "loading fonts", "loading animations", "loading css", "loading images", "loading some other cool things", "thanks for visiting <br> my website"];
    //document.getElementById("title-act").innerText = "⠀"
    // i cant remember if this is useful or not, so im going to leave it here.
    const loop_ = new Promise((resolve, reject) => {
        for (let a = 0; a < list_.length; a++) {
            setTimeout(() => {
                const new_ = document.createElement("div");
                new_.classList.add("com");
                new_.innerHTML = list_[a];
                loader.append(new_);
                setTimeout(() => {
                    new_.style.opacity = 0;
                    setTimeout(() => {
                        new_.remove();
                        if (a === list_.length - 1) {
                            resolve();
                            // wtf, i cant remeber coding this. it works and thats fine
                        }
                    }, 300);
                }, 70);
            }, 10 + a * Math.random() * 20);
        }
    });
    loop_.then(() => {
        loader_page.style.opacity = 0;
        setTimeout(() => {
            loader_page.remove();
            animate("lar-1", 20);
            // splayed timing !!!!!
            setTimeout(() => {
                animate("lar-2", 20);
                // anothuh one
                setTimeout(() => {
                    document.getElementById("navbar").style.transform = "translateY(0%)";
                    document.getElementById("extra-nav").style.transform = "translateY(0%)";
                    //document.body.style.overflowY = "scroll";
                    setTimeout(() => {
                        document.getElementsByClassName("projects-title-animate-loader")[0].style.opacity = 1;

                        setTimeout(() => {
                            coolTextFunc(document.getElementById("project-project-one"), "OPEN-CHAT");
                            coolTextFunc(document.getElementById("project-project-two"), "Terminal");
                            coolTextFunc(document.getElementById("project-project-three"), "xos");
                            document.getElementById("project-project-one").addEventListener("click", () => {
                                coolTextFunc(document.getElementById("project-project-one"), "OPEN-CHAT");
                            })

                            document.getElementById("project-project-two").addEventListener("click", () => {
                                coolTextFunc(document.getElementById("project-project-two"), "Terminal");
                            })

                            document.getElementById("project-project-three").addEventListener("click", () => {
                                coolTextFunc(document.getElementById("project-project-three"), "xos");
                            })
                        }, 400);
                    }, 500);
                    //document.getElementById("scrollbar").style.transform = "translateX(0%)"; 
                    // NUH UH
                }, 500);
            }, 200);
        }, 300);
    });
};

function animate(class_, delay_) {
    // what does this do again??
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
function animateTextPar(element, duration) {
    const mainE = document.getElementsByClassName(element)[0];
    const mainE_text = mainE.innerText.replace(/\n/g, "").split(" ");
    mainE.innerHTML = "";
    // this some bs man
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
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
            nc.firstChild.style.animation = `text-ani 0.3s ease-out forwards ${item * duration / 1000}s`;
            mainE.append(nc);
        }
    }
}
function parallax(elementId, divider) {
    const parallax = document.getElementById(elementId);
    parallax.classList.add("parallax-Element");
    // finally fixed this bs
    if (window.innerWidth >= 770) {
        document.addEventListener("mousemove", (event) => {
            let _mouseX = ((event.clientX - (document.documentElement.clientWidth / 2)) / divider);
            let _mouseY = ((event.clientY - (document.documentElement.clientHeight / 2)) / divider);

            parallax.style.transform = `translate(${_mouseX}px, ${_mouseY}px)`;
            parallax.style.webkitTransform = `translate(${_mouseX}px, ${_mouseY}px)`;
            parallax.style.mozTransform = `translate(${_mouseX}px, ${_mouseY}px)`;

            setTimeout(() => {
                parallax.style.transition = "all  0s";
            }, 300);
        });

        document.addEventListener("mouseout", () => {
            parallax.style.transform = "translate(0px, 0px)";
            parallax.style.webkitTransform = "translate(0px, 0px)";
            parallax.style.mozTransform = "translate(0px, 0px)";
        });
    }
}
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
        const rotateXUncapped = (+1) * (tiltEffectSettings.max * mouseY / (cardHeight / 2));
        const rotateYUncapped = (-1) * (tiltEffectSettings.max * mouseX / (cardWidth / 2));
        const rotateX = rotateXUncapped < -tiltEffectSettings.max ? -tiltEffectSettings.max : (rotateXUncapped > tiltEffectSettings.max ? tiltEffectSettings.max : rotateXUncapped);
        const rotateY = rotateYUncapped < -tiltEffectSettings.max ? -tiltEffectSettings.max : (rotateYUncapped > tiltEffectSettings.max ? tiltEffectSettings.max : rotateYUncapped);

        card.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) 
                          scale3d(${tiltEffectSettings.scale}, ${tiltEffectSettings.scale}, ${tiltEffectSettings.scale})`;
    }

    function cardMouseLeave(event) {
        card.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
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
function coolTextFunc(element, text) {
    element.style.opacity = 1;
    let virtual_origin = String(text);
    let render_list = [];
    charSet = "1234567890#@$&%";
    for (let letter = 0; letter < virtual_origin.length; letter++) {
        let virtual_string_letter = virtual_origin.slice(0, letter);
        for (let randomLetter = 0; randomLetter < Math.random() * 3; randomLetter++) {
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
function animateLinkOnHover(element, text) {
    const mouseMover = document.getElementById("mouse-move-cursor-dialog");
    element.addEventListener("mouseenter", () => {
        mouseMover.style.opacity = 1;
        setTimeout(() => {
            coolTextFunc(mouseMover, text);
        }, 2000)
        console.log("left");
        // why did i make this, what is the point??? there are already hover events tf was i thinking...
    })
    element.addEventListener("mouseleave", () => {
        mouseMover.style.opacity = 0;
        coolTextFunc(mouseMover, "    ");
        console.log("left");
    })
}


document.addEventListener("mousemove", (event) => {
    const mouseMover = document.getElementById("mouse-move-cursor-dialog");
    mouseMover.style.marginTop = event.clientY + "px";
    mouseMover.style.marginLeft = event.clientX + "px";

})
document.getElementById("text-animate-welcome-to").addEventListener("mouseenter", () => {
    coolTextFunc(document.getElementById("text-animate-welcome-to"), "contact");

})
document.getElementById("text-animate-welcome-to").addEventListener("mouseleave", () => {
    coolTextFunc(document.getElementById("text-animate-welcome-to"), "welcome_to")
})



parallax("noise", 100);
parallax("text-lar-1", 30);
parallax("text-lar-2", 30);
setTiltEffect(document.getElementsByClassName("lin-inn")[0], {
    max: 3,
    perspective: 1500,
    scale: 1.0,
    speed: 500,
    easing: "cubic-bezier(.03,.98,.52,.99)"
});
