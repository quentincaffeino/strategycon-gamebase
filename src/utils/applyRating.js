
export function applyRating(el, rating) {
  if (el && rating) {
    el.innerHTML = rating.html;
    el.style.color = rating.color;
  }
}
