function fillContactsList() {
	getContacts(function(tx, results) {
		// alert(results.rows.length);
		$("#contacts").empty();
		for (var i = 0; i < results.rows.length; i++) {
			// alert("Row: " + i);
			var row = results.rows.item(i);
			// alert("Kontakt gefunden: " + row['NACHNAME'] + ', ' +
			// row['VORNAME'] + ', kid = ' + row['kid']);
			$("#contacts").append(
					'<li><a data-kid="' + row['kid'] + '">' + row['NACHNAME']
							+ ', ' + row['VORNAME'] + '</a></li>');
		}
		// alert("Listview completed");
		$("#contacts").listview('refresh');
	});
}

function addTeilnehmer(contact) {
	var contact_id = $(contact).attr('data-kid')
	getContactDetails(contact_id, function(tx, results) {
		var row = results.rows.item(0); // Es kann immer nur eine Zeile
										// zurückkommen, da ID unique ist
		$("#aktiveTeilnehmer").append(
				'<li><a data-kid="' + row['kid'] + '">' + row['NACHNAME']
						+ ', ' + row['VORNAME'] + '</a></li>');
		$("#aktiveTeilnehmer").listview("refresh");
	});
}

function fillContactForm(contact) {
	clearContactForm();
	var contact_id = $(contact).attr('data-kid')
	getContactDetails(contact_id, function(tx, results) {
		var row = results.rows.item(0); // Es kann immer nur eine Zeile
										// zurückkommen, da ID unique ist
		$('#kontakt_name').val(row['NACHNAME']);
		$('#kontakt_vorname').val(row['VORNAME']);
		$('#kontakt_telnr').val(row['TELNR']);
		$('#kontakt_email').val(row['EMAIL']);
		$('#kontakt_bemerkung').val(row['BEMERKUNG']);
		$('#k_id').val(contact_id);
		$("#deleteContact").show();
	});
}

function processContact() {
	validate_result = validate("customer_details");
	if (validate_result == '') {
		var contact_id = $('#k_id').val();
		if (contact_id === "") {
			createContact();
		} else {
			updateContact(contact_id);
		}
	} else {
		alert(validate_result);
	}
}

function importContact() {
	clearContactForm();
	navigator.contacts
			.pickContact(
					function(contact) {
						var json = JSON.parse(JSON.stringify(contact));
						$('#kontakt_name').val(json.name.familyName);
						$('#kontakt_vorname').val(json.name.givenName);
						$('#kontakt_telnr').val(json.phoneNumbers[0].value);
						$('#kontakt_email').val(json.emails[0].value);
						$('#kontakt_bemerkung').val(json.note);
					},
					function(err) {
						alert('Fehler beim Abrufen des Kontakt. Stellen Sie sicher, dass diese App Zugriff auf Ihre Kontakte hat.');
					});
}

function clearContactForm() {
	$('#kontakt_name').val('');
	$('#kontakt_vorname').val('');
	$('#kontakt_telnr').val('');
	$('#kontakt_email').val('');
	$('#kontakt_bemerkung').val('');
	$('#k_id').val('');
}