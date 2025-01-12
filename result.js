let canvas;

//sessionStorageに保存したデータを取得
let topText = sessionStorage.getItem("topData");

//文字列を数字にする
let topNum = Number(topText);

let sideText = sessionStorage.getItem("sideData");
let sideNum = Number(sideText);

let tsubaText = sessionStorage.getItem("tsubaData");
let tsubaNum = Number(tsubaText);

let topDansuu = Math.round(topNum * 0.17);//0.06のとこは後で変える！//四捨五入
let topDansuuOffset = topDansuu + 1;
let sideDansuu = Math.round(sideNum * 0.17);
let tsubaDansuu = Math.round(tsubaNum * 0.17);
console.log(topNum);
console.log(sideDansuu);



//表作成
// 表データをJavaScript変数に格納
const tableData = [
  ["", "段数", "増し目"],
  ["トップ", topDansuu, ""],
  ["サイド", sideDansuu, ""],
  ["つば", tsubaDansuu, ""]
];

// 表を描画する関数
function renderTable(data) {
  const table = document.getElementById("data-table");
  table.innerHTML = ""; // 既存の表をクリア

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr"); // 行を作成

    row.forEach((cell) => {
      const cellElement = rowIndex === 0 ? document.createElement("th") : document.createElement("td");
      cellElement.textContent = cell; // セルにデータを設定
      tr.appendChild(cellElement); // 行にセルを追加
    });

    table.appendChild(tr); // テーブルに行を追加
  });
}

// 初期表示
renderTable(tableData);

//編み図のサイズ
const size = 6;
const centerCircleSize = size * 6;
const halfSize = size / 2;
const amimes = [
  [0],//1段目
];

//トップ（2段目以降）の配列作成
for (let i = 1; i < topDansuu; i++) {
  let amime = new Array(i)
  amimes.push(amime);

  if (amime.length % 2 == 0) {
    for (let a = 0; a < amime.length - 1; a++) {
      amime[a] = 0;
    }
    amime[amime.length - 1] = 1;

  } else {
    for (let a = 0; a < amime.length; a++) {
      let m = (amime.length / 2) - 1 / 2;

      if (a == m) {
        amime[a] = 1;
      } else {
        amime[a] = 0;
      }

    }
  }
}

//サイドの配列作成
for (let i = 0; i < sideDansuu; i++) {
  let amime = new Array(topDansuu - 1);
  for (let a = 0; a < amime.length; a++) {
    amime[a] = 0;
  }
  amimes.push(amime);
}

//つばの配列作成
for (let i = topDansuu; i < topDansuu + tsubaDansuu; i++) {
  let amime = new Array(i);
  //  for(let a = 0; a < amime.length; a ++){
  //   amime[a] = 0;
  // }
  amimes.push(amime);

  if (amime.length % 2 == 0) {
    for (let a = 0; a < amime.length - 1; a++) {
      amime[a] = 0;
    }
    amime[amime.length - 1] = 1;
  } else {
    for (let a = 0; a < amime.length; a++) {
      let m = (amime.length / 2) - 1 / 2;
      if (a == m) {
        amime[a] = 1;
      } else {
        amime[a] = 0;
      }
    }
  }
}

// console.log(amimes);//コンソール出力




//一度だけ実行
function setup() {
  canvas = createCanvas(windowWidth - 300, windowHeight - 30);
  canvas.class("canvas");
  angleMode(DEGREES);

}


function koma(x, y, angle) {
  // const size = 10;
  // const halfSize = size / 2;
  push();
  translate(x, y);
  rotate(angle);
  line(-halfSize, -halfSize, halfSize, halfSize);
  line(halfSize, -halfSize, -halfSize, halfSize);
  pop();
}

function mashime(x, y, angle) {
  // const size = 10;
  // const halfSize = size / 2;
  const offset = 2;

  push();
  translate(x, y);
  rotate(angle);
  strokeWeight(1.5);
  line(-halfSize, -halfSize, halfSize, halfSize);
  line(halfSize, -halfSize, -halfSize, halfSize);
  line(-offset - size, 0, -offset, -size);
  line(-offset - size, 0, -offset, size);
  pop();
}

function drawAmime(x, y, phi, amime) {
  if (amime === 0) {
    koma(x, y, phi);
  } else if (amime === 1) {
    mashime(x, y, phi);
  }
}

function drawAmimes(amimes, phi, r) {
  for (const [i, amime] of amimes.entries()) {
    const angle = phi + map(i, -1, amimes.length, 30, -30);
    const x = r * cos(angle);
    const y = r * sin(angle);
    drawAmime(x, y, angle, amime);
  }
}





//繰り返し実行
function draw() {
  // background(220);
  clear();
  translate(width - 50, height - 50);//50ってのは適当です
  noFill();

  push();
  text("aiueo", 200, 200);
  textSize(200);
  fill(0);
  pop();

  //帽子の枠組の定義
  let topMax = topDansuuOffset * (size * 6);//この6ってどっかと繋がってる？
  let sideMax = topMax + sideDansuu * (size * 6);
  let rMax = sideMax + tsubaDansuu * (size * 6);
  let lineMax = rMax / 2;
  let centerLine = centerCircleSize / 2;

  //線の描写
  line(centerCircleSize * cos(180), centerCircleSize * sin(180), lineMax * cos(180), lineMax * sin(180));

  line(centerCircleSize * cos(240), centerCircleSize * sin(240), lineMax * cos(240), lineMax * sin(240));


  //中心の六等分の線の描写
  for (let phi = 0; phi <= 360; phi += 60) {
    line(centerLine * cos(phi), centerLine * sin(phi), centerCircleSize * cos(phi), centerCircleSize * sin(phi));
  }

  //「わ」の描写
  push();
  strokeWeight(2);
  circle(0, 0, centerCircleSize);
  pop();
  //一段目の円の描写
  circle(0, 0, centerCircleSize * 2);

  //他の円弧の描写
  for (let r = centerCircleSize * 3; r <= rMax; r += centerCircleSize) {
    if ((r == topMax) || (r == sideMax) || (r == rMax)) {
      push();
      strokeWeight(2);
      arc(0, 0, r, r, 180, 240);
      pop();
    } else {
      arc(0, 0, r, r, 180, 240);
    }
  }

  //立ち上がり記号と引き抜き記号の描写
  for (let r = centerCircleSize / 2 + (3 / 2) * size; r < rMax / 2; r += 3 * size) {
    push();
    rotate(-30);
    ellipse(0, -r, size, size * 2);
    fill('black');
    ellipse(0 + 5, -r - 7, size / 2, size / 2);
    pop();
  }

  //編み図記号の描写
  for (let i = 1; i < topDansuuOffset + sideDansuu + tsubaDansuu; i++) {
    let centerOffset = centerCircleSize * (3 / 4)
    let r = centerOffset + (centerCircleSize / 2) * (i - 1);
    let arrayNumber = ((r - centerOffset) / (centerCircleSize / 2));

    if (r == centerOffset) {
      for (phi = 30; phi < 390; phi += 60) {
        drawAmimes(amimes.at(arrayNumber), phi, r);
      }
    } else {
      for (let phi = 210; phi < 270; phi += 60) {
        drawAmimes(amimes.at(arrayNumber), phi, r);
      }
    }
  }
  
}
