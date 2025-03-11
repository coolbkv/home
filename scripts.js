/* Get the current Year */
document.getElementById("copyrightYear").innerHTML = new Date().getFullYear();

/* Script Related to Digital Dice */
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const rollButton = document.getElementById('roll-button');
const diceCountRadios = document.querySelectorAll('input[name="diceCount"]');

let diceCount = 1;

diceCountRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    diceCount = parseInt(radio.value);
    if (diceCount === 1) {
      dice2.style.display = 'none';
    } else {
      dice2.style.display = 'flex';
    }
  });
});

rollButton.addEventListener('click', () => {
  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  const diceFaces = ['&#x2680;', '&#x2681;', '&#x2682;', '&#x2683;', '&#x2684;', '&#x2685;'];
  dice1.innerHTML = diceFaces[roll1 - 1];
  if(roll1 === 6){
    dice1.classList.add('red-dot');
  } else {
    dice1.classList.remove('red-dot');
  }

  if (diceCount === 2) {
    dice2.innerHTML = diceFaces[roll2 - 1];
    if(roll2 === 6){
      dice2.classList.add('red-dot');
    } else {
      dice2.classList.remove('red-dot');
    }
  }

  dice1.classList.add('shake');
  if (diceCount === 2) {
    dice2.classList.add('shake');
  }

  setTimeout(() => {
    dice1.classList.remove('shake');
    dice1.classList.remove('red-dot');
    if (diceCount === 2) {
      dice2.classList.remove('shake');
      dice2.classList.remove('red-dot');
    }
  }, 100);
});