import type { PlatformFormat } from '../types';

export interface PlatformMetrics {
  characterCount: number;
  previewLength: number;
  isTruncated: boolean;
  threadCount?: number;
  wordCount: number;
}

export interface FormattedPost {
  content: string;
  metrics: PlatformMetrics;
  platform: PlatformFormat;
}

/**
 * Reformats post content for different social media platforms
 * without calling the AI again - just structural reformatting
 */
export const formatPostForPlatform = (
  originalContent: string,
  targetPlatform: PlatformFormat
): FormattedPost => {
  const wordCount = originalContent.split(/\s+/).length;
  const characterCount = originalContent.length;

  switch (targetPlatform) {
    case 'facebook':
      return formatForFacebook(originalContent, characterCount, wordCount);
    case 'instagram':
      return formatForInstagram(originalContent, characterCount, wordCount);
    case 'twitter':
      return formatForTwitter(originalContent, characterCount, wordCount);
    case 'standard':
    default:
      return {
        content: originalContent,
        metrics: {
          characterCount,
          wordCount,
          previewLength: characterCount,
          isTruncated: false,
        },
        platform: 'standard',
      };
  }
};

/**
 * Facebook: Front-load hook in first 120-140 characters
 */
const formatForFacebook = (
  content: string,
  characterCount: number,
  wordCount: number
): FormattedPost => {
  // If already short enough, return as-is
  if (characterCount <= 140) {
    return {
      content,
      metrics: {
        characterCount,
        wordCount,
        previewLength: characterCount,
        isTruncated: false,
      },
      platform: 'facebook',
    };
  }

  // Extract first sentence or clause as hook
  const sentences = content.split(/[.!?]\s+/);
  const firstSentence = sentences[0] + (sentences[0].endsWith('.') || sentences[0].endsWith('!') || sentences[0].endsWith('?') ? '' : '.');

  // Check if first sentence is a good hook (under 140 chars)
  if (firstSentence.length <= 140 && firstSentence.length >= 40) {
    // Good hook - keep structure
    return {
      content,
      metrics: {
        characterCount,
        wordCount,
        previewLength: firstSentence.length,
        isTruncated: true,
      },
      platform: 'facebook',
    };
  }

  // First sentence too long - find a natural break point around 120-140 chars
  const hookEndpoint = findNaturalBreakpoint(content, 120, 140);

  return {
    content,
    metrics: {
      characterCount,
      wordCount,
      previewLength: hookEndpoint,
      isTruncated: true,
    },
    platform: 'facebook',
  };
};

/**
 * Instagram: Similar to Facebook but with more visual formatting
 */
const formatForInstagram = (
  content: string,
  characterCount: number,
  wordCount: number
): FormattedPost => {
  // Instagram shows ~125 chars before "more"
  const hookEndpoint = characterCount > 125 ? findNaturalBreakpoint(content, 115, 125) : characterCount;

  return {
    content,
    metrics: {
      characterCount,
      wordCount,
      previewLength: hookEndpoint,
      isTruncated: characterCount > 125,
    },
    platform: 'instagram',
  };
};

/**
 * Twitter/X: Break into thread if needed (280 char limit per tweet)
 */
const formatForTwitter = (
  content: string,
  characterCount: number,
  wordCount: number
): FormattedPost => {
  const TWEET_LIMIT = 280;
  const THREAD_MARKER_LENGTH = 10; // "1/3 " etc.

  // If fits in one tweet, return as-is
  if (characterCount <= TWEET_LIMIT) {
    return {
      content,
      metrics: {
        characterCount,
        wordCount,
        previewLength: characterCount,
        isTruncated: false,
        threadCount: 1,
      },
      platform: 'twitter',
    };
  }

  // Break into thread
  const tweets = breakIntoTweets(content, TWEET_LIMIT - THREAD_MARKER_LENGTH);
  const threadContent = tweets
    .map((tweet, index) => `${index + 1}/${tweets.length} ${tweet}`)
    .join('\n\n---\n\n');

  return {
    content: threadContent,
    metrics: {
      characterCount: threadContent.length,
      wordCount,
      previewLength: tweets[0].length,
      isTruncated: true,
      threadCount: tweets.length,
    },
    platform: 'twitter',
  };
};

