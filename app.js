import { db } from "./Firebase.js";
import {
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// 利用開始
window.startSeat = function(seatNo) {
  set(ref(db, "seats/" + seatNo), {
    status: "使用中",
    updated: Date.now()
  });
};

// 利用終了
window.endSeat = function(seatNo) {
  set(ref(db, "seats/" + seatNo), {
    status: "空席",
    updated: Date.now()
  });
};

// リアルタイム監視
onValue(ref(db, "seats"), (snapshot) => {
  const data = snapshot.val();
  console.log(data);

  if (!data) return;

  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById("seat" + i);
    if (!el) continue;

    el.textContent = data[i]?.status ?? "空席";
  }
});
