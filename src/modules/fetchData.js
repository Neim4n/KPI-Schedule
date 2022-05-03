import moment from "moment";

//Fetch week for Schedule
export async function fetchScheduleWeek() {
    return await fetch(`https://api.rozklad.org.ua/v2/weeks`)
        .then(res => res.json())
        .then(json => json.data)
        .then(data => +!(data - 1))
        .catch(() => 0);
}

//Fetch data for Schedule
export async function fetchScheduleData(week, way, id) {
    let closest = null;
    let schedule = await fetch(`https://api.rozklad.org.ua/v2/${way}/${id}/lessons`)
        .then(res => res.json())
        .then(json => formatToObject(json.data, week))
        .then(data => fillByEmptyLessons(data))
        .then(data => {
            closest = findClosestLesson(data, week)
            return data;
        }).catch(() => createEmptySchedule(week));

    return {schedule, closest}
}

function createEmptySchedule(week) {
    let result = {}
    for (let i = 1; i <= 12; i++) {
        let lessons = [...Array(6)].map((lesson, index) => {
            return {
                addClasses: "empty-lesson",
                day_number: i,
                lesson_full_name: "",
                lesson_name: "",
                lesson_number: index + 1,
                lesson_type: "",
                lesson_week: i <= 6 ? week : +!week,
                rate: "",
                teacher_name: "",
            }
        })
        result[i] = {
            day_number: i,
            week_number: i <= 6 ? week : +!week,
            lessons
        }
    }
    return result;
}

//Format response to comfortable form
function formatToObject(data, week) {
    let result = {};
    data.forEach((lesson) => {
        //Every lesson add "addClasses"
        let {day_number, lesson_week, lesson_type} = lesson;
        lesson.addClasses = "";
        lesson.lesson_type = lesson_type ? lesson_type[0].toUpperCase() + lesson_type.slice(1) : "";

        //Formed property for result
        let currentDay = lesson_week - 1 === week ? +day_number : +day_number + 6;
        let lessonsArray = result[currentDay]?.lessons ? [...result[currentDay].lessons, lesson] : [lesson];
        result[currentDay] = {
            day_number: currentDay, week_number: lesson_week - 1, lessons: lessonsArray,
        }
    })

    //if days < 12
    if (Object.values(result).length < 12) {
        for (let i = 1; i <= 12; i++) {
            if (!result.hasOwnProperty(i)) {
                result[i] = {
                    day_number: i,
                    week_number: i <= 6 ? week : +!week,
                    lessons: [],
                }
            }
        }
    }
    return result;
}

//FUnction for find closest and today lessons
function findClosestLesson(data, week) {
    let m = moment();
    let day = m.day();
    let isClosestFound = false;
    let days = Object.values(data);

    let currentDay = day;
    if (day === 0) {
        currentDay = 7;
        m = moment("0:00", "HH:mm");
    }

    let closest;
    for (let i = 0; i < days.length && !isClosestFound; i++) {
        let {day_number, week_number, lessons} = days[i];

        //Update time
        if (i === currentDay) m = moment("0:00", "HH:mm");

        //Today lesson
        if (week_number === week && day_number === currentDay && day !== 0) lessons.forEach((lesson) => lesson.addClasses += " today-lesson")

        //Closest lesson
        if (day_number >= currentDay) {
            closest = lessons.find(({
                                        time_start,
                                        time_end
                                    }) => m.isBetween(moment(time_start, "HH:mm:ss"), moment(time_end, "HH:mm:ss")) || m.isBefore(moment(time_start, "HH:mm:ss")))
        }
        //Finish loop
        if (closest) {
            isClosestFound = true;
            closest.addClasses += " closest-lesson";
            break;
        }
    }
    return closest;
}

