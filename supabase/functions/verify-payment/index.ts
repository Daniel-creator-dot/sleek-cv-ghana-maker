
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyRequest {
  reference: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference }: VerifyRequest = await req.json();
    
    const paystackSecretKey = Deno.env.get('PAYSTACK_LIVE_SECRET_KEY');
    
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured');
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const paystackData = await paystackResponse.json();
    
    if (!paystackData.status) {
      throw new Error(paystackData.message || 'Payment verification failed');
    }

    const transaction = paystackData.data;
    const isSuccessful = transaction.status === 'success';

    console.log('Payment verification result:', {
      reference: transaction.reference,
      status: transaction.status,
      amount: transaction.amount,
    });

    return new Response(
      JSON.stringify({
        success: true,
        verified: isSuccessful,
        data: {
          reference: transaction.reference,
          status: transaction.status,
          amount: transaction.amount / 100, // Convert from kobo to cedis
          customer: transaction.customer,
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in verify-payment function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment verification failed' 
      }),
      {
        status: 400,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
