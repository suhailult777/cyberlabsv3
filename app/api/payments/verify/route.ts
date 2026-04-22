import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentsStore, updatePlanStatus } from '@/lib/data/store';
import { paymentVerifySchema } from '@/lib/validators/schemas';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Verify Easebuzz payment hash (SHA-512)
 * Official format from Easebuzz Node.js kit:
 * salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 * NOTE: udf fields are in REVERSE order (udf10→udf1)
 */
function verifyEasebuzzHash(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  udf1: string = '',
  udf2: string = '',
  udf3: string = '',
  udf4: string = '',
  udf5: string = '',
  udf6: string = '',
  udf7: string = '',
  udf8: string = '',
  udf9: string = '',
  udf10: string = '',
  status: string,
  salt: string
) {
  const hashString = `${salt}|${status}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  return crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
}

export async function POST(request: Request) {
  await delay(1000);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = paymentVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    );
  }

  const key = process.env.EASEBUZZ_KEY || '';
  const salt = process.env.EASEBUZZ_SALT || '';
  const hasEasebuzzKeys = key && salt;

  if (!hasEasebuzzKeys) {
    // Mock: always succeed and persist payment
    const payment = {
      id: `pay-${Date.now()}`,
      planId: (body.planId as string) || 'mock-plan',
      amount: (body.amount as number) || 0,
      easebuzzTxnId: (body.txnId as string) || `txn-${Date.now()}`,
      status: 'success' as const,
      paidAt: new Date().toISOString(),
    };
    paymentsStore.push(payment);

    if (body.planId) {
      updatePlanStatus(body.planId as string, 'paid');
    }

    return NextResponse.json({
      status: 'success',
      txnId: body.txnId,
      message: 'Payment verified successfully (mock)',
    });
  }

  const txnid = body.txnid as string;
  const amount = body.amount as string;
  const productinfo = body.productinfo as string;
  const firstname = body.firstname as string;
  const email = body.email as string;
  const status = body.status as string;
  const receivedHash = body.hash as string;
  const udf1 = (body.udf1 as string) || '';
  const udf2 = (body.udf2 as string) || '';
  const udf3 = (body.udf3 as string) || '';
  const udf4 = (body.udf4 as string) || '';
  const udf5 = (body.udf5 as string) || '';
  const udf6 = (body.udf6 as string) || '';
  const udf7 = (body.udf7 as string) || '';
  const udf8 = (body.udf8 as string) || '';
  const udf9 = (body.udf9 as string) || '';
  const udf10 = (body.udf10 as string) || '';

  if (!txnid || !status || !receivedHash) {
    return NextResponse.json(
      { status: 'failed', message: 'Missing required fields' },
      { status: 400 }
    );
  }

  const calculatedHash = verifyEasebuzzHash(
    key, txnid, amount, productinfo, firstname, email,
    udf1, udf2, udf3, udf4, udf5, udf6, udf7, udf8, udf9, udf10,
    status, salt
  );

  if (calculatedHash !== receivedHash.toLowerCase()) {
    return NextResponse.json(
      { status: 'failed', message: 'Hash mismatch' },
      { status: 400 }
    );
  }

  if (status.toLowerCase() !== 'success') {
    return NextResponse.json(
      { status: 'failed', message: `Payment status: ${status}` },
      { status: 400 }
    );
  }

  // Persist successful payment
  const payment = {
    id: `pay-${Date.now()}`,
    planId: (body.planId as string) || 'unknown',
    amount: Number(amount) || 0,
    easebuzzTxnId: txnid,
    status: 'success' as const,
    paidAt: new Date().toISOString(),
  };
  paymentsStore.push(payment);

  if (body.planId) {
    updatePlanStatus(body.planId as string, 'paid');
  }

  return NextResponse.json({
    status: 'success',
    txnId: txnid,
    message: 'Payment verified successfully',
  });
}
