/**
 * @param {number} mean - The mean of the curve
 * @param {number} deviation - On average, how far we get from the mean. Or the "spread" of values along the curve.#9646
 * @returns {number}
 * 
 * Generates a random number along a probability curve given x mean and y standard deviation.
 */
export function randomNumberWithCurve(mean: number, deviation: number): number {
    let u1 = Math.random();
    let u2 = Math.random();

    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return mean + z0 * deviation;
}

/**
 * @param {number} max - The maximum value of the range. This value must be higher than `mean`.
 * @param {number} min - The minimum value of the range. This value must be lower than `mean`.
 * @param {number} mean - The mean of the curve.
 * @param {number} deviation - The standard deviation of the curve.
 * @returns {number}
 * 
 * Generates a random number along a probability curve given x mean and y standard deviation. Tries to stay within a given range.
 */
export function randomNumberWithCurveInRange(max: number, min: number, mean: number, deviation: number): number {
    if(max < mean || min > mean) {
        throw RangeError("`mean` must be between `min` and `max`");
    }

    return randomNumberWithCurve(mean, deviation) * (max - min) + min;
}

/**
 * @param {number} lambda - Think of it as the average number of events to occur per hour.
 * @returns {number}
 * 
 * Generates a random number with an exponential distribution. 
 */
export function randomNumberWithExpDist(lambda: number): number {
  return -Math.log(1 - Math.random()) / lambda;
}

/**
 * @param {number} max - The suggested max value for the range.
 * @param {number} min - The suggested min value for the range.
 * @param {number} lambda - The lambda used for calculations.
 * @returns {number}
 * 
 * Takes a suggested minimum and maximum value, and - using exponential distribution - returns a number usually within that range.
 */
export function randomNumberWithExpDistInRange(max: number, min: number, lambda: number): number {
  return randomNumberWithExpDist(lambda) * (max - min) + min;
}

/**
 * @param {number} max - The max value of the random number.
 * @param {number} min - The min value of the random number.
 * @param {boolean} round - If it should return a whole number.
 * @returns {number}
 * 
 * Generates a random number within the specified range
 */
export function randomNumberInRange(max: number, min: number, round = true): number {
  if (!round) {
    return Math.random() * (max - min) + min;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}