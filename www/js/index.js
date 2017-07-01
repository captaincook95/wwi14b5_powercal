document.addEventListener('deviceready', startApp, false);

function startApp() {
	//alert("deviceReady");
	openDB();
	fillContactsList();
	$("#newContact").on('click', function(){
		processContact();
	});
	$("#addTeilnehmer").on('click', function(){
		addTeilnehmer();
	});
	$(document).on('click','#contacts a', function(){
		$("#importContact").hide();
		fillContactForm(this);
	});
	$(document).on('click','#newContactForm', function(){
		clearContactForm();
		$("#deleteContact").hide();
		$("#importContact").show();
	});
	$("#deleteContact").on('click', function(){
		if (confirm("Wollen sie den Kontakt " + $('#kontakt_name').val() + ", " + $('#kontakt_vorname').val() + " wirklich löschen?") == true){
			deleteContact($('#k_id').val());
		}
	});
	$("#importContact").on('click', function(){
		importContact();
	});
}

function fillContactsList(){
	getContacts(function(tx, results){
		//alert(results.rows.length);
			$("#contacts").empty();
			$("#teilnehmerSelectlist").empty();
			for (var i = 0; i < results.rows.length; i++){
				//alert("Row: " + i);
				var row = results.rows.item(i);
				//alert("Kontakt gefunden: " + row['NACHNAME'] + ', ' + row['VORNAME'] + ', kid = ' + row['kid']);
				$("#contacts").append('<li><a href="#contact_details" data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</a>');
				$("#teilnehmerSelectlist").add('<option data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</option>');
			}
			//alert("Listview completed");
			$("#contacts").listview('refresh');
			$("#teilnehmerSelectlist").selectmenu('refresh',true);
	});
}

function addTeilnehmer(){
	var tl_name = $("#teilnehmerSelectlist").val();
	var kid = $("#teilnehmerSelectlist").attr("data-kid");
	$("#aktiveTeilnehmer").append("<li>" + tl_name + "</li>");
	$("#teilnehmerSelectlist").remove($("#teilnehmerSelectlist").selectedIndex);
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
        alter.log('Fehler beim Abrufen des Kontakt. Stellen Sie sicher, dass diese App Zugriff auf Ihre Kontakte hat.');
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