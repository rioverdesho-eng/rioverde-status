
import { db } from "./Firebase.js";
import {
  ref,
  set,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const PASSWORD = "332211";

// ログイン
window.login = function () {

  const pin = document.getElementById("pin");

  if (!pin) return;

  if (pin.value === PASSWORD) {

    document.getElementById("login").style.display = "none";
    document.getElementById("staff").style.display = "block";

  } else {

    alert("暗証番号が違います");

  }

};

// 利用開始
window.startSeat = function (seatNo) {

  const course = document.getElementById("course" + seatNo);

  const minutes = Number(course.value);

  const endTime = Date.now() + minutes * 60 * 1000;

  set(ref(db, "seats/" + seatNo), {

    status: "使用中",
    course: minutes,
    endTime: endTime

  });

};

// 利用終了
window.endSeat = function (seatNo) {

  set(ref(db, "seats/" + seatNo), {

    status: "空席",
    course: 0,
    endTime: 0

  });

};

// 表示更新
function updateDisplay(data) {

  if (!data) return;

  for (let i = 1; i <= 6; i++) {

    const seat = data[i];

    const text = document.getElementById("seat" + i);
    const card = document.getElementById("card" + i);
    const time = document.getElementById("time" + i);

    if (text) {

      text.textContent = seat?.status || "空席";

    }

    if (card) {

      if (seat?.status === "使用中") {

        card.classList.add("occupied");
        card.classList.remove("available");

      } else {

        card.classList.add("available");
        card.classList.remove("occupied");

      }

    }

    if (time) {

      if (
        seat &&
        seat.status === "使用中" &&
        seat.endTime > Date.now()
      ) {

        const remain = Math.ceil(
          (
// Firebaseを監視
onValue(ref(db, "seats"), (snapshot) => {

  const data = snapshot.val();

  updateDisplay(data);

});

// 1秒ごとに残り時間を更新
setInterval(async () => {

  const snapshot = await get(ref(db, "seats"));

  const data = snapshot.val();

  if (!data) return;

  let changed = false;

  for (let i = 1; i <= 6; i++) {

    const seat = data[i];

    if (!seat) continue;

    if (
      seat.status === "使用中" &&
      seat.endTime <= Date.now()
    ) {

      await set(ref(db, "seats/" + i), {

        status: "空席",
        course: 0,
        endTime: 0

      });

      changed = true;

    }

  }

  if (!changed) {

    updateDisplay(data);

  }

}, 1000);
