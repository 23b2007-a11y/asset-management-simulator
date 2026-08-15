let simulated = false;
let simulationRound = 1;
let chart1 = null;
let chart2 = null;
let firstPattern = true;
let pattern1Done = false;
let pattern2Done = false;

// --------------------
// 初期化
// --------------------
showScreen("home");

// --------------------
// 画面制御
// --------------------
function hideAll() {
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });
}

function showScreen(id) {
  hideAll();
  document.getElementById(id).style.display = "block";
}

// --------------------
// シミュレーター
// --------------------
//パターン１
function setPattern1(){
  
  firstPattern = true;

  document.getElementById("initial").value = 100;
  document.getElementById("monthly").value = 3;
  document.getElementById("years").value = 30;

  document.getElementById("stock").value = 90;
  document.getElementById("fund").value = 10;
  document.getElementById("cash").value = 0;

  updateSliders();
}

//パターン２
function setPattern2(){

  firstPattern = false;

  document.getElementById("initial").value = 100;
  document.getElementById("monthly").value = 3;
  document.getElementById("years").value = 30;

  document.getElementById("stock").value = 0;
  document.getElementById("fund").value = 10;
  document.getElementById("cash").value = 90;

  updateSliders();
}

// --------------------
// ２回目のシミュレーター
// --------------------
function nextSimulation() {

  simulationRound = 2;
  simulated = false;

  document.getElementById("eventMessage1").style.display = "none";
  document.getElementById("eventMessage2").style.display = "none";
  
  document.getElementById("pattern1Box").style.display="none";
  document.getElementById("pattern2Box").style.display="none";

  document.getElementById("simTitle").innerText = "シミュレーター（2回目）";
  document.getElementById("firstGuide").style.display = "none";
  document.getElementById("sampleBox").style.display = "block";
  document.getElementById("reasonArea").style.display="none";

  document.getElementById("reasonBtn").style.display="block";
  document.getElementById("runBtn").style.display="none";

  document.getElementById("chartArea").style.display = "none";
  document.getElementById("chartArea2").style.display = "none";

  //初期値
  document.getElementById("initial").value = 100;
  document.getElementById("monthly").value = 1;
  document.getElementById("years").value = 10;

  document.getElementById("stock").value = 50;
  document.getElementById("fund").value = 30;
  document.getElementById("cash").value = 20;

  updateSliders()

  if (chart1) {
    chart1.destroy();
    chart1 = null;
  }

  if (chart2) {
      chart2.destroy();
      chart2 = null;
  }

  alert("これから2回目のシミュレーターを行います。");

  document.getElementById("nextBtn").disabled = true;
  document.getElementById("nextBtn").style.display="none";

  showScreen("simulator");

  const right = document.querySelector(".right");

  right.insertBefore(
    document.getElementById("reasonArea"),
    document.getElementById("chartArea")
  );

  right.insertBefore(
    document.getElementById("chartArea"),
    document.getElementById("reflectionArea")
  );
}

// --------------------
// 判断理由入力
// --------------------
function goReason(){

    document.getElementById("reasonArea").style.display="block";
    document.getElementById("reasonBtn").style.display="none";
    document.getElementById("runBtn").style.display="block";
    document.getElementById("nextBtn").style.display = "block";
    document.getElementById("reflectionArea").style.display="none";
}

