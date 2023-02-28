
const body = document.querySelector('body'),
	html = document.querySelector('html'),
	menu = document.querySelectorAll('.header__burger, .header__nav, .header, body'),
	burger = document.querySelector('.header__burger'),
	wrapper = document.querySelector('.wrapper'),
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

				const popupVideo = popup.querySelector('.popup-video');
				if(popupVideo) {
					if(!popupVideo.querySelector('iframe')) {
						popupVideo.insertAdjacentHTML("beforeend",
						`<iframe src="${popupVideo.dataset.src}${popupVideo.dataset.id}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`)
					}
				}

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


// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let resizeCheck = [0,0];

function resize() {

	resizeCheck[0] = window.innerWidth;

	if(resizeCheck[0] != resizeCheck[1]) {
		resizeCheck[1] = window.innerWidth;
		html.style.setProperty("--height-header", header.offsetHeight + "px")
	}

	html.style.setProperty("--height-screen", window.innerHeight + "px")
	

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
		el: '.gallery__slider--pagination.swiper-pagination',
		clickable: true,
	},
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
	//lazy: true,
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

let galleryFastIntro;

const mainIntroLogo = document.querySelectorAll('.main-intro__logo');
mainIntroLogo.forEach(mainIntroLogo => {
	
	let galleryElements = document.querySelectorAll('.main-intro__gallery');
	mainIntroLogo.addEventListener('mouseenter', function () {

		if(deviceType() == "desktop") {

			if(galleryFastIntro) galleryFastIntro.destroy(true, true);

			mainIntroLogo.classList.add('_active');
	
			galleryElements.forEach(galleryElement => {
				galleryElement.classList.add('_active');
			})

			galleryFastIntro = new Swiper('.main-intro__gallery--slider', {
				effect: "fade",
				autoplay: {
					delay: 150
				},
				speed: 150,
				loop: true,
				slidesPerView: 1,
			})
		}

	})

	mainIntroLogo.addEventListener('mouseleave', function () {

		if(deviceType() == "desktop") {
			mainIntroLogo.classList.remove('_active');

			galleryElements.forEach(galleryElement => {
				galleryElement.classList.remove('_active');
			})

			setTimeout(() => {
				if(galleryFastIntro) galleryFastIntro.destroy(true, true);
			},200)
		}
		
	})
})

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-

