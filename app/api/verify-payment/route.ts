import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orderApi';
import { CartItem } from '@/context/CartContext';

// This is a backend route. It runs on the server, not in the browser.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, orderDetails } = body;

    if (!reference || !orderDetails) {
      return NextResponse.json({ error: 'Missing payment reference or order details' }, { status: 400 });
    }

    // 1. Verify the transaction with Paystack using your SECRET key
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (paystackData.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // 2. If payment is successful, create the order in your Supabase database.
    // This uses the 'createOrder' function from the file in your Canvas.
    const orderResult = await createOrder(orderDetails);

    if (!orderResult.success) {
      // Handle cases where the order creation fails even after successful payment
      console.error("Failed to save order to DB after successful payment:", orderResult.error);
      return NextResponse.json({ error: 'Payment successful, but failed to create order.' }, { status: 500 });
    }

    // 3. If everything is successful, return a success response
    return NextResponse.json({ success: true, orderId: orderResult.orderId });

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