// --------------------
// シミュレーター実行
// --------------------
function runSimulation() {

  if(simulationRound===2){
    saveDecision();
  }

  if (simulationRound === 2) {
    if (!checkDecision()) {
        return;
    }
  }
  const initial = Number(document.getElementById("initial").value);
  const monthly = Number(document.getElementById("monthly").value);
  const years = Number(document.getElementById("years").value);

  const stock = Number(document.getElementById("stock").value);
  const fund = Number(document.getElementById("fund").value);
  const cash = Number(document.getElementById("cash").value);

  // 合計チェック
  if (stock + fund + cash !== 100) {
    alert("割合の合計を100にしてください");
    return;
  }

  //設定例 非表示
  if (simulationRound === 1) {
    document.getElementById("sampleBox").style.display = "none";
  }
  const stockRatio = stock / 100;
  const fundRatio = fund / 100;
  const cashRatio = cash / 100;

  let total = initial;

  // 現在の資産を入れる
  let data = [initial];
  let labels = ["現在"];

  ///// 株式割合によるタイプ分け /////
  let type = "";
  let normalReturn = 1 + stockRatio * 0.07 + fundRatio * 0.04 + cashRatio * 0.01;
  let crashReturn = 1;

  // 安全重視
  if (stock <= 20) {
    type = "安全重視";
    normalReturn = 1.03;
    crashReturn = 0.97;
  }

  // やや保守的
  else if (stock <= 40) {
    type = "やや保守的";
    normalReturn = 1.05;
    crashReturn = 0.92;
  }

  // バランス型
  else if (stock <= 60) {
    type = "バランス型";
    normalReturn = 1.07;
    crashReturn = 0.85;
  }

  // 積極運用
  else if (stock <= 80) {
    type = "積極運用";
    normalReturn = 1.09;
    crashReturn = 0.75;
  }

  // 高リスク
  else {
    type = "高リスク";
    normalReturn = 1.12;
    crashReturn = 0.60;
  }

  //景気メッセージ
  const crashYear = 5;

  let eventText = "【市場状況】市場は比較的安定して推移しました";

  // --------------------
  // イベント等
  // --------------------

  for (let i = 1; i <= years; i++) {

    // 毎年積立
    total += monthly * 12;

    // 通常時
    let yearlyReturn = normalReturn;
    // パターン1だけランダム
    if(simulationRound === 1 && firstPattern){
      const r = Math.random();
      if(r < 0.35){
        yearlyReturn = 0.5;
      }else{
        yearlyReturn = 1.8;
      }
    } else{
      if(i === crashYear){
        yearlyReturn = crashReturn;
      }
    }


    total = total * yearlyReturn;

    data.push(Math.round(total));

    labels.push(i + "年目");
  }

  //
  if (simulationRound === 1) {
    if(firstPattern){
      document.getElementById("chartArea").style.display = "block";
      drawChart("chart1", data, labels);
      document.getElementById("eventMessage1").innerText = eventText;
      document.getElementById("eventMessage1").style.display = "block";
    }else {
      document.getElementById("chartArea2").style.display = "block";
      drawChart("chart2", data, labels);
      document.getElementById("eventMessage2").innerText = eventText;
      document.getElementById("eventMessage2").style.display = "block";
    }
  } else{
    document.getElementById("chartArea").style.display = "block";
      drawChart("chart1", data, labels);
    }

  // 判断理由表示
  if (simulationRound === 2) {
    document.getElementById("reflectionArea").style.display = "block";
    document.getElementById("nextBtn").disabled = false;
    document.getElementById("runBtn").style.display="none";

    // 設定を編集できなくする
    document.getElementById("initial").readOnly = true;
    document.getElementById("monthly").readOnly = true;
    document.getElementById("years").readOnly = true;

    document.getElementById("stock").disabled = true;
    document.getElementById("fund").disabled = true;
    document.getElementById("cash").disabled = true;

    // 判断理由を編集不可にする
    for(let i=1;i<=5;i++){
        document.getElementById("reason"+i).readOnly = true;
    }
  }

  simulated = true;

  if(firstPattern){
    pattern1Done = true;
  }else{
    pattern2Done = true;
  }

  if(pattern1Done && pattern2Done){
    document.getElementById("nextBtn").disabled = false;
  }
}

// --------------------
// グラフ
// --------------------
function drawChart(canvasId, data, labels){
  const ctx = document.getElementById(canvasId);

  if(canvasId === "chart1"){

    if(chart1){
      chart1.destroy();
    }
        
    chart1 = new Chart(ctx, {
      type: "line",

      data: {
              labels: labels,
              datasets: [{
                  label: "資産（万円）",
                  data: data
              }]
      },
      options: {
        responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "投資期間（年）"
              }
            },
            y: {
              title: {
                display: true,
                text: "資産（万円）"
              }
             }
          }
      }
    });

    } else{

      if(chart2) {
        chart2.destroy();
      }
      
        chart2 = new Chart(ctx, {
        type: "line",

        data: {
          labels: labels,
            datasets: [{
              label: "資産（万円）",
              data: data
            }]
        },

        options: {
          responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                    text: "投資期間（年）"
                }
              },
              y: {
                title: {
                  display: true,
                  text: "資産（万円）"
                }
              }
            }
        }
      });
  }
}

const stockSlider = document.getElementById("stock");
const fundSlider = document.getElementById("fund");
const cashSlider = document.getElementById("cash");

const stockValue = document.getElementById("stockValue");
const fundValue = document.getElementById("fundValue");
const cashValue = document.getElementById("cashValue");

