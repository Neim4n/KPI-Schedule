import {useEffect, useState} from "react";
import {Link, NavLink, useLocation} from "react-router-dom";
import moment from "moment";


//create your forceUpdate hook
function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function Header() {
    //Date
    let date = moment().format("ddd, D MMM").split(" ").map(e => e[0].toUpperCase() + e.slice(1)).join(" ");

    let location = useLocation();

    const forceUpdate = useForceUpdate();
    useEffect(() => {
        forceUpdate();
    }, [location])

    return (
        <header className="header">
            <div className="header__container">
                <span className="header__logo">
                        KPISchedule 🎓
                </span>
                <span className="header__links">
                    <NavLink className="links__item-link" activeсlassname='is-active'
                             to={`/groups/${localStorage.getItem("lastSeenGroup")}`}>
                        <span className="item-link__container">
                            <span className="item-link__emoji">👨‍🎓</span>
                            <span className="item-link__name">Студент</span>
                            <span className="item-link__decoration"/>
                        </span>
                    </NavLink>
                    <NavLink className="links__item-link" activeclassname='is-active'
                             to={`/teachers/${localStorage.getItem("lastSeenTeacher")}`}>
                        <span className="item-link__container">
                            <span className="item-link__decoration"/>
                            <span className="item-link__name">Викладач</span>
                            <span className="item-link__emoji">👨‍🏫</span>
                        </span>
                    </NavLink>
                </span>
                <span className="header__date">
                    {date}
                </span>
            </div>
        </header>
    )
}

export default Header;