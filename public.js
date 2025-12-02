// Log start time 
const st = performance.now();

function format_time(ms)
{
	if (!ms || ms <= 0) return "0s ago";
	ms = Math.floor(ms / 1000); // now in seconds

	const units = [
		{ label: "d", secs: 86400 },
		{ label: "h", secs: 3600 },
		{ label: "m", secs: 60 },
		{ label: "s", secs: 1 }
	];

	let str = "";
	for (const { label, secs } of units) {
		const val = Math.floor(ms / secs);
		if (val > 0) {
			str += `${val}${label} `;
			ms %= secs;
		}
		if (str) break; // stop after first non-zero
	}

	return (str || "0s").trim() + " ago";
}

// Initialize on page load
window.onload = function() 
{
	const title = document.getElementById("title");
	const roota = document.documentElement;
	const rootw = document.getElementById("base");
	const wcont = document.getElementById("content");
	let posx, posy;

	// Initialize page
	const unit = rootw.getBoundingClientRect();
	const default_title = "Home"
	rootw.classList.remove("startup");
	rootw.classList.add("root");

	// Set styles
	roota.style.setProperty("--unit-w", unit.width + "px");
	roota.style.setProperty("--unit-h", unit.height + "px");

	// Update positions
	window.addEventListener("mousemove", (e) => {
		posx = Math.floor(e.clientX / unit.width);
		posy = Math.floor(e.clientY / unit.height);
	});

	// Set dimensions of root element
	function resize_root_element()
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
	wcont.innerHTML.split('\n').forEach((line) => out += line.trimStart());
	rootw.innerHTML = out;
	wcont.remove();
	const projw = document.getElementById("projects");
	const jourw = document.getElementById("journal");

	fetch('http://wish-reggae.gl.at.ply.gg:10108')
		.then(res => {
			if (!res.ok)
				window.alert("data.json couldent be loaded..");
			return res.json();
		})
		.then(data => {
			for (const project of data["projects"]) {
				const h_item = document.createElement("div");
				h_item.classList.add("li");
				h_item.innerHTML += `<p><a href="${project.url}">${project.name}</a></p>`
				h_item.innerHTML += `<span class="l-text" title="description | tag(s)">${project.tagline} | ${project.tags.join(", ")}</span>`

				const h_item_desc_div = document.createElement("div");
				h_item.append(h_item_desc_div);

				const h_item_desc_ul = document.createElement("ul");
				h_item_desc_div.append(h_item_desc_ul);

				for (const desc of project["description"]) {
					h_item_desc_ul.innerHTML += `<li>${desc.cont}</li>`
				}

				projw.append(h_item);

				h_item.addEventListener("mouseenter", () => {
					title.innerText = `${project.name} | ${project.tagline}`
				});

				h_item.addEventListener("mouseleave", () => {
					title.innerText = default_title;
				});
			}


			for (const entry of data["journal"]) {
				const h_item = document.createElement("div");
				const date = new Date(entry.date);
				const date_s = entry.date.replace(/-/g,'/').replace('T', ' ').split('.')[0];
				const h_cont = document.createElement("div");
				const now = new Date();
				const time_since = format_time(now - date);

				h_item.classList.add("li");
				h_item.innerHTML += `<p><b>${entry.title}</b></p>`;
				h_item.innerHTML += `<span class="l-text" title="${date_s}">${time_since} | ${entry.tags}</span>`;

				h_item.append(h_cont);
				h_cont.innerText = entry.content;
				jourw.append(h_item);
			}
		})
		.catch(err => {
			console.error("Loading data.json threw error: " + err);
		})

	// Scroll to top of document
	if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
	}
	document.body.scrollTop = document.documentElement.scrollTop = 0;

	// Log load-time 
	console.log(`Page loaded in ${performance.now() - st}ms`)
}
