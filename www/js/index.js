var ContactsOverviewSelectMode = false;

document.addEventListener('deviceready', startApp, false);

function startApp() {
	//alert("deviceReady");

	openDB();
	fillContactsList();
	fillPlacesList();
	fillAppointmentsList();
	$("#newContact").on('click', function(){
		processContact();
	});
	
	$("#newAppointment").on('click', function(){
			 processAppointment();
			 //createAppointment();
        }
    ); 
	
	$("#t_start").on('click', function(){
		calendar($("#t_start"));
	});
	
	$("#t_end").on('click', function(){
		calendar($("#t_end"));
	});
	
	$("#addTeilnehmer").on('click', function(){
		location.href="#contacts_overview";
	});


	$(document).on("pagecontainerbeforeshow", function(event, ui){
		
		if (ui.prevPage[0].id == $("#new_appointment").prop("id")
		 && ui.toPage[0].id == $("#contacts_overview").prop("id")) {
			// alert("Enter select mode");
			ContactsOverviewSelectMode = true;
		}
		else if (ui.prevPage[0].id == $("#contacts_overview").prop("id")
		 && (ui.toPage[0].id == $("#new_appointment").prop("id") 
		 	|| ui.toPage[0].id == $("#index").prop("id"))) {
			// alert("Leave select mode");
			ContactsOverviewSelectMode = false;
		}
	});

	// Contacts
	$(document).on('click','#contacts a', function(){
		// alert("Select mode: " + ContactsOverviewSelectMode);
		if (ContactsOverviewSelectMode) {
			addTeilnehmer(this);
			location.href="#new_appointment";
		} 
		else {
			$("#importContact").hide();
			fillContactForm(this);
			location.href="#contact_details";
		}
	});

	$(document).on('swiperight','#contacts a', function(){
		$("#importContact").hide();
		fillContactForm(this);
		location.href="#contact_details";
	});

	$(document).on('click','#newContactForm', function(){
		clearContactForm();
		$("#deleteContact").hide();
		$("#importContact").show();
	});

	// Places
	$(document).on('swiperight','#places a', function(){
		$("#deletePlace").show();
		fillPlaceForm(this);
		location.href="#place_details";
	});

	$(document).on('click','#places a', function(){
		$('#place_name').val($(this).attr('data-bez'));
		$('#place_name').show();
		$('#place_id').val($(this).attr('data-oid'));
		location.href="#new_appointment";
	});

	$("#deleteContact").on('click', function(){
		if (confirm("Wollen Sie den Kontakt " + $('#kontakt_name').val() + ", " + $('#kontakt_vorname').val() + " wirklich löschen?") == true){
			deleteContact($('#k_id').val());
		}
	});

	$("#importContact").on('click', function(){
		importContact();
	});

	$("#savePlace").on('click', function(){
		processPlace();
	});

	$("#newPlaceForm").on('click', function(){
		clearPlaceForm();
		$('#deletePlace').hide();
	});

	$("#deletePlace").on('click', function(){
		if (confirm("Wollen Sie den Ort " + $('#ort_bezeichnung').val()  + " wirklich löschen?") == true){
			deletePlace($('#o_id').val());
		}
	});
}

function fillContactsList(){
	getContacts(function(tx, results){
		//alert(results.rows.length);
			$("#contacts").empty();
			for (var i = 0; i < results.rows.length; i++){
				//alert("Row: " + i);
				var row = results.rows.item(i);
				//alert("Kontakt gefunden: " + row['NACHNAME'] + ', ' + row['VORNAME'] + ', kid = ' + row['kid']);
				$("#contacts").append('<li><a data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</a></li>');
			}
			//alert("Listview completed");
			$("#contacts").listview('refresh');
	});
}

function addTeilnehmer(contact){
	var contact_id = $(contact).attr('data-kid')
	getContactDetails(contact_id,function(tx,results){
		var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
		$("#aktiveTeilnehmer").append('<li><a data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</a></li>');
		$("#aktiveTeilnehmer").listview("refresh");
	});	
}

