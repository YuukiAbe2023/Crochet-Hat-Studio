const standardSize = 100;
const amizuBtn= document.getElementById('amizuBtn');
const scale = 5;


let topNum;
let sideNum;
let tsubaNum;



var pass=function(){
  // alert('(^-^)');

    matsu1 = topSize;
    var num1 = matsu1;
    //sessionStorageにデータを保存
    sessionStorage.setItem("topData", matsu1);
    
    matsu2 = sideSize;
    var num2 = matsu2;
    sessionStorage.setItem("sideData", matsu2);
    
    matsu3 = tsubaSize;
    var num3 = matsu3;
    sessionStorage.setItem("tsubaData", matsu3);

    topNum=topSize;
    sideNum = sideSize;
    tsubaNum = tsubaSize;
//alert(sideNum);
    
}


//スライダーの値を取得
let sideSliderValue = 70; // スライダーの初期値
let tsubaSliderValue = 50;
const sideSlider = document.getElementById('sideRange');
const tsubaSlider = document.getElementById('tsubaRange');
  sideSlider.addEventListener('input', function() {
    sideSliderValue = sideSlider.value; // 値を取得して変数に保存
});
tsubaSlider.addEventListener('input', function() {
  tsubaSliderValue = tsubaSlider.value; // 値を取得して変数に保存
});




//サイズ選択ボタンの関数
let selectedValue = 1;//初期値は１倍
function selectSize(selectedButton, size, value) { //ここのsizeってなにか気になる
    // 全てのボタンの選択状態をリセット
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => button.classList.remove("active"));
    // クリックされたボタンを選択状態に設定
    selectedButton.classList.add("active");
    // 選択された値を更新
    selectedValue = value;
}


//ゲージスライダーの値の取得の関数
const gaugeSlider = document.getElementById('gaugeSlider');
    const gaugeSliderValue = document.getElementById('gaugeValue');

    // スライダーの値が変更されたときに値を更新
    gaugeSlider.addEventListener('input', () => {
      gaugeSliderValue.textContent = "ゲージの大きさ : " + gaugeSlider.value; // 値をリアルタイムで更新
    });


