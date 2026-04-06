var REVENUE_MULTIPLIER = 6;
var URGENCY_MULTIPLIER = 7;
var AI_MULTIPLIER = 5;
var BUDGET_MULTIPLIER = 8;
var MIN_CHALLENGE_LENGTH = 50;
var CHALLENGE_BONUS_POINTS = 10;
var STRONG_FIT_THRESHOLD = 70;
var GOOD_POTENTIAL_THRESHOLD = 40;

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  var score =
    (parseInt(data.revenue) || 0) * REVENUE_MULTIPLIER +
    (parseInt(data.urgency) || 0) * URGENCY_MULTIPLIER +
    (parseInt(data.ai) || 0) * AI_MULTIPLIER +
    (parseInt(data.budget) || 0) * BUDGET_MULTIPLIER;

  if (data.challenge && data.challenge.length >= MIN_CHALLENGE_LENGTH) {
    score += CHALLENGE_BONUS_POINTS;
  }

  var status;
  if (score >= STRONG_FIT_THRESHOLD) {
    status = "Strong Fit";
  } else if (score >= GOOD_POTENTIAL_THRESHOLD) {
    status = "Good Potential";
  } else {
    status = "Waitlist";
  }

  return ContentService
    .createTextOutput(JSON.stringify({ score: score, status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}
