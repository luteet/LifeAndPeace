
const body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, .header, body'),
	burger = document.querySelector('.header__burger'),
	header = document.querySelector('.header');


// =-=-=-=-=-=-=-=-=-=- <popup> -=-=-=-=-=-=-=-=-=-=-

function Popup(arg) {

	let body = document.querySelector('body'),
		html = document.querySelector('html'),
		saveHref = (typeof arg == 'object') ? (arg['saveHref']) ? true : false : false,
		popupCheck = true,
		popupCheckClose = true;

	const removeHash = function () {
		let uri = window.location.toString();
		if (uri.indexOf("#") > 0) {
			let clean_uri = uri.substring(0, uri.indexOf("#"));
			window.history.replaceState({}, document.title, clean_uri);
		}
	}

	const open = function (id, initStart) {

		if (popupCheck) {
			popupCheck = false;

			let popup = document.querySelector(id);

			if (popup) {

				body.classList.remove('_popup-active');
				html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
				body.classList.add('_popup-active');

				if (saveHref) history.pushState('', "", id);

				setTimeout(() => {
					if (!initStart) {
						popup.classList.add('_active');
						function openFunc() {
							popupCheck = true;
							popup.removeEventListener('transitionend', openFunc);
						}
						popup.addEventListener('transitionend', openFunc)
					} else {
						popup.classList.add('_transition-none');
						popup.classList.add('_active');
						popupCheck = true;
					}

				}, 0)

			} else {
				return new Error(`Not found "${id}"`)
			}
		}
	}

	const close = function (popupClose) {
		if (popupCheckClose) {
			popupCheckClose = false;

			let popup
			if (typeof popupClose === 'string') {
				popup = document.querySelector(popupClose)
			} else {
				popup = popupClose.closest('.popup');
			}

			if (popup.classList.contains('_transition-none')) popup.classList.remove('_transition-none')

			setTimeout(() => {
				popup.classList.remove('_active');
				function closeFunc() {
					const activePopups = document.querySelectorAll('.popup._active');

					if (activePopups.length < 1) {
						body.classList.remove('_popup-active');
						html.style.setProperty('--popup-padding', '0px');
					}

					if (saveHref) {
						removeHash();
						if (activePopups[activePopups.length - 1]) {
							history.pushState('', "", "#" + activePopups[activePopups.length - 1].getAttribute('id'));
						}
					}

					popupCheckClose = true;
					popup.removeEventListener('transitionend', closeFunc)

					if(popup.querySelector('.grid-gallery-popup__slider')) popup.querySelector('.grid-gallery-popup__slider').classList.remove('_visible');
				}

				popup.addEventListener('transitionend', closeFunc)

			}, 0)

		}
	}

	return {

		open: function (id) {
			open(id);
		},

		close: function (popupClose) {
			close(popupClose)
		},

		init: function () {

			let thisTarget
			body.addEventListener('click', function (event) {

				thisTarget = event.target;

				let popupOpen = thisTarget.closest('.open-popup');
				if (popupOpen) {
					event.preventDefault();
					open(popupOpen.getAttribute('href'))
				}

				let popupClose = thisTarget.closest('.popup-close');
				if (popupClose) {
					close(popupClose)
				}

			});

			if (saveHref) {
				let url = new URL(window.location);
				if (url.hash) {
					open(url.hash, true);
				}
			}
		},

	}
}

const popup = new Popup();

popup.init()

// =-=-=-=-=-=-=-=-=-=- </popup> -=-=-=-=-=-=-=-=-=-=-

const deviceType = () => {
	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return "tablet";
	}
	else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
		return "mobile";
	}
	return "desktop";
};

// =-=-=-=-=-=-=-=-=-=- <add decor line in header item> -=-=-=-=-=-=-=-=-=-=-

const headerNavItem = document.querySelectorAll('.header__nav--item');

headerNavItem.forEach(headerNavItem => {
	headerNavItem.insertAdjacentHTML('beforeend',
		`<svg viewBox="0 0 129 41" width="0" height="0" preserveAspectRatio="none" class="hover-line">
			<use xlink:href="img/sprites.svg#link-line"></use>
		</svg>`)

	/* headerNavItem.addEventListener('mouseenter', function () {
		headerNavItem.classList.add('_hover')
	})

	headerNavItem.addEventListener('mouseleave', function () {
		headerNavItem.classList.remove('_hover')
	}) */
})

