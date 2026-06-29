import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import prisma from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { STORAGE_LIMITS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const svixId = headersList.get('svix-id');
    const svixTimestamp = headersList.get('svix-timestamp');
    const svixSignature = headersList.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return errorResponse('Missing svix headers', 400);
    }

    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) return errorResponse('Webhook secret not configured', 500);

    const payload = await request.text();
    const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    );
    const expectedSig = Array.from(
      new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(signedContent)))
    ).map(b => b.toString(16).padStart(2, '0')).join('');

    const expectedPrefix = svixSignature.startsWith('v1,') ? svixSignature.slice(3) : svixSignature;
    const received = expectedPrefix.split(' ').map(s => s.trim());
    if (!received.some(sig => sig === expectedSig)) {
      return errorResponse('Invalid webhook signature', 400);
    }

    const evt = JSON.parse(payload) as { type: string; data: Record<string, unknown> };
    const { type, data } = evt;

    switch (type) {
      case 'user.created': {
        const id = data.id as string;
        const email = ((data.email_addresses as Array<{ email_address: string }>) || [])[0]?.email_address || '';
        const name = `${(data.first_name as string) || ''} ${(data.last_name as string) || ''}`.trim() || null;
        const avatarUrl = (data.image_url as string) || null;

        await prisma.user.upsert({
          where: { clerkId: id },
          update: { email, name, avatarUrl },
          create: {
            clerkId: id, email, name, avatarUrl,
            storageLimit: STORAGE_LIMITS.FREE,
          },
        });
        break;
      }
      case 'user.updated': {
        const id = data.id as string;
        const email = ((data.email_addresses as Array<{ email_address: string }>) || [])[0]?.email_address || '';
        const name = `${(data.first_name as string) || ''} ${(data.last_name as string) || ''}`.trim() || null;
        const avatarUrl = (data.image_url as string) || null;
        await prisma.user.update({ where: { clerkId: id }, data: { email, name, avatarUrl } });
        break;
      }
      case 'user.deleted': {
        const id = data.id as string;
        await prisma.user.update({ where: { clerkId: id }, data: { deletedAt: new Date() } });
        break;
      }
    }

    return successResponse({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse('Webhook processing failed', 500);
  }
}
