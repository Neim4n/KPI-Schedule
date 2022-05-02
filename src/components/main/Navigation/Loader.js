import {useSelector} from "react-redux";

function Loader() {

    const {isLoaded} = useSelector(state => {
        return state.appReducer;
    })

    return (
        <div className={`navigation__loader ${isLoaded ? "done" : ""}`}>
            <div className="loader"/>
        </div>
    )
}

export default Loader;