// =-=-=-=-=-=-=-=-=-=- </add decor line in header item> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=- <custom select> -=-=-=-=-=-=-=-=-=-=-

document.querySelectorAll('select').forEach(select => {
	new SlimSelect({
		select: select,
		showSearch: false,
	  })
})

// =-=-=-=-=-=-=-=-=-=- </custom select> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger')) {
		menu.forEach(element => {
			element.classList.toggle('_active')
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <header sub> -=-=-=-=-=-=-=-=-=-=-

	const
		headerNavLink = $('.header__nav--link'),
		headerNavItemSubActive = document.querySelector('.header__nav--item._sub-active');

	if (headerNavLink) {

		const
			item = headerNavLink.closest('.header__nav--item'),
			sub = item.querySelector('.header__nav-sub');

		if (sub) {
			if (!item.classList.contains('_sub-active') && (deviceType() == 'mobile' || deviceType() == 'tablet')) {
				event.preventDefault();
				item.classList.add('_sub-active')
			}
		}

	} else if (headerNavItemSubActive) {
		headerNavItemSubActive.classList.remove('_sub-active')
	}

	// =-=-=-=-=-=-=-=-=-=- </header sub> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <start video after click on preview> -=-=-=-=-=-=-=-=-=-=-

	const videoPreview = $('.video-preview');
	if (videoPreview) {
		const
			wrapper = videoPreview.closest('.video-wrapper'),
			element = wrapper.querySelector('.video-element');

		videoPreview.classList.add('_hidden');
		element.play();

	}

	// =-=-=-=-=-=-=-=-=-=- </start video after click on preview> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <open gallery> -=-=-=-=-=-=-=-=-=-=-

	const gridGalleryImage = $('.grid-gallery__image');
	if(gridGalleryImage) {
		const index = gridGalleryImage.dataset.gridGalleryIndex ? Number(gridGalleryImage.dataset.gridGalleryIndex) : false;
		
		if(index && gridGalleryPopupSlider) {
			gridGalleryPopupSlider.slideTo(index-1, 0);
		} else if(index == false && gridGalleryPopupSlider) {
			gridGalleryPopupSlider.slideTo(0, 0);
		}
		
		if(gridGalleryPopupSlider.el) {
			setTimeout(() => {
				gridGalleryPopupSlider.el.classList.add('_visible')
			},400)
		}
	}

	// =-=-=-=-=-=-=-=-=-=- </open gallery> -=-=-=-=-=-=-=-=-=-=-


	// =-=-=-=-=-=-=-=-=-=- <FAQ> -=-=-=-=-=-=-=-=-=-=-

	const faqItem = $('.faq__item');
	if(faqItem) {

		if(!faqItem.classList.contains('_animating')) {
			faqItem.classList.add('_animating');
			
			const faqItemContent = faqItem.querySelector('.faq__item--content');

			if(faqItem.classList.contains('_active')) {

				faqItemContent.style.transitionProperty = 'height';
				const height = faqItemContent.offsetHeight;
				faqItemContent.style.height = height + 'px';

				function hidden() {
					faqItemContent.style.removeProperty('transition-property')
					faqItemContent.style.display = 'none';
					faqItemContent.style.removeProperty('height')
					faqItem.classList.remove('_animating');
					faqItemContent.removeEventListener('transitionend', hidden)
				}

				faqItemContent.addEventListener('transitionend', hidden)

				setTimeout(() => {
					faqItemContent.style.height = 0;
					faqItem.classList.remove('_active')
				},0)

			} else {

				faqItem.classList.add('_active');
				faqItemContent.style.removeProperty('height');
				faqItemContent.style.display = 'block';
				const height = faqItemContent.offsetHeight;
				faqItemContent.style.height = 0;
				faqItemContent.style.transitionProperty = 'height';

				function visible() {
					faqItemContent.style.removeProperty('transition-property')
					faqItemContent.style.removeProperty('height');
					faqItem.classList.remove('_animating');
					faqItemContent.removeEventListener('transitionend', visible)
				}

				faqItemContent.addEventListener('transitionend', visible);
				
				setTimeout(() => {
					faqItemContent.style.height = height + 'px';
				},0)
				
			}
		}

		
	}

	// =-=-=-=-=-=-=-=-=-=- </FAQ> -=-=-=-=-=-=-=-=-=-=-

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

function resize() {

	html.style.setProperty("--height-screen", window.innerHeight + "px")
	html.style.setProperty("--height-header", header.offsetHeight + "px")

}

resize();

window.onresize = resize;

// =-=-=-=-=-=-=-=-=-=-=-=- </resize> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

const eventElement = document.querySelector('.event');
let gallerySlider = new Swiper('.gallery__slider', {

	effect: "fade",
	spaceBetween: 24,
	centeredSlides: true,
	slidesPerView: 1,
	loop: true,
	speed: 500,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	/* on: {
		touchMove: function() {
			eventElement.textContent = 'Active';
			body.classList.add('_active');
		},
		touchEnd: function() {
			eventElement.textContent = 'End';
			body.classList.remove('_active');
		},
	}, */
	breakpoints: {
		992: {
			navigation: {
				nextEl: '.gallery__slider--arrow.swiper-button-next',
				prevEl: '.gallery__slider--arrow.swiper-button-prev',
			},
		},
	}
});

let ambasadorsSlider = new Swiper('.ambasadors__slider', {
	slidesPerView: 1,
	spaceBetween: 24,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	breakpoints: {
		992: {
			slidesPerView: 3,
			spaceBetween: 115,
		},
		550: {
			slidesPerView: 2,
		},
	}
})

let gridGalleryPopupList = new Swiper('.grid-gallery-popup__list', {
	slidesPerView: "auto",
	spaceBetween: 10,
	
})

let gridGalleryPopupSlider = new Swiper('.grid-gallery-popup__slider', {
	slidesPerView: 1,
	spaceBetween: 30,
	autoHeight: true,
	grabCursor: true,
	speed: 700,
	
	thumbs: {
		swiper: gridGalleryPopupList
	},
	breakpoints: {
		992: {
			navigation: {
				nextEl: '.grid-gallery-popup__slider--arrow.swiper-button-next',
				prevEl: '.grid-gallery-popup__slider--arrow.swiper-button-prev',
			},
		},
	}
})

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <copy from input> -=-=-=-=-=-=-=-=-=-=-=-=

var clipboard = new ClipboardJS('.copy-btn');

// =-=-=-=-=-=-=-=-=-=-=-=- </copy from input> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <hide and visible blocks in form> -=-=-=-=-=-=-=-=-=-=-=-=

const radioInputs = document.querySelectorAll('.radio-input');
function radioInputsChange(radioInput) {
	if (radioInput.dataset.id && radioInput.checked) {
		const block = document.querySelector('#' + radioInput.dataset.id);
		block.classList.toggle('_hidden')
	} else {

		const row = radioInput.closest('.radio-row');
		if (row) {
			row.querySelectorAll('.radio-input').forEach(radioInput => {
				if (radioInput.dataset.id && !radioInput.checked) {
					const block = document.querySelector('#' + radioInput.dataset.id);
					block.classList.add('_hidden')
				}
			});
		}

	}
}
radioInputs.forEach(radioInput => {
	radioInputsChange(radioInput);
	radioInput.addEventListener('change', function () {
		radioInputsChange(radioInput);
	})
})

// =-=-=-=-=-=-=-=-=-=-=-=- </hide and visible blocks in form> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=- <focus event on input> -=-=-=-=-=-=-=-=-=-=-

const inputs = document.querySelectorAll('.input, .textarea');
inputs.forEach(input => {
	input.addEventListener('focus', function () {
		input.closest('label').classList.add('focus');
	})
	input.addEventListener('blur', function () {
		input.closest('label').classList.remove('focus');
	})
})

// =-=-=-=-=-=-=-=-=-=- </focus event on input> -=-=-=-=-=-=-=-=-=-=-



// =-=-=-=-=-=-=-=-=-=-=-=- <animation> -=-=-=-=-=-=-=-=-=-=-=-=

AOS.init({
	disable: "mobile",
});

// =-=-=-=-=-=-=-=-=-=-=-=- </animation> -=-=-=-=-=-=-=-=-=-=-=-=
