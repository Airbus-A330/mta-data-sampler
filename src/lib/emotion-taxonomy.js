/**
 * @file emotion-taxonomy.js
 * @description Canonical emotion and topic taxonomy used to normalize short
 * free-text survey affect responses into stable labels for downstream scoring.
 */

/**
 * Canonical emotions with lexical hooks, valence, and arousal.
 *
 * Valence is on [-1, 1], where -1 is maximally negative and 1 is maximally
 * positive. Arousal is on [0, 1], where 1 is highly activating.
 *
 * @type {ReadonlyArray<{
 *   id: string,
 *   label: string,
 *   polarity: 'positive' | 'negative' | 'neutral',
 *   valence: number,
 *   arousal: number,
 *   keywords: string[],
 *   phrases?: string[]
 * }>}
 */
const EMOTION_TAXONOMY = Object.freeze([
  {
    id: 'calm',
    label: 'Calm',
    polarity: 'positive',
    valence: 0.85,
    arousal: 0.2,
    keywords: ['calm', 'peaceful', 'relaxed', 'relief', 'relieved', 'comfortable', 'comforted'],
    phrases: ['at ease', 'feel safe'],
  },
  {
    id: 'joy',
    label: 'Joy',
