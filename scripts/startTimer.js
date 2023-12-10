import { padTo2Digits } from "./utils/padTo2Digits.js";

export function startTimer(endTime) {
    const x = setInterval(() => {
        const distance = endTime - Date.now();
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
        document.querySelectorAll(".timer--time").forEach(element => element.innerHTML = `
            ${days > 0 ? padTo2Digits(days) + " д., " : ""}
            ${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}
        `);
    
        if (distance < 0) {
            clearInterval(x);
    
            document.querySelectorAll(".timer--time")
                .forEach(element => element.innerHTML = "");
    
            if (document.querySelector('.schedule_subject--current')) {
                document.querySelectorAll(".schedule_subject--current")
                    .forEach(element => element.classList.remove("schedule_subject--current"));
                document.querySelector('.timer').remove();
            } else {
                document.querySelectorAll(".schedule_subject--next")
                    .forEach(element => element.classList.remove("schedule_subject--next"));
                document.querySelector('.timer').remove();
            }
        }
    }, 1000);    

    return x;
}
