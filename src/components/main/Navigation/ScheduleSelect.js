import AsyncSelect from "react-select/async";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchSelectData, fetchSelectTeachers, getDefaultTeacher} from "../../../modules/fetchData";

function ScheduleSelect({id, way}) {

    //State for Select
    const [loadedGroupsOptions, setLoadedGroupsOptions] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [defaultValue, setDefaultValue] = useState({});
    const [isLoading, setLoading] = useState(true);

    //Fetch data once for group options
    useEffect(() => {
        fetchSelectData(id, way).then(({data, defaultValue}) => {
            setLoadedGroupsOptions(data)
            if (way == "groups") {
                setDefaultValue(defaultValue)
                setDefaultOptions([defaultValue]);
            }
            setLoading(false);
        });
    }, [])

    //Update if location changes
    useEffect(() => {
        if (way == "groups") {
            setDefaultValue(loadedGroupsOptions[id - 1]);
            setDefaultOptions([loadedGroupsOptions[id - 1]]);
        } else if (way == "teachers") {
            getDefaultTeacher(id).then(teacher =>{
                setDefaultValue(teacher);
                setDefaultOptions([teacher]);
            })
        }
    }, [way, id])

    //Load options for AsyncSelect
    const loadOptions = (inputValue, callback) => {
        if (way == "groups") {
            return setTimeout(() => {
                callback(loadedGroupsOptions.filter((i) => {
                        if (inputValue.length === 2) {
                            return i.prefix.toLowerCase().includes(inputValue.toLowerCase())
                        } else if (inputValue.length > 2) {
                            return i.label.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    })
                )
            });
        } else if (way == "teachers") {
            if (inputValue.length > 2) {
                return fetchSelectTeachers(inputValue)
            }
        }
    };

    //Change event handler
    const navigate = useNavigate();
    const changeSelectHandler = (e) => {
        navigate(`/${way}/${e.value}`)
        setDefaultValue(e);
        setDefaultOptions([e]);
    }

    return (
        <AsyncSelect
            value={defaultValue}
            defaultOptions={defaultOptions}
            loadOptions={loadOptions}
            onChange={changeSelectHandler}
            placeholder={<div>{way == "groups" ? "Оберіть групу..." : "Оберіть викладача..."}</div>}
            noOptionsMessage={() => way == "groups" ? 'Немає такої групи!' : 'Немає такого викладача!'}
            loadingMessage={() => 'Шукаємо...'}
            className='navigation__select-container'
            classNamePrefix="select"
            isLoading={isLoading}
        />
    )
}

export default ScheduleSelect;