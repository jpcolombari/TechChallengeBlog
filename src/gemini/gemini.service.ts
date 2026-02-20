import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private readonly logger = new Logger(GeminiService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            this.logger.warn('GEMINI_API_KEY not found in environment variables.');
            throw new Error('GEMINI_API_KEY is missing');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateQuiz(content: string): Promise<any> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const isExpectedTrue = Math.random() > 0.5;

            const prompt = `
        Baseado no texto a seguir, gere 1 pergunta de interpretação (afirmação).
        É OBRIGATÓRIO que a afirmação gerada seja ${isExpectedTrue ? 'VERDADEIRA' : 'FALSA'} em relação ao texto.
        O formato da resposta DEVE ser um JSON válido (sem markdown, apenas o JSON cru) com os campos: 
        "question" (string), "answer" (boolean, obrigatoriamente ${isExpectedTrue ? 'true' : 'false'}) e "explanation" (string curta explicando a reposta com base no texto).

        Texto: "${content}"
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Limpar possíveis blocos de markdown ```json ... ```
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(text);
        } catch (error) {
            this.logger.error('Error integrating with Gemini:', error);
            throw new Error('Failed to generate quiz from Gemini: ' + error.message);
        }
    }
}
