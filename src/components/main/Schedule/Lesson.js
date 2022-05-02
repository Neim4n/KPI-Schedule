import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setFilter} from "../../../redux/actions";

function Lesson({data}) {
    let {lesson_name, teachers, groups, lesson_type, addArticles} = data;

    const {funMode, filter} = useSelector(state => {
        return state.appReducer;
    })

    const dispatch = useDispatch();

    //Set filter
    function filterHandler() {
        dispatch(setFilter(filter === lesson_type ? "" : lesson_type));
    }

    //Lesson classes
    let className = " lesson__container " + (addArticles || "")
        + (filter && lesson_type !== filter ? " filtered " : "")
        + (!funMode && addArticles?.includes("fun-mode-lesson") ? " empty-lesson " : "");


    //Lesson name
    lesson_name = (!funMode && !addArticles?.includes("fun-mode-lesson")) || funMode ? lesson_name : "";

    //Lesson links groups/teachers
    let lessonLinks;
    if (teachers) {
        lessonLinks = teachers.map(({teacher_id, teacher_short_name, teacher_name}, index) =>
            <Link key={teacher_id} to={`/teachers/${teacher_id}`}>
                {teacher_short_name || teacher_name}{index == teachers.length - 1 ? "" : ", "}
            </Link>
        );
    }
    if (groups) {
        lessonLinks = groups.map(({group_id, group_full_name}, index) =>
            <Link key={group_id} to={`/groups/${group_id}`}>
                {group_full_name}{index == groups.length - 1 ? "" : ", "}
            </Link>
        );
    }


    return (
        <div className="table__lesson">
            <div className={className}>
                <span className="lesson__name">{lesson_name}</span>
                <span className="lesson__links">{lessonLinks}</span>
                <span className="lesson__type" onClick={() => filterHandler()}>{lesson_type}</span>
            </div>
        </div>
    )
}

export default Lesson;