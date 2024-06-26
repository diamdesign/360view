// Get the value of the 'i' parameter from the URL
export function formatNumber(number) {
	if (number >= 1000000) {
		return (number / 1000000).toFixed(1) + "M";
	} else if (number >= 10000) {
		return (number / 1000).toFixed(1) + "k";
	} else {
		return number.toLocaleString();
	}
}

export function receiveMessage(event) {
	const identifier = "360";
	// Access the data from the event object
	const messageData = event.data;
	if (messageData.identifier === identifier) {
		return messageData;
	}

	// Process the messageData as needed
}

// Function to convert data URI to Blob
export function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(",")[1]);
	var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: mimeString });
}

export function copyToClipboard(selectorId) {
	// Find the element with the specified ID
	const element = document.querySelector(selectorId);

	// Create a temporary textarea element
	const textarea = document.createElement("textarea");
	textarea.value = element.textContent; // Set the value to the text content of the element
	document.body.appendChild(textarea); // Append the textarea to the document body

	// Select the text inside the textarea
	textarea.select();
	textarea.setSelectionRange(0, 99999); // For mobile devices

	// Add the 'flash' class to the element
	element.classList.add("copyflash");
	setTimeout(() => {
		// Remove the 'flash' class after 200 milliseconds
		element.classList.remove("copyflash");
	}, 300);

	// Copy the selected text to the clipboard
	document.execCommand("copy");

	// Remove the temporary textarea
	document.body.removeChild(textarea);
}

export function getTimeAgo(timestamp) {
	const currentDate = new Date();
	const date = new Date(timestamp);
	const timeDiff = currentDate - date;

	const seconds = Math.floor(timeDiff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) {
		return years + "y";
	} else if (months > 0) {
		return months + "m";
	} else if (days > 0) {
		return days + "d";
	} else if (hours > 0) {
		return hours + "h";
	} else {
		return minutes + "m";
	}
}

export function countComments(data) {
	if (!Array.isArray(data)) {
		return 0; // or handle the non-array case appropriately
	}

	let totalCount = 0;
	data.forEach((item) => {
		// Count the main comment
		totalCount++;

		// Count the replies
		if (item.replies && Array.isArray(item.replies)) {
			totalCount += item.replies.length;
		}
	});
	return totalCount;
}

export function getUrlParameter(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	var results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export async function xhrSend(type, file, data, header = null) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open(type, file, true);
		if (header === null) {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else if (header === "json") {
			xhr.setRequestHeader("Content-Type", "application/json");
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var responseText = xhr.responseText.trim(); // Remove leading/trailing whitespace
					// Check if the response starts with an empty array
					if (responseText.startsWith("[]")) {
						// Remove the empty array and extract the object
						var trimmedResponse = responseText.substring(2).trim(); // Remove the empty array characters
						var data = JSON.parse(trimmedResponse);
						resolve(data);
					} else {
						// Parse the response as JSON directly
						var data = JSON.parse(responseText);

						resolve(data);
					}
				} else {
					reject(xhr.statusText);
				}
			}
		};
		// Send the request with the provided data
		xhr.send(data);
	});
}

export function testInternetSpeed() {
	return new Promise((resolve, reject) => {
		const imageAddr = "../img/360-low.jpg"; // A sample image URL
		const downloadSize = 63633; // Size of the test image in bytes (adjust as needed)
		const startTime = new Date().getTime();

		const image = new Image();
		image.onload = function () {
			const endTime = new Date().getTime();
			const duration = (endTime - startTime) / 1000; // Duration in seconds
			const bitsLoaded = downloadSize * 8;
			const speedBps = (bitsLoaded / duration).toFixed(2);
			const speedKbps = (speedBps / 1024).toFixed(2); // Speed in Kilobits per second
			resolve(speedKbps);
		};
		image.onerror = function (err) {
			reject(err);
		};
		image.src = imageAddr + "?n=" + Math.random(); // Prevent caching
	});
}
