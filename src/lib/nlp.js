/**
 * @file nlp.js
 * @description Local NLP helpers for turning short survey text into normalized
 * emotions, topics, valence, arousal, and quality diagnostics.
 */

const natural = require('natural');
const { removeStopwords } = require('stopword');
const { EMOTION_TAXONOMY, TOPIC_TAXONOMY } = require('./emotion-taxonomy');

const tokenizer = new natural.WordTokenizer();
