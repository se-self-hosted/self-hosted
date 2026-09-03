import crypto from "crypto";
import fs from "fs";

function getMinioEndpoint(): string {
  const isDocker = fs.existsSync("/.dockerenv");
  const host = process.env.MINIO_ENDPOINT || (isDocker ? "minio" : "localhost");
  const port = process.env.MINIO_PORT || "9000";
  const useSsl = process.env.MINIO_USE_SSL === "true";
  const protocol = useSsl ? "https" : "http";

  const resolvedHost = !isDocker && host === "minio" ? "localhost" : host;
  return `${protocol}://${resolvedHost}:${port}`;
}

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "recordings";

function sha256(data: string | Buffer | Uint8Array): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
  const kDate = crypto.createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(regionName).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
  return kSigning;
}

async function sendS3Request(
  method: "GET" | "PUT" | "DELETE" | "HEAD",
  path: string,
  body?: Buffer | Uint8Array,
  contentType?: string,
  extraHeaders: Record<string, string> = {},
): Promise<Response> {
  const endpoint = getMinioEndpoint();
  const accessKey = process.env.MINIO_ACCESS_KEY || "admin";
  const secretKey = process.env.MINIO_SECRET_KEY || "password123";
  const region = "us-east-1";
  const service = "s3";

  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

  const url = new URL(endpoint);
  const host = url.port ? `${url.hostname}:${url.port}` : url.hostname;
  const canonicalUri = path.startsWith("/") ? path : `/${path}`;

  const payload = body ? Buffer.from(body) : Buffer.alloc(0);
  const payloadHash = sha256(payload);

  const requestHeaders: Record<string, string> = {
    host,
    "x-amz-date": amzDate,
    "x-amz-content-sha256": payloadHash,
    ...extraHeaders,
  };

  if (contentType) {
    requestHeaders["content-type"] = contentType;
  }

  const sortedHeaderKeys = Object.keys(requestHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys.map((k) => `${k.toLowerCase()}:${requestHeaders[k].trim()}\n`).join("");
  const signedHeaders = sortedHeaderKeys.map((k) => k.toLowerCase()).join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const fetchHeaders: Record<string, string> = {
    ...requestHeaders,
    Authorization: authHeader,
  };

  return await fetch(`${endpoint}${canonicalUri}`, {
    method,
    headers: fetchHeaders,
    body: method === "PUT" ? (payload.length > 0 ? (payload as unknown as BodyInit) : undefined) : undefined,
  });
}

let bucketEnsured = false;

export async function ensureBucketExists(): Promise<void> {
  if (bucketEnsured) return;
  try {
    const headRes = await sendS3Request("HEAD", `/${BUCKET_NAME}`);
    if (headRes.ok || headRes.status === 200) {
      bucketEnsured = true;
      return;
    }
  } catch {
    // Ignore head check error and attempt create
  }

  try {
    await sendS3Request("PUT", `/${BUCKET_NAME}`);
    bucketEnsured = true;
  } catch (createErr) {
    console.warn("Could not ensure S3/MinIO bucket:", createErr);
  }
}

export async function uploadRecording(
  buffer: Buffer | Uint8Array,
  key: string,
  mimeType: string = "audio/webm",
): Promise<{ key: string; bucket: string; size: number }> {
  await ensureBucketExists();

  const cleanKey = key.startsWith("/") ? key.slice(1) : key;
  const payload = Buffer.from(buffer);
  const size = payload.length;

  const res = await sendS3Request("PUT", `/${BUCKET_NAME}/${cleanKey}`, payload, mimeType);
  if (!res.ok && res.status !== 200 && res.status !== 201) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`MinIO upload failed (${res.status}): ${errorText}`);
  }

  return { key, bucket: BUCKET_NAME, size };
}

export function getRecordingPresignedUrl(
  key: string,
  expiresInSeconds = 3600,
): string {
  const endpoint = getMinioEndpoint();
  const accessKey = process.env.MINIO_ACCESS_KEY || "admin";
  const secretKey = process.env.MINIO_SECRET_KEY || "password123";
  const region = "us-east-1";
  const service = "s3";

  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

  const url = new URL(endpoint);
  const host = url.port ? `${url.hostname}:${url.port}` : url.hostname;
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;
  const canonicalUri = `/${BUCKET_NAME}/${cleanKey}`;

  const queryParams = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeURIComponent(`${accessKey}/${credentialScope}`)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expiresInSeconds}`,
    `X-Amz-SignedHeaders=host`,
  ].sort().join("&");

  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    "GET",
    canonicalUri,
    queryParams,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  return `${endpoint}${canonicalUri}?${queryParams}&X-Amz-Signature=${signature}`;
}

export async function getRecordingObject(key: string) {
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;
  const response = await sendS3Request("GET", `/${BUCKET_NAME}/${cleanKey}`);
  return {
    Body: response.body,
    ContentType: response.headers.get("content-type") || "audio/webm",
    ContentLength: response.headers.get("content-length") ? parseInt(response.headers.get("content-length")!, 10) : undefined,
    status: response.status,
  };
}

export async function deleteRecordingObject(key: string): Promise<void> {
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;
  await sendS3Request("DELETE", `/${BUCKET_NAME}/${cleanKey}`);
}
