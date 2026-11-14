export type ImapImportInput = {
	host: string;
	port: number;
	secure: boolean;
	username: string;
	password: string;
	folder: string;
	limit: number;
	/** Number of newest messages already imported by earlier batches. */
	offset: number;
};

/** The part of a Cloudflare `Socket` the IMAP client uses; the self-hosted runtime supplies the same shape. */
export type ImapSocket = Pick<Socket, "readable" | "writable">;

export type ImapSocketConnect = (
	address: { hostname: string; port: number },
	options: { secureTransport: "on" | "off"; allowHalfOpen: boolean },
) => ImapSocket;
