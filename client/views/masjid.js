Template.masjid.times = function(lat, lng) {
	prayTimes.setMethod('MWL');
	offset = 7;
	var date = new Date(); // today
	var times = prayTimes.getTimes(date, [lat, lng], offset);

	var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
	var html = '<table id="timetable">';
	//html += '<tr><th colspan="2">' + date.toLocaleDateString() + '</th></tr>';
	html += '<tr><th colspan="2"> Prayer times</th></tr>';
	for (var i in list) {
		color = (list[i] === "Sunrise") ? "#ddd" : "#444";
		html += '<tr><td style="color:' + color + '">' + list[i] + ' &nbsp; &nbsp; &nbsp; </td>';
		html += '<td style="color:' + color + '"> ' + times[list[i].toLowerCase()] + '</td></tr>';
	}
	html += '</table>';

	return html;
};