body.addEventListener('click', function (event) {

	function $(elem) {
		return event.target.closest(elem)
	}

	// =-=-=-=-=-=-=-=-=-=- <open menu in header> -=-=-=-=-=-=-=-=-=-=-

	if ($('.header__burger')) {
		menu.forEach(element => {
			element.classList.toggle('_active')
			window.scroll({
				top: 0, left: 0
			})
		})
	}

	// =-=-=-=-=-=-=-=-=-=- </open menu in header> -=-=-=-=-=-=-=-=-=-=-



	// =-=-=-=-=-=-=-=-=-=- <header sub> -=-=-=-=-=-=-=-=-=-=-

	const
		headerNavLink = $('.header__nav--link'),
		headerNavItemSubActive = document.querySelector('.header__nav--item._sub-active');

	if (headerNavLink) {

		//if(headerNavLink.classList.contains('_prevent-default')) event.preventDefault();

		const
			item = headerNavLink.closest('.header__nav--item'),
			sub = item.querySelector('.header__nav-sub');

		if (sub) {
			if (!item.classList.contains('_sub-active') && (deviceType() == 'mobile' || deviceType() == 'tablet')) {
				event.preventDefault();
				item.classList.add('_sub-active')
			} else if(item.classList.contains('_sub-active') && headerNavLink.classList.contains('_prevent-default') && (deviceType() == 'mobile' || deviceType() == 'tablet')) {
				event.preventDefault();
				item.classList.remove('_sub-active')
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
				faqItemContent.style.display = 'block';
				const height = faqItemContent.offsetHeight;
				faqItemContent.style.height = height + 'px';

				function hidden() {
					faqItemContent.style.removeProperty('transition-property')
					faqItemContent.style.display = 'none';
					faqItemContent.style.removeProperty('height')
					faqItem.classList.remove('_animating');
					faqItem.classList.remove('_active')
					setTimeout(() => {
						faqItem.classList.remove('_hide-placeholder');
					},200)
					faqItemContent.removeEventListener('transitionend', hidden)
				}

				faqItemContent.addEventListener('transitionend', hidden)

				setTimeout(() => {
					faqItemContent.style.height = 0;
				},0)

			} else {

				const faqItemActive = document.querySelector('.faq__item._active');

				if(faqItemActive) {
					const faqItemActiveContent = faqItemActive.querySelector('.faq__item--content');
					faqItemActive.classList.add('_animating');

					faqItemActiveContent.style.transitionProperty = 'height';
					faqItemActiveContent.style.display = 'block';
					const heightActive = faqItemActiveContent.offsetHeight;
					faqItemActiveContent.style.height = heightActive + 'px';

					function hidden() {
						faqItemActiveContent.style.removeProperty('transition-property')
						faqItemActiveContent.style.display = 'none';
						faqItemActiveContent.style.removeProperty('height')
						faqItemActive.classList.remove('_animating');
						faqItemActive.classList.remove('_active')
						setTimeout(() => {
							faqItemActive.classList.remove('_hide-placeholder');
						},200)
						faqItemActiveContent.removeEventListener('transitionend', hidden)
					}

					faqItemActiveContent.addEventListener('transitionend', hidden)

					setTimeout(() => {
						faqItemActiveContent.style.height = 0;
					},50)
				}


				faqItem.classList.add('_hide-placeholder');
				faqItemContent.style.removeProperty('height');
				faqItemContent.style.display = 'block';
				const height = faqItemContent.offsetHeight;
				faqItemContent.style.height = 0;
				faqItemContent.style.transitionProperty = 'height';

				function visible() {
					faqItemContent.style.removeProperty('transition-property')
					faqItemContent.style.removeProperty('height');
					faqItem.classList.remove('_animating');
					faqItem.classList.add('_active');
					faqItemContent.removeEventListener('transitionend', visible)
				}

				faqItemContent.addEventListener('transitionend', visible);

				setTimeout(() => {
					faqItemContent.style.height = height + 'px';
				},400)

			}
		}


	}

	// =-=-=-=-=-=-=-=-=-=- </FAQ> -=-=-=-=-=-=-=-=-=-=-

	const mainIntroLogo = $('.main-intro__logo'),
	mainIntroLogoActive = document.querySelector('.main-intro__logo._active');

	if(mainIntroLogo && deviceType() != "desktop") {

		let galleryElements = document.querySelectorAll('.main-intro__gallery');

		if(!mainIntroLogo.classList.contains('_active')) {
			
			if(galleryFastIntro) galleryFastIntro.destroy(true, true);

			mainIntroLogo.classList.add('_active');
		
			galleryElements.forEach(galleryElement => {
				galleryElement.classList.add('_active');
			})
	
			galleryFastIntro = new Swiper('.main-intro__gallery--slider', {
				effect: "fade",
				autoplay: {
					delay: 150
				},
				speed: 150,
				loop: true,
				slidesPerView: 1,
			})

		} else {
			
			mainIntroLogo.classList.remove('_active');

			galleryElements.forEach(galleryElement => {
				galleryElement.classList.remove('_active');
			})
			
			setTimeout(() => {
				if(galleryFastIntro) galleryFastIntro.destroy(true, true);
			},200)
		}

	} else if(mainIntroLogoActive && deviceType() != "desktop") {

		let galleryElements = document.querySelectorAll('.main-intro__gallery');

		mainIntroLogoActive.classList.remove('_active');

		galleryElements.forEach(galleryElement => {
			galleryElement.classList.remove('_active');
		})
		
		setTimeout(() => {
			if(galleryFastIntro) galleryFastIntro.destroy(true, true);
		},200)
	}

	

})

