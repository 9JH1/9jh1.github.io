

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
	const url = new URLSearchParams(window.location.search);
	
	document.querySelectorAll(".utc").forEach(element=>{
		element.innerHTML = format_time(new Date(element.innerText));
	})

	if(url.has("p")){
		fetch('data.json')
			.then(res => {
				return res.json();
			})
			.then(data => {
				if (url.get("p").length > data["journal"].length) {
					document.body.innerHTML = "404";
					document.head.innerHTML = "";
				} else {
					const loc = data["journal"][url.get("p")];
					let out = "";

					out += `title  : ${loc.title}\n`;
					out += `tags   : ${loc.tags.join(", ")}\n`;
					out += `date   : ${loc.date}\n`;
					out += `posted : ${format_time(new Date(loc.date))}\n`
					out += `url    : ${location.href}\n`
					out += `-`.repeat(20) + '\n';
					out += `${loc.content}`;
					document.body.innerText = out;
				}

				// Set basic styles and wipe head
				document.body.style.whiteSpace = "pre";
				document.body.style.fontFamily = "monospace";
				document.body.style.textWrap = "wrap";
				document.head.innerHTML = "";
		})
	}

	// Disallow scrolling
	if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}

// Log load-time 
const [entry] = performance.getEntriesByType("navigation");
const realLoadTime = entry.loadEventEnd - entry.loadEventStart;
console.log(`Actual browser-reported load time: ${realLoadTime} ms`);
