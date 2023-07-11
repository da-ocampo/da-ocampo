/* Scrollbar */

document.body.style.overflow = "hidden";
document.documentElement.style.overflow = "auto";

// JavaScript code
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

/* Show More / Show Less */

const blogContainer = document.querySelector('#blog-container');
const posts = blogContainer.querySelectorAll('.post-preview');
const showMore = document.querySelector('#show-more');
const showLess = document.querySelector('#show-less');

let displayedPosts = 3;

function showPosts(count) {
  for (let i = 0; i < posts.length; i++) {
    if (i < count) {
      posts[i].style.display = 'inline-block';
    } else {
      posts[i].style.display = 'none';
    }
  }
}

showMore.addEventListener('click', () => {
  displayedPosts = Math.min(displayedPosts + 3, posts.length);
  showPosts(displayedPosts);
  
  if (displayedPosts === posts.length) {
    showMore.style.display = 'none';
  }
  
  showLess.style.display = 'inline-block';
});

showLess.addEventListener('click', () => {
  displayedPosts = Math.max(displayedPosts - 3, 3);
  showPosts(displayedPosts);
  
  if (displayedPosts === 3) {
    showLess.style.display = 'none';
  }
  
  showMore.style.display = 'inline-block';
});

showPosts(displayedPosts);

/* Video Hover */

var video = document.getElementById("videoPlay");

video.pause(); // Start Video Paused

video.addEventListener("mouseover", function() {
  video.play(); 
}); // Play Video On Hover

video.addEventListener("mouseout", function() {
  video.pause();
}); // Pause Video When Mouse is ff

/* Blog Post Window */

function openWindow(url) {

  // Check if a window with the same URL is already open
  var existingWindow = document.querySelector('.window .content[src="' + url + '"]');
  if (existingWindow) {
    // Bring the existing window to the forefront
    const windows = document.querySelectorAll('.window');
    windows.forEach(function(w) {
      w.style.zIndex = 1;
    });
    existingWindow.parentElement.style.zIndex = 2;
    return;
  }

  // If no existing window is found, create a new one
  var windowEl = document.createElement('div');
  windowEl.classList.add('window'); // Create window div element

  var titlebarEl = document.createElement('div'); // Create titlebar for window
  titlebarEl.classList.add('titlebar');
  windowEl.appendChild(titlebarEl);

  var closeEl = document.createElement('div'); // Create close button for titlebar
  closeEl.classList.add('close');
  closeEl.textContent = 'x';
  titlebarEl.appendChild(closeEl);

  var contentEl = document.createElement('iframe'); // Create content iframe for window
  contentEl.classList.add('content');
  contentEl.src = url;
  windowEl.appendChild(contentEl);

  // Position the window randomly within the user's viewport
  var viewportWidth = document.documentElement.clientWidth;
  var viewportHeight = document.documentElement.clientHeight;
  var maxLeft = viewportWidth - 400;
  var maxTop = viewportHeight - 300;
  var minLeft = 50;
  var minTop = 50;

  // Check existing windows to avoid overlapping
  const windows = document.querySelectorAll('.window');
  var existingWindows = Array.from(windows).filter(function(w) {
    return w !== windowEl;
  });
  var overlaps = true;
  while (overlaps) {
    overlaps = false;
    var left = Math.floor(Math.random() * (maxLeft - minLeft + 1) + minLeft);
    var top = Math.floor(Math.random() * (maxTop - minTop + 1) + minTop);
    existingWindows.forEach(function(w) {
      if (overlaps) {
        return;
      }
      var wLeft = parseInt(w.style.left, 10);
      var wTop = parseInt(w.style.top, 10);
      var wWidth = w.offsetWidth;
      var wHeight = w.offsetHeight;
      if (left + 20 < wLeft + wWidth && left + 380 > wLeft && top + 20 < wTop + wHeight && top + 280 > wTop) {
        overlaps = true;
      }
    });
  }
  
  windowEl.style.left = left + 'px';
  windowEl.style.top = top + 'px';

  var isDragging = false; // Make window draggable
  var dragStartX, dragStartY;
  titlebarEl.addEventListener('mousedown', function (event) {
    isDragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  });
  window.addEventListener('mousemove', function (event) {
    if (isDragging) {
      var diffX = event.clientX - dragStartX;
      var diffY = event.clientY - dragStartY;
      windowEl.style.left = (windowEl.offsetLeft + diffX) + 'px';
      windowEl.style.top = (windowEl.offsetTop + diffY) + 'px';
      dragStartX = event.clientX;
      dragStartY = event.clientY;
    }
  });
  window.addEventListener('mouseup', function (event) {
    isDragging = false;
  });

  windowEl.addEventListener('mousedown', function (event) { // Make window resizable
    if (event.target.classList.contains('resizer')) {
      var originalWidth = parseFloat(getComputedStyle(windowEl, null).getPropertyValue('width').replace('px', ''));
      var originalHeight = parseFloat(getComputedStyle(windowEl, null).getPropertyValue('height').replace('px', ''));
      var originalX = windowEl.offsetLeft;
      var originalY = windowEl.offsetTop;
      var diffX = event.clientX - originalX;
      var diffY = event.clientY - originalY;
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    }
    function resize(event) {
      var width = event.clientX - originalX + diffX;
      var height = event.clientY - originalY + diffY;
      windowEl.style.width = (width > 100 ? width : 100) + 'px';
      windowEl.style.height = (height > 100 ? height : 100) + 'px';
    }
    function stopResize() {
      window.removeEventListener('mousemove', resize);
    }
  });

  document.body.appendChild(windowEl); // Add window to document

  windowEl.animate([ // Animate window with expanding out effect
    { transform: 'scale(0.5)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ], {
    duration: 500,
    easing: 'ease-out'
  });

  closeEl.addEventListener('click', function () { // Add event listener to close button
    windowEl.animate([ // Animate window with collapsing in effect
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.5)', opacity: 0 }
    ], {
      duration: 500,
      easing: 'ease-out'
    });

    setTimeout(function () { // Remove window after a short delay to allow the effect to finish
      document.body.removeChild(windowEl);
    }, 500);
  });

  windowEl.addEventListener('mousedown', function() { // Bring the window to the forefront when it's clicked on
    const windows = document.querySelectorAll('.window');
    windows.forEach(function(w) {
    w.style.zIndex = 1;
    });
    windowEl.style.zIndex = 2;
  });
}