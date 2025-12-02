// Log start time 
const st = performance.now();

function format_time(date) {
	let ms = Date.now() - date.getTime();
	console.log(ms);
	if (!ms || ms <= 0) return "0s ago";
	ms = Math.floor(ms / 1000); 

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
		if (str) break; 
	}

	return (str || "0s").trim() + " ago";
}

// Initialize on page load
window.onload = function() {
	const title = document.getElementById("title");
	const roota = document.documentElement;
	const rootw = document.getElementById("base");
	const wcont = document.getElementById("content");

	// Initialize page
	const unit = rootw.getBoundingClientRect();
	const default_title = "Home"

	title.innerText = default_title;
	rootw.classList.remove("startup");
	rootw.classList.add("root");
	rootw.innerHTML = "";

	// Set styles
	roota.style.setProperty("--unit-w", unit.width + "px");
	roota.style.setProperty("--unit-h", unit.height + "px");

	// Set dimensions of root element
	function resize_root_element() {
		rootw.style.width = (Math.floor(window.innerWidth / unit.width) - 1) * unit.width + "px"
	}

	resize_root_element();
	window.addEventListener("resize", resize_root_element);

	// Load content 
	let out = "";
	wcont.innerHTML.split('\n').forEach((line) => out += line.trimStart());
	rootw.innerHTML = out;
	wcont.remove();

	// Load json data
	const projw = document.getElementById("projects");
	const jourw = document.getElementById("journal");

	fetch('data.json')
		.then(res => {
			if (!res.ok)
				window.alert("data.json couldent be loaded..");
			return res.json();
		})
		.then(data => {
			for (const project of data["projects"]) {
				const h_item = document.createElement("div");
				const h_item_desc_ul = document.createElement("ul");
				const h_item_desc_div = document.createElement("div");

				h_item.classList.add("li");
				h_item.innerHTML += `<p><a href="${project.url}">${project.name}</a></p>`
				h_item.innerHTML += `<span class="l-text" title="description | tag(s)">${project.tagline} | ${project.tags.join(", ")}</span>`
				h_item.append(h_item_desc_div);
				h_item_desc_div.append(h_item_desc_ul);
				projw.append(h_item);

				for (const desc of project["description"]) {
					h_item_desc_ul.innerHTML += `<li>${desc.cont}</li>`
				}


				h_item.addEventListener("mouseenter", () => {
					title.innerText = `${project.name} | ${project.tagline}`
				});

				h_item.addEventListener("mouseleave", () => {
					title.innerText = default_title;
				});
			}


			for (const entry of data["journal"]) {
				const h_item = document.createElement("div");
				const h_cont = document.createElement("div");
				const date = new Date(entry.date);
				const date_s = date.toLocaleDateString(undefined, {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric'
				}) + " " + date.toLocaleTimeString(undefined, {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false
				});

				h_item.classList.add("li");
				h_item.innerHTML += `<p><b>${entry.title}</b></p>`;
				h_item.innerHTML += `<span class="l-text" title="Posted ${date_s}">${format_time(date)} | ${entry.tags.join(", ")}</span>`;
				h_cont.innerText = entry.content;

				h_item.append(h_cont);
				jourw.append(h_item);
			}
		})

	// Scroll to top of document
	if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
	document.body.scrollTop = document.documentElement.scrollTop = 0;

	// Log load-time 
	console.log(`Page loaded in ${performance.now() - st}ms`)
}