//Fill lesson arrays by empty lessons
function fillByEmptyLessons(data) {
    let days = Object.values(data);
    days.forEach((day) => {
        let {lessons, day_number, week_number} = day;
        let lessonsObject = lessons.reduce(function (target, key) {
            target[key.lesson_number] = key;
            return target;
        }, {})

        for (let i = 1; i < 7; i++) {
            if (!lessonsObject.hasOwnProperty(i)) {
                lessonsObject[i] = lessonObjectTemplate(i, day_number, week_number, days);
            }
        }
        day.lessons = Object.values(lessonsObject);
    })
    return data;
}

//Lessons object templates for empty lessons and lessons with fun mode
function lessonObjectTemplate(lesson_number, day_number, lesson_week, days) {
    let customLesson = {
        addClasses: "empty-lesson",
        day_number,
        lesson_full_name: "",
        lesson_name: "",
        lesson_number,
        lesson_type: "",
        lesson_week,
        rate: "",
        teacher_name: "",
    }
    if (lesson_number != 1 && lesson_number != 6 && days[day_number - 1].lessons.length < 6) {
        let prevLesson = days[day_number - 1].lessons.some((lesson) => lesson.lesson_number < lesson_number/* && lesson.addClasses !== "empty" && lesson.addClasses !== "white"*/);
        let nextLesson = days[day_number - 1].lessons.some((lesson) => lesson.lesson_number > lesson_number /*&& lesson.addClasses !== "empty" && lesson.addClasses !== "white"*/);
        if (prevLesson && nextLesson) {
            customLesson.addClasses = " fun-mode-lesson";
            customLesson.lesson_full_name = "Віконце 🤘🏼";
            customLesson.lesson_name = "Віконце 🤘🏼";
        }
    }
    if (lesson_number == 1) {
        customLesson.addClasses = " fun-mode-lesson";
        customLesson.lesson_full_name = "Поспи ще трохи 😴";
        customLesson.lesson_name = "Поспи ще трохи 😴";
    }
    if (lesson_number == 1 && !days[day_number - 1].lessons.length) {
        customLesson.addClasses = " fun-mode-lesson";
        customLesson.lesson_full_name = "Вихідний 🎉";
        customLesson.lesson_name = "Вихідний 🎉";
        customLesson.lesson_number = "1";
    }
    if (lesson_number == 6 && (day_number == 6 || !days[day_number]?.lessons.length)) {
        customLesson.addClasses = " fun-mode-lesson";
        customLesson.lesson_full_name = "Збирайся на Поляну 💃";
        customLesson.lesson_name = "Збирайся на поляну 💃";
    }
    return customLesson;
}

//Fetch data for Select
export async function fetchSelectData(id, way) {
    let data = [];
    let defaultValue;
    let offset = 0
    while (true) {
        let currentData = await fetch(`https://api.rozklad.org.ua/v2/groups/?filter={"limit":100,"offset":${offset}}`)
            .then(res => res.json())
            .then(json => json.data);
        //Format Data for Select
        currentData = currentData.map(({group_full_name, group_id, group_prefix}) => {
            if (group_id == id && way == "groups") {
                defaultValue = {
                    label: `${group_full_name}`,
                    value: `${group_id}`,
                    prefix: `${group_prefix}`
                };
            }
            return {
                label: `${group_full_name}`,
                value: `${group_id}`,
                prefix: `${group_prefix}`
            }
        })
        data = [...data, ...currentData];
        offset += 100;
        if (currentData.length < 100)
            break;
    }
    return {data, defaultValue}
}

//Fetch teachers for select
export async function fetchSelectTeachers(inputValue) {
    return await fetch(`https://api.rozklad.org.ua/v2/teachers/?search={'query': '${inputValue}'}`)
        .then(res => res.json())
        .then(json => json.data)
        .then(data => data.map(t => ({label: t.teacher_name, value: t.teacher_id,})))
        .catch(() => []);
}

//Fetch default Teacher
export async function getDefaultTeacher(id) {
    return await fetch(`https://api.rozklad.org.ua/v2/teachers/${id}`)
        .then(res => res.json())
        .then(json => json.data)
        .then(({teacher_name, teacher_id}) => {
            return {
                label: teacher_name,
                value: teacher_id
            }
        }).catch(() => ({}));

}