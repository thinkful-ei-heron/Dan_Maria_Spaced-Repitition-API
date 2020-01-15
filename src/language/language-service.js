const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select('language.id', 'language.name', 'language.user_id', 'language.head', 'language.total_score')
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  getLanguageHead(db, language_id) {
    return db
      .from('word')
      .select('original', 'total_score', 'correct_count', 'incorrect_count')
      .join('language', 'language.head', '=', 'word.id')
      .where({ language_id })
      .first();
  },

  getWordById(db, id) {
    return db
      .from('word')
      .select('id', 'original', 'translation', 'next', 'memory_value', 'correct_count', 'incorrect_count')
      .where({ id })
      .first();
  },

  updateWord(db, id, word) {
    return db('word')
      .where({ id: id })
      .update(word);
  },

  updateLanguage(db, lang_id, lang) {
    return db('language')
      .where({ id: lang_id })
      .update(lang);
  }
};

module.exports = LanguageService;
