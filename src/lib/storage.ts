import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

export const s3Client = new S3Client({
  endpoint: getMinioEndpoint(),
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "admin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "password123",
  },
  forcePathStyle: true,
});

let bucketEnsured = false;

export async function ensureBucketExists(): Promise<void> {
  if (bucketEnsured) return;
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    bucketEnsured = true;
  } catch {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      bucketEnsured = true;
    } catch (createErr) {
      console.warn("Could not ensure S3/MinIO bucket:", createErr);
    }
  }
}

export async function uploadRecording(
  buffer: Buffer | Uint8Array,
  key: string,
  mimeType: string = "audio/webm",
): Promise<{ key: string; bucket: string; size: number }> {
  await ensureBucketExists();

  const size = buffer.length;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  return { key, bucket: BUCKET_NAME, size };
}

export async function getRecordingPresignedUrl(
  key: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export async function getRecordingObject(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return await s3Client.send(command);
}

export async function deleteRecordingObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
}
