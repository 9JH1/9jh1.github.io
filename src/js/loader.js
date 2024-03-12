window.onload = async () => {
    const loader = document.getElementById("loader");
    const loader_page = document.getElementsByClassName("loader")[0];
    const list_ = ["---------------------<br>loading webpage", "loading fonts", "loading animations", "loading css", "loading images", "loading some other cool things"];
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
                        }
                    }, 300);
                }, 1000);
            }, 10 + a * Math.random() * 400);
        }
    });
    loop_.then(() => {
        loader_page.style.opacity = 0;
        setTimeout(() => {
            loader_page.remove();
            animate("lar-1", 20);
            setTimeout(() => {
                animate("lar-2", 20);
                setTimeout(() => {
                    document.getElementById("navbar").style.transform = "translateY(0%)";
                    document.body.style.overflowY = "scroll";
                    //document.getElementById("scrollbar").style.transform = "translateX(0%)"; 
                    // NUH UH
                }, 500);
            }, 200);
        }, 300);
    });
};

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
document.addEventListener("DOMContentLoaded", () => {
    animateInTitle("test")
})
function animateInTitle(newTitle) {
    const list_ = newTitle.split('');
    const title_ = document.getElementById("title-act");
    const old_ = title_.innerText;
    const char_ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&".split("");
    let render_ = [];
    let titleText = old_.split('');
    for (let i = 0; i < old_.length; i++) {
        let randomNumber = Math.round(Math.random() * (30 - 6) + 6);
        for (let ii = 0; ii < randomNumber; ii++) {
            let randomNumberChar = Math.round(Math.random() * (char_.length - 0));
            titleText[i] = char_[randomNumberChar];
            render_.push(titleText);
            console.log(titleText);

        }
    }
    console.log(render_)

}



/*
const letter_ = list_[i];
const randomI_ = Math.random * 100;

setTimeout(() => {
    title_.innerText += letter_;
}, (700 * i) + 500);
console.log(letter_)
console.log(i);
*/