//３Dモデルに丸みをつける
function culculateZ(r, topSize,sideSize,ofset){
  const roundStart=topSize-20;//丸め始める位置
  const maxZ=10;//最大丸み
  const minZ = -ofset;//基本のzの高さ
  
  if (r<roundStart){
    return minZ;//丸ない範囲では一定
  }
  
  const normalizedR=(r-roundStart)/(topSize-roundStart);//0~1に正規化
  const t=Math.pow(normalizedR,3);//0~1の範囲で非線形に変化（平方で滑らかさを調整）
  return minZ+maxZ*t;//高さを計算 
}


  
//スケッチ
var s1 = function (sketch) {
  sketch.setup = function () {
    let makingCanvas = sketch.createCanvas(700, 700, sketch.WEBGL);
    let container = document.getElementById('canvas-container');
    makingCanvas.parent(container);
    sketch.angleMode(sketch.DEGREES);

    // let sideSlider = document.getElementById('sideSlider');
    // let tsubaSlider = document.getElementById('tsubaSlider');
    
  };


  sketch.draw = function () {
    //for canvas 1
    sketch.background(255);
    sketch.orbitControl(1,1,1);//マウスの動きに対する感度。1は初期値。
  // line(-350, -350, 350, -350);
  // line(-350, -350, -350, 350);
  // line(350, 350, -350, 350);
  // line(350, -350, 350, 350);

  sketch.rotateX(250);
  sketch.rotateY(-20);
    
  topSize = standardSize * selectedValue;
  // let topSize = Math.round(100 * selectedValue);

  sideSize = (Math.round((parseInt(sideSliderValue) * selectedValue)/scale)) * scale;
  tsubaSize = (Math.round((parseInt(tsubaSliderValue) * selectedValue)/scale)) * scale;
  
  
  
  const start=(Math.round((sideSize/1)/5))*5//中心からずらすため


  // vertex配列をつくる
  //トップクラウン
  const topVertex = [];
  for(let r = 0; r <= topSize; r += scale){ // 半径を10ずつ増やす
    topVertex.push([]); // 二次元配列にする
    
    for(let phi =0; phi<360; phi+=5){
      const x=r * sketch.cos(phi);
      const y=r * sketch.sin(phi);
      const z=culculateZ(r,topSize, sideSize,start);
      
      topVertex.at(-1).push({x, y, z}); // 二次元配列の最後に追加 
          }   
    }
  //サイドクラウン上半分
  const sideVertex = [];
  // for(let h = 0; h <= sideSize + (10) ; h += 5){
  //   sideVertex.push([]); // 二次元配列にする
    
  //   for(let phi = 0; phi < 360; phi += 5){ // 角度を10度ずつ増やす
  //            let x = topSize * cos(phi);
  //            let y = topSize * sin(phi);
  //            let z = h;

  //            sideVertex.at(-1).push({x, y, z}); // 二次元配列の最後に追加 
  //         }    
  //   }

  for(let h2 = -start+(scale*2); h2 <= sideSize; h2 += 10){ 
    sideVertex.push([]); // 二次元配列にする
    
    for(let phi = 0; phi < 360; phi += 5){ // 角度を10度ずつ増やす
      if(h2 <= (sideSize -15)){
             x = topSize * sketch.cos(phi);
             y = topSize * sketch.sin(phi);
             z = h2;
      }else if(h2 >(sideSize - 15) && h2<= (sideSize - 10)){
             x = (topSize + 2) * sketch.cos(phi) ;
             y = (topSize + 2) * sketch.sin(phi);
             z = h2;
               
      }else if(h2 >(sideSize - 10) && h2<= (sideSize - 5)){
             x = (topSize + 5) * sketch.cos(phi) ;
             y = (topSize +5) * sketch.sin(phi);
             z = h2;
      }else{
        x = (topSize + 10) * sketch.cos(phi) ;
             y = (topSize + 10) * sketch.sin(phi);
             z = h2;
            //  console.log(h2);
      }
             

             sideVertex.at(-1).push({x, y, z}); // 二次元配列の最後に追加 
          }    
    }
    
  //つば
  const tsubaVertex = [];
  for(let r = topSize; r <= tsubaSize + topSize; r += scale){ // 半径を5ずつ増やす
    tsubaVertex.push([]); // 二次元配列にする
    
    for(let phi = 0; phi < 360; phi += 5){ // 角度を5度ずつ増やす
             let x = (r+10) * sketch.cos(phi);
             let y = (r+10) * sketch.sin(phi);
             let z = (sideSize + r -topSize);
             tsubaVertex.at(-1).push({x, y, z}); // 二次元配列の最後に追加 
    }    
  }
  // console.log(hatVertex);
  
  //描写の関数
  function drawVertexShapes(vertices) {
    for (let r = 0; r < vertices.length; r++) {
      for (let phi = 0; phi < vertices[r].length; phi++) {
        if (r < vertices.length - 1 && phi < vertices[r].length - 1) {
          sketch.beginShape();
          sketch.fill(242, 146, 97);
          sketch.stroke(193, 87, 35);
          sketch.strokeWeight(0.5);
          sketch.vertex(vertices[r][phi].x, vertices[r][phi].y, vertices[r][phi].z);
          sketch.vertex(vertices[r + 1][phi].x, vertices[r + 1][phi].y, vertices[r + 1][phi].z);
          sketch.vertex(vertices[r + 1][phi + 1].x, vertices[r + 1][phi + 1].y, vertices[r + 1][phi + 1].z);
          sketch.vertex(vertices[r][phi + 1].x, vertices[r][phi + 1].y, vertices[r][phi + 1].z);
          sketch.endShape(sketch.CLOSE);
        } else if (r < vertices.length - 1 && phi === vertices[r].length - 1) {
          sketch.beginShape();
          sketch.vertex(vertices[r][phi].x, vertices[r][phi].y, vertices[r][phi].z);
          sketch.vertex(vertices[r][0].x, vertices[r][0].y, vertices[r][0].z);
          sketch.vertex(vertices[r + 1][0].x, vertices[r + 1][0].y, vertices[r + 1][0].z);
          sketch.vertex(vertices[r + 1][phi].x, vertices[r + 1][phi].y, vertices[r + 1][phi].z);
          sketch.endShape(sketch.CLOSE);
        }
      }
    }
  }
  
  //トップクラウンの描写
  drawVertexShapes(topVertex);
  // サイドクラウンの描写
  drawVertexShapes(sideVertex);
  // つばの描写
  drawVertexShapes(tsubaVertex);
    }
  };

// create a new instance of p5 and pass in the function for sketch 1
new p5(s1, "canvas-container");



