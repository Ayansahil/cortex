/**
 * Safely applies highlights to an HTML content string.
 * Wraps occurrences of highlight text with <mark> tags.
 * 
 * @param {string} content - The original HTML content.
 * @param {Array} highlights - Array of highlight objects { text: string, color: string }.
 * @returns {string} - The content with <mark> tags inserted.
 */
export const applyHighlights = (content, highlights) => {
  if (!content || !highlights || highlights.length === 0) return content;

  let highlightedContent = content;
  
  // Sort highlights by length (descending) to handle overlapping text carefully
  const sortedHighlights = [...highlights].sort((a, b) => (b.text?.length || 0) - (a.text?.length || 0));

  sortedHighlights.forEach(h => {
    if (!h.text || h.text.trim().length < 2) return;
    
    // Escape special characters for regex
    const escapedText = h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // This regex looks for the text but NOT within an existing HTML tag
    // It's a simple heuristic: match the text if it's not followed by a > without an earlier <
    // A more robust way would be a full DOM parser, but this is often sufficient for prose
    const regex = new RegExp(`(${escapedText})(?![^<]*>)`, 'gi');
    
    const colorClass = `highlight-${h.color || 'indigo'}`;
    
    // We use a unique marker to avoid double-highlighting in the same pass
    // but since we are doing it sequentially, we just need to be careful.
    // To prevent nested marks:
    highlightedContent = highlightedContent.replace(regex, (match, p1, offset, string) => {
      // Simple check to see if we are already inside a mark tag
      // (This is imperfect but better than nothing)
      const preceding = string.substring(0, offset);
      if (preceding.lastIndexOf('<mark') > preceding.lastIndexOf('</mark>')) {
        return match; // Already inside a mark tag
      }
      return `<mark class="${colorClass}">${p1}</mark>`;
    });
  });

  return highlightedContent;
};
