const calculate = () => {
	let startWeight = parseFloat(document.getElementById('startingWeight').innerText);
	let endWeight = parseFloat(document.getElementById('endingWeight').innerText);
	let ozDrank = parseFloat(document.getElementById('ozDrank').innerText);
	let ozSweatLost = (startWeight - endWeight) / 0.0625 + ozDrank;

	let output = document.getElementById('sweatOzLost');
	if (isNaN(ozSweatLost)) output.innerText = '...';
	else output.innerText = Math.round(ozSweatLost * 100) / 100;
};

const activate = value => {
	if (value.classList.contains('active')) return;
	document.querySelector('.active')?.classList.remove('active');
	value.classList.add('active');
};

const nextActive = () => {
	let next = document.querySelector('.value:not(.filled,.outputValue)');
	if (next) activate(next);
	return next;
};

const setValue = value => {
	let span = document.querySelector('.active span');

	if (value.length < 4) return (span.innerText = value);
	let { intiger, decimal } = /(?<intiger>\d{3})(?<decimal>\d{1,2})/.exec(value).groups;
	span.innerText = intiger + '.' + decimal;
};

const type = digit => {
	let active = document.querySelector('.active');
	if (!active) active = nextActive();
	active.classList.add('filled');
	let value = active.innerText.replaceAll('.', '');
	if (value.length === 5) {
		let next = nextActive();
		if (!next) return;
		type(digit);
		return;
	}
	setValue(value + digit);
};

const backspace = () => {
	let active = document.querySelector('.active');
	if (!active) return;
	setValue(active.innerText.replace(/.$/, ''));
};

const clear = () => {
	document.querySelectorAll('.filled').forEach(filledVal => {
		filledVal.firstChild.innerText = '';
		filledVal.classList.remove('filled');
	});
	document.querySelector('.active')?.classList.remove('active');
};

const checkClear = () => {
	let openSpot = document.querySelector('.value:not(.filled,.outputValue,.active)');
	if (openSpot && !document.querySelector('.next')) {
		let button = document.querySelector('.clear');
		button.classList.remove('clear');
		button.classList.add('next');
		button.innerText = '↳';
	} else if (!openSpot && !document.querySelector('.clear')) {
		let button = document.querySelector('.next');
		button.classList.remove('next');
		button.classList.add('clear');
		button.innerText = 'Ⓒ';
	}
};

const buttonPress = button => {
	if (!button) return;
	button.classList.add('clicked');
	setTimeout(() => button.classList.remove('clicked'), 50);
};

document.querySelectorAll('#inputs .value').forEach(value => {
	value.addEventListener('click', ({ target }) => activate(target.closest('.value')));
});

document.querySelectorAll('.buttons').forEach(button => {
	button.addEventListener('click', ({ target }) => {
		buttonPress(target);
		if (target.matches('.clear')) clear();
		else if (target.matches('.back')) backspace();
		else if (target.matches('.next')) nextActive();
		else type(target.innerText);
		calculate();
		checkClear();
	});
});

document.addEventListener('keydown', ({ code }) => {
	if (code.startsWith('Digit')) {
		let digit = code.replace('Digit', '');
		type(digit);
		buttonPress(document.querySelector('.number-' + digit));
	} else if (code === 'Backspace') {
		backspace();
		buttonPress(document.querySelector('.back'));
	} else if (code === 'Enter') {
		nextActive();
		buttonPress(document.querySelector('.next'));
	} else if (code === 'KeyC') {
		clear();
		buttonPress(document.querySelector('.clear'));
	} else return;
	calculate();
	checkClear();
});
