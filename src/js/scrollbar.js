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
    scrollbar.style.marginTop = `${((scrollbarInn.clientHeight / 100) * percentage) - 20}px`; // Assigning marginTop in pixels;
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);