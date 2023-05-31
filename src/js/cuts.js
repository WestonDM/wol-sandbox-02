// Get the current user:
// Available after on('init') is invoked
const user = netlifyIdentity.currentUser();
//document.getElementById("input_box").style.display = 'none'
var row_start = 950;
var row_end = 1000;
var tabledata_full = JSON.parse(contents)
netlifyIdentity.on('login', user => {
	console.log(user),
		document.getElementById("sample").style.display = 'none',
		//document.getElementById("input_box").style.display = 'block',          // Show
		row_start = 0;
	row_end = 10000000;
	makeTable(tabledata_full, row_start, row_end)
});
netlifyIdentity.on('logout', () => {
	//location.reload()
	row_start = 950;
	row_end = 1000;
	document.getElementById("sample").style.display = 'block';
	makeTable(tabledata_full, row_start, row_end);
});

function makeTable(tabledata_full, row_start, row_end) {
	var valueEl = document.getElementById("filter-value");
	//Trigger setFilter function with correct parameters
	function updateFilter() {
		if(valueEl.value > 50) {
			table.setFilter("price", "<=", valueEl.value / 100);
		} else {
			table.setFilter("price", "<=", 1000);
		}
	}
	document.getElementById("filter-value").addEventListener("keyup", updateFilter);
	document.getElementById("filter-value").addEventListener("change", updateFilter);
	document.getElementById("filter-value").addEventListener("blur", updateFilter);
	var headerMenu = function() {
		var menu = [];
		var columns = this.getColumns().slice(1, );
		for(let column of columns) {
			//create checkbox element using font awesome icons
			let icon = document.createElement("i");
			icon.classList.add("fas");
			icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");
			//build label
			let label = document.createElement("span");
			let title = document.createElement("span");
			title.textContent = " " + column.getDefinition().title;
			label.appendChild(icon);
			label.appendChild(title);
			//create menu item
			menu.push({
				label: label,
				action: function(e) {
					//prevent menu closing
					e.stopPropagation();
					//toggle current column visibility
					column.toggle();
					//change menu item icon
					if(column.isVisible()) {
						icon.classList.remove("fa-square");
						icon.classList.add("fa-check-square");
					} else {
						icon.classList.remove("fa-check-square");
						icon.classList.add("fa-square");
					}
				}
			});
		}
		return menu;
	};
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
	var table = new Tabulator(".options_table", {
		height: 1400,
		data: tabledata_full.slice(row_start, row_end),
		pagination: "local",
		paginationSize: 50,
		paginationButtonCount: 0,
		layout: "fitColumns",
		resizableRows: false,
		resizableColumnFit: true,
		columns: [{
			title: "Rank",
			field: "rank",
			sorter: "number",
			hozAlign: "center",
			headerTooltip: "Rank based on the algorithm, factoring in premium and probability of assignment",
			headerMenu: headerMenu,
			width: 90
		}, {
			title: "Ticker",
			field: "stock",
			sorter: "string",
			hozAlign: "center",
			headerTooltip: "The stock's ticker symbol",
			headerFilter: "input",
			headerFilterPlaceholder: "filter...",
			width: 90
		}, {
			title: "Expiration",
			field: "expiration",
			sorter: "date",
			hozAlign: "center",
			headerTooltip: "The expiration date of the put contract",
			width: 110
		}, {
			title: "Strike ($)",
			field: "strike",
			sorter: "number",
			hozAlign: "center",
			formatter: "money",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "The price you will buy 100 shares at, if assigned",
			width: 120
		}, {
			title: "Last Price ($)",
			field: "price",
			sorter: "number",
			formatter: "money",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "The last quoted price of the underlying stock when this list was generated",
			width: 125
		}, {
			title: "Premium ($)",
			field: "premium_per_contract",
			sorter: "number",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "Total premium (based on the last bid) paid by this put contract",
			width: 120
		}, {
			title: "ROI (%)",
			field: "weekly_roi",
			sorter: "number",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "Return on investment %, calculated as Premium / Last Price",
			width: 120
		}, {
			title: "Delta",
			field: "delta",
			sorter: "number",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "Delta",
			width: 120
		}, {
			title: "OTM (%)",
			field: "otm",
			sorter: "number",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "Percent out-of-the-money this strike is",
			width: 120
		}, {
			title: "Volume",
			field: "volume",
			sorter: "number",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "Total number of transactions for this contract",
			width: 90
		}, {
			title: "Price History ($)",
			field: "time_averages",
			sorter: "string",
			hozAlign: "center",
			headerTooltip: "Average price of the underlying stock over the past year. From left to right, more recent days are weighted more"
		}, {
			title: "Dividend ($)",
			field: "dividend",
			sorter: "number",
			hozAlign: "center",
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false,
			headerTooltip: "Annual dividend",
			width: 120
		}, {
			title: "Earnings?",
			field: "earnings",
			sorter: "string",
			hozAlign: "center",
			headerTooltip: "Is the underlying stock expected to announce earnings this week?",
			editor: "list",
			editorParams: {
				values: {
					"YES!": "Yes",
					"No": "No"
				}
			},
			headerFilter: true,
			headerFilterParams: {
				values: {
					"YES!": "Yes",
					"No": "No",
					"": "Any"
				}
			}
		}, ],
	});
	//trigger download of data.xlsx file
	document.getElementById("download").addEventListener("click", function() {
		table.download("csv", "calls.csv");
	});
}
makeTable(tabledata_full, row_start, row_end);