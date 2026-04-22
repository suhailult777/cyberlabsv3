import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

  const key = process.env.EASEBUZZ_KEY || '';
  const salt = process.env.EASEBUZZ_SALT || '';
  const hasEasebuzzKeys = key && salt;

  if (!hasEasebuzzKeys) {
    // Mock: always succeed
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

  return NextResponse.json({
    status: 'success',
    txnId: txnid,
    message: 'Payment verified successfully',
  });
}
