import { Composio } from '@composio/core';
import { GoogleProvider } from '@composio/google';
import { GoogleGenAI, type Part } from '@google/genai';
export const composio = new Composio({
    apiKey: process.env.NEXT_COMPOSIO_API_KEY ,
    provider: new GoogleProvider(),
});
