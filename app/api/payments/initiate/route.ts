import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { paymentInitiateSchema } from '@/lib/validators/schemas';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate Easebuzz payment hash (SHA-512)
 * Official format from Easebuzz Node.js kit:
 * key|txnid|amount|productinfo|name|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
 */
function generateEasebuzzHash(
  key: string,
  txnid: string,
  amount: string,
  productinfo: string,
  name: string,
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
  salt: string
) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${name}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
}

export async function POST(request: Request) {
  await delay(500);
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = paymentInitiateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(', ') },
      { status: 400 }
    );
  }

  const { planId } = parsed.data;
  const txnId = `txn-${Date.now()}`;
  const key = process.env.EASEBUZZ_KEY || '';
  const salt = process.env.EASEBUZZ_SALT || '';
  const env = process.env.EASEBUZZ_ENV || 'test';

  const hasEasebuzzKeys = key && salt;

  if (!hasEasebuzzKeys) {
    return NextResponse.json({
      mock: true,
      txnId,
      planId,
      message: 'Mock payment initiated. Use simulate payment on frontend.',
    });
  }

  const amount = String(body.amount || '0');
  const productinfo = (body.productinfo as string) || 'Cyberlab Plan';
  const firstname = (body.firstname as string) || 'Student';
  const email = (body.email as string) || 'student@cyberlabs.local';
  const phone = (body.phone as string) || '9999999999';
  const udf1 = (body.udf1 as string) || '';
  const udf2 = (body.udf2 as string) || '';
  const udf3 = (body.udf3 as string) || '';
  const udf4 = (body.udf4 as string) || '';
  const udf5 = (body.udf5 as string) || '';

  const hash = generateEasebuzzHash(
    key, txnId, amount, productinfo, firstname, email,
    udf1, udf2, udf3, udf4, udf5, '', '', '', '', '',
    salt
  );

  const baseUrl = env === 'prod'
    ? 'https://pay.easebuzz.in'
    : 'https://testpay.easebuzz.in';

  return NextResponse.json({
    mock: false,
    paymentUrl: `${baseUrl}/payment/initiateLink`,
    payUrl: `${baseUrl}/pay/`,
    txnId,
    hash,
    key,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    surl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback?status=success`,
    furl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback?status=failure`,
  });
}
