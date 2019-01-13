/* Taken from:
 * https://stackoverflow.com/questions/20114469/javascript-generate-random-dark-color
 */

var color,
  letters = '0123456789ABCDEF'.split('');
function AddDigitToColor(limit) {
  color += letters[Math.round(Math.random() * limit)];
}
function getDarkColor() {
  color = '#';
  AddDigitToColor(5);
  for (var i = 0; i < 5; i++) {
    AddDigitToColor(15);
  }
  return color;
}

export { getDarkColor };
