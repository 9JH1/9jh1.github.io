if(document.body.getBoundingClientRect().width < 1120){ 
    window.addEventListener("resize",()=>{
        const projects = document.getElementById("projects"); 
        projects.style.bottom = document.body.getBoundingClientRect().height + "px"
    })
}