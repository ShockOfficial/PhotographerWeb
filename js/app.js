import API_KEY from './apikey.js';
import TEMPLATE_ID from './apikey.js';
import SERVICE_ID from './apikey.js';

let $menuItems;
let $barsBox;
let $bars;
let $menuBox;
let $home, $about, $gallery, $process, $contact;
let isSwipable = false;
let $nameField, $surnameField, $emailField, $areaField, $contactBtn;
let $errorTitle, $errorDesc, $error;
let $imagesRight;

const carousel = {
	currentImgIndex: 0,
	container: '',
	imgArr: '',
	nextBtn: '',
	prevBtn: '',
	status: '',
	intervalId: '',
};

function prepareDomElements() {
	$menuItems = [...document.querySelectorAll('.nav__box .nav__link')];
	$barsBox = document.querySelector('.nav__bars-box');
	$bars = document.querySelector('.nav__bars');
	$menuBox = document.querySelector('.nav__box');
	$home = document.querySelector('#home');
	$about = document.querySelector('#about');
	$gallery = document.querySelector('#gallery');
	$contact = document.querySelector('#contact');
	$process = document.querySelector('#process');
	$imagesRight = document.querySelectorAll('.carousel__img--right');

	$nameField = document.querySelector('input#name');
	$surnameField = document.querySelector('input#surname');
	$emailField = document.querySelector('input#email');
	$areaField = document.querySelector('textarea#area');
	$contactBtn = document.querySelector('.contact__btn');

	$error = document.querySelector('.contact__error-box');
	$errorTitle = document.querySelector('.contact__error-title');
	$errorDesc = document.querySelector('.contact__error-desc');

	carousel.imgArr = [...document.querySelectorAll('.carousel__img')];
	carousel.nextBtn = document.querySelector('.carousel__btn--left');
	carousel.prevBtn = document.querySelector('.carousel__btn--right');
	carousel.status = document.querySelector('.carousel__photo-status');
	carousel.container = document.querySelector('.carousel__image-field');

	carousel.nextBtn.addEventListener('click', slideImage);
	carousel.prevBtn.addEventListener('click', slideImage);
	carousel.imgArr.forEach((el) => {
		el.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	});
	carousel.imgArr.forEach((el) => {
		el.draggable = false;
	});
}

function prepareDomEvnets() {
	// $menuItems.forEach((item) => {
	// 	item.addEventListener('click', addActive);
	// });

	$barsBox.addEventListener('click', swipeMenu);
	$menuItems.forEach((item) => item.addEventListener('click', swipeMenu));

	//Send Email
	$contactBtn.addEventListener('click', sendEmial);

	// Scroll spy
	window.addEventListener('scroll', () => {
		let windo = window.pageYOffset + 200;
		$menuItems.forEach((el) => {
			el.classList.remove('active');
		});
		if ($about.offsetTop <= windo && $gallery.offsetTop >= windo) {
			$menuItems[1].classList.add('active');
		} else if ($gallery.offsetTop <= windo && $process.offsetTop >= windo) {
			$menuItems[2].classList.add('active');
		} else if ($process.offsetTop <= windo && $contact.offsetTop >= windo) {
			$menuItems[3].classList.add('active');
		} else if ($contact.offsetTop <= windo) {
			$menuItems[4].classList.add('active');
		} else {
			$menuItems[0].classList.add('active');
		}
	});
}

function setMenuType() {
	if (window.innerWidth < 768) {
		$menuBox.classList.add('hide');
		isSwipable = true;
	} else {
		$menuBox.classList.remove('hide');
		isSwipable = false;
	}
}

function swipeMenu() {
	let flag = false;
	if (isSwipable) {
		if (!$menuBox.classList.contains('hide')) {
			flag = true;
		}
		$bars.classList.toggle('moveBars');
		$menuBox.classList.remove('hide');
		$menuBox.classList.toggle('swipeDown');

		setTimeout(() => {
			flag ? $menuBox.classList.add('hide') : '';
		}, 100);
	}
}

