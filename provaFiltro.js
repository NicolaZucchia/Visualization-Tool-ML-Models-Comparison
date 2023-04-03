let pairs = [];
let abs_bool = false;

const yScale = d3.scaleLinear()
.domain([0, 1])
.range([360, 40]);

const svg = d3.select("#chart")
.append("svg")
.attr("width", 400)
.attr("height", 400);

function uploadFile() {
    const inputElement = document.getElementById("file-upload");
  
    const fileList = inputElement.files;
    const fileReader = new FileReader();
  
    fileReader.readAsText(fileList[0]);
  
    fileReader.onload = function (event) {
        const text = event.target.result;
        const newPairs = text.trim().split('\n').map(line => line.split(',').map(Number));
        pairs = pairs.concat(newPairs);
        console.log("pairs");
        console.log(pairs.length);
        console.log(pairs);

        printInstances(svg, yScale, pairs);
    };
}

function print_output(d) {

    let num_f = featureCount(d);
    const outputElement = document.getElementById("output");
    const shap1Element = document.getElementById("m1shap");
    const shap2Element = document.getElementById("m2shap");
    let cur_list = [];
    cur_list.push(d[0].toFixed(3));
    cur_list.push(d[1].toFixed(3));
    outputElement.innerHTML = cur_list;
    cur_index = 2;
    let s1_list = [];
    let s2_list = [];
    for (let i=0; i<d.length-2; i++) {
        if (i<num_f) {
            s1_list.push(d[cur_index+i]);
        }
        else {
            s2_list.push(d[cur_index+i]);
        }
    }

    let table = document.createElement('table');
    let headerRow = table.insertRow();
    let m1Header = headerRow.insertCell(0);
    m1Header.innerHTML = "M1";
    let m2Header = headerRow.insertCell(1);
    m2Header.innerHTML = "M2";
    let m3Header = headerRow.insertCell(2);
    m3Header.innerHTML = "Delta";
    for (let i=0; i<num_f; i++) {
        let row = table.insertRow();
		let m1Cell = row.insertCell(0);
		let m2Cell = row.insertCell(1);
        let m3Cell = row.insertCell(2);
        m1Cell.innerHTML = s1_list[i].toFixed(3);
		m2Cell.innerHTML = s2_list[i].toFixed(3);
        m3Cell.innerHTML = (s1_list[i] - s2_list[i]).toFixed(3);
    }
    let tableContainer = document.getElementById("table-container");
	tableContainer.innerHTML = "";
	tableContainer.appendChild(table);

}

function featureCount(d) {
    if (Array.isArray(d)) {
        return d.length/2 - 1;
    }
    else {
        console.log("Errore: nessuna lista");
        return 0;
    }
}

function hideOnDiff() {
    let filterMax = document.getElementById("filter-input-max").value;
    let filterMin = document.getElementById("filter-input-min").value;
    let filter_pairs = [];
    for (let i=0; i<pairs.length; i++) {
        let curDiff = pairs[i][0] - pairs[i][1]
        if (abs_bool) {
            curDiff = Math.abs(curDiff);
        }
        if (curDiff < filterMax && curDiff > filterMin) {
            filter_pairs.push(pairs[i]);
        }
    }
    printInstances(svg, yScale, filter_pairs);
}

function printInstances(svg, yScale, pairs) {
    svg.selectAll(".left-dot")
            .data(pairs)
            .join("circle")
            .attr("class", "left-dot")
            .attr("cx", "20%")
            .attr("cy", d => yScale(d[0]))
            .attr("r", 2)
            .on("click", (event, d) => print_output(d));

        svg.selectAll(".right-dot")
            .data(pairs)
            .join("circle")
            .attr("class", "right-dot")
            .attr("cx", "80%")
            .attr("cy", d => yScale(d[1]))
            .attr("r", 2)
            .on("click", (event, d) => print_output(d));

        svg.selectAll("line")
            .data(pairs)
            .join("line")
            .attr("class", "line")
            .attr("x1", "20%")
            .attr("y1", d => yScale(d[0]))
            .attr("x2", "80%")
            .attr("y2", d => yScale(d[1]))
            .on("click", (event, d) => print_output(d));
}

function absVal(){
    let isAbs = document.getElementById("abs").value;
    if (isAbs === "true") {
        document.getElementById("filter-input-min").setAttribute("min", "0");
        document.getElementById("filter-input-min").setAttribute("value", "0");
        abs_bool = true;
    }
    if (isAbs === "false") {
        document.getElementById("filter-input-min").setAttribute("min", "-1");
        document.getElementById("filter-input-min").setAttribute("value", "-1");
        abs_bool = false;
    }
}