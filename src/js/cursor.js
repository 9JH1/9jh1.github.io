document.addEventListener("mousemove", (event) => {
    const cursor_ = document.getElementById("cursor");
    cursor_.style.transform = `translate(${event.clientX - 10}px, ${event.clientY - 10}px)`;
    console.log(event.clientX);

})

document.addEventListener("mouseleave", () => {
    document.getElementById("cursor").style.opacity = 0;
})

document.addEventListener("mouseenter", () => {
    document.getElementById("cursor").style.opacity = 1;
})