const mainPreachers = [
    { en: "Pastor John Smith", ru: "Пастор Иван Смирнов" },
    { en: "Pastor Sarah Johnson", ru: "Пастор Сара Иванова" },
    { en: "Pastor Michael Brown", ru: "Пастор Михаил Браун" },
    { en: "Pastor Emily Davis", ru: "Пастор Эмилия Давыдова" }
];

const secondaryPreachers = [
    { en: "Deacon Mark Wilson", ru: "Дьякон Марк Вильсон" },
    { en: "Deacon Lisa Anderson", ru: "Дьякон Елизавета Андреева" },
    { en: "Deacon David Thompson", ru: "Дьякон Давид Томпсон" },
    { en: "Deacon Rachel Martinez", ru: "Дьякон Рахиль Мартынова" },
    { en: "Deacon Thomas Lee", ru: "Дьякон Фома Ли" },
    { en: "Deacon Anna Garcia", ru: "Дьякон Анна Гарсия" }
];

let currentMonth = new Date();
let currentLanguage = 'en';
const calendar = document.getElementById('calendar');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const languageToggle = document.getElementById('languageToggle');

const translations = {
    en: {
        churchCalendar: "Church Calendar",
        serviceDetails: "Service Details",
        close: "Close",
        mainPreacher: "Main Preacher",
        secondaryPreacher: "Secondary Preacher",
        preacher: "Preacher",
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    ru: {
        churchCalendar: "Церковный Календарь",
        serviceDetails: "Детали Служения",
        close: "Закрыть",
        mainPreacher: "Главный Проповедник",
        secondaryPreacher: "Второй Проповедник",
        preacher: "Проповедник",
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
    }
};

function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    currentMonthYear.textContent = `${translations[currentLanguage].months[month]} ${year}`;

    calendar.innerHTML = '';

    // Add day names
    translations[currentLanguage].days.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-header';
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendar.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (date.getDay() === 0) dayElement.classList.add('sunday');
        if (date.getDay() === 5) dayElement.classList.add('friday');
        if (isToday(date)) dayElement.classList.add('today');

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        if (date.getDay() === 0 || date.getDay() === 5) {
            const preachers = assignPreachers(date);
            if (date.getDay() === 0) {
                const mainPreacher = document.createElement('div');
                mainPreacher.className = 'preacher main-preacher';
                mainPreacher.textContent = preachers.mainPreacher[currentLanguage];
                dayElement.appendChild(mainPreacher);
            }
            const secondaryPreacher = document.createElement('div');
            secondaryPreacher.className = 'preacher secondary-preacher';
            secondaryPreacher.textContent = preachers.secondaryPreacher[currentLanguage];
            dayElement.appendChild(secondaryPreacher);

            dayElement.addEventListener('click', () => showModal(date, preachers));
        }

        calendar.appendChild(dayElement);
    }
}

function assignPreachers(date) {
    const dayOfMonth = date.getDate();
    const isSunday = date.getDay() === 0;
    const mainIndex = Math.floor(dayOfMonth / 7) % mainPreachers.length;
    const secondaryIndex = dayOfMonth % secondaryPreachers.length;

    return {
        mainPreacher: isSunday ? mainPreachers[mainIndex] : null,
        secondaryPreacher: secondaryPreachers[secondaryIndex]
    };
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function showModal(date, preachers) {
    modalDate.textContent = date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    modalBody.innerHTML = '';

    if (date.getDay() === 0) {
        modalBody.innerHTML = `
            <p><strong>${translations[currentLanguage].mainPreacher}:</strong> ${preachers.mainPreacher[currentLanguage]}</p>
            <p><strong>${translations[currentLanguage].secondaryPreacher}:</strong> ${preachers.secondaryPreacher[currentLanguage]}</p>
        `;
    } else {
        modalBody.innerHTML = `
            <p><strong>${translations[currentLanguage].preacher}:</strong> ${preachers.secondaryPreacher[currentLanguage]}</p>
        `;
    }

    modal.style.display = 'block';
}

function updateLanguage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[currentLanguage][key];
    });
    renderCalendar();
}

prevMonthBtn.addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    languageToggle.textContent = currentLanguage === 'en' ? 'RU' : 'EN';
    updateLanguage();
});

renderCalendar();
updateLanguage();
