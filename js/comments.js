import { getTimeAgo, formatNumber, xhrSend } from "./functions.min.js";
import { installEmoji } from "./emoji.min.js";

export function buildComments(targetObject, creator, user) {
	const locationId = targetObject.id;
	const allowComments = targetObject.allowcomments;
	const totalComments = targetObject.total_comments;
	const props = targetObject.comments;

	var commentHTML, replyHTML;

	const offset = 1;

	function setupCommentHTML(props) {
		try {
			props.map((comment) => {
				let userId = comment.user_id;
				commentHTML += `<div class="comment" data-id="${comment.id}">
				<a href="${profileBaseUrl + comment.username}" class="thumb"  target="_blank">
					<img src="${comment.thumbnail}" alt="" />
				</a>
				<div class="commentinfo">
					<a href="${profileBaseUrl + comment.username}" class="profilename" target="_blank">
						${comment.username}`;
				if (userId === creatorId) {
					commentHTML += `<span class="creator">· Creator</span>`;
				}

				commentHTML += `</a>
					<p class="message">${comment.comment}</p>
					<span class="timeago">${getTimeAgo(comment.registered)}</span>
					<a href="#like" class="likecomment${comment.has_liked ? " likedcomment" : ""}" data-hasliked="${
					comment.has_liked
				}" data-id="${comment.id}">
						<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
							<rect fill="none" height="256" width="256" />
							<path
								d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
							/>
						</svg>
						<span>
						${formatNumber(comment.likes_count).trim()}
						</span>
					</a>
					<a href="#reply" class="replybtn" data-id="${comment.id}" data-name="${comment.username}">Reply</a>
				</div>
			</div>`;

				if (comment.reply_count > 0) {
					commentHTML += `<div class="replies" data-parent_id="${comment.id}">
				<div class="btn-showreplies" data-parent_id="${comment.id}">+ View ${comment.reply_count} replies</div>
				<div class="replies-container" data-parent_id="${comment.id}"></div>
			</div>`;
				}
			});
		} catch (error) {
			console.error("Error occurred during mapping:", error);
		}
	}

	function setupRepliesHTML(props) {
		props.map((reply) => {
			let replyId = reply.user_id;

			replyHTML += `<div class="comment reply" data-id="${reply.id}" data-reply_id="${
				reply.reply_id
			}" data-parent_id="${reply.parent_id}">
						<a href="${profileBaseUrl + reply.username}" class="thumb" target="_blank"><img src="${
				reply.thumbnail
			}" alt="" /></a>
						<div class="commentinfo">
							<div class="repliedto">
								<a href="${profileBaseUrl + reply.username}" class="profilename" target="_blank">${reply.username}`;

			if (replyId === creatorId) {
				replyHTML += `<span class="creator">· Creator</span>`;
			}

			replyHTML += `</a> > <a href="${
				profileBaseUrl + reply.reply_username
			}" class="profilename replyto" target="_blank">${reply.reply_username}`;

			if (reply.reply_username === creator.username) {
				replyHTML += `<span class="creator">· Creator</span>`;
			}

			replyHTML += `</a>
							</div>
							<p class="message">${reply.comment}</p>
							<span class="timeago">${getTimeAgo(reply.registered)}</span>
							<a href="#like" class="likecomment${reply.has_liked ? " likedcomment" : ""}" data-hasliked="${
				reply.has_liked
			}" data-id="${reply.id}">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								<span>
								${formatNumber(reply.likes_count).trim()}
								</span>
							</a>
							<a href="#reply" class="replybtn" data-id="${reply.id}" data-parent_id="${
				reply.parent_id
			}" data-name="${reply.username}">Reply</a>
						</div>
						
					</div>`;
		});

		replyHTML += `</div><div class="hide-replies">- Hide replies</div>`;
	}

	console.log("Building comments...");
	// Count total comments function

	const creatorId = creator.id;

	const profileBaseUrl = "https://360.com/profile/";

	// Comment Root Element
	const commentElement = document.querySelector("#comments");

	commentElement.innerHTML = "";

	commentHTML = `<h4 class="amount-comments">${totalComments} comments</h4>
                <div id="closecommentsbtn"></div><div class="container">`;

	if (allowComments) {
		setupCommentHTML(props);

		if (totalComments > offset) {
			commentHTML += `<div class="btn-showmorecomments">Show more</div>`;
		}
	} else {
		commentHTML += `<div style="padding:2rem;">Creator has disabled comments.</div>`;
	}

	commentHTML += `</div>
            <div class="writecomment">
                <div class="thumb"></div>
                <div id="emojiplugin"></div>
            </div>`;

	commentElement.innerHTML = commentHTML;

	console.log("Building comments complete...");

	var showMoreComments = document.querySelector(".btn-showmorecomments");

	if (showMoreComments) {
		showMoreComments.addEventListener("click", loadMoreComments);

		function loadMoreComments() {
			showMoreComments = document.querySelector(".btn-showmorecomments");
			var all = document.querySelectorAll(".comment");
			const currentOffset = all.length;
			const passuri = "id=" + locationId + "&user=" + user.id + "&offset=" + currentOffset;

			const clonedShowMoreComments = showMoreComments.cloneNode(true);
			showMoreComments.remove();

			xhrSend("POST", "../php/morecomments.php", passuri)
				.then((data) => {
					console.log(data);
					commentHTML = "";
					setupCommentHTML(data);

					commentElement
						.querySelector(".container")
						.insertAdjacentHTML("beforeend", commentHTML);

					commentHTML = "";

					all = document.querySelectorAll(".comment");
					if (all.length < totalComments) {
						commentElement
							.querySelector(".container")
							.insertAdjacentElement("beforeend", clonedShowMoreComments);
						// Reattach event listener to the cloned element
						showMoreComments = document.querySelector(".btn-showmorecomments");
						showMoreComments.addEventListener("click", loadMoreComments);
					}
					addRepliesEvents();
				})
				.catch((error) => {
					// Handle any errors
					console.error("XHR request failed:", error);
				});
		}
	}

	function addRepliesEvents() {
		// Remove existing event listeners for showing replies
		const viewReply = document.querySelectorAll(".btn-showreplies");
		viewReply.forEach((btn) => {
			btn.removeEventListener("click", showReplies);
			btn.addEventListener("click", showReplies);
		});

		// Remove existing event listeners for hiding replies
		const hideReply = document.querySelectorAll(".hide-replies");
		hideReply.forEach((btn) => {
			btn.removeEventListener("click", hideReplies);
			btn.addEventListener("click", hideReplies);
		});
	}

	function showReplies(e) {
		e.preventDefault();
		let parent_id = e.target.getAttribute("data-parent_id");
		let replyContainer = e.target.parentNode.querySelector(".replies-container");
		const replyObjects = replyContainer.querySelectorAll("*");

		if (replyObjects.length > 0) {
			replyContainer.style.display = "block";
			e.target.style.display = "none";
			e.target.parentNode.querySelector(".hide-replies").style.display = "block";
			return;
		}

		let currentOffset = replyObjects.length;

		const passuri = "id=" + parent_id + "&user=" + user.id + "&offset=" + currentOffset;

		xhrSend("POST", "../php/morereplies.php", passuri)
			.then((data) => {
				console.log(data);
				replyHTML = "";
				setupRepliesHTML(data);
				const hideRepliesElement = replyContainer.querySelector(".hide-replies");

				// Insert replyHTML before the hide-replies element
				if (hideRepliesElement) {
					hideRepliesElement.insertAdjacentHTML("beforebegin", replyHTML);
				} else {
					// If hide-replies element is not found, append replyHTML to the end of container
					replyContainer.insertAdjacentHTML("beforeend", replyHTML);
				}
				replyHTML = "";

				if (replyContainer) {
					replyContainer.style.display = "block";
					e.target.style.display = "none";
					e.target.parentNode.querySelector(".hide-replies").style.display = "block";
					addRepliesEvents();
				} else {
					console.error("Replies container not found.");
				}
			})
			.catch((error) => {
				console.error("XHR request failed:", error);
			});
	}

	function hideReplies(e) {
		e.preventDefault();
		// Find the container of the replies
		let container = e.target.closest(".replies-container");
		if (container) {
			e.target.parentNode.parentNode.querySelector(".btn-showreplies").style.display =
				"block";
			container.style.display = "none";
			e.target.style.display = "none";
		} else {
			console.error("Replies container not found.");
		}
	}

	addRepliesEvents();

	const writecommentElement = document.querySelector(".writecomment");

	if (user) {
		let commentThumb = `<a href="https://360.com/profile/${user.username}" target="_blank" class="thumb">
				<img src="${user.thumbnail}" alt="" /></a><div id="emojiplugin"></div>`;

		writecommentElement.innerHTML = commentThumb;

		installEmoji("emojiplugin");

		const allReplyButtons = document.querySelectorAll(".replybtn");
		const commentTextarea = document.querySelector("#commentInputField");
		allReplyButtons.forEach((replybtn) => {
			replybtn.addEventListener("click", (e) => {
				let username = e.target.getAttribute("data-name");
				let replytoid = e.target.getAttribute("data-id");

				// Set placeholder text
				commentTextarea.placeholder = "Reply to " + username;

				// Set custom attribute using dataset
				commentTextarea.dataset.replytoid = replytoid;
				commentTextarea.focus();
			});
		});

		const allLikeComments = document.querySelectorAll(".likecomment");
		allLikeComments.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				let thisEl = e.target.closest(".likecomment");
				let span = thisEl.querySelector("span");
				let amount = parseInt(span.textContent.trim());
				if (thisEl.classList.contains("likedcomment")) {
					thisEl.classList.remove("likedcomment");
					amount -= 1;
				} else {
					thisEl.classList.add("likedcomment");
					amount += 1;
				}
				span.textContent = amount.toString();
			});
		});

		commentTextarea.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				// Remove the dataset attribute
				delete commentTextarea.dataset.replytoid;
				// Set placeholder text
				commentTextarea.placeholder = "Write your comment";
				commentTextarea.value = "";
				// Remove focus from the textarea
				commentTextarea.blur();
			}
		});
	} else {
		const commentLogin = `<p>Need to login. Put login signup stuff here.</p>`;
		writecommentElement.innerHTML = commentLogin;
	}
}
