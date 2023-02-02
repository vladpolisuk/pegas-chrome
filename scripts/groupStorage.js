const schedule_group = document.querySelector('.schedule_group');
const schedule_external = document.querySelector('.schedule_external');

const xhr = new XMLHttpRequest();

export function groupStorage(fromDate, toDate, setSchedule) {
    chrome.storage.local.get("group", ({ group }) => {
        if (!group) return;

        schedule_group.textContent = group;
        schedule_external.href = `https://bsuedu.ru/bsu/education/schedule/groups/index.php?group=${group}`;
        xhr.open("GET", `https://beluni.ru/schedule/g/${group}?from=${fromDate}&to=${toDate}&qdist=1`);
        xhr.send();
        xhr.onload = setSchedule;
    });
}

export function groupInputListener(fromDate, toDate, setSchedule) {
    const input = document.querySelector('.schedule_form');

    input.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('.schedule_input');
        const value = document.querySelector('.schedule_input').value;

        if (!value) return;

        input.value = '';
        schedule_group.textContent = value;
        schedule_external.href = `https://bsuedu.ru/bsu/education/schedule/groups/index.php?group=${value}`;
        chrome.storage.local.set({ group: value });
        xhr.open("GET", `https://beluni.ru/schedule/g/${value}?from=${fromDate}&to=${toDate}&qdist=1`);
        xhr.send();
        xhr.onload = setSchedule;
    });
}
