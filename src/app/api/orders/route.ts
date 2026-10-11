import { NextResponse } from 'next/server';
import db from '@/lib/db';

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

    const stmt = db.prepare(`
      INSERT INTO orders (
        order_id, customer_name, customer_phone, customer_address,
        package_name, package_qty, package_price, delivery_area,
        delivery_charge, total_amount, order_type, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      packageName || '১ কেজি প্রিমিয়াম খেজুরের গুড়',
      packageQty || 1,
      packagePrice || 490,
      deliveryArea || 'dhaka',
      deliveryCharge || 70,
      totalAmount || 560,
      orderType,
      notes
    );

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
    const stmt = db.prepare(`SELECT * FROM orders ORDER BY created_at DESC`);
    const orders = stmt.all();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { success: false, message: 'ডাটা লোড করতে ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}
