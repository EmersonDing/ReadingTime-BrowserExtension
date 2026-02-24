"use strict";
var text = document.body.innerText;

//Count CJK characters (Unified Ideographs, Hiragana/Katakana, Hangul)
var cjkRegex = /\p{Unified_Ideograph}|[\u3040-\u30FF\uAC00-\uD7AF]/gu;
var cjkCount = (text.match(cjkRegex) || []).length;

//Count non-CJK words using Intl.Segmenter for accurate word boundary detection
var nonCjkText = text.replace(cjkRegex, ' ');
var segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
var wordCount = [...segmenter.segment(nonCjkText)].filter(function(s) { return s.isWordLike; }).length;

var timeToRead;
var message = {};

//Default settings
var readingSpeed = 275;
var cjkReadingSpeed = 500;
var iconColor = "#000000";

//Check localStorage for saved values
chrome.storage.local.get(null, function (result) {
    if (result.readingSpeed !== undefined) {
      readingSpeed = result.readingSpeed;
    }
    if (result.cjkReadingSpeed !== undefined) {
      cjkReadingSpeed = result.cjkReadingSpeed;
    }
    if (result.iconColor !== undefined) {
      iconColor = result.iconColor;
    }

    timeToRead = Math.ceil(wordCount / readingSpeed + cjkCount / cjkReadingSpeed);
    message.timeToRead = timeToRead;
    message.iconColor = iconColor;
    chrome.runtime.sendMessage({newBadge: message});
});
