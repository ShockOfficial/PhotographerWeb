let $menuItems;
let $barsBox;
let $bars;
let $menuBox;
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
	$menuItems.forEach((item) => {
		item.addEventListener('click', addActive);
	});

	$barsBox.addEventListener('click', swipeMenu);
}

function addActive(e) {
	const items = $menuItems.filter((el) => el.classList.contains('active'));
	items[0].classList.remove('active');

	e.target.classList.add('active');
}

function setMenuType() {
	if (window.innerWidth < 768) {
		$menuBox.classList.add('hide');
	} else {
		$menuBox.classList.remove('hide');
	}
}

function swipeMenu() {
	let flag = false;
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

const main = function () {
	prepareDomElements();
	prepareDomEvnets();
	setMenuType();
	startAutoSwiping();
};

document.addEventListener('DOMContentLoaded', main);
window.addEventListener('resize', setMenuType);