// --------------------
// スライダー
// --------------------
function updateSliders(changed) {

  let stock = Number(stockSlider.value);
  let fund = Number(fundSlider.value);
  let cash = Number(cashSlider.value);

  let total = stock + fund + cash;

  // ％バー　超えた分を他から減らす
  if (total > 100) {

    let excess = total - 100;

    if (changed === "stock") {
      if (fund >= excess) {
        fund -= excess;
      } else {
        cash -= (excess - fund);
        fund = 0;
      }
    }

    else if (changed === "fund") {
      if (cash >= excess) {
        cash -= excess;
      } else {
        stock -= (excess - cash);
        cash = 0;
      }
    }

    else if (changed === "cash") {
      if (stock >= excess) {
        stock -= excess;
      } else {
        fund -= (excess - stock);
        stock = 0;
      }
    }
  }

  stockSlider.value = stock;
  fundSlider.value = fund;
  cashSlider.value = cash;

  stockValue.innerText = stock;
  fundValue.innerText = fund;
  cashValue.innerText = cash;

  const totalDisplay = document.getElementById("totalDisplay");
  const totalPercent = stock + fund + cash;

  totalDisplay.innerText = "合計：" + totalPercent + "%";

  if (totalPercent === 100) {
    totalDisplay.style.color = "blue";
  } else {
    totalDisplay.style.color = "red";
  }
}

stockSlider.addEventListener("input", () => updateSliders("stock"));
fundSlider.addEventListener("input", () => updateSliders("fund"));
cashSlider.addEventListener("input", () => updateSliders("cash"));

function goDecision() {

  const stock = Number(document.getElementById("stock").value);
  const fund = Number(document.getElementById("fund").value);
  const cash = Number(document.getElementById("cash").value);

  // 合計100チェック
  if (stock + fund + cash !== 100) {
    alert("割合を100%にしてください");
    return;
  }

  showScreen("decision");

}

// --------------------
// 判断理由入力チェック
// --------------------
function checkDecision() {
  const reason1 = document.getElementById("reason1").value.trim();
  const reason2 = document.getElementById("reason2").value.trim();
  const reason3 = document.getElementById("reason3").value.trim();
  const reason4 = document.getElementById("reason4").value.trim();
  const reason5 = document.getElementById("reason5").value.trim();

  const answers = [
    reason1,
    reason2,
    reason3,
    reason4,
    reason5
  ];

  // 未入力チェック
  for (let i = 0; i < answers.length; i++) {

    if (answers[i] === "") {
      alert((i + 1) + "つ目の項目を入力してください");
      return false;
    }

    // 文字数チェック
    if (answers[i].length < 50 || answers[i].length > 500) {
      alert((i + 1) + "つ目の項目は50〜500文字で入力してください");
      return false;
    }
  }
  return true;
}

// --------------------
// 振り返り入力チェック
// --------------------
function checkReflection() {
  const reflection1 = document.getElementById("reflection1").value.trim();
  const reflection2 = document.getElementById("reflection2").value.trim();
  const reflection3 = document.getElementById("reflection3").value.trim();

  const answers = [
    reflection1,
    reflection2,
    reflection3
  ];

  // 未入力・文字数チェック
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === "") {
      alert((i + 1) + "つ目の振り返りを入力してください");
      return false;
    }
    if (answers[i].length < 50 || answers[i].length > 500) {
      alert((i + 1) + "つ目の振り返りは50〜500文字で入力してください");
      return false;
    }
  }
  return true;
}

// --------------------
// 判断理由保存
// --------------------
function saveDecision() {

  const reason1 = document.getElementById("reason1").value.trim();
  const reason2 = document.getElementById("reason2").value.trim();
  const reason3 = document.getElementById("reason3").value.trim();
  const reason4 = document.getElementById("reason4").value.trim();
  const reason5 = document.getElementById("reason5").value.trim();

  fetch("SaveCSVServlet", {
  method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      stock: document.getElementById("stock").value,
      fund: document.getElementById("fund").value,
      cash: document.getElementById("cash").value,

      reason1: reason1,
      reason2: reason2,
      reason3: reason3,
      reason4: reason4,
      reason5: reason5
    })
  });
}

// --------------------
// 保存
// --------------------
function saveReflection(){
    const reason1 = document.getElementById("reason1").value;
    const reason2 = document.getElementById("reason2").value;
    const reason3 = document.getElementById("reason3").value;
    const reason4 = document.getElementById("reason4").value;
    const reason5 = document.getElementById("reason5").value;

    const reflection1 = document.getElementById("reflection1").value;
    const reflection2 = document.getElementById("reflection2").value;
    const reflection3 = document.getElementById("reflection3").value;

    fetch("SaveCSVServlet",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            stock:document.getElementById("stock").value,
            fund:document.getElementById("fund").value,
            cash:document.getElementById("cash").value,

            reason1:reason1,
            reason2:reason2,
            reason3:reason3,
            reason4:reason4,
            reason5:reason5,

            reflection1:reflection1,
            reflection2:reflection2,
            reflection3:reflection3
        })
    });

    showScreen("feedback");
}

