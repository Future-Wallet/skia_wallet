export async function copyValueToClipboard(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}
