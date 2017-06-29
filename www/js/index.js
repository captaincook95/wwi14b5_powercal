document.addEventListener('deviceready', startApp, false);

function startApp() {
	//alert("deviceReady");
	openDB();
	fillContactsList();
	$("#newContact").on('click', function(){
			 createContact();
        }
    );
	$("#addTeilnehmer").on('click', function(){
		 addTeilnehmer();
   }
);
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
			$("#teilnehmerSelectlist").listview('refresh');
	});
}

function addTeilnehmer(){
	var tl_name = $("#teilnehmerSelectlist").val();
	var kid = $("#teilnehmerSelectlist").attr("data-kid");
	$("#aktiveTeilnehmer").append("<li>" + tl_name + "</li>");
	$("#teilnehmerSelectlist").remove($("#teilnehmerSelectlist").selectedIndex);
}