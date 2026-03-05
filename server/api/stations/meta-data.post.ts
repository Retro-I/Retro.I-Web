import http from "node:http";
import https from "node:https";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.src;
  if (!url)
    throw createError({ statusCode: 400, statusMessage: "Missing url" });

  try {
    const title = await getIcyMetadata(url);
    return title;
  } catch {
    return "";
  }
});

function getIcyMetadata(url: string, redirectCount = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return resolve("");

    const client = url.startsWith("https") ? https : http;

    const req = client.get(url, { headers: { "Icy-MetaData": "1" } }, (res) => {
      // 🔥 Handle redirect
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        req.destroy();
        return resolve(getIcyMetadata(res.headers.location, redirectCount + 1));
      }

      const metaintHeader = res.headers["icy-metaint"];
      if (!metaintHeader) {
        req.destroy();
        return resolve("");
      }

      const metaint = parseInt(metaintHeader as string);
      if (!metaint) {
        req.destroy();
        return resolve("");
      }

      let buffer = Buffer.alloc(0);

      res.on("data", (chunk: Buffer) => {
        buffer = Buffer.concat([buffer, chunk]);

        while (buffer.length >= metaint + 1) {
          // skip audio
          buffer = buffer.slice(metaint);

          const metadataLength = buffer.readUInt8(0) * 16;
          if (buffer.length < metadataLength + 1) return;

          const metadata = buffer
            .slice(1, 1 + metadataLength)
            .toString("utf8")
            .replace(/\0/g, "");
          const match = metadata.match(/StreamTitle='([^']*)';/);
          if (match && match[1]) {
            req.destroy();
            resolve(match[1]);
            return;
          }

          buffer = buffer.slice(1 + metadataLength);
        }
      });

      res.on("error", reject);
    });

    req.on("error", reject);

    // Timeout safety
    setTimeout(() => {
      req.destroy();
      resolve("");
      return;
    }, 8000);
  });
}
