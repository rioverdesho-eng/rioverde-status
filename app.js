import { db } from "./Firebase.js";
import {
  ref,
 set,
  onValue
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

  const endTime = Date.now() + 1* 60 * 1000;

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

// リアルタイム更新
onValue(ref(db, "seats"), (snapshot) => {

  const data = snapshot.val();

  if (!data) return;

  for (let i = 1; i <= 6; i++) {

    const text = document.getElementById("seat" + i);
    const card = document.getElementById("card" + i);

    if (!text) continue;

    const status = data[i]?.status || "空席";

    text.textContent = status;

    if (card) {

      if (status === "使用中") {
        card.classList.add("occupied");
        card.classList.remove("available");
      } else {
        card.classList.add("available");
        card.classList.remove("occupied");
      }

    }

  }

});
// 自動で終了時間をチェック
function checkEndTime(data) {

  if (!data) return;

  for (let i = 1; i <= 6; i++) {

    if (!data[i]) continue;

    if (
      data[i].status === "使用中" &&
      data[i].endTime > 0 &&
      Date.now() >= data[i].endTime
    ) {

      set(ref(db, "seats/" + i), {
        status: "空席",
        course: 0,
        endTime: 0
      });

    }

  }

}

// 30秒ごとに1回だけデータを確認
setInterval(() => {

  const seatsRef = ref(db, "seats");

  onValue(seatsRef, (snapshot) => {
    checkEndTime(snapshot.val());
  }, {
    onlyOnce: true
  });

}, 30000);
