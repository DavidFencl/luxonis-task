/**
 * Function generates semi-random number from interval <0, 1000> which can be used as an id.
 */
export function generateId(): number {
    return Math.floor(Math.random() * 1000);
}