// test-generate.js
import generateRandom from "crypto-randomizer";

console.log("🔧 generateRandom type:", typeof generateRandom);

try {
    const test1 = generateRandom(6, "number");
    console.log("✅ Number:", test1);
    
    const test2 = generateRandom(32, "alphaNumeric");
    console.log("✅ Alphanumeric:", test2);
} catch (error) {
    console.error("❌ Error:", error.message);
}