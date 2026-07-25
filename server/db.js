import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data", "quotes.json");
const TMP_FILE = DATA_FILE + ".tmp";

const usePostgres = Boolean(process.env.POSTGRES_URL);
export const storageMode = usePostgres ? "postgres" : "file";

let sql = null;
let ready = null;

if (usePostgres) {
  ready = (async () => {
    const pg = await import("@vercel/postgres");
    sql = pg.sql;
    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT DEFAULT '',
        service TEXT DEFAULT '',
        message TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'yeni',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;
  })();
}

function rowToQuote(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    service: row.service || "",
    message: row.message || "",
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
}

function readFile() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeFile(quotes) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(TMP_FILE, JSON.stringify(quotes, null, 2), "utf-8");
  fs.renameSync(TMP_FILE, DATA_FILE);
}

export async function listQuotes() {
  if (usePostgres) {
    await ready;
    const { rows } = await sql`SELECT * FROM quotes ORDER BY created_at DESC`;
    return rows.map(rowToQuote);
  }
  return readFile();
}

export async function insertQuote(quote) {
  if (usePostgres) {
    await ready;
    await sql`
      INSERT INTO quotes (id, name, email, phone, service, message, status, created_at)
      VALUES (${quote.id}, ${quote.name}, ${quote.email}, ${quote.phone}, ${quote.service}, ${quote.message}, ${quote.status}, ${quote.createdAt})
    `;
    return quote;
  }
  const quotes = readFile();
  quotes.unshift(quote);
  writeFile(quotes);
  return quote;
}

export async function updateQuoteStatus(id, status) {
  if (usePostgres) {
    await ready;
    const { rows } = await sql`UPDATE quotes SET status = ${status} WHERE id = ${id} RETURNING *`;
    return rows[0] ? rowToQuote(rows[0]) : null;
  }
  const quotes = readFile();
  const idx = quotes.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  quotes[idx].status = status;
  writeFile(quotes);
  return quotes[idx];
}

export async function deleteQuote(id) {
  if (usePostgres) {
    await ready;
    await sql`DELETE FROM quotes WHERE id = ${id}`;
    return;
  }
  writeFile(readFile().filter((q) => q.id !== id));
}
