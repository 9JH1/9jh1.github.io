console.clear();

if(window.location.search ){
  const searchResults = String(window.location.search).replace("?","");
  fetch("./src/js/journal.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    Object.keys(data).forEach(key => {
      if(key == searchResults){ 
        document.head.innerHTML = `<title>${location.href}</title>`
        document.body.id=null;
        document.body.classList=null;
        document.body.style.cssText=null
        document.body.innerText = JSON.stringify(data[key])
        
        setTimeout(()=>{console.clear()},3000)
      }
    });
  })
}



function lms(){
fetch("./src/js/journal.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    Object.keys(data).forEach(key => {
      const newLog = document.createElement("div");
      newLog.classList.add("message-log");
      newLog.innerHTML =  /*html*/`
          
      `;
    });
  })
}