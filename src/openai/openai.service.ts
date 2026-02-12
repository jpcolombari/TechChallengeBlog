import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
    private openai: OpenAI;
    private readonly logger = new Logger(OpenAIService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            this.logger.warn('OPENAI_API_KEY not found in environment variables.');
        }
        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    async generateQuiz(content: string): Promise<any> {
        try {
            const prompt = `
        Baseado no texto a seguir, gere 1 pergunta de Verdadeiro ou Falso.
        O formato da resposta DEVE ser um JSON válido com os campos: 
        "question" (string), "answer" (boolean, true para verdadeiro, false para falso) e "explanation" (string curta explicando a resposta).

        Texto: "${content}"
      `;

            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-3.5-turbo',
                response_format: { type: "json_object" },
            });

            const responseContent = completion.choices[0].message.content;
            if (!responseContent) {
                this.logger.error('Received null content from OpenAI');
                throw new Error('Failed to generate quiz from OpenAI');
            }
            return JSON.parse(responseContent);
        } catch (error) {
            this.logger.error('Error integrating with OpenAI:', error);

            // MOCK FALLBACK (Para testes sem créditos na API)
            this.logger.warn('Using MOCK response due to API error.');
            return {
                question: "Esta é uma pergunta de teste (Mock) gerada porque a API da OpenAI retornou erro (provavelmente cota excedida). O Nest.js é um framework exclusivo para Frontend?",
                answer: false,
                explanation: "O Nest.js é um framework para desenvolvimento Backend (Node.js), não Frontend."
            };
        }
    }
}
