
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    
    // Format chat history for the Perplexity API
    const formattedMessages = [
      {
        role: 'system',
        content: `You are a helpful assistant for MyCow, a financial platform that helps users invest in REITs and other real estate assets. 
        Be concise, helpful, and friendly. Provide specific answers to questions about the platform's features, investment options, 
        account management, and financial concepts. If asked about a common issue like login problems, deposits, withdrawals, 
        or investment strategies, provide step-by-step instructions or clear explanations.
        
        When responding to follow-up questions, maintain context from the previous messages.
        Keep responses under 3-4 sentences unless detailed instructions are needed.
        
        If you cannot help with a specific query, suggest connecting with a human agent.`
      }
    ];
    
    // Add chat history if available
    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        formattedMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }
    
    // Add the current message
    formattedMessages.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to Perplexity API:', JSON.stringify(formattedMessages));
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: formattedMessages,
        temperature: 0.2,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', errorData);
      throw new Error(`Perplexity API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Perplexity API response:', data);
    
    return new Response(JSON.stringify({
      reply: data.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI support function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while processing your request.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
