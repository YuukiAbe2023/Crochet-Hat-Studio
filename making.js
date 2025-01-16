//これはグローバル変数のはず
let standardSize = 100;
let sideSlider;
let tsubaSlider;

let newWin;
let matsu1;
let matsu2;
let matsu3;




const BUTTON_CLICK_EVENT= document.getElementById('amizu_btn');

let x;
let y; 
let z;

let topSize;
let sideSize;
let tsubaSize;

let scale = 5;


var pass=function(){
  // alert('(^-^)');

    matsu1 = standardSize;
    var num1 = matsu1;
    //sessionStorageにデータを保存
    sessionStorage.setItem("topData", matsu1);
    
    matsu2 = sideSlider.value;
    var num2 = matsu2;
    sessionStorage.setItem("sideData", matsu2);
    
    matsu3 = tsubaSlider.value;
    var num3 = matsu3;
    sessionStorage.setItem("tsubaData", matsu3);
    
}

// ボタン選択（選択された値を保持する変数）
let selectedValue = 1;//初期値は１倍

function selectSize(selectedButton, size, value) {
    // 全てのボタンの選択状態をリセット
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => button.classList.remove("active"));

    // クリックされたボタンを選択状態に設定
    selectedButton.classList.add("active");

    // 選択された値を更新
    selectedValue = value;

}


//ゲージの取得
function getGauge() {
  // 入力ボックスの値を取得
  const inputElement = document.getElementById('gauge-input');
  const gauge = inputElement.value;

  // 数字を出力
  if (gauge) {
      console.log(`入力された数字は: ${gauge}`);
      document.getElementById('output').innerText = `入力された数字: ${gauge}`;
  } else {
      console.log('数字が入力されていません。');
      document.getElementById('output').innerText = '数字が入力されていません。';
  }
}


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



function setup() {
  let container = document.getElementById('canvas-container');
  // let canvas = createCanvas(windowWidth*0.5, windowHeight*0.9, WEBGL);
  let modelCanvas = createCanvas(700, 700, WEBGL);
  modelCanvas.parent(container); // canvasをcontainerの中に入れる

  angleMode(DEGREES);
  
  // topSlider = document.getElementById('topSlider');
  sideSlider = document.getElementById('sideSlider');
  tsubaSlider = document.getElementById('tsubaSlider');
  
}





function draw() {

  background(255);
  orbitControl(1,1,1);//マウスの動きに対する感度。1は初期値。
  // line(-350, -350, 350, -350);
  // line(-350, -350, -350, 350);
  // line(350, 350, -350, 350);
  // line(350, -350, 350, 350);
  

  rotateX(250);
  rotateY(-20);
  
  
  topSize = standardSize * selectedValue;
  // let topSize = Math.round(100 * selectedValue);
  sideSize = (Math.round((parseInt(sideSlider.value) * selectedValue)/scale)) * scale;
  tsubaSize = (Math.round((parseInt(tsubaSlider.value) * selectedValue)/scale)) * scale;
  
  // console.log(sideSize);
  
  let start=(Math.round((sideSize/1)/5))*5//中心からずらすため


  // vertex配列をつくる
  //トップクラウン
  const topVertex = [];
  for(let r = 0; r <= topSize; r += scale){ // 半径を10ずつ増やす
    topVertex.push([]); // 二次元配列にする
    
    for(let phi =0; phi<360; phi+=5){
      const x=r*cos(phi);
      const y=r*sin(phi);
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
             x = topSize * cos(phi);
             y = topSize * sin(phi);
             z = h2;
      }else if(h2 >(sideSize - 15) && h2<= (sideSize - 10)){
             x = (topSize + 2) * cos(phi) ;
             y = (topSize + 2) * sin(phi);
             z = h2;
               
      }else if(h2 >(sideSize - 10) && h2<= (sideSize - 5)){
             x = (topSize + 5) * cos(phi) ;
             y = (topSize +5) * sin(phi);
             z = h2;
      }else{
        x = (topSize + 10) * cos(phi) ;
             y = (topSize + 10) * sin(phi);
             z = h2;
             console.log(h2);
      }
             

             sideVertex.at(-1).push({x, y, z}); // 二次元配列の最後に追加 
          }    
    }
    
  //つば
  const tsubaVertex = [];
  for(let r = topSize; r <= tsubaSize + topSize; r += scale){ // 半径を5ずつ増やす
    tsubaVertex.push([]); // 二次元配列にする
    
    for(let phi = 0; phi < 360; phi += 5){ // 角度を5度ずつ増やす
             let x = (r+10) * cos(phi);
             let y = (r+10) * sin(phi);
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
          beginShape();
          fill(242, 146, 97);
          stroke(193, 87, 35);
          strokeWeight(0.5);
          vertex(vertices[r][phi].x, vertices[r][phi].y, vertices[r][phi].z);
          vertex(vertices[r + 1][phi].x, vertices[r + 1][phi].y, vertices[r + 1][phi].z);
          vertex(vertices[r + 1][phi + 1].x, vertices[r + 1][phi + 1].y, vertices[r + 1][phi + 1].z);
          vertex(vertices[r][phi + 1].x, vertices[r][phi + 1].y, vertices[r][phi + 1].z);
          endShape(CLOSE);
        } else if (r < vertices.length - 1 && phi === vertices[r].length - 1) {
          beginShape();
          vertex(vertices[r][phi].x, vertices[r][phi].y, vertices[r][phi].z);
          vertex(vertices[r][0].x, vertices[r][0].y, vertices[r][0].z);
          vertex(vertices[r + 1][0].x, vertices[r + 1][0].y, vertices[r + 1][0].z);
          vertex(vertices[r + 1][phi].x, vertices[r + 1][phi].y, vertices[r + 1][phi].z);
          endShape(CLOSE);
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

