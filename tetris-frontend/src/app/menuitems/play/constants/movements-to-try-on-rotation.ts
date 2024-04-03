
/**
 * When the user tries to rotate but it would collide,
 * we want to check maybe we can rotate and move it left 
 * or right and up or down to avoid collision.
 * The first argument is on the x-axis and 
 * the second one is on the y-axis
 */
export const movementsToTry = [
    [1,0],
    [-1,0],
    [2,0],
    [-2,0],
    [1,1],
    [-1,1],
    [2,-1],
    [-2,-1],


]