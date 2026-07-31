// Mini-Games Logic and Question Bank Constants

window.APP_ID = 'daksh-brahmgeet-ultimate-v2';

window.TRUTH_OR_DARE_QUESTIONS = [
  { type: 'Truth', text: 'What was your very first impression when we first talked?' },
  { type: 'Truth', text: 'What is one secret habit you have that nobody else knows?' },
  { type: 'Truth', text: 'If we could travel anywhere in the world tomorrow, where would we go?' },
  { type: 'Truth', text: 'What is your favorite memory of us together?' },
  { type: 'Truth', text: 'What song immediately reminds you of me?' },
  { type: 'Truth', text: 'What is your favorite compliment you have ever received?' },
  { type: 'Dare', text: 'Send a 10-second goofy voice note singing your favorite chorus right now!' },
  { type: 'Dare', text: 'Draw a quick 1-minute masterpiece on the Draw Canvas and send it!' },
  { type: 'Dare', text: 'Send the 3rd most recent photo in your gallery right now!' },
  { type: 'Dare', text: 'Write a 3-line cheesy poem and send it in chat!' },
  { type: 'Dare', text: 'Do 10 jumping jacks and send an audio note confirming!' }
];

window.checkTttWinner = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let l of lines) {
    if (board[l[0]] && board[l[0]] === board[l[1]] && board[l[0]] === board[l[2]]) {
      return board[l[0]];
    }
  }
  if (board.every(x => x !== null)) return 'Tie';
  return null;
};
