const revealItems = document.querySelectorAll('.reveal');
const backToTopButton = document.getElementById('backToTop');
const hireMeButton = document.getElementById('hireMeBtn');
const footerNavLinks = document.querySelectorAll('#footerNav a');
const siteNavLinks = document.querySelectorAll('#siteNav a');
const sections = document.querySelectorAll('section[id], footer[id]');
const certificateItems = document.querySelectorAll('.cert-list li');
const certificateViewer = document.getElementById('certificateViewer');
const certificateViewerImage = document.getElementById('certificateViewerImage');
const certificateViewerClose = document.getElementById('certificateViewerClose');
const resumeButton = document.getElementById('resumeBtn');
const resumeViewer = document.getElementById('resumeViewer');
const resumeViewerBack = document.getElementById('resumeViewerBack');
const storySequences = document.querySelectorAll('.story-sequence');
const educationSection = document.querySelector('.education');
const interactiveSections = document.querySelectorAll('.interactive-section');
const copyButtons = document.querySelectorAll('.contact-copy');
let previouslyFocusedCertificate = null;

if ('IntersectionObserver' in window) {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.2
	});

	revealItems.forEach((item) => revealObserver.observe(item));

	const storyObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-active');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.28,
		rootMargin: '0px 0px -10% 0px'
	});

	storySequences.forEach((sequence) => storyObserver.observe(sequence));
} else {
	revealItems.forEach((item) => item.classList.add('is-visible'));
	storySequences.forEach((sequence) => sequence.classList.add('is-active'));
}

const updateActiveNav = () => {
	const marker = window.scrollY + window.innerHeight * 0.35;
	let currentSectionId = 'home';

	sections.forEach((section) => {
		if (section.offsetTop <= marker) {
			currentSectionId = section.id;
		}
	});

	[...footerNavLinks, ...siteNavLinks].forEach((link) => {
		const isActive = link.getAttribute('href') === `#${currentSectionId}`;
		link.classList.toggle('active', isActive);
	});
};

const toggleBackToTop = () => {
	if (!backToTopButton) {
		return;
	}

	backToTopButton.classList.toggle('show', window.scrollY > 300);
};

window.addEventListener('scroll', () => {
	updateActiveNav();
	toggleBackToTop();
});

updateActiveNav();
toggleBackToTop();

if (backToTopButton) {
	backToTopButton.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

if (hireMeButton) {
	hireMeButton.addEventListener('click', () => {
		const contactSection = document.getElementById('contact');
		if (contactSection) {
			contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
}

certificateItems.forEach((item) => {
	const openCertificate = () => {
		if (!certificateViewer || !certificateViewerImage) {
			return;
		}

		certificateItems.forEach((otherItem) => otherItem.classList.remove('selected'));
		item.classList.add('selected');
		previouslyFocusedCertificate = item;
		certificateViewerImage.src = item.dataset.certificateImage;
		certificateViewerImage.alt = `${item.textContent.trim()} certificate`;
		certificateViewer.classList.add('is-open');
		certificateViewer.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		certificateViewerClose?.focus();
	};

	item.addEventListener('click', openCertificate);

	item.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openCertificate();
		}
	});
});

const closeCertificate = () => {
	if (!certificateViewer) {
		return;
	}

	certificateViewer.classList.remove('is-open');
	certificateViewer.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	certificateViewerImage?.removeAttribute('src');
	previouslyFocusedCertificate?.focus();
};

certificateViewerClose?.addEventListener('click', closeCertificate);
certificateViewer?.addEventListener('click', (event) => {
	if (event.target === certificateViewer) {
		closeCertificate();
	}
});

let previouslyFocusedResume = null;

const closeResume = () => {
	if (!resumeViewer) {
		return;
	}

	resumeViewer.classList.remove('is-open');
	resumeViewer.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	previouslyFocusedResume?.focus();
};

resumeButton?.addEventListener('click', (event) => {
	event.preventDefault();
	if (!resumeViewer) {
		return;
	}

	previouslyFocusedResume = resumeButton;
	resumeViewer.classList.add('is-open');
	resumeViewer.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
	resumeViewerBack?.focus();
});

resumeViewerBack?.addEventListener('click', closeResume);
resumeViewer?.addEventListener('click', (event) => {
	if (event.target === resumeViewer) {
		closeResume();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && certificateViewer?.classList.contains('is-open')) {
		closeCertificate();
	}
	if (event.key === 'Escape' && resumeViewer?.classList.contains('is-open')) {
		closeResume();
	}
});

if (educationSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	educationSection.addEventListener('pointermove', (event) => {
		const bounds = educationSection.getBoundingClientRect();
		const pointerX = `${((event.clientX - bounds.left) / bounds.width) * 100}%`;
		const pointerY = `${((event.clientY - bounds.top) / bounds.height) * 100}%`;

		educationSection.style.setProperty('--pointer-x', pointerX);
		educationSection.style.setProperty('--pointer-y', pointerY);
	});
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	interactiveSections.forEach((section) => {
		section.addEventListener('pointermove', (event) => {
			const bounds = section.getBoundingClientRect();
			const pointerX = `${((event.clientX - bounds.left) / bounds.width) * 100}%`;
			const pointerY = `${((event.clientY - bounds.top) / bounds.height) * 100}%`;

			section.style.setProperty('--pointer-x', pointerX);
			section.style.setProperty('--pointer-y', pointerY);
		});
	});
}

copyButtons.forEach((button) => {
	button.addEventListener('click', async () => {
		const value = button.dataset.copy;

		try {
			await navigator.clipboard.writeText(value);
			button.textContent = 'Copied';
		} catch {
			button.textContent = 'Select';
		}

		window.setTimeout(() => {
			button.textContent = 'Copy';
		}, 1600);
	});
});
