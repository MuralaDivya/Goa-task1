import { BuilderFormData, FormatType } from '../types';

export interface ShareResult {
  id: string;
  shareUrl: string;
  imageUrl: string;
}

/**
 * Downloads canvas as a real PNG file
 */
export function downloadCanvasImage(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/**
 * Open X intent composer with pre-filled caption and hashtag
 */
export function shareToX(shareUrl?: string, customCaption?: string): void {
  const defaultText = customCaption || 'Framed my builder era at HH Goa 2026 🌴⚡\n\n#FrameInGoa';
  
  let tweetText = defaultText;
  if (shareUrl) {
    tweetText += `\n\nCheck out my badge: ${shareUrl}`;
  }

  const tweetUrl = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`;
  window.open(tweetUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Send PNG image data to backend to generate share URL
 */
export async function uploadShareImage(
  canvas: HTMLCanvasElement,
  formData: BuilderFormData,
  format: FormatType
): Promise<ShareResult> {
  const dataUrl = canvas.toDataURL('image/png', 0.95);

  const response = await fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dataUrl,
      name: formData.name,
      title: formData.title,
      stack: formData.stack,
      format,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create share link');
  }

  return await response.json();
}

/**
 * Copy string to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
