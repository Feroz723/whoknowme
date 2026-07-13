/**
 * wa.me deep links work without the WhatsApp Business API - they simply
 * open WhatsApp (app or web) with a pre-filled message, letting the user
 * pick who to send it to. No integration/cost required.
 */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function quizShareText(creatorName: string, takeUrl: string): string {
  return `${creatorName} made a quiz to see who actually knows them. Think it's you? ${takeUrl}`;
}

export function resultShareText(
  takerName: string,
  creatorName: string,
  scorePercent: number,
  resultUrl: string
): string {
  return `${takerName} scored ${Math.round(scorePercent)}% on ${creatorName}'s friendship quiz. Think you can beat that? ${resultUrl}`;
}
