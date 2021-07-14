var docs = document.getElementById("docsDIV");
var rwd = document.getElementById("rwdDIV");
var chem = document.getElementById("chemDIV");
var phys = document.getElementById("physDIV");
var y = document.getElementById("select")

function hideRWD() {
	if (rwd.style.display === "block") {
		rwd.style.display = "none";
		y.style.display = "block";
	} else {
		rwd.style.display = "block";
		y.style.display = "none";
		phys.style.display = "none";
		chem.style.display = "none";
		docs.style.display = "none";
	}
}

function hideDocs() {
	if (docs.style.display === "block") {
		docs.style.display = "none";
		y.style.display = "block";
	} else {
		docs.style.display = "block";
		y.style.display = "none";
		phys.style.display = "none";
		rwd.style.display = "none";
		chem.style.display = "none";
	}
}

function hideChem() {
	if (chem.style.display === "block") {
		chem.style.display = "none";
		y.style.display = "block";
	} else {
		chem.style.display = "block";
		y.style.display = "none";
		phys.style.display = "none";
		rwd.style.display = "none";
		docs.style.display = "none";
	}
}

function hidePhys() {
	if (phys.style.display === "block") {
		phys.style.display = "none";
		y.style.display = "block";
	} else {
		phys.style.display = "block";
		y.style.display = "none";
		chem.style.display = "none";
		rwd.style.display = "none";
		docs.style.display = "none";
	}
}






