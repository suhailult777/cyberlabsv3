import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentsStore, updatePlanStatus } from '@/lib/data/store';
import { paymentVerifySchema } from '@/lib/validators/schemas';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function verifyEasebuzzHash(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  status: string,
  salt: string
) {
  const hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  return crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
}

export async function POST(request: Request) {
  await delay(1000);
  const body = await request.json();

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
      planId: body.planId || 'mock-plan',
      amount: body.amount || 0,
      easebuzzTxnId: body.txnId || `txn-${Date.now()}`,
      status: 'success' as const,
      paidAt: new Date().toISOString(),
    };
    paymentsStore.push(payment);

    if (body.planId) {
      updatePlanStatus(body.planId, 'paid');
    }

    return NextResponse.json({
      status: 'success',
      txnId: body.txnId,
      message: 'Payment verified successfully (mock)',
    });
  }

  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    hash: receivedHash,
  } = body;

  if (!txnid || !status || !receivedHash) {
    return NextResponse.json(
      { status: 'failed', message: 'Missing required fields' },
      { status: 400 }
    );
  }

  const calculatedHash = verifyEasebuzzHash(
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    salt
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
    planId: body.planId || 'unknown',
    amount: Number(amount) || 0,
    easebuzzTxnId: txnid,
    status: 'success' as const,
    paidAt: new Date().toISOString(),
  };
  paymentsStore.push(payment);

  if (body.planId) {
    updatePlanStatus(body.planId, 'paid');
  }

  return NextResponse.json({
    status: 'success',
    txnId: txnid,
    message: 'Payment verified successfully',
  });
}
