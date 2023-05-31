//var valueEl = document.getElementById("filter-value");
//Trigger setFilter function with correct parameters
function updateFilter() {
	if(valueEl.value > 50) {
		table.setFilter("strike", "<=", valueEl.value / 100);
	} else {
		table.setFilter("strike", "<=", 1000);
	}
}
//document.getElementById("filter-value").addEventListener("keyup", updateFilter);
//document.getElementById("filter-value").addEventListener("change", updateFilter);
//document.getElementById("filter-value").addEventListener("blur", updateFilter);
var tabledata = JSON.parse(contents);
//custom max min header filter
var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams) {
		var end;
		var container = document.createElement("span");
		//create and style inputs
		var start = document.createElement("input");
		start.setAttribute("type", "number");
		start.setAttribute("placeholder", "Min");
		start.setAttribute("min", 0);
		start.setAttribute("max", 10000000);
		start.style.padding = "4px";
		start.style.width = "50%";
		start.style.boxSizing = "border-box";
		start.value = cell.getValue();

		function buildValues() {
			success({
				start: start.value,
				end: end.value,
			});
		}

		function keypress(e) {
			if(e.keyCode == 13) {
				buildValues();
			}
			if(e.keyCode == 27) {
				cancel();
			}
		}
		end = start.cloneNode();
		end.setAttribute("placeholder", "Max");
		start.addEventListener("change", buildValues);
		start.addEventListener("blur", buildValues);
		start.addEventListener("keyup", buildValues);
		end.addEventListener("change", buildValues);
		end.addEventListener("blur", buildValues);
		end.addEventListener("keyup", buildValues);
		container.appendChild(start);
		container.appendChild(end);
		return container;
	}
	//custom max min filter function
function getRowValue(rowValue) {
	var value = rowValue
	return value; //must return a boolean, true if it passes the filter.
}
//custom max min filter function
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams) {
	//headerValue - the value of the header filter element
	//rowValue - the value of the column in this row
	//rowData - the data for the row being filtered
	//filterParams - params object passed to the headerFilterFuncParams property
	var value_as_float = parseFloat(rowValue)
	if(rowValue) {
		if(headerValue.start != "") {
			if(headerValue.end != "") {
				return value_as_float >= headerValue.start && value_as_float <= headerValue.end;
			} else {
				return value_as_float >= headerValue.start;
			}
		} else {
			if(headerValue.end != "") {
				return value_as_float <= headerValue.end;
			}
		}
	}
	return true; //must return a boolean, true if it passes the filter.
}
var table = new Tabulator("#options", {
	height: 1400,
	data: tabledata,
	pagination: "local",
	paginationSize: 50,
	paginationButtonCount: 0,
	layout: "fitColumns",
	resizableRows: false,
	resizableColumnFit: true,
	columns: [{
		title: "Algorithm Rank",
		field: "rank",
		sorter: "number",
		hozAlign: "center",
		headerTooltip: "Rank based on the algorithm, factoring in premium and probability of assignment"
	}, {
		title: "Stock Ticker Symbol",
		field: "stock",
		sorter: "string",
		hozAlign: "center",
		headerTooltip: "The stock's ticker symbol",
		headerFilter: "input",
		headerFilterPlaceholder: "filter stocks..."
	}, {
		title: "Expiration Date",
		field: "expiration",
		sorter: "date",
		hozAlign: "center",
		headerFilter: "input",
		headerFilterPlaceholder: "Enter date..."
	}, {
		title: "Strike Price ($)",
		field: "strike",
		sorter: "number",
		hozAlign: "center",
		formatter: "money",
		headerFilter: minMaxFilterEditor,
		headerFilterFunc: minMaxFilterFunction,
		headerFilterLiveFilter: false,
		headerTooltip: "The price you will buy 100 shares at, if assigned"
	}, {
		title: "Week Open Price ($)",
		field: "price",
		sorter: "number",
		formatter: "money",
		hozAlign: "center",
		headerTooltip: "The quoted price of the underlying stock at the start of the week"
	}, {
		title: "Premium ($)",
		field: "premium_per_contract",
		sorter: "number",
		hozAlign: "center",
		headerFilter: minMaxFilterEditor,
		headerFilterFunc: minMaxFilterFunction,
		headerFilterLiveFilter: false,
		headerTooltip: "Total premium (based on the last bid) paid by this put contract"
	}, {
		title: "ROI (%)",
		field: "weekly_roi",
		sorter: "number",
		hozAlign: "center",
		headerFilter: minMaxFilterEditor,
		headerFilterFunc: minMaxFilterFunction,
		headerFilterLiveFilter: false,
		headerTooltip: "Return on invesmtnet, calculated as Premium / (100 x Strike Price)"
	}, {
		title: "Week Close Price ($)",
		field: "closing_price",
		sorter: "number",
		formatter: "money",
		hozAlign: "center",
		headerTooltip: "The closing price of the underlying stock at expiration"
	}, {
		title: "Win or Loss?",
		field: "win_loss",
		sorter: "string",
		hozAlign: "center",
		headerTooltip: "The last quoted price of the underlying stock when this list was generated",
		formatter: "tickCross"
	}, ],
});
//trigger download of data.xlsx file
document.getElementById("download").addEventListener("click", function() {
	table.download("csv", "historical_performance.csv");
});