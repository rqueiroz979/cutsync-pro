import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  to: string;
  message: string;
}

// Input validation functions
function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function validateMessage(message: string): boolean {
  return message.length > 0 && message.length <= 1000;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { to, message }: WhatsAppRequest = await req.json();
    
    // Validate required fields
    if (!to || !message) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: to and message' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate phone number format
    if (!validatePhoneNumber(to)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid phone number format. Must be 10-15 digits.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate message length
    if (!validateMessage(message)) {
      return new Response(JSON.stringify({ 
        error: 'Message must be between 1 and 1000 characters' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = Deno.env.get('WHAPI_CLOUD_TOKEN');
    if (!token) {
      console.error('WHAPI_CLOUD_TOKEN not found');
      return new Response(JSON.stringify({ 
        error: 'WhatsApp API token not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Clean phone number (remove non-digits)
    const cleanPhone = to.replace(/\D/g, '');
    
    // Add Brazil country code if not present
    let formattedPhone = cleanPhone;
    if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
      formattedPhone = `55${cleanPhone}`;
    } else if (cleanPhone.length === 10) {
      formattedPhone = `5511${cleanPhone}`;
    } else if (!cleanPhone.startsWith('55')) {
      formattedPhone = `55${cleanPhone}`;
    }

    console.log(`Sending WhatsApp message to: ${formattedPhone}`);

    const response = await fetch('https://gate.whapi.cloud/messages/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formattedPhone,
        body: message,
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('WhatsApp API error:', responseData);
      return new Response(JSON.stringify({ 
        error: 'Failed to send WhatsApp message',
        details: responseData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('WhatsApp message sent successfully:', responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      data: responseData 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in send-whatsapp function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);