String.prototype.format = function(){
	var num = parseFloat(this);
	if( isNaN(num) ) return "0";

	return num.format();
};

String.prototype.formatDecimal = function(format){
	if(this.blank()){
		return "";
	}
	var tmp = removeComma(this);
	var num = parseFloat(tmp);
	if( isNaN(num) ) return "0";
	//num = num.toFixed(1); 
	var rst = num+"";
	return rst.addCommas(format);
};
String.prototype.noCommaDecimal = function(format){
	return this.formatDecimal(format).removeComma();
};
String.prototype.addCommas = function(fix)
{
	x = this.split('.');
	x1 = x[0];
	x2 = "";
	if(fix){
		if(x[1]==null){
			var num = parseFloat(this);
			num = num.toFixed(fix)+""; 
			x2 = "."+num.split('.')[1];
		}else if(fix > x[1].length){
			var num = parseFloat(this);
			num = num.toFixed(fix)+""; 
			x2 = "."+num.split('.')[1];
		}else{
			x2 = "."+x[1].substring(0,fix);
		}
	}else{
		x2 = x.length > 1 ? '.' + x[1] : '';
	}
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}


Number.prototype.formatDecimal = function(format){
	if( isNaN(this) ) return "0";
	//num = num.toFixed(1); 
	var rst = this+"";
	return rst.addCommas(format);
};

Number.prototype.format = function(){
	if(this==0) return 0;

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + '');

	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

	return n;
};

var removeComma = function(value) {
	value += ""; // Convert numeric data to string
	return value.replace(/,/gi, "");
}

var gfRound = function(val, precision) {
    var p = Math.pow(10, precision);
    var returnValue = Math.round(parseFloat(removeComma(val)) * p) / p;
    
    return  returnValue.format();
}

String.prototype.blank = function() {
    return /^\s*$/.test(this);
};


String.prototype.toDate = function(pattern) {
	var rst = this.replace(/[^0-9]/g,"");
    var index = -1;
    var year;
    var month;
    var day;
    var hour = 0;
    var min  = 0;
    var sec  = 0;
    var ms   = 0;

    if (pattern == null) {
    	pattern = "yyyyMMdd";
    }

    if ((pattern.indexOf("yyyy")) != -1 ) {
//    	index = pattern.indexOf("yy");
//    	year = "20" + rst.substr(index, 2);
    	year = rst.substr(0, 4);
    } else {
    	//year = rst.substr(index, 4);
    	year = new Date().getFullYear();
    }

    if ((pattern.indexOf("MM")) != -1 ) {
    	month = rst.substr(4, 2);
    } else {
    	//month = 1;
    	month = new Date().getMonth() + 1;
    }

    if ((pattern.indexOf("dd")) != -1 ) {
    	day = rst.substr(6, 2);
    } else {
    	//day = 1;
    	day = new Date().getDate();
    }

    if ((pattern.indexOf("HH")) != -1 ) {
    	hour = rst.substr(8, 2);
    }

    if ((pattern.indexOf("mm")) != -1 ) {
    	min = rst.substr(10, 2);
    }

    if ((pattern.indexOf("ss")) != -1 ) {
    	sec = rst.substr(12, 2);
    }

    if ((pattern.indexOf("SS")) != -1 ) {
    	ms = rst.substr(14, 2);
    }
    
    return new Date(year, month - 1, day, hour, min, sec, ms);
};


String.prototype.dateFormat = function(pattern,addDayVal) {
	if(this.blank()){
		return "";
	}
	if(pattern==null){
		return this;
	}
	var tmp = pattern.replace(/[ ,-.:\/]/gi,"");
	var date = this.toDate(tmp);
	if(addDayVal){
		date = date.addDay(addDayVal);
	}
	return date.format(pattern);
};


Date.prototype.format = function(pattern) {
	var year = this.getFullYear();
	var month = this.getMonth() + 1;
	var day = this.getDate();
	var dayInWeek = this.getDay();
	var hour24 = this.getHours();
	var ampm = (hour24 < 12) ? 0 : 1;
	var hour12 = (hour24 > 12) ? (hour24 - 12) : hour24;
	var min = this.getMinutes();
	var sec = this.getSeconds();
	var YYYY = "" + year;
	var YY = YYYY.substr(2);
	var MM = (("" + month).length == 1) ? "0" + month : "" + month;
	var DD = (("" + day).length == 1) ? "0" + day : "" + day;
	var HH = (("" + hour24).length == 1) ? "0" + hour24 : "" + hour24;
	var hh = (("" + hour12).length == 1) ? "0" + hour12 : "" + hour12;
	var mm = (("" + min).length == 1) ? "0" + min : "" + min;
	var ss = (("" + sec).length == 1) ? "0" + sec : "" + sec;
	var SS = "" + this.getMilliseconds();
	var a = (a == 0) ? "AM" : "PM";

	var dateStr;
	var index = -1;

	if (typeof (pattern) == "undefined") {
		dateStr = "YYYYMMDD";
	} else {
		dateStr = pattern;
	}

	dateStr = dateStr.replace(/a/g, a);
	dateStr = dateStr.replace(/yyyy/g, YYYY);
	dateStr = dateStr.replace(/yy/g, YY);
	dateStr = dateStr.replace(/MM/g, MM);
	dateStr = dateStr.replace(/dd/g, DD);
	dateStr = dateStr.replace(/hh/g, hh);
	dateStr = dateStr.replace(/HH/g, HH);
	dateStr = dateStr.replace(/mm/g, mm);
	dateStr = dateStr.replace(/ss/g, ss);

	return dateStr;
};
Number.prototype.to2 = function() { return (this > 9 ? "" : "0")+this; };

Date.prototype.addHour = function(value){
	return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours()+value,this.getMinutes(), this.getSeconds(), this.getMilliseconds());
}

Date.prototype.addMin = function(value){
	return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(),this.getMinutes()+value, this.getSeconds(), this.getMilliseconds());
}

Date.prototype.addDay = function(value){
	return new Date(this.getFullYear(), this.getMonth(), this.getDate()+value, this.getHours(),this.getMinutes(), this.getSeconds(), this.getMilliseconds());
}

Date.prototype.addMonth = function(value){
	return new Date(this.getFullYear(), this.getMonth()+value, this.getDate(), this.getHours(),this.getMinutes(), this.getSeconds(), this.getMilliseconds());
}