export function stripHtmlTags(content: string) {
  return content.replaceAll(/<\/?.+?>|&gt;/g, '');
  return content;
}