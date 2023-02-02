export function scrollToSubject() {
    const scrollToSubjectBtn = document.querySelector('.scroll_to_subject_btn');

    scrollToSubjectBtn.addEventListener('click', (event) => {
        event.preventDefault();

        if (!document.querySelector('.schedule_subject--current')) {
            const dates = document.querySelectorAll('.schedule_dayOfWeek');
            const currentDate = new Date().toLocaleDateString("ru", { dateStyle: "medium" });
            let date = null;

            dates.forEach((node) => {
                if (node.textContent.split(', ')[1] === currentDate)
                    date = node
                else return null
            });

            if (date) date.scrollIntoView({ behavior: "smooth", block: "center" });
            else dates[dates.length - 1].scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        document
            .querySelector('.schedule_subject--current')
            .scrollIntoView({ behavior: "smooth", block: "center" });
    });
}