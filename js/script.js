/* Scrollbar */

document.body.style.overflow = "hidden";
document.documentElement.style.overflow = "auto";

const ellipsisSpan = document.getElementById('ellipsis');
const dots = ['.', '..', '...']; // Array of ellipsis dots
let currentDotIndex = 0; // Index of the current dot in the dots array

// Function to update the ellipsis animation
function updateEllipsisAnimation() {
  ellipsisSpan.textContent = dots[currentDotIndex]; // Set the current dot as the content of the span
  currentDotIndex = (currentDotIndex + 1) % dots.length; // Increment the current dot index and loop back to the beginning if necessary
}

// Start the ellipsis animation
setInterval(updateEllipsisAnimation, 500); // Change the ellipsis every 500 milliseconds (0.5 seconds)


/* Generate Window */

function openWindow(url) {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.open(url, '_blank');
    return;
  }

  const existingWindow = document.querySelector(`.window .content[src="${url}"]`);
  if (existingWindow) {
    const windows = document.querySelectorAll('.window');
    windows.forEach(w => (w.style.zIndex = 1));
    existingWindow.parentElement.style.zIndex = 2;
    return;
  }

  const windowEl = document.createElement('div');
  windowEl.classList.add('window', 'opening');
  const titlebarEl = document.createElement('div');
  titlebarEl.classList.add('titlebar');
  windowEl.appendChild(titlebarEl);
  const closeEl = document.createElement('div');
  closeEl.classList.add('close');
  closeEl.textContent = 'x';
  titlebarEl.appendChild(closeEl);
  const fullSizeButtonEl = document.createElement('div');
  fullSizeButtonEl.classList.add('full-size-button');
  fullSizeButtonEl.textContent = 'New Tab';
  windowEl.appendChild(fullSizeButtonEl);
  const resizeEl = document.createElement('div');
  resizeEl.classList.add('resizer');
  titlebarEl.appendChild(resizeEl);
  const contentEl = document.createElement('iframe');
  contentEl.classList.add('content');
  contentEl.src = url;
  windowEl.appendChild(contentEl);

  const randomPosition = getRandomPosition();
  windowEl.style.left = randomPosition.left + 'px';
  windowEl.style.top = randomPosition.top + 'px';

  makeDraggable(windowEl, titlebarEl);
  makeResizable(windowEl, resizeEl);
  addAnimation(windowEl);

  document.body.appendChild(windowEl);

  closeEl.addEventListener('click', () => closeWindow(windowEl));
  windowEl.addEventListener('mousedown', () => bringToFront(windowEl));
  fullSizeButtonEl.addEventListener('click', () => openInNewTab(url));
}

function getRandomPosition() {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const maxLeft = viewportWidth - 400;
  const maxTop = viewportHeight - 300;
  const minLeft = 50;
  const minTop = 50;

  const existingWindows = Array.from(document.querySelectorAll('.window'));
  let overlaps = true;
  let left, top;

  while (overlaps) {
    overlaps = false;
    left = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
    top = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);

    existingWindows.forEach(w => {
      if (
        left + 20 < w.offsetLeft + w.offsetWidth &&
        left + 380 > w.offsetLeft &&
        top + 20 < w.offsetTop + w.offsetHeight &&
        top + 280 > w.offsetTop
      ) {
        overlaps = true;
      }
    });
  }

  return { left, top };
}

function makeDraggable(windowEl, titlebarEl) {
  let isDragging = false;
  let dragStartX, dragStartY;

  titlebarEl.addEventListener('mousedown', event => {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  });

  window.addEventListener('mousemove', event => {
    if (isDragging) {
      const diffX = event.clientX - dragStartX;
      const diffY = event.clientY - dragStartY;
      windowEl.style.left = windowEl.offsetLeft + diffX + 'px';
      windowEl.style.top = windowEl.offsetTop + diffY + 'px';
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    }
  });

  window.addEventListener('mouseup', () => (isDragging = false));
}

function makeResizable(windowEl, resizeEl) {
  resizeEl.addEventListener('mousedown', event => {
    if (event.target.classList.contains('resizer')) {
      const originalX = event.clientX;
      const originalY = event.clientY;

      function resize(event) {
        const diffX = event.clientX - originalX;
        const diffY = event.clientY - originalY;
        windowEl.style.width = windowEl.offsetWidth + diffX + 'px';
        windowEl.style.height = windowEl.offsetHeight + diffY + 'px';
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
  });
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

  setTimeout(() => document.body.removeChild(windowEl), 500);
}

function bringToFront(windowEl) {
  const windows = document.querySelectorAll('.window');
  windows.forEach(w => (w.style.zIndex = 1));
  windowEl.style.zIndex = 2;
}

function openInNewTab(url) {
  window.open(url, '_blank');
}