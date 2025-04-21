function createSlider(config) {
    const {
        containerId = 'slider',
        images = [],
        showArrows = false,
        showDots = false,
        autoplay = false,
        autoplayInterval = 3000
    } = config;

    const state = {
        currentIndex: 0,
        autoplay,
        autoplayInterval,
        autoplayTimer: null,
        isPaused: !autoplay
    };

    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const track = createTrack(images);
    container.appendChild(track);

    const arrows = showArrows ? createArrows(container) : {};
    const dotsData = showDots ? createDots(images, container) : {};

    const { leftArrow, rightArrow } = arrows;
    const { dotsContainer, dots } = dotsData;

    if (showDots && dots.length) {
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                update(i);
                restartAutoSlide();
            });
        });
    }

    if (leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => update(state.currentIndex - 1));
        rightArrow.addEventListener('click', () => update(state.currentIndex + 1));
    }

    container.addEventListener('mouseenter', () => clearAutoSlide());
    container.addEventListener('mouseleave', () => startAutoSlide());

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') update(state.currentIndex - 1);
        if (e.key === 'ArrowRight') update(state.currentIndex + 1);
    });

    const update = (index) => {
        state.currentIndex = (index + images.length) % images.length;
        updateView(state.currentIndex, track, dots);
    };

    const startAutoSlide = () => {
        if (state.autoplay && !state.autoplayTimer && !state.isPaused) {
            state.autoplayTimer = setInterval(() => {
                update(state.currentIndex + 1);
            }, state.autoplayInterval);
        }
    };

    const clearAutoSlide = () => {
        if (state.autoplayTimer) {
            clearInterval(state.autoplayTimer);
            state.autoplayTimer = null;
        }
    };

    const restartAutoSlide = () => {
        if (!state.isPaused) {
            clearAutoSlide();
            startAutoSlide();
        }
    };

    const updateInterval = (newInterval) => {
        state.autoplayInterval = newInterval;
        restartAutoSlide();
    };

    const play = () => {
        if (state.isPaused) {
            state.isPaused = false;
            startAutoSlide();
        }
    };

    const pause = () => {
        clearAutoSlide();
        state.isPaused = true;
    };

    const toggleDots = (show) => {
        if (dotsContainer) {
            dotsContainer.style.display = show ? 'flex' : 'none';
        }
    };

    if (state.autoplay) {
        startAutoSlide();
    }

    return {
        nextSlide: () => update(state.currentIndex + 1),
        prevSlide: () => update(state.currentIndex - 1),
        updateInterval,
        play,
        pause,
        toggleDots
    };
}

// DOM helpers

const createTrack = (images) => {
    const track = document.createElement('div');
    track.className = 'slider-track';

    images.forEach(src => {
        const slide = document.createElement('div');
        slide.className = 'slide';

        const img = document.createElement('img');
        img.src = src;

        slide.appendChild(img);
        track.appendChild(slide);
    });

    return track;
};

const createArrows = (container) => {
    const createArrow = (direction, symbol) => {
        const arrow = document.createElement('button');
        arrow.className = `arrow ${direction}`;
        arrow.textContent = symbol;
        return arrow;
    };

    const leftArrow = createArrow('left', '←');
    const rightArrow = createArrow('right', '→');

    container.appendChild(leftArrow);
    container.appendChild(rightArrow);

    return { leftArrow, rightArrow };
};

const createDots = (images, container) => {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dots';

    const dots = images.map((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
        return dot;
    });

    container.after(dotsContainer);
    return { dotsContainer, dots };
};

const updateView = (index, track, dots) => {
    track.style.transform = `translateX(-${index * 100}%)`;

    if (dots && dots.length) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    }
};

// Event listeners for the UI

const intervalInput = document.getElementById('intervalInput');
const intervalCheckbox = document.getElementById('intervalCheckbox');
const playPauseBtn = document.getElementById('playPauseBtn');
const toggleDotsCheckbox = document.getElementById('toggleDots');

intervalInput.addEventListener('input', () => {
    if (intervalCheckbox.checked) {
        slider.updateInterval(parseInt(intervalInput.value));
    }
});

intervalCheckbox.addEventListener('change', () => {
    intervalInput.disabled = !intervalCheckbox.checked;
    if (intervalCheckbox.checked) {
        slider.updateInterval(parseInt(intervalInput.value));
    }
});

let paused = false;
playPauseBtn.addEventListener('click', () => {
    paused = !paused;
    if (paused) {
        slider.pause();
        playPauseBtn.textContent = '▶️ Продовжити';
    } else {
        slider.play();
        playPauseBtn.textContent = '⏸ Зупинити';
    }
});

toggleDotsCheckbox.addEventListener('change', (e) => {
    slider.toggleDots(e.target.checked);
});

// Slider Initialization

const slider = createSlider({
    images: [
        'img/img-1.jpg',
        'img/img-2.jpg',
        'img/img-3.avif',
        'img/img-4.jpg',
        'img/img-5.avif'
    ],
    autoplay: true,
    autoplayInterval: 3000,
    showArrows: true,
    showDots: true
});
