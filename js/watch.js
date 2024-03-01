const embedId = getUrlParameter("i");
const locId = getUrlParameter("loc");

const data = "i=" + embedId + "&loc=" + locId;
const file = "../php/getdata.php";

// Usage example:
xhrSend("POST", file, data)
	.then((data) => {
		// Handle the response data
		console.log(data);
	})
	.catch((error) => {
		// Handle any errors
		console.error("XHR request failed:", error);
	});
