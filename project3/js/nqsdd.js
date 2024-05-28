"use strict";

    //Declared variables and constants
    //#region 
    const prefix = "jpt7200-";
    const title = document.querySelector("#townName");
    const explore = document.querySelector("#explore");
    const tavern = document.querySelector("#tavern");
    const shop = document.querySelector("#shop");
    const leave = document.querySelector("#leave");
    const backToTown = document.querySelector("#return");
    const heal = document.querySelector("#heal");
    const sell = document.querySelector("#sell");
    const buy = document.querySelector("#buy");
    const textLog = document.querySelector("#log");
    const saveName = document.querySelector("#saveName");
    const playerName = document.querySelector("#playerNameINP");
    const playerInfo = document.querySelector("#HUD");
    const nameKey = prefix + "name";
    const attKey = prefix + "attack";
    const defKey = prefix + "defence";
    const goldKey = prefix + "gold";
    const multKey = prefix + "multiplier";
    const goodsKey = prefix + "goods";
    const townPic = document.querySelector("#townPic");
    const tavernPic = document.querySelector("#tavernPic");
    const shopPic = document.querySelector("#shopPic");
    const ratPic = document.querySelector("#ratPic");
    const banditPic = document.querySelector("#banditPic");
    const gameOver = document.querySelector("#gameOver");
    const tutorial = document.querySelector("#tutorial");
    const startGame = document.querySelector("#startGame");
    const reset = document.querySelector("#reset");

    //#endregion

    //Player class
    class Player {
        constructor(name, hp, attack, defence, gold, buyMultiplier, goods){
            this.name = name;
            this.hp = hp;
            this.attack = attack;
            this.defence = defence;
            this.gold = gold;
            this.buyMultiplier = buyMultiplier;
            this.goods = goods;
        }

        takeDamage(damage){
            this.hp -= damage * (1 - (this.defence * 0.01));
        }

        heal(){
            this.hp = 100;
        }

        increaseATT(){
            this.attack += 5;
        }

        increaseDEF(){
            this.defence += 5;
        }

    }

    //                           Name     HP   ATT  DEF Gold BM Goods
    let player = new Player("Player Name", 100, 5,  5,  10,  1,  0)
    
    const storedName = localStorage.getItem(nameKey);
    const storedAtt = localStorage.getItem(attKey);
    const storedDef = localStorage.getItem(defKey);
    const storedGold = localStorage.getItem(goldKey);
    const storedMultiplier = localStorage.getItem(multKey);
    const storedGoods = localStorage.getItem(goodsKey);

    if(storedName){
        playerName.value = storedName;
        player.name = storedName;
        player.attack = storedAtt;
        player.defence = storedDef;
        player.gold = storedGold;
        player.multKey = storedMultiplier;
        player.goods = storedGoods;
    }

    //Enemy class
    class Enemy {

        constructor(name, hp, attack, defence){
            this.name = name;
            this.hp = hp;
            this.attack = attack;
            this.defence = defence;
        }

        takeDamage(damage){
            this.hp -= damage * (1 - (this.defence * 0.01));
        }

        //Gives the player a random amount of gold
        dropGold(){
            let goldEarned = Math.round(Math.random() * 10);
            player.gold += goldEarned
            player.goods++;
            return goldEarned;
        }
    }

    let enemy = new Enemy("Name", 20, 3, 2);


    //detects when the buttons are clicked
    tavern.onclick = loadTavern;
    explore.onclick = loadExplore;
    shop.onclick = loadShop;
    leave.onclick = loadTown;
    backToTown.onclick = loadTown;
    startGame.onclick = loadTown;
    heal.onclick = healEvent;
    buy.onclick = buyEvent;
    sell.onclick = sellEvent;
    saveName.onclick = saveEvent;
    reset.onclick = resetEvent;
    window.onload = infoCreation;

    //Saves the player character
    function saveEvent(){

        player.name = playerName.value;
        localStorage.setItem(nameKey, player.name);
        localStorage.setItem(attKey, player.attack);
        localStorage.setItem(defKey, player.defence);
        localStorage.setItem(goldKey, player.gold);
        localStorage.setItem(multKey, player.buyMultiplier);
        localStorage.setItem(goodsKey, player.goods);
    }

    //Generates player information
    function infoCreation(){
        let textString = "";
        
        textString = "HP: "+ Math.round(player.hp) + "<br>" + "Attack: "+ player.attack +"<br>Defence: "+ player.defence +"<br>Gold: " + player.gold +"<br>Sellable Goods: " + player.goods;

        playerInfo.innerHTML = textString;

    }

    //Hides non-tavern button options and reveals tavern options
    function loadTavern() {
        tavern.setAttribute("hidden", true);
        explore.setAttribute("hidden", true);
        shop.setAttribute("hidden", true);
        leave.removeAttribute("hidden");
        heal.removeAttribute("hidden");
        title.innerHTML = "Rejsend's Tavern"
        townPic.setAttribute("hidden", true);
        tavernPic.removeAttribute("hidden");
    }

    //Hides non-wilderness button options and reveals wilderness options
    function loadExplore() {
        title.innerHTML = "The Wilderness"
        tavern.setAttribute("hidden", true);
        explore.setAttribute("hidden", true);
        shop.setAttribute("hidden", true);
        backToTown.removeAttribute("hidden");
        townPic.setAttribute("hidden", true);
        generateEnemy();
    }

    //Generates either a rat or a bandit
    function generateEnemy(){
        let randNum = Math.random();
        if(randNum <= .75){
            ratPic.removeAttribute("hidden");
            enemy.hp = 20 + (player.buyMultiplier * 10);
            enemy.attack = 2;
            enemy.defence = 1;
            enemy.name = "Rat";
            startCombat();
        }
        else {
            banditPic.removeAttribute("hidden");
            enemy.hp = 40 + (player.buyMultiplier * 10);
            enemy.attack = 4;
            enemy.defence = 4;
            enemy.name = "Bandit";
            startCombat();
        }
    }

    async function startCombat(){

        //Combat loop
        do{
            await sleep(2000);
            
            enemy.takeDamage(player.attack);
            
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You attack the "+ enemy.name +", dealing " + player.attack * (1 - (enemy.defence * 0.01)) + " damage! It has " + enemy.hp + " HP left!";
            textLog.appendChild(logMessage);

            logMessage = document.createElement("p");
            logMessage.innerHTML = "The "+ enemy.name +" attacks, dealing " + enemy.attack * (1 - (player.defence * 0.01)) + " damage!";
            textLog.appendChild(logMessage);

            player.takeDamage(enemy.attack);

            infoCreation();

            if(enemy.name == "Rat"){
                if(window.getComputedStyle(ratPic).visibility === "hidden"){
                    return;
                }
            }
            else{
                if(window.getComputedStyle(banditPic).visibility === "hidden"){
                    return;
                }
            }

            if(enemy.hp <= 0){
                break;
            }

            if(player.hp <= 0){
                break;
            }
        }
        while(enemy.hp > 0 || player.hp > 0)
            
        if(player.hp >= 1){
            let goldEarned = enemy.dropGold();
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You defeated the enemy! It dropped " + goldEarned + " gold and 1 sellable good!";
            textLog.appendChild(logMessage);
            infoCreation();
            ratPic.setAttribute("hidden", true);
            banditPic.setAttribute("hidden", true);
        }
        else{
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You have perished in a blaze of glory. Sadly, this is Game Over.";
            textLog.appendChild(logMessage);

            gameOverEvent();

        }

    }

    //Reveals the game over screen and reset button
    function gameOverEvent(){
        banditPic.setAttribute("hidden", true);
        ratPic.setAttribute("hidden", true);
        backToTown.setAttribute("hidden", true);
        gameOver.removeAttribute("hidden");
        reset.removeAttribute("hidden");
    }

    //Creates a blank slate character and saves it, also shows beginning screen
    function resetEvent() {
        player.name = "Player Name"
        player.hp = 100;
        player.attack = 5;
        player.defence = 5;
        player.goods = 0;
        player.gold = 10;
        player.buyMultiplier = 1;
        saveEvent();
        infoCreation();
        gameOver.setAttribute("hidden", true);
        reset.setAttribute("hidden", true);
        tutorial.removeAttribute("hidden");
        startGame.removeAttribute("hidden");
    }

    //Got this from https://www.tutorialspoint.com/javascript-sleep-function since I didn't want the battle to be too fast.
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }

    //Hides non-shop button options and reveals shop options
    function loadShop() {
        tavern.setAttribute("hidden", true);
        explore.setAttribute("hidden", true);
        shop.setAttribute("hidden", true);
        buy.removeAttribute("hidden");
        sell.removeAttribute("hidden");
        leave.removeAttribute("hidden");
        title.innerHTML = "Maxine's General Store"
        shopPic.removeAttribute("hidden");
        townPic.setAttribute("hidden", true);
    }

    //Hides non-town button options and reveals town options
    function loadTown() {
        title.removeAttribute("hidden");
        townPic.removeAttribute("hidden");
        title.innerHTML = "Toman's Hollow"
        tavern.removeAttribute("hidden");
        explore.removeAttribute("hidden");
        shop.removeAttribute("hidden");
        leave.setAttribute("hidden", true);
        backToTown.setAttribute("hidden", true);
        buy.setAttribute("hidden", true);
        heal.setAttribute("hidden", true);
        sell.setAttribute("hidden", true);
        tavernPic.setAttribute("hidden", true);
        banditPic.setAttribute("hidden", true);
        ratPic.setAttribute("hidden", true);
        shopPic.setAttribute("hidden", true);
        tutorial.setAttribute("hidden", true);
        startGame.setAttribute("hidden", true);
    }

    //Resets the player's HP and prints out a log with flavortext
    function healEvent() {

        //If the player can afford the inn, they sleep well and heal
        if(player.gold >= 2){
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You decide to rest the night in the tavern. You spend 2 Gold and feel your wounds fade away with a hot meal and a soft bed.";
            textLog.appendChild(logMessage);
            player.gold -= 2;
            player.heal();
            infoCreation();
        }
        else{
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You realize you don't have enough money to rest at the inn. Your stomach grumbles and you head for a soft patch of dirt hidden inside a grove of trees. It's going to be a long night.";
            textLog.appendChild(logMessage);
        }
        
    }

    //Upgrades the player's attack and defence at the cost of gold.
    function buyEvent() {

        //If they have the correct amount of money
        if(player.gold >= player.buyMultiplier * 10)
        {
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You spend " + player.buyMultiplier * 10 + " gold on an upgraded suit of armor and a better weapon.";
            textLog.appendChild(logMessage);
            player.increaseATT();
            console.log(player.attack);
            player.increaseDEF();
            player.gold -= player.buyMultiplier * 10;
            player.buyMultiplier++;
            infoCreation();
        }
        else{
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "You don't have enough gold for this upgrade. You need "+ player.buyMultiplier * 10 + " gold.";
            textLog.appendChild(logMessage);
        }

        
    }

    //Purchases a "Good" from the player with a random quality for certain prices
    function sellEvent() {

        //If the player has goods to sell
        if(player.goods >= 1){
                let randNum = Math.random();

            //Low quality good
            if(randNum < .25){
                let logMessage = document.createElement("p");
                logMessage.innerHTML = "\"This isn't great scavenge, but I've seen worse. The best I can offer is 5 gold\"";
                textLog.appendChild(logMessage);
                player.gold += 5;
                player.goods--;
            }
            else if(randNum >= .25 && randNum < .5){
                let logMessage = document.createElement("p");
                logMessage.innerHTML = "\"This is a decent find, but I've seen better. The best I can offer is 10 gold\"";
                textLog.appendChild(logMessage);
                player.gold += 10;
                player.goods--;
            }
            else if(randNum >= .5 && randNum < .75){
                let logMessage = document.createElement("p");
                logMessage.innerHTML = "\"This is an incredible find! I'll give you 15 gold for it!\" ";
                textLog.appendChild(logMessage);
                player.gold += 15;
                player.goods--;
            }
            else if(randNum >= .75 && randNum < .98){
                let logMessage = document.createElement("p");
                logMessage.innerHTML = "\"How did you even find this? This is magnificent! 25 gold!\" ";
                textLog.appendChild(logMessage);
                player.gold += 25;
                player.goods--;
            }
            else if(randNum == .99){
                let logMessage = document.createElement("p");
                logMessage.innerHTML = "\"... Did you steal this from some kind of noble? There's no way that something this valueable was just lying around in the wilderness. Allright, I'm not calling you a liar or anything, but this is some serious high-quality stuff. Just for you, I'll give you 50 gold.\" ";
                textLog.appendChild(logMessage);
                player.gold += 50;
                player.goods--;
            }
            infoCreation();
        }
        else{
            let logMessage = document.createElement("p");
            logMessage.innerHTML = "\"What do you mean you want to sell me something? You don't have anything to sell!\" ";
            textLog.appendChild(logMessage);
        }
        
        
    }