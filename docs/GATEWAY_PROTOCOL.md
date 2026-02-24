# Anima Gateway Connection Protocol (V3)

This document outlines the connection and authentication flow required to successfully pair the Anima frontend with an OpenClaw Gateway instance over WebSocket.

## The Security Challenge
OpenClaw's V3 protocol implements a strict security policy for WebSocket clients. If a UI client attempts to connect using only a shared access token (without cryptographic proof of identity), the Gateway automatically strips all requested scopes (e.g., `operator.read`, `operator.write`). This results in an `INVALID_REQUEST: missing scope` error when attempting to fetch history or send messages.

## The Solution: Device Identity Handshake
To bypass this restriction without modifying the user's `openclaw.json` configuration, the Anima frontend must mimic the native OpenClaw WebUI by providing a cryptographically signed "Device Identity".

### 1. Key Generation (`src/utils/device-identity.ts`)
On the first connection attempt, the frontend uses `@noble/ed25519` to generate a public/private keypair. 
- The public key is fingerprinted to generate a `deviceId`.
- The keys and ID are stored in the browser's `localStorage` (`anima-device-identity-v1`).

### 2. The Connection Flow (`src/app/canvas/CanvasClient.tsx`)
1. **Initial Connection**: The client opens the WebSocket connection passing the gateway token via the query string.
2. **The Challenge**: The Gateway responds with an event: `event: "connect.challenge"`. This contains a cryptographic `nonce`.
3. **The Signature**: 
   - The frontend intercepts the challenge and constructs a strict 9-part payload string: `v2|<deviceId>|<clientId>|<clientMode>|<role>|<scopes>|<timestamp>|<token>|<nonce>`.
   - This payload is signed using the stored Ed25519 private key.
4. **The Handshake Request**: The frontend immediately sends a `{ type: "req", method: "connect" }` frame, including the token *and* the fully constructed `device` object (containing the `id`, `publicKey`, `signature`, `signedAt`, and `nonce`).
5. **The Handshake Response**: Because the signature matches, the Gateway explicitly grants the requested `operator.read` and `operator.write` scopes. The Gateway replies with a `{ type: "res", payload: { type: "hello-ok" } }` frame.

### 3. Preventing Infinite Loops
When the `hello-ok` response is received, the client requests the chat history using the canonical session key. 

**Important:** The client must strictly verify that it is reacting to the *handshake* response before requesting history. `chat.history` requests *also* return as `{ type: "res", ok: true }`. If the client does not check for `data.payload?.type === "hello-ok"`, the incoming history will trigger a recursive loop, freezing the application.