//スライダーのデザイン
document.addEventListener('DOMContentLoaded', () => {
 
  // 全てのレンジスライダーの要素を取得（必要に応じてセレクタを変更）
  const rangeSliders = document.querySelectorAll('input[type="range"]');
  // Track の元の色
  const baseColor = '#fff';
  // Track のつまみの左側の部分の色
  const activeColor = '#000';
 
  // 取得したレンジスライダーの各要素に対して実行
  rangeSliders.forEach((slider) => {
    // input イベントのリスナーを設定
    slider.addEventListener('input', (e) => {
      // updateSlider を呼び出す
      updateSlider(e.target);
    });
    // updateSlider を実行して現在の値を反映
    updateSlider(slider);
  });
 

  // input イベントで呼び出される関数（トラックの塗りの範囲と色を設定する関数）
  function updateSlider(slider) {
    // max 属性の値が省略されている場合は100を設定
    if(!slider.max) {
      slider.max = 100;
    }
    // 現在の値から割合（%）を取得
    const progress = (slider.value / slider.max) * 100;
    // linear-gradient で Track の色を設定
    slider.style.background = `linear-gradient(to right, ${activeColor} ${progress}%, ${baseColor} ${progress}%)`;
  }
});


// let amizuCanvas;
let resultPage = document.getElementById('resultPage');
// sessionStorageに保存したデータを取得
let topText = sessionStorage.getItem("topData");

//文字列を数字にする

//--------------------------------------------------------------------------------------------------------------------------------

//let topNum = Number(topText);
//let topNum = topSize;

//let sideText = sessionStorage.getItem("sideData");
//let sideNum = Number(sideText);

//let tsubaText = sessionStorage.getItem("tsubaData");
//let tsubaNum = Number(tsubaText);


// let topDansuu = Math.round(topNum * 0.17);//0.06のとこは後で変える！//四捨五入
// let topDansuuOffset = topDansuu + 1;
// let sideDansuu = Math.round(sideNum * 0.17);
// let tsubaDansuu = Math.round(tsubaNum * 0.17);



let topDansuu;
let sideDansuu
let tsubaDansuu;
let topDansuuOffset;
//表の変数たち
let cols;
let rows ;//行数
let cellWidth; //セルの横幅
let cellHeight; //セルの高さ
let shiten;
let tableData; 
let keita;
let s2 = null;
let amizuCanvas;

