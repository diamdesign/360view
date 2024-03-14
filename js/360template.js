export const rootHTML = `<div id="outside">
			<a href="#" id="logo">
				<div><img src="img/logo.jpg" alt="" /></div>
				<span class="hint">Powered by 360</span>
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
					<div class="user-details">
						<a href="#" class="thumbnail" target="_blank">
							<img src="" alt="" />
						</a>
						<div class="userinfo">
							<a href="#" target="_blank"></a>
						</div>
					</div>
					<div class="column4">
						<div class="details-likes">Likes<span>0</span></div>
						<div class="details-views">Views<span>0</span></div>
						<div class="details-comments">Comments<span>0</span></div>
						<div class="details-created">Created<span>-</span></div>
					</div>
					<h2 class="title"></h2>
					<p class="description"></p>
				</div>
			</div>

			<div id="comments"></div>

			<div id="share">
				<div id="closesharebtn"></div>
				<div class="show-link showactive">Share link</div>
				<div class="show-embed">Embed</div>

				<div id="share-link" class="container">
					

					<h4>Start at location</h4>
					<div class="startlocations">
						
					</div>
					
					<h4>Start looking at</h4>
					<div id="lookingat">
						<div class="xyinput"><div><span>X</span><input type="number" min="-360" max="360" id="lookatx" value="0" /></div></div>
						<div class="xyinput"><div><span>Y</span><input type="number" min="-360" max="360" id="lookaty" value="0" /></div></div>
					</div>
					<div id="linktoshare">
						<span></span>
						<div id="copylink" class="button">Copy</div>
					</div>
				</div>

				<div id="share-embed" class="container">
					<h4>Start at location</h4>
					<div class="startlocations">
						
					</div>
					<div id="embedcode">
						<textarea></textarea>
					</div>
					<div id="copyembed" class="button">Copy</div>
					
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
					<input type="range" min="0.5" max="8" step="0.01" id="ambient" value="3.5" />
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
						<span class="hint">Like</span><span class="amount">0</span>
					</div>
					<div id="commentbtn">
						<span class="hint">Comments</span><span class="amount">0</span>
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

export const haspassHTML = `<div id="haspass-login">
		<form>
			<label for="haspass-password">Password</label>
			<div class="formgroup">
				<input id="haspass-password" type="password" placeholder="Password" />
				<button id="enter-password">Enter</button>
			</div>
		</form>
	</div>`;