//「次へ」の動き
function nextButton() {
  if (simulationRound === 1) {
    nextSimulation();
  } else if (simulationRound === 2) {
    // 振り返りの入力チェック
    if (!checkReflection()) {
      return;
    }
    saveDecision();
    saveReflection();
  }
}

// 判断理由の文字数カウント
for (let i = 1; i <= 5; i++) {

  const textarea = document.getElementById("reason" + i);
  const counter = document.getElementById("count" + i);

  textarea.addEventListener("input", function () {

    const length = this.value.length;

    counter.textContent = length + " / 500文字";

    if (length < 50) {
      counter.style.color = "red";
    } else {
      counter.style.color = "green";
    }

  });
}

// --------------------
// 振り返りの文字数カウント
// --------------------
for (let i = 1; i <= 3; i++) {

  const textarea = document.getElementById("reflection" + i);
  const counter = document.getElementById("reflectionCount" + i);

  textarea.addEventListener("input", function () {

    const length = this.value.length;

    counter.textContent = length + " / 500文字";

    if (length < 50) {
      counter.style.color = "red";
    } else {
      counter.style.color = "green";
    }

  });
}

// --------------------
// ２回目のフィードバック
// --------------------



// --------------------
// 事後テスト
// --------------------
// 正解
const posttestAnswers = [
  true,   // Q1
  false,  // Q2
  true,   // Q3
  false,  // Q4
  true,   // Q5
  true,   // Q6
  true,   // Q7
  false,  // Q8
  true,   // Q9
  false,  // Q10
  false,  // Q11
  false,  // Q12
  true,   // Q13
  false,  // Q14
  true    // Q15
];

// 回答を保存
let posttestUserAnswers = {};

// ○・×を選択したとき
function answerPosttest(questionNumber, answer) {
  posttestUserAnswers[questionNumber] = answer;
  // 選択したボタンを分かりやすくする
  const question = document.querySelectorAll(".test-question")[questionNumber - 1];
  const buttons = question.querySelectorAll("button");

  // 両方を初期状態に戻す
  buttons[0].style.backgroundColor = "";
  buttons[0].style.color = "";

  buttons[1].style.backgroundColor = "";
  buttons[1].style.color = "";

  if (answer === true) {
    // ○を選択 → 濃い青
    buttons[0].style.backgroundColor = "#1976d2";
    buttons[0].style.color = "white";
  } else {
    // ×を選択 → 赤
    buttons[1].style.backgroundColor = "#e53935";
    buttons[1].style.color = "white";
  }
}

// 回答を確定
function finishPosttest() {
  // 未回答チェック
  for (let i = 1; i <= 15; i++) {
    if (posttestUserAnswers[i] === undefined) {
      alert("Q" + i + "に回答してください。");
      return;
    }
  }
  // 採点
  let score = 0;
  for (let i = 1; i <= 15; i++) {
    if (posttestUserAnswers[i] === posttestAnswers[i - 1]) {
      score++;
    }
  }
  // 保存
  localStorage.setItem(
    "posttestAnswers",
    JSON.stringify(posttestUserAnswers)
  );
  localStorage.setItem("posttestScore", score);
  // 合計点数
  document.getElementById("finalResult").innerHTML = `
    <div class="score-box">
      <p>あなたの得点</p>
      <strong>${score} / 15点</strong>
    </div>
  `;
  // 問題ごとの結果を表示
  const questions = document.querySelectorAll(".test-question");

  let reviewHTML = "";

  for (let i = 1; i <= 15; i++) {
    const questionText =
      questions[i - 1].querySelector("p").textContent;
    const userAnswer =
      posttestUserAnswers[i];
    const correctAnswer =
      posttestAnswers[i - 1];
    const isCorrect =
      userAnswer === correctAnswer;

    reviewHTML += `
      <div class="review-question ${isCorrect ? "correct" : "incorrect"}">

        <p class="review-question-text">
          ${questionText}
        </p>

        <p>
          <strong>あなたの回答：</strong>
          <span class="${isCorrect ? "answer-correct" : "answer-incorrect"}">
            ${userAnswer ? "○" : "×"}
          </span>
        </p>

        <p>
          <strong>正解：</strong>
          <span class="correct-answer">
          ${correctAnswer ? "○" : "×"}
          </span>
        </p>
      </div>
    `;
  }

  document.getElementById("answerReview").innerHTML = `
    <h3 class="review-title">問題と解答</h3>
    <p class="review-note">
      ※青い枠はあなたの回答が「正解」、赤い枠はあなたの回答が「不正解」を示しています。
    </p>
    ${reviewHTML}
  `;
  // 結果画面へ
  showScreen("posttestresult");
}