import { connect as connectTcp, isIP } from "node:net";
import { Readable, Writable } from "node:stream";
import { connect as connectTls } from "node:tls";
import type { ImapSocketConnect } from "@/lib/import/imap-types";

// A server that stops answering would otherwise hold an import chunk open forever.
const IDLE_TIMEOUT_MS = 2 * 60 * 1000;

/**
 * Stands in for `cloudflare:sockets` off Workers: the same readable/writable
 * pair over net or tls, so IMAP import runs unchanged on the self-hosted server.
 */
export const connectSocket: ImapSocketConnect = (address, options) => {
	const socket = options.secureTransport === "on"
		? connectTls({ host: address.hostname, port: address.port, servername: isIP(address.hostname) ? undefined : address.hostname })
		: connectTcp({ host: address.hostname, port: address.port });
	socket.setTimeout(IDLE_TIMEOUT_MS, () => socket.destroy(new Error(`Connection to ${address.hostname} timed out`)));
	return {
		readable: Readable.toWeb(socket) as unknown as ReadableStream,
		writable: Writable.toWeb(socket) as unknown as WritableStream,
	};
};
