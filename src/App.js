import './App.css';
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import {HashRouter} from "react-router-dom";

function App() {
    return (
        <HashRouter>
            <div className="wrapper">
                <Header/>
                <Main/>
            </div>
        </HashRouter>
    );
}

export default App;
