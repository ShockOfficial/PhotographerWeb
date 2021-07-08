let $menuItems;
let $barsBox;
let $bars;
let $menuBox;

function prepareDomElements() {
	$menuItems = [...document.querySelectorAll('.nav__box .nav__link')];
	$barsBox = document.querySelector('.nav__bars-box');
	$bars = document.querySelector('.nav__bars');
	$menuBox = document.querySelector('.nav__box');
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

const main = function () {
	prepareDomElements();
	prepareDomEvnets();
	setMenuType();
};

document.addEventListener('DOMContentLoaded', main);
window.addEventListener('resize', setMenuType);
