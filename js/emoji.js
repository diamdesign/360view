export function installEmoji(elementId) {
	const emojiHTML = `<textarea
				id="commentInputField"
				rows="1"
				style="resize: none; overflow-y: hidden"
				placeholder="Write your comment"
			></textarea>
			<button id="emojiButton">😀</button>
			<div id="emojiContainer">
				<input type="text" id="searchInput" placeholder="Search for emojis..." />
				<div id="emojiList"></div>
			</div>`;

	var insertIntoElement;

	if (elementId === null) {
		insertIntoElement = document.getElementById("emojiplugin");
	} else {
		insertIntoElement = document.getElementById(elementId);
	}

	insertIntoElement.innerHTML = emojiHTML;

	const inputField = document.getElementById("commentInputField");
	const emojiButton = document.getElementById("emojiButton");
	const searchInput = document.getElementById("searchInput");
	const emojiContainer = document.getElementById("emojiContainer");
	const emojiList = document.getElementById("emojiList");
	let emojisData;

	// Function to fetch emojis data from the JSON file
	async function fetchEmojis() {
		try {
			const response = await fetch("../data/emoji-en-US.json"); // Adjust the path as needed
			emojisData = await response.json();
		} catch (error) {
			console.error("Error fetching emojis:", error);
		}
	}

	// Function to filter emojis based on search input
	function filterEmojis() {
		const searchTerm = searchInput.value.trim().toLowerCase();
		emojiList.innerHTML = ""; // Clear existing content
		for (let emoji in emojisData) {
			if (
				emoji.includes(searchTerm) ||
				emojisData[emoji].some((keyword) => keyword.includes(searchTerm))
			) {
				const button = document.createElement("button");
				button.innerText = emoji;
				button.addEventListener("click", () => addEmoji(emoji));
				emojiList.appendChild(button);
			}
		}
	}

	// Function to show/hide emoji list
	emojiButton.addEventListener("click", async () => {
		if (emojiContainer.style.display === "block") {
			emojiContainer.style.display = "none"; // Use assignment operator here
			return;
		} else {
			emojiList.innerHTML = ""; // Clear existing content
			await fetchEmojis(); // Fetch emojis data
			const emojisArray = Object.keys(emojisData);
			const chunkSize = 80; // Number of emojis to load initially
			let startIndex = 0;
			loadEmojis(startIndex, chunkSize, emojisArray);
			emojiContainer.style.display = "block";

			// Lazy loading more emojis when scroll reaches bottom
			emojiList.addEventListener("scroll", function () {
				if (emojiList.scrollTop + emojiList.clientHeight >= emojiList.scrollHeight) {
					startIndex += chunkSize;
					loadEmojis(startIndex, chunkSize, emojisArray);
				}
			});
		}
	});

	// Function to load emojis
	function loadEmojis(startIndex, chunkSize, emojisArray) {
		for (let i = startIndex; i < Math.min(startIndex + chunkSize, emojisArray.length); i++) {
			const emoji = emojisArray[i];
			const button = document.createElement("button");
			button.innerText = emoji;
			button.addEventListener("click", () => addEmoji(emoji));
			emojiList.appendChild(button);
		}
	}

	// Function to add emoji to input field
	function addEmoji(emoji) {
		const maxLength = 200; // Character limit
		let value = inputField.value;
		// Count emojis as two characters
		const emojiCount = (value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []).length;
		const length = value.length + emojiCount;
		if (length < maxLength) {
			inputField.value += emoji;
			adjustTextAreaHeight(); // Adjust textarea height after adding emoji
		}
	}

	// Event listener for search input
	searchInput.addEventListener("input", filterEmojis);

	// Event listener for textarea input
	inputField.addEventListener("input", function () {
		const maxLength = 200; // Character limit
		let value = inputField.value;
		// Count emojis as two characters
		const emojiCount = (value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []).length;
		const length = value.length + emojiCount;
		if (length > maxLength) {
			// Trim input to maxLength characters
			inputField.value = value.slice(0, maxLength - emojiCount);
		}
		adjustTextAreaHeight(); // Adjust textarea height after input
		// Disable emoji button if the character limit is reached
		if (length >= maxLength) {
			emojiButton.disabled = true;
			emojiContainer.style.display = "none";
		} else {
			emojiButton.disabled = false;
		}
	});

	// Adjust textarea height based on content with a maximum of 12 rows
	function adjustTextAreaHeight() {
		const lineHeight = parseInt(window.getComputedStyle(inputField).lineHeight);
		const maxHeight = lineHeight * 12; // Maximum height for 12 rows
		inputField.style.height = "auto"; // Reset height to auto
		inputField.style.overflowY = "hidden"; // Disable vertical scrolling initially
		inputField.rows = 1; // Reset rows to 1
		while (inputField.scrollHeight > inputField.clientHeight && inputField.rows <= 12) {
			inputField.rows++; // Increase rows until content fits or reaches maximum
		}
		if (inputField.rows > 12) {
			inputField.style.overflowY = "auto"; // Enable vertical scrolling if content exceeds 12 rows
			inputField.rows = 12; // Limit to 12 rows
		}
	}
}
