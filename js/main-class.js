var PlwJs = (function () {
  var createTblRow = function (prntDivId, rowId, rowCls, rowCnt) {
    console.log(rowCnt);
    var rowNum = null,
        rowParent,
        rowEl,
        css;

    if (rowCnt & 1) {
      css = "width:477; height:33; background-color: beige; color: black";  
    } else {
      css = "width:477; height:33; background-color: white; color: black";
    }   
    console.log(css);
    rowParent = document.getElementById(prntDivId); 
    rowEl = document.createElement("div"); 
    rowEl.setAttribute("id", rowId);
    rowEl.setAttribute("class", rowCls);   
    rowEl.setAttribute("style", css);
        
    rowParent.append(rowEl);
  };
  
  var createTblSpan = function (prntDivId, spanId, spanCls, txtCntnt) {
    var spanParent,
        spanEl;
        
    // console.log(prntDivId);
    spanParent = document.getElementById(prntDivId);
    spanEl = document.createElement("span");
    
    spanEl.setAttribute("id", spanId);
    spanEl.setAttribute("class", spanCls);
    spanEl.textContent = txtCntnt;
    spanParent.append(spanEl);
    
    // console.log(spanParent);
  };
  
  return {
    createTblRow: createTblRow,
    createTblSpan: createTblSpan,
  }
})();

class Mortgage {
  constructor(principal, years, rate) {
    this.principal = principal;
    this.years = years;
    this.rate = rate;
  }
  
  get monthlyPayment() {
    let monthlyRate = this.rate / 100 / 12;
    return this.principal * monthlyRate / (1 - (Math.pow(1/(1 + monthlyRate), this.years * 12)));
  }
  
  get amortization() {
    let monthlyPayment = this.monthlyPayment;
    let monthlyRate = this.rate / 100 / 12;
    let balance = this.principal;
    let amortization = [];
    let rowCnt = 1;
    for (let y = 0; y < this.years; y++) {     
      let interestY = 0;
      let principalY = 0;
      for (let m = 0; m < 12; m++) {
        let interestM = balance * monthlyRate;
        let principalM = monthlyPayment - interestM;
        interestY = interestY + interestM;
        principalY = principalY + principalM;
        balance = balance - principalM;
      }
      amortization.push({rowCnt, principalY, interestY, balance});
      rowCnt++;
    }
    return {amortization, monthlyRate};
  }
}

var displayAmort = function () {
  
}

document.getElementById("calcBtn").addEventListener("click", () => {
    // CLEARS contents of div
    while(document.querySelector("#amortization").firstChild){
      document.querySelector("#amortization").removeChild(document.querySelector("#amortization").firstChild);
    }
    
    let principal = document.getElementById("principal").value;
    let years = document.getElementById("years").value;
    let rate = document.getElementById("rate").value;
    let mortgage = new Mortgage(principal, years, rate);
    document.getElementById("monthlyPayment").innerHTML = mortgage.monthlyPayment.toFixed(2);
    console.log(mortgage);
    document.getElementById("monthlyRate").innerHTML = (mortgage.amortization.monthlyRate * 100).toFixed(2);
    console.log(mortgage.amortization);
    
    mortgage.amortization.amortization.forEach((year, index) => {
      let cnt = 0;
      PlwJs.createTblRow("amortization", "amort" + index, "amortization", index + 1);
      for(let key in year) {
        let val = year[key];
        if (cnt != 0) {
          console.log(val);
          if (val < 0) {
            val = 0.00;
          }
          val = "$" + val.toFixed(2);
        }
        PlwJs.createTblSpan("amort" + index, key + index, key, val);
        cnt++;
      }         
    });    
});