function fillContactForm(contact){
	clearContactForm();
	var contact_id = $(contact).attr('data-kid')
	getContactDetails(contact_id,function(tx,results){
		var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
		$('#kontakt_name').val(row['NACHNAME']);
		$('#kontakt_vorname').val(row['VORNAME']);
		$('#kontakt_telnr').val(row['TELNR']);
		$('#kontakt_email').val(row['EMAIL']);
		$('#kontakt_bemerkung').val(row['BEMERKUNG']);
		$('#k_id').val(contact_id);
		$("#deleteContact").show();
	});
}

function processContact(){
	var contact_id = $('#k_id').val();
	if (contact_id === ""){
		createContact();
	} else {
		updateContact(contact_id);
	}
}

function importContact(){
	clearContactForm();
	navigator.contacts.pickContact(function(contact){
        var json = JSON.parse(JSON.stringify(contact));
        $('#kontakt_name').val(json.name.familyName);
		$('#kontakt_vorname').val(json.name.givenName);
		$('#kontakt_telnr').val(json.phoneNumbers[0].value);
		$('#kontakt_email').val(json.emails[0].value);
		$('#kontakt_bemerkung').val(json.note);      
    },function(err){
        alert('Fehler beim Abrufen des Kontakt. Stellen Sie sicher, dass diese App Zugriff auf Ihre Kontakte hat.');
    });
}

function clearContactForm(){
	$('#kontakt_name').val('');
	$('#kontakt_vorname').val('');
	$('#kontakt_telnr').val('');
	$('#kontakt_email').val('');
	$('#kontakt_bemerkung').val('');
	$('#k_id').val('');
}

function fillPlacesList(){
	getPlaces(function(tx, results){
			$("#places").empty();
			for (var i = 0; i < results.rows.length; i++){
				var row = results.rows.item(i);
				$("#places").append('<li> <a href="#" data-oid="' + row['oid'] + '" data-bez="' + row['BEZEICHNUNG'] +  '">' + row['BEZEICHNUNG'] + '</a></li>');
			}
			$("#places").listview('refresh');
	});
}

function fillPlaceForm(place){
	clearPlaceForm();
	var place_id = $(place).attr('data-oid')
	getPlaceDetails(place_id,function(tx,results){
		var row = results.rows.item(0); //Es kann immer nur eine Zeile zurückkommen, da ID unique ist
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

function clearPlaceForm(){
	$('#ort_bezeichnung').val('');
	$('#ort_strasse').val('');
	$('#ort_hausnummer').val('');
	$('#ort_name').val('');
	$('#ort_plz').val('');
	$('#ort_land').val('');
	$('#o_id').val('');
}

function processPlace(){
	var place_id = $('#o_id').val();
	if (place_id === ""){
		createPlace();
	} else {
		update_place(place_id);
	}
}

function fillAppointmentsList(){
	getAppointments(function(tx, results){
		//alert(results.rows.length);
			$("#appointments").empty();
				for (var i = 0; i < results.rows.length; i++){
					//alert("Row: " + i);
					var row = results.rows.item(i);
					$("#appointments").append('<li><a href="#selectedAppointment" data-kid="' + row['kid'] + '">' + row['ANFANG'] + '</a>');
			}
			//alert("Listview completed");
			$("#appointments").listview('refresh');
	});
}

function clearAppointmantForm(){
	$('#t_titel').val('');
	$('#place_name').val('');
	$('#t_start').val('');
	$('#t_end').val('');
	$('#aktiveTeilnehmer').empty();
	$('#t_file').val('');
	$('#t_note').val('');
}

function processAppointment(){
	var t_id = $('#t_id').val();
	if (t_id === ""){
		createAppointment();
	} else {
		updateAppointment(t_id);
	}
}



function calendar(control) {

  //alert("test")

  var options = {
    date: new Date(),
    mode: 'datetime'
  };
  
  function onSuccess(date) {
    alert('Selected date: ' + date);
	var time = date.getHours() + ':' + date.getMinutes();
	var day = date.getDay() +'.' + date.getMonth() + '.' + date.getFullYear();
	control.val(day + ' ' + time);
  }	

  function onError(error) { // Android only
    //alert('Error: ' + error);
  }

  datePicker.show(options, onSuccess, onError);
}
