// Caching frequently used DOM elements
const body = document.body;
const ellipsisSpan = document.getElementById('ellipsis');
const documentElement = document.documentElement;

// Scrollbar
body.style.overflow = "hidden";
documentElement.style.overflow = "auto";

const dots = ['.', '..', '...'];
let currentDotIndex = 0;

function updateEllipsisAnimation() {
  ellipsisSpan.textContent = dots[currentDotIndex];
  currentDotIndex = (currentDotIndex + 1) % dots.length;
}

setInterval(updateEllipsisAnimation, 500);

// Generate Window
function openWindow(url) {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.open(url, '_blank');
    return;
  }

  const existingWindow = document.querySelector(`.window .content[src="${url}"]`);
  if (existingWindow) {
    bringToFront(existingWindow.parentElement);
    return;
  }

  const windowEl = createWindowElement(url);
  const randomPosition = getRandomPosition();
  setPosition(windowEl, randomPosition);
  addWindowListeners(windowEl, url);

  body.appendChild(windowEl);
}

function createWindowElement(url) {
  const windowEl = document.createElement('div');
  windowEl.classList.toggle('window', true);
  windowEl.classList.toggle('opening', true);

  const titlebarEl = document.createElement('div');
  titlebarEl.classList.toggle('titlebar', true);
  windowEl.appendChild(titlebarEl);

  titlebarEl.appendChild(createElementWithClass('div', 'close', 'x'));
  windowEl.appendChild(createElementWithClass('div', 'full-size-button', 'New Tab'));
  titlebarEl.appendChild(createElementWithClass('div', 'resizer'));

  const contentEl = createElementWithClass('iframe', 'content');
  contentEl.src = url;
  windowEl.appendChild(contentEl);

  addAnimation(windowEl);
  return windowEl;
}

function createElementWithClass(tag, className, textContent) {
  const element = document.createElement(tag);
  element.classList.toggle(className, true);
  if (textContent) element.textContent = textContent;
  return element;
}

function getRandomPosition() {
  const viewportWidth = documentElement.clientWidth;
  const viewportHeight = documentElement.clientHeight;
  const maxLeft = viewportWidth - 400;
  const maxTop = viewportHeight - 300;
  const minLeft = 50;
  const minTop = 50;

  const existingWindows = Array.from(document.querySelectorAll('.window'));

  let overlaps, left, top;
  do {
    overlaps = false;
    left = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
    top = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);

    for (const w of existingWindows) {
      if (left + 20 < w.offsetLeft + w.offsetWidth &&
        left + 380 > w.offsetLeft &&
        top + 20 < w.offsetTop + w.offsetHeight &&
        top + 280 > w.offsetTop) {
        overlaps = true;
        break;
      }
    }
  } while (overlaps);

  return { left, top };
}

function setPosition(element, position) {
  const { left, top } = position;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

function makeDraggable(windowEl, titlebarEl) {
  let isDragging = false;
  let dragStartX, dragStartY;

  titlebarEl.addEventListener('mousedown', startDrag);

  function startDrag(event) {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;

    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDrag);
  }

  function drag(event) {
    if (isDragging) {
      const { clientX, clientY } = event;
      const diffX = clientX - dragStartX;
      const diffY = clientY - dragStartY;
      windowEl.style.left = `${windowEl.offsetLeft + diffX}px`;
      windowEl.style.top = `${windowEl.offsetTop + diffY}px`;
      dragStartX = clientX;
      dragStartY = clientY;
    }
  }

  function stopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', drag);
    window.removeEventListener('mouseup', stopDrag);
  }
}

function makeResizable(windowEl, resizeEl) {
  resizeEl.addEventListener('mousedown', startResize);

  function startResize(event) {
    if (event.target.classList.contains('resizer')) {
      let originalX = event.clientX;
      let originalY = event.clientY;

      function resize(event) {
        const diffX = event.clientX - originalX;
        const diffY = event.clientY - originalY;
        windowEl.style.width = `${windowEl.offsetWidth + diffX}px`;
        windowEl.style.height = `${windowEl.offsetHeight + diffY}px`;
        originalX = event.clientX;
        originalY = event.clientY;
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    }
  }
}

function addWindowListeners(windowEl, url) {
  makeDraggable(windowEl, windowEl.querySelector('.titlebar'));
  makeResizable(windowEl, windowEl.querySelector('.resizer'));

  windowEl.querySelector('.close').addEventListener('click', () => closeWindow(windowEl));
  windowEl.addEventListener('mousedown', () => bringToFront(windowEl));
  windowEl.querySelector('.full-size-button').addEventListener('click', () => openInNewTab(url));
}

function addAnimation(windowEl) {
  windowEl.style.transform = 'scale(0.5)';
  windowEl.style.opacity = 0;
  windowEl.offsetHeight;

  let startTime;

  function animateOpen(time) {
    if (!startTime) startTime = time;
    const progress = (time - startTime) / 500;
    windowEl.style.transform = `scale(${0.5 + 0.5 * progress})`;
    windowEl.style.opacity = progress;
    if (progress < 1) {
      requestAnimationFrame(animateOpen);
    } else {
      windowEl.style.transition = '';
    }
  }

  requestAnimationFrame(animateOpen);
}

function closeWindow(windowEl) {
  windowEl.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
  windowEl.style.transform = 'scale(0.5)';
  windowEl.style.opacity = 0;

  setTimeout(() => body.removeChild(windowEl), 500);
}

function bringToFront(windowEl) {
  const windows = document.querySelectorAll('.window');
  windows.forEach(w => (w.style.zIndex = 1));
  windowEl.style.zIndex = 2;
}

function openInNewTab(url) {
  window.open(url, '_blank');
}