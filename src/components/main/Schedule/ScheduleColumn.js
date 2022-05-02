import Lesson from "./Lesson";
import moment from "moment";

function ScheduleColumn({weekday, lessons, day}) {
    let isClosest = lessons.find(lesson => lesson.addArticles.includes("closest-lesson"));
    return (
        <div className="table__column">
            <div
                className={`table__weekday ${moment().day() === day ? "today-weekday" : ""} ${isClosest ? "closest-lesson" : ""}`}>
                <span>{weekday}</span>
            </div>
            {
                lessons.length ? lessons.map(lesson => {
                    let {lesson_id, lesson_number, day_number} = lesson;
                    return (<Lesson key={`${day_number}_${lesson_number}_${lesson_id || ""}`}
                                    data={lesson}/>)
                }) : <></>
            }
        </div>
    )
}

export default ScheduleColumn;