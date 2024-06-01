function aboutMe(){
    const newPage = document.createElement("div"); 
    newPage.classList.add("about-me"); 
    document.body.append(newPage);
    newPage.innerHTML = /*html*/`

    <div class="info">
        <div class="title">
        Welcome to my website, im 3hy, ive been programming since 2020<br>
        which has given me the time to learn several different skills<br>
        such as web development and software development among other<br> 
        things<br><br>
        im not going to get into a sappy life story,<br> 
        this portion of my website is not finished yet<br><br>
        </div>
        <div class="multi-line">
            <div class="title">3hy</div>
            <div class="gap"> | </div>
            <div class="answer">2024</div>
        </div>
    </div>

    `
    
}