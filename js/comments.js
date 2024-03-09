import { getTimeAgo, formatNumber, countComments } from "./functions.min.js";
import { installEmoji } from "./emoji.min.js";

export function buildComments(targetObject, creator, user) {
	const allowComments = targetObject.allowcomments;
	const props = targetObject.comments;

	console.log("Building comments...");
	// Count total comments function

	const creatorId = creator.id;

	const profileBaseUrl = "https://360.com/profile/";

	// Comment Root Element
	const commentElement = document.querySelector("#comments");

	commentElement.innerHTML = "";

	// Get the total comments
	const totalComments = countComments(props);

	var commentHTML = `<h4 class="amount-comments">${totalComments} comments</h4>
                <div id="closecommentsbtn"></div><div class="container">`;

	if (allowComments) {
		try {
			props.map((comment) => {
				let userId = comment.user_id;
				commentHTML += `<div class="comment" data-id="${comment.id}">
                        <a href="${
							profileBaseUrl + comment.username
						}" class="thumb"  target="_blank">
                            <img src="${comment.thumbnail}" alt="" />
                        </a>
                        <div class="commentinfo">
                            <a href="${
								profileBaseUrl + comment.username
							}" class="profilename" target="_blank">
                                ${comment.username}`;
				if (userId === creatorId) {
					commentHTML += `<span class="creator">· Creator</span>`;
				}

				commentHTML += `</a>
                            <p class="message">${comment.comment}</p>
                            <span class="timeago">${getTimeAgo(comment.registered)}</span>
                            <a href="#like" class="likecomment${
								comment.has_liked ? " likedcomment" : ""
							}" data-hasliked="${comment.has_liked}" data-id="${comment.id}">
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
                            <a href="#reply" class="replybtn" data-id="${comment.id}" data-name="${
					comment.username
				}">Reply</a>
                        </div>
                    </div>`;

				if (comment.replies && comment.replies.length > 0) {
					commentHTML += `<div class="replies"><div class="btn-showreplies">+ View ${comment.replies.length} replies</div><div class="replies-container">`;

					comment.replies.map((reply) => {
						let replyId = reply.user_id;

						commentHTML += `<div class="comment reply" data-id="${
							reply.id
						}" data-reply_id="${reply.reply_id}" data-parent_id="${reply.parent_id}">
                                <a href="${
									profileBaseUrl + reply.username
								}" class="thumb" target="_blank"><img src="${
							reply.thumbnail
						}" alt="" /></a>
                                <div class="commentinfo">
                                    <div class="repliedto">
                                        <a href="${
											profileBaseUrl + reply.username
										}" class="profilename" target="_blank">${reply.username}`;

						if (replyId === creatorId) {
							commentHTML += `<span class="creator">· Creator</span>`;
						}

						commentHTML += `</a> > <a href="${
							profileBaseUrl + reply.reply_username
						}" class="profilename replyto" target="_blank">${reply.reply_username}`;

						if (reply.reply_username === creator.username) {
							commentHTML += `<span class="creator">· Creator</span>`;
						}

						commentHTML += `</a>
                                    </div>
                                    <p class="message">${reply.comment}</p>
                                    <span class="timeago">${getTimeAgo(reply.registered)}</span>
                                    <a href="#like" class="likecomment${
										reply.has_liked ? " likedcomment" : ""
									}" data-hasliked="${reply.has_liked}" data-id="${reply.id}">
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
                                    <a href="#reply" class="replybtn" data-id="${
										reply.id
									}" data-parent_id="${reply.parent_id}" data-name="${
							reply.username
						}">Reply</a>
                                </div>
                                
                            </div>`;
					});

					commentHTML += `</div><div class="hide-replies">- Hide replies</div></div>`;
				}
			});
		} catch (error) {
			console.error("Error occurred during mapping:", error);
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

	// Add event listeners to show replies
	const viewReply = document.querySelectorAll(".btn-showreplies");
	viewReply.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			let container = e.target.parentNode.querySelector(".replies-container");
			if (container) {
				container.style.display = "block";
				e.target.style.display = "none";
				e.target.parentNode.querySelector(".hide-replies").style.display = "block";
			} else {
				console.error("Replies container not found.");
			}
		});
	});

	// Add event listeners to show replies
	const hideReply = document.querySelectorAll(".hide-replies");
	hideReply.forEach((btn) => {
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			// Find the container of the replies
			let container = e.target.parentNode.querySelector(".replies-container");
			if (container) {
				container.style.display = "none";
				e.target.style.display = "none";
				e.target.parentNode.querySelector(".btn-showreplies").style.display = "block";
			} else {
				console.error("Replies container not found.");
			}
		});
	});

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
		const commentLogin = ``;
		writecommentElement.innerHTML = commentLogin;
	}
}
