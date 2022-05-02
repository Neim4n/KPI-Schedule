//Import
import {Routes, Route, Navigate} from "react-router-dom";
import MainContainer from "./MainContainer";

function Main() {

    //Set if not exist
    if (!localStorage.getItem("lastSeenGroup")) {
        localStorage.setItem("lastSeenGroup", 1);
    }
    if (!localStorage.getItem("lastSeenTeacher")) {
        localStorage.setItem("lastSeenTeacher", 1);
    }
    if (!localStorage.getItem("funMode")) {
        localStorage.setItem("funMode", false);
    }

    return (
        <main className="main">
            <Routes>
                <Route exact path="/"
                       element={<Navigate replace to={`/groups/${localStorage.getItem("lastSeenGroup")}`}/>}/>
                <Route path="/groups/:id" element={<MainContainer/>}/>
                <Route path="/teachers/:id" element={<MainContainer/>}/>
                <Route path="/*"
                       element={<Navigate replace to={`/groups/${localStorage.getItem("lastSeenGroup")}`}/>}/>
            </Routes>
        </main>
    )
}

export default Main;
