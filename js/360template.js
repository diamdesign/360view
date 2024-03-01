const rootHTML = `<div id="outside">
			<a href="#" id="logo">
				<div><img src="img/logo.jpg" alt="" /></div>
				<span class="hint">Powered by Snälla Pojkar</span>
			</a>
			<div id="map">
				<div id="mapimage">
					<img src="" alt="" id="mapimg" />
				</div>
			</div>
			<div id="info">
				<div class="show-loc showactive">Location</div>
				<div class="show-info">Details</div>
				<div id="closeinfobtn"></div>
				<div id="resizer"></div>

				<div id="info-location" class="container"></div>
				<div id="info-details" class="container">
					<div class="column3">
						<div>Likes<span>132</span></div>
						<div>Views<span>1,132</span></div>
					</div>
				</div>
			</div>
			<div id="comments">
				<h4 class="amount-comments">88 comments</h4>
				<div id="closecommentsbtn"></div>
				<div class="container">
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename"
								>Hellothere42<span class="creator">· Creator</span></a
							>
							<p class="message">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aut
								accusantium aliquid in! Quidem.
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="replies">
						<div class="comment reply">
							<a href="#profile" class="thumb"><img src="" alt="" /></a>
							<div class="commentinfo">
								<a href="#profile" class="profilename">Hellothere42</a>
								<p class="message">U are rocking it :)</p>
								<span class="timeago">40m</span>
								<a href="#like" class="likecomment">
									<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
										<rect fill="none" height="256" width="256" />
										<path
											d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
										/>
									</svg>
									324
								</a>
								<a href="#reply" class="replybtn">Reply</a>
							</div>
						</div>
						<div class="comment reply">
							<a href="#profile" class="thumb"><img src="" alt="" /></a>
							<div class="commentinfo">
								<div class="repliedto">
									<a href="#profile" class="profilename">Sparapåpengar</a>
									<a href="#profile" class="profilename replyto"
										>> Hellothere42</a
									>
								</div>
								<p class="message">U are rocking it :)</p>
								<span class="timeago">40m</span>
								<a href="#like" class="likecomment">
									<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
										<rect fill="none" height="256" width="256" />
										<path
											d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
										/>
									</svg>
									324
								</a>
								<a href="#reply" class="replybtn">Reply</a>
							</div>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo
								quisquam dicta, officiis veritatis numquam autem cupiditate
								doloribus eligendi architecto odit?
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment likedcomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="replies">+ View 32 replies</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim,
								earum accusantium? Corporis quo repellendus eius odio doloribus
								accusamus possimus sapiente ex ea, eos porro nemo officiis? Eveniet
								dolorem quos vero.
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aut
								accusantium aliquid in! Quidem.
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment likedcomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">U are rocking it :)</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo
								quisquam dicta, officiis veritatis numquam autem cupiditate
								doloribus eligendi architecto odit?
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment likedcomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
					<div class="comment">
						<a href="#profile" class="thumb"><img src="" alt="" /></a>
						<div class="commentinfo">
							<a href="#profile" class="profilename">Hellothere42</a>
							<p class="message">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim,
								earum accusantium? Corporis quo repellendus eius odio doloribus
								accusamus possimus sapiente ex ea, eos porro nemo officiis? Eveniet
								dolorem quos vero.
							</p>
							<span class="timeago">40m</span>
							<a href="#like" class="likecomment">
								<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
									<rect fill="none" height="256" width="256" />
									<path
										d="M176,32a60,60,0,0,0-48,24A60,60,0,0,0,20,92c0,71.9,99.9,128.6,104.1,131a7.8,7.8,0,0,0,3.9,1,7.6,7.6,0,0,0,3.9-1,314.3,314.3,0,0,0,51.5-37.6C218.3,154,236,122.6,236,92A60,60,0,0,0,176,32Z"
									/>
								</svg>
								324
							</a>
							<a href="#reply" class="replybtn">Reply</a>
						</div>
					</div>
				</div>

				<div class="writecomment">
					<div class="thumb"></div>
					<textarea
						name=""
						cols="30"
						rows="1"
						placeholder="Add comment..."
						id="commentinput"
					></textarea>
				</div>
			</div>
		</div>
		<div id="caption"></div>
		<div id="view-container">
			<div id="angleIndicator"></div>

			<div class="settingsbtn"><span class="hint">Settings</span></div>
			<div id="settings">
				<div class="closebtn"></div>
				<div class="row">
					<span>Ambient:</span>
					<input type="range" min="0.5" max="8" step="0.1" id="ambient" value="3.5" />
					<span id="ambientNo">3.5</span>
				</div>
				<div class="row">
					<span>Brightness:</span>
					<input type="range" min="0" max="2" step="0.01" id="brightness" value="1" />
					<span id="brightnessNo">1</span>
				</div>
				<div class="row">
					<span>Contrast:</span>
					<input type="range" min="0" max="2" step="0.01" id="contrast" value="1" />
					<span id="contrastNo">1</span>
				</div>
				<div class="row">
					<span>Saturation:</span>
					<input type="range" min="0" max="2" step="0.01" id="saturation" value="1" />
					<span id="saturationNo">1</span>
				</div>
				<div class="row">
					<span>Volume:</span>
					<input type="range" min="0" max="1" step="0.01" id="volume" value="1" />
					<span id="volumeNo">1</span>
				</div>

				<div id="reset" class="button">Reset</div>
			</div>
			<div class="locations" id="locations">
				<div id="videoplayer">
					<div id="playvideo"></div>
					<input type="range" min="0" max="1" id="videoduration" value="0" step="0.01" />
					<div id="currenttime"></div>
					<div id="captionselect">
						<ul>
							<li id="captionoff" class="active">Captions off</li>
						</ul>
					</div>
				</div>
				<div id="zoombtn">
					<input type="range" min="0" max="1" step="0.1" id="zoomlevel" value="0.5" />
				</div>
				<div class="rightbuttons">
					<div id="likebtn">
						<span class="hint">Like</span><span class="amount">25.3K</span>
					</div>
					<div id="commentbtn">
						<span class="hint">Comments</span><span class="amount">1,558</span>
					</div>
					<div id="infobtn">i<span class="hint">Info & Details</span></div>
					<div id="sharebtn"><span class="hint">Share</span></div>
					<div id="fullscreenbtn"><span class="hint">Toggle Fullscreen</span></div>
				</div>
				<div id="mapbtn"><span class="hint">Toggle Map</span></div>
				<div id="indicatorbtn"></div>
				<div class="container" id="scrollable">
					<ul id="locationlist"></ul>
				</div>
			</div>
			<div id="labels"></div>
		</div>`;

const rootElement = document.getElementById("root");

// Append the iframe to the parent element
rootElement.innerHTML = rootHTML;