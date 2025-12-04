// src/GenerateCartCode.js

// Function name is kept as you wrote it
function generateRandomAlphanumeric(length = 11){ // Set length to 11
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result
}

// FIX: Export the function so it can be called multiple times
export { generateRandomAlphanumeric };