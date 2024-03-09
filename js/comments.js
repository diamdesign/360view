import { getTimeAgo, formatNumber, countComments } from "./functions.min.js";

export function buildComments(props, user) {
	console.log("Building comments...");
	// Count total comments function

	const profileBaseUrl = "https://360.com/profile/";

	// Comment Root Element
	const commentElement = document.querySelector("#comments");

	commentElement.innerHTML = "";

	// Get the total comments
	const totalComments = countComments(props);

	var commentHTML = `<h4 class="amount-comments">${totalComments} comments</h4>
                <div id="closecommentsbtn"></div><div class="container">`;

	try {
		props.map((comment) => {
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
			if (comment.username === user.username) {
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
                                ${formatNumber(comment.likes_count)}
                            </a>
                            <a href="#reply" class="replybtn" data-id="${comment.id}" data-name="${
				comment.username
			}">Reply</a>
                        </div>
                    </div>`;

			if (comment.replies && comment.replies.length > 0) {
				commentHTML += `<div class="replies"><div class="btn-showreplies">+ View ${comment.replies.length} replies</div><div class="replies-container">`;

				comment.replies.map((reply) => {
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

					if (reply.username === user.username) {
						console.log(reply.username, user.username);
						commentHTML += `<span class="creator">· Creator</span>`;
					}

					commentHTML += `</a> > <a href="${
						profileBaseUrl + reply.reply_username
					}" class="profilename replyto">${reply.reply_username}`;

					if (reply.username === user.username) {
						console.log(reply.username, user.username);
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
                                        ${formatNumber(reply.likes_count)}
                                    </a>
                                    <a href="#reply" class="replybtn" data-id="${
										reply.id
									}" data-parent_id="${reply.parent_id}" data-name="${
						reply.username
					}">Reply</a>
                                </div>
                            </div>`;
				});

				commentHTML += `</div></div>`;
			}
		});
	} catch (error) {
		console.error("Error occurred during mapping:", error);
	}

	commentHTML += `</div>
            <div class="writecomment">
                <div class="thumb"></div>
                <div id="emojiplugin"></div>
            </div>`;

	commentElement.innerHTML = commentHTML;
	console.log("Building comments complete...");
}
