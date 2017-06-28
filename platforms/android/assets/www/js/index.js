document.addEventListener('deviceready', startApp, false);

function startApp() {
	//alert("deviceReady");
	openDB();
	fillContactsList();
	$("#newContact").on('click', function(){
			 createContact();
        }
    );
}

function fillContactsList(){
	getContacts(function(tx, results){
		//alert(results.rows.length);
			$("#contacts").empty();
			for (var i = 0; i < results.rows.length; i++){
				//alert("Row: " + i);
				var row = results.rows.item(i);
				//alert("Kontakt gefunden: " + row['NACHNAME'] + ', ' + row['VORNAME'] + ', kid = ' + row['kid']);
				$("#contacts").append('<li><a href="#contact_details" data-kid="' + row['kid'] + '">' + row['NACHNAME'] + ', ' + row['VORNAME'] + '</a>');
			}
			//alert("Listview completed");
			$("#contacts").listview('refresh');
	});
}