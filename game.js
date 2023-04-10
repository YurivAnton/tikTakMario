"use strict";
let main = document.querySelector('#main');

// Створюю випадаючий список для вибору мови
let len = document.createElement('select');
let opt1 = document.createElement('option');
opt1.value = 'ua';
opt1.textContent = 'ua';
let opt2 = document.createElement('option');
opt2.value = 'rus';
opt2.textContent = 'rus';
len.append(opt1);
len.append(opt2);

main.prepend(len);

let manual = document.querySelector('#manual');
let footer = document.querySelector('#footer');

let lenguage = {
    'ua': `<h1>Інструкція</h1><p>1. Для того щоб Маріо рухався вперед натисніть та утримуйте клавішу \'d\'</p>
    <p>2. Для підстрибування натисніть ліву клавішу миші(курсор миші повинен знаходитись в полі гри).</p>`,
    'rus': '<h1>ШУРУЙ ВЧИТИ УКРАЇНСЬКУ МОВУ!!!</h1>',
};

manual.innerHTML = lenguage.ua;
len.addEventListener('click', function () {
    manual.innerHTML = lenguage[this.value];
})

let start = document.createElement('button');
start.id = 'start';
start.innerHTML = 'start';
main.after(start);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWall(downItems) {
    if (getRandomInt(1, 100) % 2 == 0) {
        downItems[downItems.length - 1].classList.add('active');
    } else {
        downItems[downItems.length - 1].classList.add('active');
        downItems[downItems.length - 2].classList.add('active');
    }
}


// Старт гри
start.addEventListener('click', function startGame(event) {
    start.remove();

    main.classList.add('main');
    footer.classList.add('footer');

    let up = document.querySelector('#up');
    let down = document.querySelector('#down');
    let result = document.querySelector('#result');
    let message = document.createElement('span');
    message.classList.add('result');

    len.remove();
    manual.innerHTML = '';

    let backButton = document.createElement('button');
    let backLink = document.createElement('a');
    backLink.href = 'index.html';
    backLink.textContent = 'Back';
    backButton.append(backLink);
    main.after(backButton);

    // Створюю верхній ряд ігрового поля
    for (let i = 0; i <= 13; i++) {
        let div = document.createElement('div');
        div.classList.add('field');

        div.id = 'up' + i;
        up.append(div);
    }

    // Створюю нижній ряд ігрового поля
    for (let i = 0; i <= 13; i++) {
        let div = document.createElement('div');

        div.classList.add('game', 'field');

        div.id = 'down' + i;
        down.append(div);
    }

    let upItems = document.querySelectorAll('#up div');
    let downItems = document.querySelectorAll('#down div');
    let score = 0;
    let koef = 10;
    let stopGame = false;

    let mario = document.createElement('img');
    mario.src = 'sourse/mario.gif';
    mario.classList.add('mario');

    // Створюю обʼєкт з картинками перешкод
    let walls = {};
    for (let i = 0; i <= 13; i++) {
        let wall = document.createElement('img');
        wall.src = 'sourse/wall.jpeg';
        wall.classList.add('walls');
        walls[i] = wall;
    }

    // Створюю героя і даю йому клас 
    for (let k = 0; k < downItems.length; k++) {
        if (k == 3) {
            downItems[3].classList.add('person');
            downItems[3].append(mario);
            downItems[3].classList.remove('loose');
        }
    }

    let scoreSpan = document.createElement('span');
    scoreSpan.classList.add('score');
    scoreSpan.textContent = 'Score: ';
    upItems[upItems.length - 2].append(scoreSpan);

    // Створюю каунтер і початкові позиції перешкод
    let downItemsCounter = downItems.length;
    downItems[6].classList.add('active');
    downItems[6].append(walls[0]);
    downItems[10].classList.add('active');
    downItems[10].append(walls[1]);

    document.body.addEventListener('keydown', function func(event) {
        if (event.key == 'd' || event.key == 'в') {
            let timerId = setInterval(function () {
                if (!stopGame) {
                    upItems[upItems.length - 1].classList.add('score');
                    upItems[upItems.length - 1].textContent = score;

                    // Роблю так щоб після успішного проходження перешкоди герой спускався на нижній рівень
                    if (upItems[3].classList.contains('person')
                        && downItems[2].classList.contains('active')
                        && !downItems[3].classList.contains('active')
                    ) {
                        upItems[3].classList.remove('person');
                        upItems[3].innerHTML = '';
                        downItems[3].classList.add('person');
                        downItems[3].append(mario);
                    }

                    // Визначаю позиції перешкод і посуваю їх на одне поле ближче
                    let indexes = [];

                    for (let i = downItems.length - 1; i >= 0; i--) {
                        if (downItems[i].classList.contains('active')) {
                            indexes.push(i);
                        }

                        downItems[i].classList.remove('active');

                        if (!downItems[i].classList.contains('person')) {
                            downItems[i].innerHTML = '';
                        }
                    }

                    for (let index of indexes) {
                        if (downItems[index - 1]) {
                            downItems[index - 1].classList.add('active');
                        }
                    }

                    for (let i = downItems.length - 1; i >= 0; i--) {
                        if (downItems[i].classList.contains('active')) {
                            downItems[i].append(walls[i]);
                        }
                    }

                    // Рахую очки
                    if (downItems[1].classList.contains('active')) {
                        score += 100;
                        if (score == 500) {
                            koef = 7;
                            document.body.addEventListener('keydown', func);
                        }

                        if (score == 1500) {
                            koef = 5;
                            document.body.addEventListener('keydown', func);
                        }
                    }

                    // декрементую каунтер
                    downItemsCounter--;

                    // В два рази створюю випадково одну або дві перешкоди з відступом між ними
                    if (downItemsCounter == downItems.length - 6) {
                        generateWall(downItems);
                    }

                    if (downItemsCounter == 0) {
                        //обновлюю каунтер
                        downItemsCounter = downItems.length;

                        generateWall(downItems);
                    }

                    // коли програв...
                    if (downItems[3].classList.contains('active') && downItems[3].classList.contains('person')) {
                        backButton.remove();
                        message.textContent = 'Ви програли. Ваша кількість балів: ' + score;
                        result.append(message);
                        let resButton = document.createElement('button');
                        let restart = document.createElement('a');
                        restart.href = 'index.html';
                        restart.textContent = 'Restart';
                        resButton.append(restart);
                        main.after(resButton);
                        start.addEventListener('click', startGame);
                        document.body.removeEventListener('keydown', func);
                        downItems[3].children[1].remove();
                        downItems[3].classList.add('loose')
                        stopGame = true;
                        clearInterval(timerId);
                    }
                }

            }, 50 * koef);
            document.body.removeEventListener('keydown', func);

            // коли відпустити клавішу d гра зупиниться
            document.body.addEventListener('keyup', function () {
                if (!downItems[3].classList.contains('loose')) {
                    document.body.addEventListener('keydown', func);
                    clearInterval(timerId);
                }
            })
        }
    })

    // Стрибки
    main.addEventListener('mousedown', function jumpUp(event) {
        upItems[3].classList.add('person');
        upItems[3].append(mario);
        downItems[3].classList.remove('person');
    })


    main.addEventListener('mouseup', function jumpDown(event) {

        if (downItems[3].classList.contains('active')) {
            upItems[3].classList.add('person');
            upItems[3].append(mario);
            downItems[3].classList.remove('person');
        } else {
            upItems[3].classList.remove('person');
            upItems[3].innerHTML = '';
            downItems[3].classList.add('person');
            downItems[3].append(mario);
        }
    })

})

