// 1. deposit some money
// 2a. how many lines to bet
// 3. collect bet amount
// 4. spin slot machine
// 5. check if user won
// 6. if win pay out /if lost take money
// 7. play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = 
{
    A : 2,
    B : 4, 
    C : 6,
    D : 8
}

//multiplier? 
const SYMBOLS_VALUES = {
    A : 5,
    B : 4,
    C : 3,
    D : 2
}

const deposit = () => 
{
    while (true) {
        const depositAmount = prompt("Enter the deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
    
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");   
        }
        else
        {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => 
{
    const lines = prompt("Enter number of lines(1-3) to bet on: ");
    const numberofLines = parseFloat(lines);

    if (isNaN(numberofLines) || numberofLines <= 0 || numberofLines > 3){
        console.log("Invalid number of lines, try again."); 
        getNumberOfLines();
    } 
    else
    {
        return numberofLines;
    }
};

const getBetAmount = (balance, lines) =>
{
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const betAmount = parseFloat(bet);
    
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / lines) {
            console.log("Invalid bet, try again.");   
        }
        else
        {
            return betAmount;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT))
    {
        for (let i = 0; i < count; i++)
        {
            symbols.push(symbol); //add to array
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbol = [...symbols]; 
        for (let j = 0; j < ROWS; j++)
        {
            const randomIndex = Math.floor(Math.random() * reelSymbol.length);
            const selectedSymbol = reelSymbol[randomIndex]
            reels[i].push(selectedSymbol);
            reelSymbol.splice(randomIndex,1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i=0; i < ROWS; i++) 
    {
        rows.push([]);
        for (let j=0; j < COLS; j++)
        {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

const printRows = (rows) => {
    for(const row of rows)
    {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1)
            {
                rowString += " | ";
            }
        }

        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allsame = false;
                break;
            }
        }
        
        if (allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }

    return winnings;
};

const game = () => {
    let balance = deposit();
    while (true){
        console.log("You have a balance of $" +balance);
        let numberOfLines = getNumberOfLines();
        if (isNaN(numberOfLines))
        {
            lines = 1;
            console.log("Default number of lines (1) has been assigned");
        }
        const bet = getBetAmount(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const genRows = transpose(reels);
        printRows(genRows);
        const winnings = getWinnings(genRows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings);
        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Play Again? (y/n): ");

        if (playAgain != "y") {
            break;
        }
    }
};

game();

 
