export function generateId(): number {
    // Generate random int from <0, 1000> interval
    return Math.floor(Math.random() * 1000);
}