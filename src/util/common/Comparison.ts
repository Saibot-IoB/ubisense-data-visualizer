export interface IsGreaterFunction {
    type: "isGreater";
    (a: number, b: number): boolean;
}

export interface IsSmallerFunction {
    type: "isSmaller";
    (a: number, b: number): boolean;
}

/**
 * Compares 2 numbers, a and b, and returns
 * true if a is greater than b. Otherwise false.
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
export const isGreater: IsGreaterFunction = (a: number, b: number): boolean => {
    return a > b;
};
isGreater.type = "isGreater";

/**
 * Compares 2 numbers, a and b, and returns
 * true if a is greater than b. Otherwise false.
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
export const isSmaller: IsSmallerFunction = (a: number, b: number): boolean => {
    return a < b;
};
isSmaller.type = "isSmaller";
