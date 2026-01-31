import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

// Environment variables
const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.AWS_S3_BUCKET!;
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN;

// Lazy initialization of S3 client
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
    if (!s3Client) {
        s3Client = new S3Client({
            region: REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }
    return s3Client;
}

/**
 * Generate a unique S3 key for a file
 */
export function generateS3Key(filename: string): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const fileExtension = filename.split(".").pop()?.toLowerCase() || "jpg";
    const uniqueId = randomUUID();
    return `images/${year}/${month}/${uniqueId}.${fileExtension}`;
}

/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function generatePresignedUploadUrl(params: {
    filename: string;
    contentType: string;
    fileSize: number;
}): Promise<{
    presignedUrl: string;
    s3Key: string;
}> {
    const s3Key = generateS3Key(params.filename);

    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        ContentType: params.contentType,
        ContentLength: params.fileSize,
        Metadata: {
            originalName: encodeURIComponent(params.filename),
            uploadedAt: new Date().toISOString(),
        },
    });

    const presignedUrl = await getSignedUrl(getS3Client(), command, {
        expiresIn: 900, // 15 minutes
    });

    return {
        presignedUrl,
        s3Key,
    };
}

/**
 * Delete an object from S3
 */
export async function deleteFromS3(s3Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
    });

    await getS3Client().send(command);
}

/**
 * Check if a file exists in S3
 */
export async function fileExistsInS3(s3Key: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET,
            Key: s3Key,
        });
        await getS3Client().send(command);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get the public URL for an S3 object
 * Uses CloudFront if configured, otherwise falls back to S3 URL
 */
export function getPublicUrl(s3Key: string): string {
    if (CLOUDFRONT_DOMAIN) {
        // Remove trailing slash if present
        const domain = CLOUDFRONT_DOMAIN.replace(/\/$/, "");
        return `${domain}/${s3Key}`;
    }
    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`;
}

/**
 * Validate file type
 */
export function isValidImageType(contentType: string): boolean {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif",
    ];
    return allowedTypes.includes(contentType);
}

/**
 * Validate file size (max 50MB)
 */
export function isValidFileSize(fileSize: number): boolean {
    const maxSize = 50 * 1024 * 1024; // 50MB
    return fileSize > 0 && fileSize <= maxSize;
}
