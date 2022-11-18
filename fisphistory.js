("use strict");
(async function (e) {
  "use strict";
  document.querySelector("html").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.querySelector("#doSearch").click();
    }
  });
  let vProp = new DocumentFragment();
  let vPropCycles = new DocumentFragment();
  const data = await d3.csv(
    "https://raw.githubusercontent.com/NYCDOB/data_store/master/facadeLL11_v2.csv",
    (d) => {
      d.Address = `${d["House Number"]} ${d["Street Name"]}`;
      return d;
    }
  );
  function buildCard(e) {
    function fMakeEl(theval, thediv, theclass) {
      let vDivEl = document.createElement("div");
      vDivEl.innerText = theval;
      vDivEl.className = theclass;
      thediv.appendChild(vDivEl);
    }
    let _A = document.createElement("p");
    _A.innerText = e[0]["Address"];
    let _H = document.createElement("h3");
    _H.class = "col-xl-1";
    _H.appendChild(_A);
    vProp.appendChild(_H);
    let vVals = ["Bin", "Borough", "Block", "Lot"];
    vVals.forEach((colName, ndx) => {
      window["_Div" + ndx] = document.createElement("div");
      window["_Div" + ndx].className = "detailDiv row";
      fMakeEl(`${colName}:`, window["_Div" + ndx], "col-4");
      fMakeEl(`${e[0][colName]}`, window["_Div" + ndx], "col");
      vProp.appendChild(window["_Div" + ndx]);
    });
    let _hr = document.createElement("hr");
    _hr.className = "col-lg-1 d-lg-inline";
    vProp.appendChild(_hr);
    let ctr = 0;
    for (let record of e) {
      let vVals = [
        "Cycle",
        "Control Number",
        "CN Filing Status",
        "CN Filing Date",
        "SWARMP Recommended Date",
        " QEWI Name",
        "QEWI Business Name",
      ];
      vVals.forEach((colName, ndx) => {
        window["_Div" + ndx] = document.createElement("div");
        window["_Div" + ndx].className = "zzdetailDiv row";
        fMakeEl(
          `${colName}:`,
          window["_Div" + ndx],
          ndx == 0 ? "col-3 boldit" : "col-3"
        );
        fMakeEl(
          `${e[ctr][colName]}`,
          window["_Div" + ndx],
          ndx == 0 ? "col-3 boldit" : "col-3"
        );
        vPropCycles.appendChild(window["_Div" + ndx]);
      });
      vPropCycles.appendChild(document.createElement("br"));
      ctr++;
    }
    document.querySelector("#propertyData").textContent = "";
    document.querySelector("#propertyData").appendChild(vProp);
    document.querySelector("#propertyDataDetail").textContent = "";
    document.querySelector("#propertyDataDetail").appendChild(vPropCycles);
  }
  document.querySelector("#doSearch").addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    let searchTerm = document
      .querySelector("#searchTerm")
      .value.toLowerCase()
      .trim();
    if (!searchTerm) return;
    document.querySelector("#propertyData").innerText = "";
    let vBoro;
    document.querySelectorAll("[name='borough']").forEach((e) => {
      if (e.checked) {
        vBoro = e.value;
      }
    });
    let theRecord = data.filter((e) => {
      return (
        searchTerm == e["Bin"] ||
        (searchTerm == e["Address"].toLowerCase().trim() &&
          e["Borough"].toLowerCase() == vBoro)
      );
    });
    if (theRecord.length == 0) {
      document.querySelector("#propertyData").innerText =
        "Search Results...Property Not Found";
      document.querySelector("#propertyDataDetail").innerText = "";
      return;
    }
    theRecord.sort((x, z) => {
      return x.Cycle < z.Cycle ? 1 : -1;
    });
    buildCard(theRecord);
  });
  (function () {
    let t = localStorage.getItem("cathyBIN");
    if (t) {
      let d = document.querySelector("#searchTerm");
      d.value = t;
      d.setAttribute("value", t);
      let x = document.querySelector("#doSearch");
      x.click();
      localStorage.clear();
      x = localStorage.getItem("cathyBIN");
    }
  })();
})();
