const buttonTwoHourProgram = document.getElementById("2-hour-program")
const buttonFourHourProgram = document.getElementById("4-hour-program")
const buttonEightHourProgram = document.getElementById("8-hour-program")
const startButton = document.querySelector(".start-button")
const breakButton = document.querySelector(".break-button")
const resumeButton = document.querySelector(".resume-button")
const backButton = document.querySelector(".back-button")

const selectedProgramElement = document.querySelector(".selected-program")
const endingMessageElement = document.querySelector(".ending-message")
const timerElement = document.querySelector(".timer")
const selectedDurationElement = document.querySelector(".selected-duration")
const countdownElement = document.querySelector(".countdown")
const progressBarElement = document.querySelector(".progress-bar")

const regex = /[a-z]/

let selectedProgram = null

selectedProgramElement.innerText = `Bienvenue sur Wallacefocus !\nPour commencer, sélectionne un programme.`

function resetProgram() {
    selectedProgramElement.innerText = `Bienvenue sur Wallacefocus !\nPour commencer, sélectionne un programme.`
    selectedDurationElement.innerText = ``
    selectedProgram = null
}

function setProgram(buttonText, hours) {
    selectedProgramElement.innerText = `Tu as sélectionné\n${buttonText}.\nPour démarrer la session, appuie sur START.`
    selectedDurationElement.innerText = `0${hours}:00:00`
    selectedProgram = buttonText
}

function buttonAdjustment(buttonText, hours) {
    if (!regex.test(selectedProgramElement.innerText)) {
        return null
    } else if (selectedProgram === buttonText) {
        resetProgram()
    } else {
        setProgram(buttonText, hours)
    }
}

buttonTwoHourProgram.addEventListener("click", () => {
    buttonAdjustment("deux heures", 2)
})

buttonFourHourProgram.addEventListener("click", () => {
    buttonAdjustment("quatre heures", 4)
})

buttonEightHourProgram.addEventListener("click", () => {
    buttonAdjustment("huit heures", 8)
})

let timerIsBreak = false
let timerBreakTime = 0
let timerTimeBeforeBreak = 0
let timerStartTime = 0

let countdownIsBreak = false
let countdownBreakTime = 0
let countdownTimeBeforeBreak = 0
let countdownStartTime = 0

function timer(duration) {
    return new Promise((resolve) => {
        let startTime = performance.now()
        timerStartTime = startTime
        const interval = setInterval(() => {
            if (timerIsBreak) {
                return null
            }
            const elapsedTime = performance.now() - startTime - timerBreakTime
            const remainingTime = Math.max(0, duration - Math.floor(elapsedTime / 1000))
            const minutes = Math.floor(remainingTime / 60)
            const seconds = remainingTime % 60
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
            const formattedSeconds = seconds < 10 ? '0' + seconds : seconds
            document.title = `Wallacefocus • ${formattedMinutes}:${formattedSeconds}`
            timerElement.innerText = `${formattedMinutes}:${formattedSeconds}`
            if (remainingTime === 0) {
                clearInterval(interval)
                document.title = `Wallacefocus • C'est terminé !`
                timerElement.innerText = ``
                endingMessageElement.innerText = `Tu as terminé\nta session !\nPour revenir à\nl'écran titre,\nappuie sur RETOUR.`
                resolve()
            }
        }, 1000)
    })
}

function workTimer() {
    timerBreakTime = 0
    return timer(1500)
}

function breakTimer() {
    timerBreakTime = 0
    return timer(300)
}

async function timerSequence(repetitions) {
    for (let i = 0; i < repetitions; i++) {
        await workTimer()
        await breakTimer()
    }
}

function countdown(duration) {
    let startTime = performance.now()
    countdownStartTime = startTime
    const interval = setInterval(() => {
        if (countdownIsBreak) {
            return null
        }
        const elapsedTime = performance.now() - startTime - countdownBreakTime
        const remainingTime = Math.max(0, duration - Math.floor(elapsedTime / 1000))
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60
        const formattedHours = hours < 10 ? '0' + hours : hours
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds
        countdownElement.innerText = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
        if (remainingTime === 0) {
            clearInterval(interval)
            countdownElement.innerText = ``
            breakButton.style.display = "none"
            backButton.style.display = "block"
        }
    }, 1000)
}

startButton.addEventListener("click", () => {
    if (selectedDurationElement.innerText === "02:00:00") {
        selectedProgram = null
        selectedProgramElement.innerText = ``
        selectedDurationElement.innerText = ``
        startButton.style.display = "none"
        breakButton.style.display = "block"
        timerSequence(4)
        countdown(7200)
    } else if (selectedDurationElement.innerText === "04:00:00") {
        selectedProgram = null
        selectedProgramElement.innerText = ``
        selectedDurationElement.innerText = ``
        startButton.style.display = "none"
        breakButton.style.display = "block"
        timerSequence(8)
        countdown(14400)
    } else if (selectedDurationElement.innerText === "08:00:00") {
        selectedProgram = null
        selectedProgramElement.innerText = ``
        selectedDurationElement.innerText = ``
        startButton.style.display = "none"
        breakButton.style.display = "block"
        timerSequence(16)
        countdown(28800)
    } else {
        return null
    }
})

breakButton.addEventListener("click", () => {
    timerIsBreak = true
    countdownIsBreak = true
    timerTimeBeforeBreak = performance.now() - timerStartTime
    countdownTimeBeforeBreak = performance.now() - countdownStartTime
    breakButton.style.display = "none"
    resumeButton.style.display = "block"
})

resumeButton.addEventListener("click", () => {
    timerIsBreak = false
    countdownIsBreak = false
    timerBreakTime += performance.now() - (timerStartTime + timerTimeBeforeBreak)
    countdownBreakTime += performance.now() - (countdownStartTime + countdownTimeBeforeBreak)
    resumeButton.style.display = "none"
    breakButton.style.display = "block"
})

backButton.addEventListener("click", () => {
    document.title = `Wallacefocus`
    endingMessageElement.innerText = ``
    selectedProgramElement.innerText = `Bienvenue sur Wallacefocus !\nPour commencer, sélectionne un programme.`
    backButton.style.display = "none"
    startButton.style.display = "block"
})