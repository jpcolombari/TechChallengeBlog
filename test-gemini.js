const { GoogleGenerativeAI } = require("@google/generative-ai");

// Substitua pela sua API Key ou leia do ambiente
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAHoSXoNPNiGfpgEvJdT0b2Nu8dQ5Bl_P4";
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Curiosamente, o SDK não tem um método direto 'listModels' exportado na raiz facilmente em todas as versões,
        // mas a chamada de um modelo inexistente costuma retornar a lista de suportados no erro,
        // OU podemos testar um print simples.

        // Vamos tentar gerar conteúdo com um modelo simples para ver se conecta
        console.log("Testing connection with gemini-1.5-flash...");
        const flash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await flash.generateContent("Hello");
        console.log("Success with gemini-1.5-flash:", result.response.text());

    } catch (error) {
        console.error("Error testing model:", error.message);
        if (error.response && error.response.promptFeedback) {
            console.log("Feedback:", error.response.promptFeedback);
        }
    }

    try {
        console.log("\nTesting connection with gemini-pro...");
        const pro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await pro.generateContent("Hello");
        console.log("Success with gemini-pro:", result2.response.text());
    } catch (error) {
        console.error("Error testing gemini-pro:", error.message);
    }
}

listModels();
