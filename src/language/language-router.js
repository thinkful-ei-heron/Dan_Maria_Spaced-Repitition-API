const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const bodyParser = express.json();

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(req.app.get('db'), req.user.id);

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(req.app.get('db'), req.language.id);

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const head = await LanguageService.getLanguageHead(req.app.get('db'), req.language.id);

    res.json({
      nextWord: head.original,
      totalScore: head.total_score,
      wordCorrectCount: head.correct_count,
      wordIncorrectCount: head.incorrect_count
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', bodyParser, async (req, res, next) => {
  let { guess } = req.body;

  if (!guess) {
    res.status(400).send({ error: `Missing 'guess' in request body` });
  }

  let { head, total_score } = await LanguageService.getUsersLanguage(req.app.get('db'), req.user.id);
  let headData = await LanguageService.getWordById(req.app.get('db'), head);
  let nextWord = await LanguageService.getWordById(req.app.get('db'), headData.next);

  let resBody = {
    nextWord: nextWord.original,
    totalScore: total_score,
    wordCorrectCount: nextWord.correct_count,
    wordIncorrectCount: nextWord.incorrect_count,
    answer: headData.translation,
    isCorrect: false
  };

  if (guess.toLowerCase() === headData.translation.toLowerCase()) {
    resBody.isCorrect = true;
    resBody.totalScore++;
    headData.correct_count++;
    headData.memory_value *= 2;
  } else {
    headData.incorrect_count++;
    headData.memory_value = 1;
  }

  ////////////////////////////////
  // LINKED LIST IMPLEMENTATION //
  ////////////////////////////////

  //word row represents node in linked list

  //IDENTIFYING CORRECT PLACEMENT OF WORD AFTER USER GUESS
  let currNode = { ...headData };
  let temp = null;
  let toMove = headData.memory_value;
  let moved = 0;
  while (currNode.next !== null && moved <= toMove) {
    temp = currNode;
    currNode = await LanguageService.getWordById(req.app.get('db'), currNode.next);
    moved++;
  }

  //ALGORITHM FOR LINKED LIST UPDATE AFTER IDENTIFYING CORRECT PLACE IN LIST
  //when currNode.next is null just update currNode.next to headData and make headData.next null
  //otherwise --
  //temp.next => headData.id  -- knex(word).where({id: temp.id}.update({next: headData.id}))
  //headData.next => currNode.id  -- knex(word).where({id: headData.id}.update({next: currNode.id}))
  //ALWAYS -- update head

  let newHead = headData.next;

  if (!currNode.next) {
    temp = currNode;
    headData.next = null;
  } else {
    headData.next = currNode.id;
  }
  temp.next = headData.id;

  let updatedLang = { head: newHead, total_score: resBody.totalScore };

  await LanguageService.updateWord(req.app.get('db'), temp.id, temp);
  await LanguageService.updateWord(req.app.get('db'), headData.id, headData);
  await LanguageService.updateLanguage(req.app.get('db'), req.language.id, updatedLang);

  res.send(resBody);
});

module.exports = languageRouter;
