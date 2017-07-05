var ContactsOverviewSelectMode = false;

document.addEventListener('deviceready', startApp, false);

function startApp() {
	// alert("deviceReady");

	openDB();
	fillContactsList();
	fillPlacesList();
	fillAppointmentsList();
	$("#newContact").on('click', function() {
		processContact();
	});

	$("#newAppointment").on('click', function() {
		processAppointment();
		// createAppointment();
	});

	$("#t_start").on('click', function() {
		calendar($("#t_start"));
	});

	$("#t_end").on('click', function() {
		calendar($("#t_end"));
	});

	$("#addTeilnehmer").on('click', function() {
		location.href = "#contacts_overview";
	});

	$(document)
			.on(
					"pagecontainerbeforeshow",
					function(event, ui) {

						if (ui.prevPage[0].id == $("#new_appointment").prop(
								"id")
								&& ui.toPage[0].id == $("#contacts_overview")
										.prop("id")) {
							// alert("Enter select mode");
							ContactsOverviewSelectMode = true;
						} else if (ui.prevPage[0].id == $("#contacts_overview")
								.prop("id")
								&& (ui.toPage[0].id == $("#new_appointment")
										.prop("id") || ui.toPage[0].id == $(
										"#index").prop("id"))) {
							// alert("Leave select mode");
							ContactsOverviewSelectMode = false;
						}
					});

	// Contacts
	$(document).on('click', '#contacts a', function() {
		// alert("Select mode: " + ContactsOverviewSelectMode);
		if (ContactsOverviewSelectMode) {
			addTeilnehmer(this);
			location.href = "#new_appointment";
		} else {
			$("#importContact").hide();
			fillContactForm(this);
			location.href = "#contact_details";
		}
	});

	$(document).on('swiperight', '#contacts a', function() {
		$("#importContact").hide();
		fillContactForm(this);
		location.href = "#contact_details";
	});

	$(document).on('click', '#newContactForm', function() {
		clearContactForm();
		$("#deleteContact").hide();
		$("#importContact").show();
	});

	// Places
	$(document).on('swiperight', '#places a', function() {
		$("#deletePlace").show();
		fillPlaceForm(this);
		location.href = "#place_details";
	});

	$(document).on('click', '#places a', function() {
		$('#place_name').val($(this).attr('data-bez'));
		$('#place_name').show();
		$('#place_id').val($(this).attr('data-oid'));
		location.href = "#new_appointment";
	});

	$("#deleteContact")
			.on(
					'click',
					function() {
						if (confirm("Wollen Sie den Kontakt "
								+ $('#kontakt_name').val() + ", "
								+ $('#kontakt_vorname').val()
								+ " wirklich löschen?") == true) {
							deleteContact($('#k_id').val());
						}
					});

	$("#importContact").on('click', function() {
		importContact();
	});

	$("#savePlace").on('click', function() {
		processPlace();
	});

	$("#newPlaceForm").on('click', function() {
		clearPlaceForm();
		$('#deletePlace').hide();
	});

	$("#deletePlace").on(
			'click',
			function() {
				if (confirm("Wollen Sie den Ort " + $('#ort_bezeichnung').val()
						+ " wirklich löschen?") == true) {
					deletePlace($('#o_id').val());
				}
			});
	
	$("#openInMaps").on('click', function() {
		openLocationMap();
	});

}



function fillAppointmentsList() {
	getAppointments(function(tx, results) {
		// alert(results.rows.length);
		$("#appointments").empty();
		for (var i = 0; i < results.rows.length; i++) {
			// alert("Row: " + i);
			var row = results.rows.item(i);
			$("#appointments").append(
					'<li><a href="#selectedAppointment" data-kid="'
							+ row['kid'] + '">' + row['ANFANG'] + '</a>');
		}
		// alert("Listview completed");
		$("#appointments").listview('refresh');
	});
}

function clearAppointmantForm() {
	$('#t_titel').val('');
	$('#place_name').val('');
	$('#t_start').val('');
	$('#t_end').val('');
	$('#aktiveTeilnehmer').empty();
	$('#t_file').val('');
	$('#t_note').val('');
}

function processAppointment() {
	var t_id = $('#t_id').val();
	if (t_id === "") {
		createAppointment();
	} else {
		updateAppointment(t_id);
	}
}

function calendar(control) {

	// alert("test")

	var options = {
		date : new Date(),
		mode : 'datetime'
	};

	function onSuccess(date) {
		alert('Selected date: ' + date);
		var time = date.getHours() + ':' + date.getMinutes();
		var day = date.getDay() + '.' + date.getMonth() + '.'
				+ date.getFullYear();
		control.val(day + ' ' + time);
	}

	function onError(error) { // Android only
		// alert('Error: ' + error);
	}

	datePicker.show(options, onSuccess, onError);
}
