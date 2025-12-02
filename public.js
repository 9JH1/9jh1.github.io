// Log start time 
const st = performance.now();

const url = window.location.search;
const url_params = new URLSearchParams(url);
let page_load = -1;

if (url_params.has("p")) {
	page_load = url_params.get("p");
}

function format_time(date) {
	let ms = Math.floor((Date.now() - date.getTime()) / 1000);

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
	if (page_load == -1) {
		const title = document.getElementById("title");
		const roota = document.documentElement;
		const start = document.getElementById("startup");
		const rootw = document.getElementById("content");

		// Initialize page
		const unit = start.getBoundingClientRect();
		const default_title = title.innerText;
		start.remove();
		roota.style.setProperty("--unit-w", unit.width + "px");
		roota.style.setProperty("--unit-h", unit.height + "px");

		// Set dimensions of root element
		function resize_root_element() {
			rootw.style.width = (Math.floor(window.innerWidth / unit.width) - 1) * unit.width + "px"
		}

		resize_root_element();
		window.addEventListener("resize", resize_root_element);

		// Load json data
		const projw = document.getElementById("projects");
		const jourw = document.getElementById("journal");
	}

	fetch('data.json')
		.then(res => {
			return res.json();
		})
		.then(data => {
			if (page_load != -1) {
				if (page_load > data["journal"].length) {
					document.body.innerHTML = "404";
					document.head.innerHTML = "";
				} else {
					const loc = data["journal"][page_load];
					let out = "";

					out += `title  : ${loc.title}\n`;
					out += `tags   : ${loc.tags.join(", ")}\n`;
					out += `date   : ${loc.date}\n`;
					out += `posted : ${format_time(new Date(loc.date))}\n`
					out += `url    : ${location.href}\n`
					out += `---------------------------\n`;
					out += `${loc.content}`;
					document.body.innerText = out;
				}

				// styles
				document.body.style.whiteSpace = "pre";
				document.body.style.fontFamily = "monospace";
				document.body.style.textWrap = "wrap";

				// wipe other data
				document.head.innerHTML = "";
				return;

			} else {
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


					h_item.addEventListener("mouseenter", () => title.innerText = `${project.name} | ${project.tagline}`);
					h_item.addEventListener("mouseleave", () => title.innerText = default_title);
				}

				for (const [index, entry] of data["journal"].entries()) {
					const h_item = document.createElement("div");
					const h_cont = document.createElement("div");
					const date = new Date(entry.date);
					const h_share = document.createElement("span");
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
					h_item.innerHTML += `<p><b>${entry.title}</b> </p>`;
					h_item.innerHTML += `<span class="l-text" title="Posted ${date_s}">${format_time(date)} | ${entry.tags.join(", ")}</span>`;
					h_cont.innerText = entry.content + '\n';

					h_share.classList.add("share");
					h_share.innerText = "Copy Share Link"

					h_share.addEventListener("click", () => {
						const url_text = `${location.href}?p=${index}`;
						navigator.clipboard.writeText(url_text)
							.then(() => {
								console.log('Text copied to clipboard');
								alert('URL copied: ' + url_text);
							})
					});

					h_item.append(h_cont);
					h_cont.append(h_share);
					jourw.append(h_item);
				}
			}
		})

	// Scroll to top of document
	if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
	document.body.scrollTop = document.documentElement.scrollTop = 0;

}

// Log load-time 
console.log(`Page loaded in ${performance.now() - st}ms`)
