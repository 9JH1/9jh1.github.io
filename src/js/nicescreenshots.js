document.addEventListener("keydown",(event)=>{
    if(event.key =="S"&&event.shiftKey){ 
        document.body.innerHTML = ""
    }
})