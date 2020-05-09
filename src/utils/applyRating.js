
export function applyRating(el, rating) {
  if (el && rating) {
    el.innerHTML = rating.text;
    el.style.color = rating.color;
  }
}
