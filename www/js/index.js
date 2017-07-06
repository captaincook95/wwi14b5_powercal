var ContactsOverviewSelectMode = false;
var PlacesOverviewUpdateMode = false;

document.addEventListener('deviceready', startApp, false);

function startApp() {
	openDB();
	fillContactsList();
	fillPlacesList();
	fillAppointmentsList();

	$(document).on("pagecontainerbeforeshow", function(event, ui) {
		if (ui.prevPage[0].id == $("#new_appointment").prop("id")
		 && ui.toPage[0].id == $("#contacts_overview").prop("id")) {
			ContactsOverviewSelectMode = true;
		}
		else if (ui.prevPage[0].id == $("#contacts_overview").prop("id")
		 && (ui.toPage[0].id == $("#new_appointment").prop("id") 
		 	|| ui.toPage[0].id == $("#index").prop("id"))) {
			ContactsOverviewSelectMode = false;
		}


		if (ui.prevPage[0].id == $("#appointment_details").prop("id")
		 && ui.toPage[0].id == $("#places_overview").prop("id")) {
			PlacesOverviewUpdateMode = true;
		}
		else if (ui.prevPage[0].id == $("#places_overview").prop("id")
		 && (ui.toPage[0].id == $("#appointment_details").prop("id") 
		 	|| ui.toPage[0].id == $("#index").prop("id"))) {
			PlacesOverviewUpdateMode = false;
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

	$("#newContact").on('click', function() {
		processContact();
	});

	$("#deleteContact").on('click', function(){
		if (confirm("Wollen Sie den Kontakt " + $('#kontakt_name').val() + ", " + $('#kontakt_vorname').val() + " wirklich löschen?") == true){
			deleteContact($('#k_id').val());
		}
	});

	$("#importContact").on('click', function(){
		impContact();
	});

	// Places
	$(document).on('swiperight', '#places a', function() {
		$("#deletePlace").show();
		fillPlaceForm(this);
		location.href = "#place_details";
	});

	$(document).on('click', '#places a', function() {
		if (PlacesOverviewUpdateMode) {
			$('#place_d').val($(this).attr('data-bez'));
			$('#place_id_d').val($(this).attr('data-oid'));
			location.href="#appointment_details";
		} else {
			$('#place_name').val($(this).attr('data-bez'));
			$('#place_id').val($(this).attr('data-oid'));
			location.href="#new_appointment";
		}
	});

	$("#deleteContact").on('click', function(){
		if (confirm("Wollen Sie den Kontakt " + $('#kontakt_name').val() + ", " + $('#kontakt_vorname').val() + " wirklich löschen?") == true){
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

	$("#deletePlace").on('click', function(){
		if (confirm("Wollen Sie den Ort " + $('#ort_bezeichnung').val()  + " wirklich löschen?") == true){
			deletePlace($('#o_id').val());
		}
	});

	$("#openInMaps").on('click', function() {
		openLocationMap();
	});

	// Appointments
	$(document).on('click','#appointments a', function(){
		fillDetailsAppointmentForm(this);
		location.href="#appointment_details";
	});

	$("#create_appointment_button").on('click', function(){
		clearNewAppointmentForm();
	}); 

	$("#newAppointment").on('click', function(){
		alert($('t_file').val());
		processAppointment();
	}); 

	$("#saveApp").on('click', function(){
		processAppointment();
	});

	$("#deleteApp").on('click', function(){
		if (confirm("Wollen Sie den Termin " + $('#titel_d').val()  + " wirklich löschen?") == true){
			deleteAppointment($('#t_id').val());
		}
	});	
	
	$('#place_name').on('click', function(){
		location.href = '#places_overview';
	});

	$('#place_d').on('click', function(){
		location.href = '#places_overview';
	});

	$("#t_start").on('click', function(){
		calendar($("#t_start"));
	});
	
	$("#t_end").on('click', function(){
		calendar($("#t_end"));
	});
	
	$("#addTeilnehmer").on('click', function(){
		location.href="#contacts_overview";
	});
	
	$("#getImage").on('click', function(){
		takePicture();
	});
	
	$(document).on('swiperight', '#documentsList a', function() {
		$(this).closest('li').remove();
		$("#documentsList").listview("refresh");
	});
	
	$(document).on('click', '#documentsList a', function() {
		var filePath = $(this).attr('data-path');
		cordova.plugins.fileOpener2.open(
			    filePath, 
			    'image/jpeg', 
			    {
			        error : function(){alert("Fehler"); }, 
			        success : function(){ } 
			    } 
			);
	});
	
	$(document).on('swiperight', '#documentsList_d a', function() {
		$(this).closest('li').remove();
		$("#documentsList_d").listview("refresh");
	});
	
	$(document).on('click', '#documentsList_d a', function() {
		var filePath = $(this).attr('data-path');
		cordova.plugins.fileOpener2.open(
			    filePath, 
			    'image/jpeg', 
			    {
			        error : function(){alert("Fehler"); }, 
			        success : function(){ } 
			    } 
			);
	});
}

// Appointments
function fillAppointmentsList() {
	getAppointments(function(tx, results){
		//alert(results.rows.length);
			$("#appointments").empty();
				for (var i = 0; i < results.rows.length; i++){
					//alert("Row: " + i);
					var row = results.rows.item(i);
					$("#appointments").append('<li><a href="#" data-tid="' + row['tid'] + '">' + '<h2>' + row['ANFANG'] + '</h2>' + '<p>' + row['TITEL'] + '</p>' + '</a>');
			}
			//alert("Listview completed");
			$("#appointments").listview('refresh');
	});
}

function addTeilnehmer(contact) {
	var contact_id = $(contact).attr('data-kid')
	getContactDetails(contact_id,function(tx,results){
		var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
		$("#aktiveTeilnehmer").append('<li><a data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</a></li>');
		$("#aktiveTeilnehmer").listview("refresh");
	});	
}

function clearDetailsAppointmentForm() {
	$('#titel_d').val('');
	$('#place_d').val('');
	$('#start_d').val('');
	$('#end_d').val('');
	$('#teilnehmer_d').empty();
	//$('#t_file').val('');
	$('#note_d').val('');
	$('#documentsList').empty();
	$('#documentsList_d').empty();
}

function clearNewAppointmentForm() {
	$('#t_titel').val('');
	$('#place_name').val('');
	$('#t_start').val('');
	$('#t_end').val('');
	$('#aktiveTeilnehmer').empty();
	//$('#t_file').val('');
	$('#t_note').val('');
}

function fillDetailsAppointmentForm(appointment) {
	var tid = $(appointment).attr('data-tid');
	// alert(tid);

	clearDetailsAppointmentForm();

	// Fill details
	getAppointmentDetails(tid,function(tx,results){
		var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
		$('#titel_d').val(row['TITEL']);
		$('#start_d').val(row['ANFANG']);
		$('#end_d').val(row['ENDE']);
		$('#note_d').val(row['BESCHREIBUB']);
		$('#t_id').val(tid);

		// Fill place
		var oid = row['OID'];
		getPlaceDetails(oid,function(tx,results){
			var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
			$('#place_d').val(row['BEZEICHNUNG']);
			$('#place_id_d').val(oid);
		});		
	});

	// Fill contacts
	getAppointmentContacts(tid, function(tx, results){
		for (var i = 0; i < results.rows.length; i++){
			var kid = results.rows.item(i)['KID'];
			// alert("Row: "+ i + ', ' + kid);
			getContactDetails(kid, function(tx, results){
				var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
				$("#teilnehmer_d").append('<li><a data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</a></li>');
				$("#teilnehmer_d").listview("refresh");
			});	
		}
	});
	
	//Fill documents
	getAppointmentDocuments(tid, function(tx, results){
		for (var i = 0; i < results.rows.length; i++){
			var bez = results.rows.item(i)['BEZEICHNUNG'];
			var file = results.rows.item(i)['FILE'];
			$("#documentsList_d").append('<li><a data-path="' + file + '">' + bez + '</a></li>');
			$("#documentsList_d").listview("refresh");
		}
	});
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

	var options = {
		date : new Date(),
		mode : 'datetime'
	};

	function onSuccess(date) {
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

function takePicture(){
	navigator.camera.getPicture(onSuccess, onFail, {
		quality: 50,
		destinationType: Camera.DestinationType.NATIVE_URI,
		sourceType: Camera.PictureSourceType.CAMERA
		});
	
	function onSuccess(pathToFile){
		var bez = "";
		bez = prompt("Bezeichnung für das Dokument eintragen","");
		if (bez == ""){
			alert("Kein Name angegeben. Kann Dokument nicht speichern.");
		} else {
			$('#documentsList').append('<li><a href="#" data-path="' + pathToFile + '">' + bez + '</a></li>');
			$("#documentsList").listview("refresh");	
		}
	}
	
	function onFail(message){
		alert("Fehler beim Abrufen des Bildes: " + message)
	}
}
