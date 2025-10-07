import type { Resource } from '../types';

export interface FetchedResourceContent {
  url: string;
  title: string;
  content: string;
  error?: string;
}

/**
 * Fetch and extract text content from a URL
 * Uses a simple fetch approach - in production you might want a more robust solution
 */
export const fetchResourceContent = async (url: string): Promise<FetchedResourceContent> => {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return {
        url,
        title: url,
        content: '',
        error: `Failed to fetch: ${response.status} ${response.statusText}`,
      };
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      const html = await response.text();
      const extracted = extractTextFromHtml(html);
      return {
        url,
        title: extracted.title || url,
        content: extracted.text,
      };
    } else if (contentType.includes('text/plain')) {
      const text = await response.text();
      return {
        url,
        title: url,
        content: text,
      };
    } else {
      return {
        url,
        title: url,
        content: '',
        error: 'Unsupported content type. Only HTML and text are supported.',
      };
    }
  } catch (error) {
    return {
      url,
      title: url,
      content: '',
      error: error instanceof Error ? error.message : 'Failed to fetch resource',
    };
  }
};

/**
 * Extract text content from HTML
 * Simple extraction - removes scripts, styles, and gets main text
 */
const extractTextFromHtml = (html: string): { title: string; text: string } => {
  // Create a temporary DOM element
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Get title
  const title = doc.querySelector('title')?.textContent || '';

  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style, nav, footer, header');
  scripts.forEach((el) => el.remove());

  // Try to find main content area
  const main = doc.querySelector('main, article, [role="main"], .content, #content');
  const contentElement = main || doc.body;

  // Get text content
  let text = contentElement?.textContent || '';

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();

  // Limit length to prevent overwhelming the prompt
  const maxLength = 3000;
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }

  return { title, text };
};

/**
 * Fetch multiple resources and combine their content
 */
export const fetchMultipleResources = async (
  resources: Resource[]
): Promise<FetchedResourceContent[]> => {
  const promises = resources.map((resource) => fetchResourceContent(resource.url));
  return Promise.all(promises);
};

/**
 * Format fetched resources for inclusion in AI prompt
 */
export const formatResourcesForPrompt = (
  fetchedResources: FetchedResourceContent[]
): string => {
  if (fetchedResources.length === 0) {
    return '';
  }

  const successfulResources = fetchedResources.filter((r) => !r.error && r.content);

  if (successfulResources.length === 0) {
    return '';
  }

  const resourceText = successfulResources
    .map((resource, index) => {
      return `
REFERENCE RESOURCE ${index + 1}:
Title: ${resource.title}
URL: ${resource.url}
Content: ${resource.content}
---`;
    })
    .join('\n\n');

  return `
IMPORTANT: You have access to the following reference resources. Use these as primary sources of information when relevant to the topic:

${resourceText}

When referencing these resources, incorporate the information naturally into your post. DO NOT just copy-paste or over-quote. Instead, distill the key insights and present them in your persona's voice.
`;
};
