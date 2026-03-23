import { ItemsRepository } from './items.repository.js';
import {
  extractArticleContent,
  extractPDFContent,
  extractYouTubeMetadata,
  detectContentType,
} from '../../utils/contentExtractor.util.js';
import { queueEmbeddingJob, queueTaggingJob } from '../../workers/queue.js';
import { HighlightsRepository } from '../highlights/highlights.repository.js';

// FIX 2: Twitter/X URL detection
const isTwitterURL = (url) => {
  return url.includes('twitter.com') || url.includes('x.com') || url.includes('t.co');
};

// FIX 3: Extract tweet info from URL safely
const extractTweetMetadata = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const username = pathParts[0] || 'unknown';
    const tweetId = pathParts[2] || Date.now().toString();
    return {
      title: `Tweet by @${username}`,
      type: 'tweet',
      source: 'Twitter/X',
      thumbnail: null,
      description: `Saved tweet from @${username}`,
      tweetId,
    };
  } catch {
    return {
      title: 'Saved Tweet',
      type: 'tweet',
      source: 'Twitter/X',
      thumbnail: null,
    };
  }
};

export class ItemsService {
  constructor() {
    this.itemsRepository = new ItemsRepository();
    this.highlightsRepository = new HighlightsRepository();
  }

  async createItem(userId, itemData, file) {
    let processedData = { ...itemData };

    if (itemData.url && !file) {
      // FIX 4: Handle Twitter/X URLs separately — they block scraping
      if (isTwitterURL(itemData.url)) {
        const tweetMeta = extractTweetMetadata(itemData.url);
        processedData = { ...processedData, ...tweetMeta };
      } else {
        // Normal URL processing
        let detectedType;
        try {
          detectedType = detectContentType(itemData.url);
          processedData.type = itemData.type || detectedType;
        } catch (error) {
          console.error('Error detecting content type:', error);
          detectedType = 'article';
          processedData.type = 'article';
        }

        if (detectedType === 'article') {
          try {
            const extracted = await extractArticleContent(itemData.url);
            processedData = {
              ...processedData,
              ...extracted,
              title: itemData.title || extracted.title || itemData.url,
            };
          } catch (error) {
            // FIX 5: Never crash — save with URL as fallback title
            console.error('Error extracting article:', error);
            processedData.title = itemData.title || itemData.url;
            processedData.type = 'article';
          }
        } else if (detectedType === 'video') {
          try {
            const videoData = await extractYouTubeMetadata(itemData.url);
            processedData = { ...processedData, ...videoData };
          } catch (error) {
            // FIX 6: YouTube metadata fail → still save
            console.error('Error extracting YouTube metadata:', error);
            processedData.title = itemData.title || 'YouTube Video';
            processedData.type = 'video';
          }
        }
      }
    }

    // File upload handling
    if (file) {
      processedData.filePath = file.path;
      processedData.fileSize = file.size;
      processedData.mimeType = file.mimetype;

      // Auto-detect type from mimetype
      if (!processedData.type) {
        if (file.mimetype === 'application/pdf') {
          processedData.type = 'pdf';
        } else if (file.mimetype.startsWith('image/')) {
          processedData.type = 'image';
        } else {
          processedData.type = 'file';
        }
      }

      // Set title from filename if not provided
      if (!processedData.title) {
        processedData.title = file.originalname || 'Uploaded File';
      }

      if (file.mimetype === 'application/pdf') {
        try {
          const pdfData = await extractPDFContent(file.path);
          processedData.content = pdfData.content;
          processedData.wordCount = pdfData.wordCount;
          processedData.readingTime = pdfData.readingTime;
        } catch (error) {
          // FIX 7: PDF extraction fail → still save file
          console.error('Error extracting PDF:', error);
        }
      }
    }

    // FIX 8: Make sure title always exists
    if (!processedData.title) {
      processedData.title = processedData.url || 'Untitled Item';
    }

    processedData.user = userId;

    const item = await this.itemsRepository.createItem(processedData);

    // FIX 9: Queue jobs with error protection — don't crash if queue fails
    try {
      await queueTaggingJob(item._id);
    } catch (error) {
      console.error('Tagging queue error (non-fatal):', error);
    }

    try {
      await queueEmbeddingJob(item._id);
    } catch (error) {
      console.error('Embedding queue error (non-fatal):', error);
    }

    return item;
  }

  async getItems(userId, filters, options) {
    return await this.itemsRepository.findUserItems(userId, filters, options);
  }

  async getItemById(userId, itemId) {
    const item = await this.itemsRepository.findItemById(itemId, userId);

    if (!item) {
      throw new Error('Item not found');
    }

    const itemObj = item.toObject ? item.toObject() : item;

    const highlights = await this.highlightsRepository.findItemHighlights(itemId, userId);
    itemObj.highlights = highlights;

    await this.itemsRepository.incrementViewCount(itemId, userId);

    return itemObj;
  }

  async updateItem(userId, itemId, updateData) {
    const item = await this.itemsRepository.updateItem(itemId, userId, updateData);

    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  }

  async deleteItem(userId, itemId) {
    const item = await this.itemsRepository.deleteItem(itemId, userId);

    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  }

  async getStats(userId) {
    return await this.itemsRepository.getItemStats(userId);
  }
}