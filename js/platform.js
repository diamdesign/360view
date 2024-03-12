document.querySelector("#toggle-leftpanel").addEventListener("click", function () {
	const leftMenu = this.closest("#leftmenu");
	if (leftMenu) {
		leftMenu.classList.toggle("gridsmall");
		this.classList.toggle("panelexpand");
	}
});

document.querySelector("#toggle-rightpanel").addEventListener("click", function () {
	const rightMenu = this.closest("#rightmenu");
	if (rightMenu) {
		rightMenu.classList.toggle("gridsmall");
		this.classList.toggle("panelexpand");
	}
});

const darkenElement = document.querySelector("#darkoverlay");
const signupElement = document.querySelector("#signup-container");
const loginElement = document.querySelector("#login-container");
const forgotElement = document.querySelector("#forgot-container");
const menuUl = document.querySelector("#menu ul");

document.querySelector("#btn-login").addEventListener("click", function () {
	darkenElement.style.display = "block";

	loginElement.style.display = "block";
	document.querySelector("#login-username").focus();
});

document.querySelector("#btn-signup").addEventListener("click", function () {
	darkenElement.style.display = "block";
	signupElement.style.display = "block";
	document.querySelector("#reg-username").focus();
});

darkenElement.addEventListener("click", function () {
	darkenElement.style.display = "none";
	loginElement.style.display = "none";
	signupElement.style.display = "none";
	forgotElement.style.display = "none";
});

document.querySelector("#menu").addEventListener("click", function () {
	menuUl.closest("#menu").classList.toggle("on");
});

document.querySelector("#showmenu").addEventListener("click", function () {
	document.querySelector("#header").classList.add("headeron");
	document.querySelector("#searchinput").focus();
});

document.querySelector("#close-header").addEventListener("click", function () {
	document.querySelector("#header").classList.remove("headeron");
});

document.querySelector(".forgot").addEventListener("click", function () {
	document.querySelector("#login-container").style.display = "none";
	document.querySelector("#forgot-container").style.display = "block";
	document.querySelector("#login-email").focus();
});

document.querySelector(".backtologin").addEventListener("click", function () {
	document.querySelector("#login-container").style.display = "block";
	document.querySelector("#forgot-container").style.display = "none";
	document.querySelector("#login-username").focus();
});
