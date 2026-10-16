import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const updated = updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
  }
}
