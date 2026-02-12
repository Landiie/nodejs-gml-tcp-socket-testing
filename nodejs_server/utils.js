/**
 * Get a random integer between min and max params, inclusive.
 * @param {Number} min minimum number inclusive
 * @param {Number} max maximum number invlusive
 * @returns {Number} a number between min and max inclusive
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
