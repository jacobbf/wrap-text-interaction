// https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
function throttled(delay, fn) {
  let lastCall = 0;
  return function (...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

/* takes text, a class name and an element type all as strings wraps each letter in a span with class letter */
const letterWrapper = function(string, el, cl) {
  let wrappedText = "";
  for (var i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    if (char == " ") {
      char = "&nbsp";
    }
    wrappedText = wrappedText + "<" + el + " class='" + cl + "'>" + char + "</" + el + ">";
  }
  return wrappedText;
};

/* wrapAroundImage
textContainer -> the parent container of the text to wrap around the image. Text itself must have each character wrapped in a span. To do this automatically see letterWrapper()
margin -> left and right stops for image movement */
const wrapAroundImage = function(textContainer, image, lrMargin) {
  // declaring these guys, we'll define them later
  let imageRect;
  let imageWidth;
  let imageHeight;
  let imageTop;
  let imageLeft;
  let fontSize;
  let letterHeight;

  const setUp = function() {
    // get image width and height before we start messing with events
    imageRect = image.getBoundingClientRect();
    imageWidth = imageRect.width;
    imageHeight = imageRect.height;
    fontSize = parseFloat(window.getComputedStyle(textContainer.children[0]).getPropertyValue('font-size'));
    letterHeight = parseInt(window.getComputedStyle(textContainer.children[0]).getPropertyValue('height'));
    console.log(fontSize);
    console.log(letterHeight);
    lrPadding = fontSize/2;
    tbPadding = letterHeight;
  }

  const wrapTextAroundimage = function() {
    image.classList.add('moved');

    imageLeft = (event.clientX - imageWidth / 2);
    imageTop = (event.clientY - imageHeight / 2);

    if (imageLeft < lrMargin) {
      imageLeft = 0 + lrMargin;
    }
    if ((imageLeft + imageWidth) > window.innerWidth - lrMargin) {
      imageLeft = window.innerWidth - imageWidth - lrMargin;
    }

    image.style.transform = "translate(" + imageLeft + "px ," + imageTop + "px)"

    const letters = textContainer.children;
    for (var i = 0; i < letters.length; i++) {
      const dx = letters[i].getBoundingClientRect().x - imageLeft;
      const dy = letters[i].getBoundingClientRect().y - imageTop;

      if (dx < lrPadding && dx > -lrPadding && dy > -tbPadding && dy < imageHeight) {
        let width = window.getComputedStyle(letters[i]).getPropertyValue('width');
        let parsedWidth = width.split("p")
        letters[i].style.paddingLeft = (imageWidth + parseInt(parsedWidth[0], 10) + 30) + "px";
      } else {
        letters[i].style.paddingLeft = 0 + "px";
      }
    }
  }

  image.addEventListener("load", setUp);
  image.addEventListener("resize", setUp);
  const throttledWrapTextAroundimage = throttled(50, wrapTextAroundimage);
  document.addEventListener("mousemove", throttledWrapTextAroundimage)
  document.addEventListener("touchmove", throttledWrapTextAroundimage)

}

const wrapper = document.getElementById('wrapper');
const block = document.getElementById('block');
const imageObj = document.getElementById('image');
block.innerHTML = block.innerHTML + letterWrapper(block.getAttribute('data-text'), 'span', 'letter');
wrapAroundImage(block, imageObj, 100);
