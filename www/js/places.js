function fillPlacesList() {
	getPlaces(function(tx, results) {
		$("#places").empty();
		for (var i = 0; i < results.rows.length; i++) {
			var row = results.rows.item(i);
			$("#places").append(
					'<li> <a href="#" data-oid="' + row['oid'] + '" data-bez="'
							+ row['BEZEICHNUNG'] + '">' + row['BEZEICHNUNG']
							+ '</a></li>');
		}
		$("#places").listview('refresh');
	});
}

function fillPlaceForm(place) {
	clearPlaceForm();
	var place_id = $(place).attr('data-oid')
	getPlaceDetails(place_id, function(tx, results) {
		var row = results.rows.item(0); // Es kann immer nur eine Zeile
										// zurückkommen, da ID unique ist
		$('#ort_bezeichnung').val(row['BEZEICHNUNG']);
		$('#ort_strasse').val(row['STRASSE']);
		$('#ort_hausnummer').val(row['HAUSNUMMER']);
		$('#ort_name').val(row['STADT']);
		$('#ort_plz').val(row['PLZ']);
		$('#ort_land').val(row['LAND']);
		$('#o_id').val(place_id);
		$("#deletePlace").show();
	});
}

function clearPlaceForm() {
	$('#ort_bezeichnung').val('');
	$('#ort_strasse').val('');
	$('#ort_hausnummer').val('');
	$('#ort_name').val('');
	$('#ort_plz').val('');
	$('#ort_land').val('');
	$('#o_id').val('');
}

function processPlace() {
	var place_id = $('#o_id').val();
	if (place_id === "") {
		createPlace();
	} else {
		updatePlace(place_id);
	}
}

function openLocationMap(){
	location.href="https://www.google.de/maps/place/" + $('#ort_strasse').val() + "+" + $('#ort_hausnummer').val() + ",+" +
	$('#ort_plz').val() + "+" + $('#ort_name').val() + ",+"+ $('#ort_land').val();
}