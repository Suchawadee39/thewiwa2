const perChunk = 5;

let dataList = [];
let getSlideList = [];

let menuData = [];

let monthNames = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];

let textMessage = null;

let showData = 2;

let page = parseInt(getPage());
if (page === null || page === undefined || isNaN(page)) {
  window.location.href = "index.html?page=1";
}

function showStatus() {
  let x = document.getElementById("show-status");
  x.innerHTML = "";

  let chuckTable = tableToChunk(dataList);

  if (page > chuckTable.length) {
    window.location.href = "index.html?page=1";
  }

  let realData = chuckTable[page - 1];

  realData.forEach(function (element, index) {
    const tableName = element.name;

    const orders = element.orders;

    for (let index = 0; index < orders.length; index++) {
      const orderList = orders[index];
      console.log("999", orderList);
      const testTime = orderList.estimate_end_time;

      let imageStatus = null;
      if (orderList.status == "In the kitchen") {
        imageStatus = "/images/Icon/in-the-kitchen.png";
      }
      if (orderList.status == "Order Place") {
        imageStatus = "/images/Icon/order-placed.png";
      }
      if (orderList.status == "Serving") {
        imageStatus = "/images/Icon/serving.png";
      }

      x.innerHTML += `<div class="row ">
      <div class="col-5">
        <div class="status-table">
          <div class="name-status">โต๊ะ (Table)</div>
          <div class="main-status">${tableName}</div>
        </div>
      </div>
      <div class="col-5 ">
        <div class="status-time">
          <div class="name-status">เสิร์ฟ (Serving time)</div>
          <div class="main-status">${testTime}</div>
        </div>
      </div>
      <div class="col-2">
          <img class="status-logo" src="${imageStatus}">
      </div>
    </div>`;
    }
  });
}

function tableToChunk(arr) {
  return arr.reduce((all, one, i) => {
    const ch = Math.floor(i / perChunk);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);
}

function showSlider() {
  let x = document.getElementById("show-slide");

  for (let index = 0; index < getSlideList.length; index++) {
    const element = getSlideList[index];

    const image = element.image_path;
    const titleimg = element.description;

    if (index === 0) {
      x.innerHTML += `<div class="carousel-item active" data-bs-interval="30000">
      <img class="img-slider" src="${image}">
      <div class="wrapper-content">
        <div class="carousel-caption d-none d-md-block">
        <div class="menu-name">${titleimg}</div>
        </div>
      </div>
    </div>`;
    } else {
      x.innerHTML += `<div class="carousel-item" data-bs-interval="30000">
      <img class="img-slider" src="${image}">
      <div class="wrapper-content">
        <div class="carousel-caption d-none d-md-block">
        <div class="menu-name">${titleimg.toUpperCase()}</div>
        </div>
      </div>
    </div>`;
    }
  }
}

function showClockRealTime() {
  let d = new Date();
  let h = addZero(d.getHours());
  let m = addZero(d.getMinutes());
  let s = addZero(d.getSeconds());
  let day = addZero(d.getDate());
  let month = monthNames[d.getMonth()];
  let year = addZero(d.getFullYear());
  document.getElementById("timenow").innerHTML = h + ":" + m + ":" + s;
  document.getElementById("datenow").innerHTML = day + " " + month + " " + year;
}
setInterval("showClockRealTime()", 1000);

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

function showTextMessage() {
  document.getElementById("text-showmessage").innerHTML = textMessage;
}

async function getData() {
  const response = await fetch(
    "http://13.250.6.185/fb-system/public/api/guest/restaurants",
    {
      method: "GET",
    }
  );
  const result = await response.json();

  const res1 = result.data[1];
  console.log("rest2", res1);
  dataList = res1.room_or_tables;
  console.log("datalist_rest2", dataList);
  textMessage = res1.remark;

  getSlideList = res1.slides;

  showStatus();
  showSlider();
  showTextMessage();
}

function getPage() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  return params.page;
}

getData();

setInterval(() => {
  window.location.href = "index.html?page=" + (page + 1);
}, 1000 * 60);
