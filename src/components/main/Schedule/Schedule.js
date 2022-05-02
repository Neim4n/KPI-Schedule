//React
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {loadOff, loadOn} from "../../../redux/actions";
import {fetchScheduleData} from "../../../modules/fetchData";
import ScheduleColumn from "./ScheduleColumn";
//Moment
import moment from 'moment';
import 'moment/locale/uk';
//Swiper
import {Navigation, Pagination, Controller} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/grid";
import 'swiper/css/scrollbar';
import TimeColumn from "./TimeColumn";

let WEEKS = ["Перший тиждень", "Другий тиждень"];

function Schedule({id, way}) {
    //Moment locale
    moment.locale('uk')
    let location = useLocation();

    //Get all weekdays with date;
    const startDay = moment().startOf('week').subtract(1, "day");
    const weekdays = [...Array(12)]
        .map(() => startDay.add(1, "day").day() !== 0 ? startDay.format("dd, D") : startDay.add(1, "day").format("dd, D"))
        .map(day => day[0].toUpperCase() + day.slice(1));


    //Schedule/Week state
    const [schedule, setSchedule] = useState({});
    const [week, setWeek] = useState("");
    const [closest, setClosest] = useState({});

    const dispatch = useDispatch();
    //Fetch Schedule/Week
    useEffect(() => {
        dispatch(loadOn());
        fetchScheduleData(way, id)
            .then(({week, schedule, closest}) => {
                setWeek(week)
                setSchedule(schedule)
                setClosest(closest)
            })
            .then(() => dispatch(loadOff()));
    }, [location, id])

    //Controlled Swiper
    const [weekSwiper, setWeekSwiper] = useState(null);
    const [scheduleSwiper, setScheduleSwiper] = useState(null);

    function scheduleSwiperHandler(realIndex) {
        if (realIndex >= 6 && weekSwiper) {
            weekSwiper.slideTo(1)
        } else if (realIndex < 6 && weekSwiper) {
            weekSwiper.slideTo(0)
        }
    }

    function weekSwiperHandler(realIndex, scheduleIndex) {
        if (realIndex === 0 && scheduleIndex >= 6) {
            scheduleSwiper.slideTo(0)
        } else if (realIndex === 1) {
            scheduleSwiper.slideTo(6)
        }
    }

    return (
        <div className="content__full-schedule">
            <div className="full-schedule__week">
                <Swiper
                    onSwiper={setWeekSwiper}
                    navigation={true}
                    modules={[Pagination, Navigation, Controller]}
                    onActiveIndexChange={({realIndex}) => {
                        weekSwiperHandler(realIndex, scheduleSwiper.realIndex);
                    }}>
                    <SwiperSlide><span className="week__name">{WEEKS[week]}</span></SwiperSlide>
                    <SwiperSlide><span className="week__name">{WEEKS[+!week]}</span></SwiperSlide>
                </Swiper>
            </div>
            <div className="full-schedule__table-container">
                <TimeColumn closest={closest} week={week}/>
                <div className="full-schedule__table ">
                    <Swiper
                        initialSlide={moment().day()}
                        onSwiper={setScheduleSwiper}
                        slidesPerView={6}
                        slidesPerGroup={6}
                        spaceBetween={5}
                        modules={[Pagination, Controller]}
                        onActiveIndexChange={({realIndex, previousIndex}) => {
                            scheduleSwiperHandler(realIndex, previousIndex);
                        }}
                        breakpoints={{
                            1440: {
                                slidesPerView: 6,
                                slidesPerGroup: 6
                            },
                            1024: {
                                slidesPerView: 3,
                                slidesPerGroup: 3
                            }, 600: {
                                slidesPerView: 2,
                                slidesPerGroup: 2
                            }, 0: {
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                            }
                        }}>
                        {
                            Object.values(schedule).map(({day_number, lessons}, index) =>
                                <SwiperSlide key={index}>
                                    <ScheduleColumn
                                        weekday={weekdays[day_number - 1]}
                                        day={day_number}
                                        lessons={lessons}/>
                                </SwiperSlide>)
                        }
                    </Swiper>
                </div>
            </div>
        </div>)
}

export default Schedule;