function slideImage(e) {
	// Button implementation;

	clearInterval(carousel.intervalId);

	if (!Boolean(e) || e.target.id === 'right') {
		carousel.currentImgIndex < carousel.imgArr.length - 1
			? carousel.currentImgIndex++
			: (carousel.currentImgIndex = 0);
	} else {
		carousel.currentImgIndex > 0
			? carousel.currentImgIndex--
			: (carousel.currentImgIndex = carousel.imgArr.length - 1);
	}

	const currentImg = carousel.imgArr[carousel.currentImgIndex];

	// Display current image possition in UI
	carousel.status.textContent = `${carousel.currentImgIndex + 1} / ${
		carousel.imgArr.length
	}`;

	// Swipe to appropriate image

	carousel.container.style.transform = `translateX(-${
		100 * carousel.currentImgIndex
	}%)`;

	startAutoSwiping();
}

function startAutoSwiping() {
	// Automaticly swipe Images
	carousel.intervalId = setInterval(() => {
		slideImage();
	}, 3000);
}

function setDate() {
	const currentYear = new Date().getFullYear();
	document.querySelector('.footer__year').textContent = currentYear;
}

function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(new String(email).toLowerCase());
}

function sendEmial(params) {
	const numbers = /\d/;

	if (
		$nameField.value === '' ||
		$surnameField.value === '' ||
		$emailField.value === '' ||
		$areaField.value === ''
	) {
		$errorTitle.textContent = 'BŁĄD!';
		$errorDesc.textContent = 'Wypełnij wszystkie pola!';
	} else if (
		numbers.test($nameField.value) ||
		numbers.test($surnameField.value) ||
		$nameField.value.length < 3 ||
		$surnameField.value.length < 3
	) {
		$errorTitle.textContent = 'BŁĄD!';
		$errorDesc.textContent = 'Wpisz swoje dane prawidłowo!';
	} else if (!validateEmail($emailField.value)) {
		$errorTitle.textContent = 'BŁĄD!';
		$errorDesc.textContent = 'Wpisz poprawny email!';
	} else {
		let tempParams = {
			from_name: `${$nameField.value} ${$surnameField.value}`,
			from_email: $emailField.value,
			to_name: 'Paweł',
			message: $areaField.value,
		};

		emailjs
			.send(API_KEY.SERVICE_ID, API_KEY.TEMPLATE_ID, tempParams)
			.then(function (respond) {
				succesEmail();
				showPopup();
				clearInputs();
			});

		return;
	}
	showPopup();
}

function showPopup() {
	$error.classList.remove('hide');
	$error.classList.add('notify');
	$contactBtn.disabled = true;
	setTimeout(() => {
		$error.classList.add('hide');
	}, 1500);
	setTimeout(() => {
		$error.classList.remove('notify');
		$errorTitle.removeAttribute('style');
		$contactBtn.disabled = false;
	}, 1800);
}

function succesEmail() {
	$errorTitle.textContent = 'Sukces!';
	$errorDesc.textContent = 'Twoja wiadomośc została wysłana!';
}

function clearInputs() {
	$nameField.value = '';
	$surnameField.value = '';
	$emailField.value = '';
	$areaField.value = '';
}

function RightClassToggler() {
	if (window.innerWidth > 1100) {
		$imagesRight.forEach((img) => img.classList.remove('carousel__img--right'));
	} else {
		$imagesRight.forEach((img) => img.classList.add('carousel__img--right'));
	}
}

const main = function () {
	(function () {
		emailjs.init(API_KEY.API_KEY);
	})();
	prepareDomElements();
	prepareDomEvnets();
	setMenuType();
	startAutoSwiping();
	setDate();
	RightClassToggler();
	AOS.init();
};

document.addEventListener('DOMContentLoaded', main);
window.addEventListener('resize', setMenuType);
window.addEventListener('resize', RightClassToggler);
