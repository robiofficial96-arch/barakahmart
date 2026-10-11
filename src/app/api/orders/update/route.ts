import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request: Request) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const stmt = db.prepare(`UPDATE orders SET status = ? WHERE order_id = ?`);
    stmt.run(status, orderId);

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
  }
}