/**
 * Find a natural breakpoint (sentence end, comma, etc.) near target length
 */
const findNaturalBreakpoint = (text: string, minLength: number, maxLength: number): number => {
  // Look for sentence endings first
  const sentenceEndings = /[.!?]\s+/g;
  let match;

  while ((match = sentenceEndings.exec(text)) !== null) {
    const position = match.index + match[0].length;
    if (position >= minLength && position <= maxLength) {
      return position;
    }
    if (position > maxLength) {
      break;
    }
  }

  // No sentence ending found, look for commas or spaces
  for (let i = maxLength; i >= minLength; i--) {
    if (text[i] === ',' || text[i] === ' ' || text[i] === '\n') {
      return i;
    }
  }

  // No natural break found, just use max length
  return maxLength;
};

/**
 * Break content into multiple tweets for threading
 */
const breakIntoTweets = (content: string, maxLength: number): string[] => {
  const tweets: string[] = [];
  const paragraphs = content.split(/\n\n+/);

  let currentTweet = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();

    // If paragraph fits in remaining space of current tweet
    if (currentTweet.length + trimmedParagraph.length + 2 <= maxLength) {
      currentTweet += (currentTweet ? '\n\n' : '') + trimmedParagraph;
    }
    // If paragraph is short enough for its own tweet
    else if (trimmedParagraph.length <= maxLength) {
      if (currentTweet) {
        tweets.push(currentTweet.trim());
      }
      currentTweet = trimmedParagraph;
    }
    // Paragraph too long - need to split sentences
    else {
      if (currentTweet) {
        tweets.push(currentTweet.trim());
        currentTweet = '';
      }

      const sentences = trimmedParagraph.split(/[.!?]\s+/);
      for (const sentence of sentences) {
        const fullSentence = sentence + (sentence.endsWith('.') || sentence.endsWith('!') || sentence.endsWith('?') ? '' : '.');

        if (currentTweet.length + fullSentence.length + 1 <= maxLength) {
          currentTweet += (currentTweet ? ' ' : '') + fullSentence;
        } else {
          if (currentTweet) {
            tweets.push(currentTweet.trim());
          }
          // If single sentence is too long, force break
          if (fullSentence.length > maxLength) {
            const words = fullSentence.split(' ');
            currentTweet = '';
            for (const word of words) {
              if (currentTweet.length + word.length + 1 <= maxLength) {
                currentTweet += (currentTweet ? ' ' : '') + word;
              } else {
                if (currentTweet) {
                  tweets.push(currentTweet.trim());
                }
                currentTweet = word;
              }
            }
          } else {
            currentTweet = fullSentence;
          }
        }
      }
    }
  }

  if (currentTweet) {
    tweets.push(currentTweet.trim());
  }

  // Limit to reasonable thread length
  if (tweets.length > 8) {
    return tweets.slice(0, 8);
  }

  return tweets.length > 0 ? tweets : [content.substring(0, maxLength)];
};

/**
 * Get platform-specific display info
 */
export const getPlatformInfo = (platform: PlatformFormat) => {
  switch (platform) {
    case 'facebook':
      return {
        name: 'Facebook',
        emoji: '📘',
        color: '#1877F2',
        previewNote: 'First ~140 chars shown before "See More"',
        maxLength: null,
      };
    case 'instagram':
      return {
        name: 'Instagram',
        emoji: '📸',
        color: '#E4405F',
        previewNote: 'First ~125 chars shown before "more"',
        maxLength: 2200,
      };
    case 'twitter':
      return {
        name: 'Twitter/X',
        emoji: '𝕏',
        color: '#000000',
        previewNote: '280 characters per tweet',
        maxLength: 280,
      };
    case 'standard':
    default:
      return {
        name: 'Standard',
        emoji: '📱',
        color: '#6B7280',
        previewNote: 'No platform-specific formatting',
        maxLength: null,
      };
  }
};
