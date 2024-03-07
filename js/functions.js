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

export async function xhrSend(type, file, data) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open(type, file, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
