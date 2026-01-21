module.exports = {
  analyzeAffect(rawText) {
    return { rawText, normalizedText: String(rawText || '') };
  },
};
