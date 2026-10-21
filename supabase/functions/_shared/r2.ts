/**
 * Cloudflare R2 (S3-compatible) helpers shared by upload-url and
 * generate-audio. Credentials come from the Edge Function environment only.
 */
const ACCOUNT_ID = () => Deno.env.get("R2_ACCOUNT_ID")!;
const ACCESS_KEY = () => Deno.env.get("R2_ACCESS_KEY_ID")!;
const SECRET_KEY = () => Deno.env.get("R2_SECRET_ACCESS_KEY")!;
const BUCKET = () => Deno.env.get("R2_BUCKET")!;
/** Public base URL of the bucket, e.g. an r2.dev or custom domain. */
export const PUBLIC_BASE = () => Deno.env.get("R2_PUBLIC_BASE_URL")!;

const REGION = "auto";
const SERVICE = "s3";
export const EXPIRY_SECONDS = 300;

/* ------------------------------------------------------------------ *
 * AWS SigV4 presigning (R2 is S3-compatible)
 * ------------------------------------------------------------------ */

const encoder = new TextEncoder();

async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

/** Each path segment is encoded, but the separators are preserved. */
function encodeKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

export async function presignPut(objectKey: string, contentType: string): Promise<string> {
  const host = `${ACCOUNT_ID()}.r2.cloudflarestorage.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;

  const query = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${ACCESS_KEY()}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(EXPIRY_SECONDS),
    // The client must send exactly this Content-Type, so a signed URL for an
    // image cannot be reused to upload something else.
    "X-Amz-SignedHeaders": "content-type;host",
  });
  // URLSearchParams sorts nothing by default; SigV4 requires sorted keys.
  const canonicalQuery = [...query.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const canonicalRequest = [
    "PUT",
    `/${BUCKET()}/${encodeKey(objectKey)}`,
    canonicalQuery,
    `content-type:${contentType}\nhost:${host}\n`,
    "content-type;host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = await hmac(encoder.encode(`AWS4${SECRET_KEY()}`), dateStamp);
  const kRegion = await hmac(kDate, REGION);
  const kService = await hmac(kRegion, SERVICE);
  const kSigning = await hmac(kService, "aws4_request");
  const signature = toHex(await hmac(kSigning, stringToSign));

  return `https://${host}/${BUCKET()}/${encodeKey(objectKey)}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

export function publicUrl(objectKey: string): string {
  return `${PUBLIC_BASE().replace(/\/$/, "")}/${objectKey}`;
}

/** Server-side upload: presign, then PUT the bytes. Returns the public URL. */
export async function putObject(
  objectKey: string,
  body: Uint8Array | ArrayBuffer,
  contentType: string,
): Promise<string> {
  const url = await presignPut(objectKey, contentType);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: body as BodyInit,
  });
  if (!response.ok) {
    throw new Error(`r2_put_failed_${response.status}: ${await response.text()}`);
  }
  return publicUrl(objectKey);
}
