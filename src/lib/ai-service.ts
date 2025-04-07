import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export type MessageTone = 'formal' | 'casual' | 'friendly' | 'professional';

export interface AIMessageOptions {
  tone?: MessageTone;
  length?: 'short' | 'medium' | 'long';
  style?: 'direct' | 'elaborate' | 'persuasive';
}

/**
 * Generate message content using AI
 */
export async function generateMessageContent(
  prompt: string,
  options: AIMessageOptions = {}
): Promise<string> {
  try {
    const { tone = 'friendly', length = 'medium', style = 'direct' } = options;
    
    const systemPrompt = `You are a helpful AI assistant that helps users write messages. 
    Create a ${length} message in a ${tone} tone with a ${style} style. 
    The message should be well-written, engaging, and appropriate for the context.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return response.choices[0]?.message?.content || "Failed to generate message.";
  } catch (error) {
    console.error("Error generating message content:", error);
    throw new Error("Failed to generate message content");
  }
}

/**
 * Improve an existing message
 */
export async function improveMessage(
  message: string,
  options: AIMessageOptions = {}
): Promise<string> {
  try {
    const { tone = 'friendly', length = 'medium', style = 'direct' } = options;
    
    const systemPrompt = `You are a helpful AI assistant that improves messages. 
    Improve the following message to be more ${tone}, ${length}, and ${style}. 
    Fix any grammar or style issues while maintaining the original intent.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return response.choices[0]?.message?.content || "Failed to improve message.";
  } catch (error) {
    console.error("Error improving message:", error);
    throw new Error("Failed to improve message");
  }
}

/**
 * Generate reply suggestions for a message
 */
export async function generateReplySuggestions(
  message: string,
  count: number = 3
): Promise<string[]> {
  try {
    const systemPrompt = `You are a helpful AI assistant that generates reply suggestions. 
    Generate ${count} different reply options for the following message. 
    Each reply should be unique in tone and approach while being appropriate for the context.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });
    
    const content = response.choices[0]?.message?.content || "";
    // Split the content into individual replies
    const replies = content
      .split(/\d+\.\s+/)
      .filter(reply => reply.trim().length > 0)
      .map(reply => reply.trim());
    
    return replies.length > 0 ? replies : ["Failed to generate reply suggestions."];
  } catch (error) {
    console.error("Error generating reply suggestions:", error);
    throw new Error("Failed to generate reply suggestions");
  }
} 