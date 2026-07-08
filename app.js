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
window.startSeat = async function (seatNo) {

  const course = document.getElementById("course" + seatNo);

  const minutes = Number(course.value);

  const endTime = Date.now() + minutes * 60 * 1000;

  await set(ref(db, "seats/" + seatNo), {
    status: "使用中",
    course: minutes,
    endTime: endTime
  });

};

// 利用終了
window.endSeat = async function (seatNo) {

  await set(ref(db, "seats/" + seatNo), {
    status: "空席",
    course: 0,
    endTime: 0
  });

};

// 画面更新
function updateDisplay(data) {

  if (!data) return;

  for (let i = 1; i <= 6; i++) {

    const seat = data[i];

    const seatText = document.getElementById("seat" + i);
    const card = document.getElementById("card" + i);
    const time = document.getElementById("time" + i);

    const status = seat?.status || "空席";

    if (seatText) {
      seatText.textContent = status;
    }

    if (card) {

      if (status === "使用中") {
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
          (seat.endTime - Date.now()) / 60000
        );

        time.textContent = "残り時間：" + remain + "分";

      } else {

        time.textContent = "残り時間：--";

      }

    }

  }

}
// Firebaseのデータをリアルタイムで監視
onValue(ref(db, "seats"), (snapshot) => {

  const data = snapshot.val();

  updateDisplay(data);

});

// 1秒ごとに残り時間を更新
setInterval(async () => {

  const snapshot = await get(ref(db, "seats"));

  const data = snapshot.val();

  if (!data) return;

  let updated = false;

  for (let i = 1; i <= 6; i++) {

    const seat = data[i];

    if (!seat) continue;

    if (
      seat.status === "使用中" &&
      seat.endTime > 0 &&
      Date.now() >= seat.endTime
    ) {

      await set(ref(db, "seats/" + i), {
        status: "空席",
        course: 0,
        endTime: 0
      });

      updated = true;
    }

  }

  if (!updated) {
    updateDisplay(data);
  }

}, 1000);
