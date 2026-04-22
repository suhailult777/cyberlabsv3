import { NextResponse } from 'next/server';
import crypto from 'crypto';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function generateEasebuzzHash(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  salt: string
) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
}

export async function POST(request: Request) {
  await delay(500);
  const body = await request.json();

  const txnId = `txn-${Date.now()}`;
  const key = process.env.EASEBUZZ_KEY || '';
  const salt = process.env.EASEBUZZ_SALT || '';
  const env = process.env.EASEBUZZ_ENV || 'test';

  const hasEasebuzzKeys = key && salt;

  if (!hasEasebuzzKeys) {
    return NextResponse.json({
      mock: true,
      txnId,
      planId: body.planId,
      message: 'Mock payment initiated. Use simulate payment on frontend.',
    });
  }

  const amount = String(body.amount || '0');
  const productinfo = body.productinfo || 'Cyberlab Plan';
  const firstname = body.firstname || 'Student';
  const email = body.email || 'student@cyberlabs.local';

  const hash = generateEasebuzzHash(key, txnId, amount, productinfo, firstname, email, salt);

  const baseUrl = env === 'prod'
    ? 'https://pay.easebuzz.in/payment/initiateLink'
    : 'https://testpay.easebuzz.in/payment/initiateLink';

  return NextResponse.json({
    mock: false,
    paymentUrl: baseUrl,
    txnId,
    hash,
    key,
    amount,
    productinfo,
    firstname,
    email,
    surl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback?status=success`,
    furl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback?status=failure`,
  });
}
