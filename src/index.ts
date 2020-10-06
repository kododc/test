import "./index.scss";
import axios from "axios";

// Text-Processing API Url
const API_URL = "http://localhost:8080/api";

// RapidAPI request headers
const REQUEST_HEADERS = {
	"Content-Type": "application/json"
};

var url = new URL(location.href);
var parentId = url.searchParams.get("parentId");
if (parentId == null) parentId = "";

const analyzeComment = (callback: any) => {
	axios
		.get(`${API_URL}/items/?parentId=${parentId}`, { headers: REQUEST_HEADERS })
		.then(response => {
			callback(response.data);
		})
		.catch(error => console.error("On get list error", error));
};

const downloadFile = (itemId: any, callback?: any) => {
	if (callback != null && itemId != null) {
		axios
			.get(`${API_URL}/items/${itemId}`, { headers: REQUEST_HEADERS })
			.then(response => {
				callback(response.data);
			})
			.catch(error => console.error("On get list error", error));
	}
};

// Making a GET request using an axios instance from a connected library

function getList(item: any) {
	const resultElement = document.getElementById("result")!;
	if (item.folder) {
		var div = document.createElement("div");
		div.setAttribute("class", "folder ");
		var btn_child = document.createElement("a");
		btn_child.href = item._links.children.href.replace("/api/items", "");
		btn_child.innerHTML =
			"<i class='fas fa-folder text-warning'></i><span>" +
			item.name +
			"</span>";
	} else {
		var div = document.createElement("div");
		div.setAttribute("class", "file");
		var btn_child = document.createElement("a");
		btn_child.href = item._links.download.href;
		btn_child.innerHTML =
			"<i class='fas fa-file text-primary'></i><span>" + item.name + "</span>";
	}
	div.appendChild(btn_child);
	resultElement.appendChild(div);
	console.log(item);
	return true;
}

const displayResult = (result: any) => {
	result.items.map(getList);
	if (parentId != "") {
		var PrevBtn = document.createElement("div");
		PrevBtn.innerHTML =
			"<a href='" +
			document.referrer +
			"'><i class='fas fa-chevron-circle-left pr-1 text-secondary'></i>Previous</a>";
		const resultElement = document.getElementById("result")!;
		resultElement.prepend(PrevBtn);
	}
};
const downloadAction = (result: any) => {
	var fileDownload = require("js-file-download");
	fileDownload(result, "filename.csv");
};

analyzeComment(displayResult);
