const seats = [
    "使用中",
    "空席",
    "使用中",
    "空席",
    "空席",
    "使用中"
];

console.log(seats);
const PASSWORD = "123456";

function login() {
  const pin = document.getElementById("pin").value;

  if (pin === PASSWORD) {
    document.getElementById("login").style.display = "none";
    document.getElementById("staff").style.display = "block";
  } else {
    alert("暗証番号が違います");
  }
}

function startSeat(no) {
  alert(no + "番打席を利用開始");
}

function endSeat(no) {
  alert(no + "番打席を利用終了");
}
