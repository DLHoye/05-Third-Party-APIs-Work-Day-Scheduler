//const list + moment for date
const currentDayEl = $("#currentDay");
const today = moment().format("LL");
currentDayEl.text(today);

//pull events from local storage
let events = JSON.parse(localStorage.getItem("DailyPlanner"));
if (!events) {
  events = {};
  events[today] = {};
}


//build each hour of the workday
const createEachHour = () => {
  const eachHour = $(".container");
  for (i = 8; i <= 17; i++) {
    const hour = moment(i, "H").format("hA");
    const row = $(`<div id=${hour} class="row time-block">`);
    const timeSlot = $('<textarea class="col-10 form-control">');

    eachHour.append(row);
    row.append(timeSlot);

    timeSlot
      .before(`<div class="hour col pt-4">${hour}</div>`)
      .after('<button class="col btn saveBtn" id="save">💾</button>');
    
    //add events to each hour
     if (!!events[today][hour]) $(`#${hour}`).children("textarea").val(events[today][hour]);
  }
  checkTime();
  addListener();
};

//check hour to asign past, present, or future css styles
const checkTime = () => {
  $("textarea").each((i, el) => {
    const prev = $(el).prev();
    const now = moment();
    const prevTime = moment(prev.text(), "hA");
    if (prevTime.format('H') === now.format('H')) {
      $(el).addClass("present");
    }
    else if (prevTime.isBefore(now)) {
      $(el).addClass("past");
    } else if (prevTime.isAfter(now)) {
      $(el).addClass("future");
    } 
  });
};

//save events to local storage
const saveEvent = (e) => {
  const event = $(e.target).prev()
  const eventTime = $(event).prev().text()
  events[today][eventTime] = event.val()
  localStorage.setItem('DailyPlanner', JSON.stringify(events))
}

//add save button click event listener
const addListener = () => {
   $("button").on("click", saveEvent);
}

//checks the time every 10 seconds for any CSS style updates
setInterval(checkTime, 1000 * 10);

//calls the createEachHour function
$(window).on("load", createEachHour);
