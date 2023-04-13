let pairs = [];
let header = [];
let abs_bool = false;

const svg = d3.select("#chart")
.append("svg")
.attr("width", 400)
.attr("height", 400);

const maxText = document.querySelector('.max-text');
const minText = document.querySelector('.min-text');

function uploadFile() {
    const inputElement = document.getElementById("file-upload");
  
    const fileList = inputElement.files;
    const fileReader = new FileReader();
  
    fileReader.readAsText(fileList[0]);
  
    fileReader.onload = function (event) {
        const text = event.target.result;
        const lines = text.trim().split('\n').map(line => line.split(','));
        header = lines[0]; // Get the first line as header
        const data = lines.slice(1).map(line => line.map(Number)); // Get all lines except the first as data
        pairs = data;
        console.log("Header: ", header);
        console.log("Data: ", data);

        let minmax = minmaxFinder(pairs);
        instanceCount(pairs);

        yScale = d3.scaleLinear()
        .domain([minmax[0], minmax[1]])
        .range([360, 40]);

        maxText.textContent = `max: ${minmax[1]}`;
        minText.textContent = `min: ${minmax[0]}`;

        printInstances(svg, yScale, pairs);
    };
}

function print_output(d) {

    let num_f = featureCount(d);
    const outputElement = document.getElementById("output");
    const outputinfoElement = document.getElementById("output-info");
    const shap1Element = document.getElementById("m1shap");
    const shap2Element = document.getElementById("m2shap");
    let cur_list = [];
    cur_list.push(d[0].toFixed(3));
    cur_list.push(d[1].toFixed(3));
    outputElement.innerHTML = cur_list;
    outputinfoElement.innerHTML = (d[0] - d[1]).toFixed(3);
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
    let m0Header = headerRow.insertCell(0);
    m0Header.innerHTML = "Feature";
    let m1Header = headerRow.insertCell(1);
    m1Header.innerHTML = "M1";
    let m2Header = headerRow.insertCell(2);
    m2Header.innerHTML = "M2";
    let m3Header = headerRow.insertCell(3);
    m3Header.innerHTML = "Delta";
    for (let i=0; i<num_f; i++) {
        let row = table.insertRow();
        let m0Cell = row.insertCell(0);
		let m1Cell = row.insertCell(1);
		let m2Cell = row.insertCell(2);
        let m3Cell = row.insertCell(3);
        m0Cell.innerHTML = header[i+2];
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

function instanceCount(pairs) {
    let instance_num = pairs.length;
    document.getElementById("choosing-instance").setAttribute("max", instance_num);
}

function minmaxFinder(pairs) {
    let max_pred1 = pairs[0][0];
    let max_pred2 = pairs[0][1];
    let min_pred1 = pairs[0][0];
    let min_pred2 = pairs[0][1];
    for (let i=1; i<pairs.length; i++) {
        if (pairs[i][0] > max_pred1) {
            max_pred1 = pairs[i][0];
        }
        if (pairs[i][1] > max_pred2) {
            max_pred2 = pairs[i][1];
        }
        if (pairs[i][0] < min_pred1) {
            min_pred1 = pairs[i][0];
        }
        if (pairs[i][1] < min_pred2) {
            min_pred2 = pairs[i][1];
        }
    }
    let min = 0;
    let max = 0;
    if (min_pred1 < min_pred2) {
        min = min_pred1;
    }
    else {
        min = min_pred2;
    }
    if (max_pred1 > max_pred2) {
        max = max_pred1;
    }
    else {
        max = max_pred2;
    }
    let minmax = [];
    minmax.push(min);
    minmax.push(max);
    return minmax;
}