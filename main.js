timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
    remainingTime: {},
};

resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    buttonSound.play();
    let pom = document.forms["timer-edit"]["pom"].value;
    let short = document.forms["timer-edit"]["short"].value;
    let long = document.forms["timer-edit"]["long"].value;
    //console.log("1: "+pom+" "+short+" "+long);
    timer = {
        pomodoro: pom,
        shortBreak: short,
        longBreak: long,
        longBreakInterval: 4,
        sessions: 0,
        remainingTime: {
            total: 0,
            minutes: 0,
            seconds: 0,
        },
    };
    
    if (pom == ""){
        timer.pomodoro = 25;
    }
    if (short == ""){
        timer.shortBreak = 5;
    }
    if (long == ""){
        timer.longBreak = 15;
    }

    // timer.pomodoro = pom;
    // timer.shortBreak = short;
    // timer.longBreak = long;
    // timer.remainingTime = {
    //             total: 0,
    //             minutes: 0,
    //             seconds: 0,
    //         }
    //console.log("2: "+timer.pomodoro+" "+timer.shortBreak+" "+timer.longBreak);
    // window.location.replace("index.html");





});



//console.log("3: "+timer.pomodoro+" "+timer.shortBreak+" "+timer.longBreak);

const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

let interval;

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    console.log("diff: "+seconds+", end: "+(endTime/1000)%60+", curr: "+(currentTime/1000)%60);
    console.log("total: "+total+", min: "+minutes+", sec: "+seconds);

    return {
    total,
    minutes,
    seconds,
    };
}

function startTimer() {
    // console.log("4: "+timer.pomodoro+" "+timer.shortBreak+" "+timer.longBreak);
    
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    document.getElementById("myAudio").loop = true;
    document.getElementById("myAudio").play();

    interval = setInterval(function() {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
        clearInterval(interval);

        switch (timer.mode) {
            case 'pomodoro':
                if (timer.sessions % timer.longBreakInterval === 0) {
                switchMode('longBreak');
                } else {
                switchMode('shortBreak');
                }
                break;
            default:
                switchMode('pomodoro');
        }
        
        document.querySelector(`[data-sound="${timer.mode}"]`).play();

        startTimer();
    }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
    document.getElementById("myAudio").pause();
}

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
    };

    document
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock();
}

function handleMode(event) {
const { mode } = event.target.dataset;

if (!mode) return;

switchMode(mode);
stopTimer();
}






