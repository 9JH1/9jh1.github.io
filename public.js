// Log start time 
const st = performance.now();

// Initialize on page load
window.onload = function() 
{
	const roota = document.documentElement;
	const rootw = document.getElementById("base");
	const wcont = document.getElementById("content"); 
	let posx, posy;

	// Initialize page
	const unit = rootw.getBoundingClientRect();
	rootw.classList.remove ("startup");
	rootw.classList.add ("root");
	
	// Set styles
	roota.style.setProperty("--unit-w", unit.width + "px");
	roota.style.setProperty("--unit-h", unit.height + "px");

	// Update positions
	window.addEventListener("mousemove",(e) => {
		posx = Math.floor(e.clientX / unit.width);
		posy = Math.floor(e.clientY / unit.height);
	});

	// Set dimensions of root element
	function resize_root_element ()
	{
		const u_w = (Math.floor(window.innerWidth / unit.width) - 1) * unit.width;
		/* const u_h = (Math.floor(window.innerHeight / unit.height) - 1) * unit.height; */

		rootw.style.width = u_w + "px";
		/*rootw.style.height = u_h + "px";*/
	}
	
	resize_root_element();
	window.addEventListener("resize", resize_root_element);
		
	// Load content 
	let out = "";
	wcont.innerHTML.split('\n').forEach((line)=>out+=line.trimStart());
	rootw.innerHTML = out;
	wcont.remove();
	const projw = document.getElementById("projects");

	fetch('data.json')
	.then(res => {
		if(!res.ok)
			window.alert("data.json couldent be loaded..");
		return res.json();
	})
	.then(data => {
		console.log(data);
		for(const project of data["projects"]){
			const h_item = document.createElement("div");
			h_item.classList.add("li");
			h_item.innerHTML += `<p><a href="${project.url}">${project.name}</a></p>`
			h_item.innerHTML += `<span class="l-text" title="description | tag(s)">${project.tagline} | ${project.tags.join(", ")}</span>`
			
			const h_item_desc_div = document.createElement("div");
			h_item.append(h_item_desc_div);

			const h_item_desc_ul = document.createElement("ul");
			h_item_desc_div.append(h_item_desc_ul);

			for(const desc of project["description"]){
				h_item_desc_ul.innerHTML += `<li>${desc.cont}</li>`
			}

			projw.append(h_item);
		}

	})
	.catch(err => {
		console.error("Loading data.json threw error: " + err);
	})

	// Log load-time 
	console.log(`Page loaded in ${performance.now() - st}ms`)
}