amizuBtn.addEventListener("click", function(){
  if (s2) {
    // キャンバスを閉じる
    s2.remove(); // p5.js の remove() メソッドでキャンバスを削除
    s2 = null; // スケッチの参照をリセット
    } else{
      s2 = new p5((sketch) => {
      sketch.setup = function() {
        // amizuCanvas = sketch.createCanvas(canvasWidth, canvasHeight);
        amizuCanvas = sketch.createCanvas((sketch.windowHeight*0.9) * 1.414, sketch.windowHeight*0.9);
        amizuCanvas.class("amizuCanvas");
        amizuCanvas.parent("resultPage");
        sketch.angleMode(sketch.DEGREES);
      }

      topDansuu = Math.round(topNum * 0.17);//0.06のとこは後で変える！//四捨五入
topDansuuOffset = topDansuu + 1;
sideDansuu = Math.round(sideNum * 0.17);
tsubaDansuu = Math.round(tsubaNum * 0.17);
console.log(topDansuu);
console.log(sideDansuu);


cols = 2; //列数
rows = 4; //行数
cellWidth = 100; //セルの横幅
cellHeight = 50; //セルの高さ
shiten = 0;
tableData = [
  ["", "段数"],
  ["トップ", topDansuu ],
  ["サイド", sideDansuu ],
  ["つば", tsubaDansuu ]
];
  


  //関数この中に書いてみる
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
  
  function koma(x, y, angle) {
    // const size = 10;
    // const halfSize = size / 2;
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(angle);
    sketch.line(-halfSize, -halfSize, halfSize, halfSize);
    sketch.line(halfSize, -halfSize, -halfSize, halfSize);
    sketch.pop();
  }
  
  function mashime(x, y, angle) {
    // const size = 10;
    // const halfSize = size / 2;
    const offset = 2;
  
    sketch.push();
    sketch.translate(x, y);
    sketch.rotate(angle);
    sketch.strokeWeight(1.5);
    sketch.line(-halfSize, -halfSize, halfSize, halfSize);
    sketch.line(halfSize, -halfSize, -halfSize, halfSize);
    sketch.line(-offset - size, 0, -offset, -size);
    sketch.line(-offset - size, 0, -offset, size);
    sketch.pop();
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
      const angle = phi + sketch.map(i, -1, amimes.length, 30, -30);
      const x = r * sketch.cos(angle);
      const y = r * sketch.sin(angle);
      drawAmime(x, y, angle, amime);
    }
  }

  sketch.draw = function(){
    //for canvas 2
    // sketch.background(200);

    //for canvas 2
    // sketch.background(255);
    // sketch.translate(sketch.width - 50, sketch.height - 50);//50ってのは適当です

    
    sketch.push();
    //10の数字変えれば右上の隙間変わる。
    sketch.translate(sketch.width - cols*cellWidth - 10, 10);
    sketch.strokeWeight(1);
    sketch.textSize(16); // テキストサイズを設定
    sketch.textAlign(sketch.CENTER, sketch.CENTER);


    sketch.push();
    sketch.noStroke();
    sketch.fill(230);
    sketch.rect(shiten, shiten, cellWidth, cellHeight*rows)
    sketch.rect(shiten + cellWidth, shiten, cellWidth, cellHeight);
    sketch.fill(255);
    sketch.rect(shiten + cellWidth, shiten + cellHeight, cellWidth, cellHeight *(rows-1));
    sketch.pop();


    //表の外ふち
    sketch.push();
    sketch.noFill();
    sketch.rect(shiten, shiten, cellWidth * cols , cellHeight * rows);
    sketch.line(shiten + cellWidth, shiten, shiten + cellWidth, shiten + cellHeight*rows);//縦せん
    sketch.line(shiten, shiten + cellHeight, shiten + cellWidth*cols, shiten+ cellHeight);//横１
    sketch.line(shiten, shiten + 2*cellHeight, shiten + cellWidth*cols, shiten+ 2*cellHeight);//線２
    sketch.line(shiten, shiten + 3*cellHeight, shiten + cellWidth*cols, shiten+ 3*cellHeight);//線３
    sketch.pop();
    
    // セル内に文字を描く
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let x = j * cellWidth + cellWidth / 2; // セルの中心x座標
        let y = i * cellHeight + cellHeight / 2; // セルの中心y座標
        sketch.text(tableData[i][j], x, y); // テキストを描画
      }
    }
    sketch.pop();




    sketch.push();
    sketch.noFill();

    sketch.translate(sketch.width-60, sketch.height-50);
    
  //帽子の枠組の定義
  let topMax = topDansuuOffset * (size * 6);//この6ってどっかと繋がってる？
  let sideMax = topMax + sideDansuu * (size * 6);
  let rMax = sideMax + tsubaDansuu * (size * 6);
  let lineMax = rMax / 2;
  let centerLine = centerCircleSize / 2;

  //線の描写
  sketch.line(centerCircleSize * sketch.cos(180), centerCircleSize * sketch.sin(180), lineMax * sketch.cos(180), lineMax * sketch.sin(180));

  sketch.line(centerCircleSize * sketch.cos(240), centerCircleSize * sketch.sin(240), lineMax * sketch.cos(240), lineMax * sketch.sin(240));


  //中心の六等分の線の描写
  for (let phi = 0; phi <= 360; phi += 60) {
    sketch.line(centerLine * sketch.cos(phi), centerLine * sketch.sin(phi), centerCircleSize * sketch.cos(phi), centerCircleSize * sketch.sin(phi));
  }

  //「わ」の描写
  sketch.push();
  sketch.strokeWeight(2);
  sketch.circle(0, 0, centerCircleSize);
  sketch.pop();
  //一段目の円の描写
  sketch.circle(0, 0, centerCircleSize * 2);

  //他の円弧の描写
  for (let r = centerCircleSize * 3; r <= rMax; r += centerCircleSize) {
    if ((r == topMax) || (r == sideMax) || (r == rMax)) {
      sketch.push();
      sketch.strokeWeight(2);
      sketch.arc(0, 0, r, r, 180, 240);
      sketch.pop();
    } else {
      sketch.arc(0, 0, r, r, 180, 240);
    }
  }

  //立ち上がり記号と引き抜き記号の描写
  for (let r = centerCircleSize / 2 + (3 / 2) * size; r < rMax / 2; r += 3 * size) {
    sketch.push();
    sketch.rotate(-30);
    sketch.ellipse(0, -r, size, size * 2);
    sketch.fill('black');
    sketch.ellipse(0 + 5, -r - 7, size / 2, size / 2);
    sketch.pop();
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
  sketch.pop();
  sketch.noLoop();


  }//sketch.drawのカッコ
  document.getElementById("saveBtn").addEventListener("click", function() {
    sketch.saveCanvas(amizuCanvas,"amizu", "png");
  });
  
  
});//new p5のカッコ二つ

  resultPage.style.display = "flex"; // 表示
    }//elseのカッコ

});


//閉じる
document.getElementById("tojiru").addEventListener("click", function() {
  s2.remove(); // p5.js の remove() メソッドでキャンバスを削除
  s2 = null; // スケッチの参照をリセット
  resultPage.style.display="none";
});