// =-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-


// =-=-=-=-=-=-=-=-=-=-=-=- <copy from input> -=-=-=-=-=-=-=-=-=-=-=-=

var clipboard = new ClipboardJS('.copy-btn');

// =-=-=-=-=-=-=-=-=-=-=-=- </copy from input> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <hide and visible blocks in form> -=-=-=-=-=-=-=-=-=-=-=-=

const radioInputs = document.querySelectorAll('.radio-input');

let animCheck = false;

function radioInputsChange(radioInput, duration=300) {
	animCheck = true;

	if (radioInput.dataset.id && radioInput.checked) {
		const block = document.querySelector('#' + radioInput.dataset.id);
		slideDown(block,duration);
		setTimeout(() => {
			//radioInput.classList.remove('_animating')
			animCheck = false;
		},duration)
	} else {
		const row = radioInput.closest('.radio-row');
		if (row) {
			row.querySelectorAll('.radio-input').forEach(radioInput => {
				if (radioInput.dataset.id && !radioInput.checked) {
					const block = document.querySelector('#' + radioInput.dataset.id);
					slideUp(block,duration);
				}
			});
		}
		setTimeout(() => {
			animCheck = false;
		},duration)

	}
}

radioInputs.forEach(radioInput => {
	radioInputsChange(radioInput, 0);
	radioInput.addEventListener('change', function () {
		if(animCheck) {
			setTimeout(() => {
				radioInputsChange(radioInput);
			}, 300)
		} else {
			radioInputsChange(radioInput);
		}

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



// =-=-=-=-=-=-=-=-=-=-=-=- <scroll> -=-=-=-=-=-=-=-=-=-=-=-=

let scrollProgress = [0, false];

function scroll() {
	
	scrollProgress[0] = Math.abs(body.getBoundingClientRect().y);

	if(scrollProgress[0] >= (header.offsetHeight * 1.5) && scrollProgress[1] == false) {

		scrollProgress[1] = true;
		header.style.setProperty('--opacity', '0');

		setTimeout(function() {
			header.classList.add('_fixed');
			setTimeout(() => {
				header.style.setProperty('--opacity', '1');
			},100)
		},200);

	} else if(scrollProgress[0] <= (header.offsetHeight * 1.5) && scrollProgress[1] == true) {

		scrollProgress[1] = false;
		header.style.setProperty('--opacity', '0');

		setTimeout(function() {
			header.style.setProperty('--opacity', '1');
			header.classList.remove('_fixed');

		},200);

	}
}

scroll()

window.addEventListener('scroll', scroll)

// =-=-=-=-=-=-=-=-=-=-=-=- </scroll> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <animation> -=-=-=-=-=-=-=-=-=-=-=-=

AOS.init({
	disable: "mobile",
	once: true,
});

// =-=-=-=-=-=-=-=-=-=-=-=- </animation> -=-=-=-=-=-=-=-=-=-=-=-=

function slideUp (target, duration=300) {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout( () => {
	  target.style.display = 'none';
	  target.style.removeProperty('height');
	  target.style.removeProperty('padding-top');
	  target.style.removeProperty('padding-bottom');
	  target.style.removeProperty('margin-top');
	  target.style.removeProperty('margin-bottom');
	  target.style.removeProperty('overflow');
	  target.style.removeProperty('transition-duration');
	  target.style.removeProperty('transition-property');
	}, duration);
}

function slideDown (target, duration=300) {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;

	if (display === 'none')
	  display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout( () => {
	  target.style.removeProperty('height');
	  target.style.removeProperty('overflow');
	  target.style.removeProperty('transition-duration');
	  target.style.removeProperty('transition-property');
	}, duration);
}
