/** Avoid Node/viem UV_HANDLE_CLOSING crash on Windows when exiting abruptly. */
export function exitClean(code = 0) {
  setTimeout(() => process.exit(code), 200);
}