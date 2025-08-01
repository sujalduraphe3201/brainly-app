export function generateLink(id: number): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${id}-${random}`;
}
