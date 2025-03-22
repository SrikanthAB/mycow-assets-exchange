
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Predefined responses for common questions to ensure high-quality answers
const PREDEFINED_RESPONSES = {
  // Login issues
  "forgot_password": "To reset your password:\n1. Click on the 'Forgot Password' link on the login page\n2. Enter your email address\n3. Check your email for a password reset link\n4. Follow the link to create a new password\n\nThe reset link is valid for 24 hours. If you don't receive an email within 5 minutes, please check your spam folder.",
  
  "account_locked": "Your account may be locked due to multiple failed login attempts or suspicious activity. To unlock your account:\n1. Wait 30 minutes and try again\n2. Use the 'Forgot Password' option to reset your credentials\n3. Contact our security team if you continue to experience issues\n\nWe implement these measures to protect your assets and information.",
  
  "verification": "If you're having trouble with verification:\n1. Ensure your documents are clear, uncut images with all corners visible\n2. Check that your selfie matches your ID photo\n3. Make sure file sizes are under 5MB and in JPG or PNG format\n\nVerification typically takes 1-2 business days. For assistance with specific verification errors, please provide the error message you're seeing.",

  // Deposit issues
  "deposit_methods": "MyCow supports multiple deposit methods:\n1. Bank transfer (ACH/Wire)\n2. Credit/debit card (Visa, Mastercard)\n3. Cryptocurrency deposits (BTC, ETH, USDC)\n\nBank transfers typically have higher limits but take 1-3 business days to process. Card payments are instant but may have lower limits and higher fees. Crypto deposits are confirmed after blockchain verification.",
  
  "deposit_limit": "Deposit limits on MyCow vary by verification level and payment method:\n• Basic verification: Up to $2,000/day\n• Advanced verification: Up to $10,000/day\n• Institutional: Custom limits\n\nACH transfers have a $5,000 daily limit, while wire transfers allow for higher amounts. Card payments are limited to $2,500 per transaction. These limits are in place for security and regulatory compliance.",
  
  "processing_time": "Deposit processing times:\n• Credit/debit cards: Instant to 30 minutes\n• ACH transfers: 1-3 business days\n• Wire transfers: Same day to 24 hours (if received before 2 PM ET)\n• Cryptocurrency: 10-60 minutes (depending on network confirmations)\n\nPlease note that bank processing times may be affected by weekends and holidays.",

  // Withdrawal issues
  "withdrawal_methods": "MyCow offers these withdrawal options:\n1. Bank transfer to verified accounts\n2. Cryptocurrency withdrawals to external wallets\n3. Internal transfers to other MyCow users\n\nAll withdrawals require two-factor authentication for security purposes. Bank withdrawals are only available to accounts that have completed advanced verification.",
  
  "withdrawal_limit": "Withdrawal limits on MyCow are:\n• Daily limit: Up to $5,000\n• Weekly limit: Up to $25,000\n• Monthly limit: Up to $50,000\n\nInstitutional accounts have customized limits. First-time withdrawals may have lower limits and additional security checks. Withdrawals over $10,000 may require additional verification per regulatory requirements.",
  
  "withdrawal_time": "Withdrawal processing times:\n• Bank transfers: 1-3 business days\n• Cryptocurrency: 30 minutes to 2 hours\n• Internal transfers: Instant\n\nPlease note that initial withdrawals may take longer due to security checks. Withdrawals initiated outside business hours may begin processing on the next business day. You'll receive email notifications at each step of the process.",

  // Investment issues
  "investment_options": "MyCow offers several investment options:\n1. REIT investments (commercial, residential, mixed-use)\n2. Fractional property ownership\n3. Real estate debt instruments\n4. Property development projects\n\nEach investment type has different risk profiles, minimum investments, and expected returns. You can filter investments by property type, location, projected yield, and investment horizon.",
  
  "min_investment": "Minimum investment amounts on MyCow vary by investment type:\n• Fractional property shares: $100\n• REITs: $500\n• Real estate debt instruments: $1,000\n• Development projects: $2,500\n\nWe offer these varied entry points to make real estate investing accessible to both new and experienced investors. All investments can be managed through your dashboard.",
  
  "risk_levels": "Investment risk levels on MyCow are determined by:\n1. Property location and market stability\n2. Asset class and diversification\n3. Development stage (existing vs. under construction)\n4. Debt-to-equity ratio\n5. Historical performance\n\nEach investment is assigned a risk score from 1-10, with detailed risk factors explained on the investment page. We recommend diversifying across different risk categories.",

  // Returns issues
  "performance_calc": "Performance is calculated using:\n1. Rental income distributions\n2. Property value appreciation\n3. Realized gains from property sales\n4. Reinvested dividends (if applicable)\n\nTotal return combines these elements minus fees and expenses. Performance is updated monthly for most investments, with property valuations conducted quarterly by independent appraisers.",
  
  "tax_reporting": "MyCow provides annual tax documents by January 31st each year:\n1. Form 1099-DIV for dividend distributions\n2. Form 1099-B for investment sales\n3. Schedule K-1 for partnership investments\n\nThese documents are available in your account under 'Tax Documents'. We also provide quarterly summaries for estimated tax payments. We recommend consulting with a tax professional for specific tax advice related to your investments.",
  
  "expected_returns": "Expected returns vary by investment type:\n• Core REITs: 5-8% annual return (lower risk)\n• Value-add properties: 8-12% annual return (medium risk)\n• Development projects: 12-20% annual return (higher risk)\n\nThese projections are based on historical performance and market analysis but are not guaranteed. Each investment page provides detailed return projections including cash flow and appreciation components."
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    
    // Check if we have a predefined response
    for (const [key, response] of Object.entries(PREDEFINED_RESPONSES)) {
      if (message.includes(key)) {
        return new Response(JSON.stringify({
          reply: response
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
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
        
        Format your responses with line breaks between paragraphs and use numbered lists for steps or options.
        Always provide specific, actionable information rather than generic advice.
        
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
