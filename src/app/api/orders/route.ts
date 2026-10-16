import { NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      packageName,
      packageQty,
      packagePrice,
      deliveryArea,
      deliveryCharge,
      totalAmount,
      orderType = 'form',
      notes = ''
    } = body;

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { success: false, message: 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' },
        { status: 400 }
      );
    }

    const orderId = `BM-${Date.now().toString().slice(-6)}`;

    createOrder({
      order_id: orderId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      package_name: packageName || '১ কেজি প্রিমিয়াম খেজুরের গুড়',
      package_qty: packageQty || 1,
      package_price: packagePrice || 490,
      delivery_area: deliveryArea || 'dhaka',
      delivery_charge: deliveryCharge || 70,
      total_amount: totalAmount || 560,
      order_type: orderType,
      notes
    });

    return NextResponse.json({
      success: true,
      orderId,
      message: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { success: false, message: 'ডাটা লোড করতে ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}
