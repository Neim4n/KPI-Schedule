import {useDispatch, useSelector} from "react-redux";
import Switch from "react-switch";
import {setFunMode} from "../../../redux/actions";

function Settings({isOpen}) {

    const {funMode} = useSelector(state => {
        return state.appReducer;
    })

    const dispatch = useDispatch();

    function switchHandler() {
        dispatch(setFunMode(!funMode))
    }

    return (
        <div className={`navigation__settings-window ${isOpen ? "active" : ""}`}>
            <div className="settings-window__container">
                <div className="settings-window__fun-mode">
                    <label>
                        <span className="fun-mode__name">Fun mode</span>
                        <Switch offColor="#5f6366"
                                onColor="#90cbf3"
                                offHandleColor="#ebebeb"
                                onHandleColor="#5ca1d4"
                                uncheckedIcon={
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        fontSize: 15,
                                        paddingRight: 2
                                    }}
                                    >
                                        😐
                                    </div>
                                }
                                checkedIcon={
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        fontSize: 15,
                                        paddingLeft: 2
                                    }}
                                    >
                                        🙃
                                    </div>
                                }
                                onChange={() => switchHandler()}
                                checked={funMode}/>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Settings;