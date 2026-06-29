export async function uploadFile(file: Buffer | Blob, key: string, contentType: string): Promise<string> {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME || 'maxtools';
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicUrl = process.env.R2_PUBLIC_URL;
  
  const fileBuffer = file instanceof Blob
    ? Buffer.from(await file.arrayBuffer())
    : file;
  
  if (!endpoint || !accessKey || !secretKey) {
    const fs = await import('fs/promises');
    const path = await import('path');
    const localDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(localDir, { recursive: true });
    const filePath = path.join(localDir, key);
    await fs.writeFile(filePath, fileBuffer);
    return `/uploads/${key}`;
  }
  
  const url = `${endpoint}/${bucket}/${key}`;
  const response = await fetch(url, {
    method: 'PUT',
    body: fileBuffer as unknown as BodyInit,
    headers: { 'Content-Type': contentType },
  });
  if (!response.ok) throw new Error(`R2 upload failed: ${response.statusText}`);
  return publicUrl ? `${publicUrl}/${key}` : url;
}

export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (publicUrl) return `${publicUrl}/${key}`;
  return `/uploads/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME || 'maxtools';
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKey || !secretKey) {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'uploads', key);
    await fs.unlink(filePath).catch(() => {});
    return;
  }

  const url = `${endpoint}/${bucket}/${key}`;
  await fetch(url, { method: 'DELETE' });
}

export async function listFiles(prefix?: string): Promise<string[]> {
  return [];
}
