import axios from 'axios';
import * as cheerio from 'cheerio';
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import config from '../core/config/env.config.js';

export const extractArticleContent = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(data);
    $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();

    const title = $('title').text() || $('h1').first().text() || 'Untitled';
    const author = $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') || '';
    const image = $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') || '';
    const content = $('article').text() || $('main').text() || $('body').text() || '';
    const cleanContent = content.replace(/\s+/g, ' ').trim();

    return {
      title: title.trim(),
      author: author.trim(),
      excerpt: description.substring(0, 500),
      content: cleanContent,
      thumbnail: image,
      wordCount: cleanContent.split(' ').length,
      readingTime: Math.ceil(cleanContent.split(' ').length / 200),
    };
  } catch (error) {
    console.error('Error extracting article:', error);
    throw error;
  }
};

export const extractPDFContent = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);

    return {
      content: data.text,
      pages: data.numpages,
      wordCount: data.text.split(' ').length,
      readingTime: Math.ceil(data.text.split(' ').length / 200),
    };
  } catch (error) {
    console.error('Error extracting PDF:', error);
    throw error;
  }
};

export const extractYouTubeMetadata = async (url) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s]+)/);

  if (!videoIdMatch) {
    throw new Error('Invalid YouTube URL');
  }

  // Clean videoId by stripping any query params like ?t= or &list=
  const rawVideoId = videoIdMatch[1];
  const cleanVideoId = rawVideoId.split('?')[0].split('&')[0];

  const metadata = {
    videoId: cleanVideoId,
    type: 'video',
    title:rawVideoId, 
    thumbnail: `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${cleanVideoId}`,
  };

  // Try oEmbed first (no API key needed)
  try {
    const oEmbed = await axios.get(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${cleanVideoId}&format=json`,
      { timeout: 5000 }
    );
    if (oEmbed.data?.title) {
      metadata.title = oEmbed.data.title;
      metadata.author = oEmbed.data.author_name || '';
      metadata.thumbnail = oEmbed.data.thumbnail_url || metadata.thumbnail;
    }
  } catch (e) {
  }

  // Try YouTube Data API if key is configured (overrides oEmbed)
  if (config.youtube?.apiKey) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${cleanVideoId}&key=${config.youtube.apiKey}&part=snippet`
      );

      if (response.data.items && response.data.items.length > 0) {
        const snippet = response.data.items[0].snippet;
        return {
          ...metadata,
          title: snippet.title,
          excerpt: snippet.description.substring(0, 500),
          author: snippet.channelTitle,
          thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || metadata.thumbnail,
        };
      }
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error.message);
    }
  }

  return metadata;
};

export const detectContentType = (url) => {
  const urlLower = url.toLowerCase();

  // FIX: YouTube check first
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'video';
  }

  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'tweet';
  }

  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(urlLower)) {
    return 'image';
  }

  if (/\.pdf$/i.test(urlLower)) {
    return 'pdf';
  }

  return 'article';
};