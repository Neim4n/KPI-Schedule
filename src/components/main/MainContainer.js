//Import
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import ScheduleSelect from "./Navigation/ScheduleSelect";
import Schedule from "./Schedule/Schedule";
import Settings from "./Navigation/Settings";
import Loader from "./Navigation/Loader";


function MainContainer() {
    //Location
    let location = useLocation();
    let locationsArray = location.pathname.split("/");


    //State for location way/:id
    const [id, setId] = useState(locationsArray[2]);
    const [way, setWay] = useState(locationsArray[1]);

    //Schedule states
    const [isOpen, setIsOpen] = useState(false);

    //Location
    useEffect(() => {
        setId(locationsArray[2]);
        setWay(locationsArray[1]);
        if (locationsArray[1] == "groups") {
            localStorage.setItem("lastSeenGroup", locationsArray[2])
        }
        if (locationsArray[1] == "teachers") {
            localStorage.setItem("lastSeenTeacher", locationsArray[2])
        }
    }, [location])

    function navigationClickHandler(e) {
        if (!e.target.closest(".navigation__button-open-setting") && !e.target.closest(".navigation__settings-window")) {
            setIsOpen(false);
        }
    }

    return (
        <div className="main__container">
            <div className={`main__navigation ${isOpen ? "active" : ""}`} onClick={navigationClickHandler}>
                <button className={`navigation__button-open-setting ${isOpen ? "active" : ""}`}
                        onClick={() => setIsOpen(!isOpen)}>⚙️
                </button>
                <Settings isOpen={isOpen}/>
                <ScheduleSelect way={way} id={id}/>
                <Loader/>
            </div>
            <div className="main__content">
                <Schedule way={way} id={id}/>
            </div>
        </div>
    )
}

export default MainContainer;