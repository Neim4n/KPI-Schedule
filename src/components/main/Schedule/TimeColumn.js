import moment from "moment";

let LESSON_TIMES =
    [["8:30", "10:05"],
        ["10:25", "12:00"],
        ["12:20", "13:55"],
        ["14:15", "15:50"],
        ["16:10", "17:45"],
        ["18:30", "20:05"]]

function TimeColumn({closest, week}) {
    let {lesson_number, day_number, lesson_week} = closest;
    let m = moment();
    let currentTime = LESSON_TIMES.find((time) =>
        m.isBetween(moment(time[0], "HH:mm:ss"), moment(time[1], "HH:mm:ss")) || m.isBefore(moment(time[0], "HH:mm:ss"))
    )
    return (
        <div className="full-schedule__time-column">
            {
                LESSON_TIMES.map((time, index) => {
                    return (
                        <div key={`time_${index}`}
                             className={`table__lesson-time ${time === currentTime ? "current-lesson" : ""} ${index === lesson_number - 1 ? "closest-lesson" : ""} ${m.day() == day_number && lesson_week == week + 1 ? "today-lesson" : ""}`}>
                            <span>{time[0]}</span>
                        </div>)
                })
            }
        </div>
    )
}

export default TimeColumn;