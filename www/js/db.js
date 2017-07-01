var db;

function openDB() {
        db = window.openDatabase("Database", "1.0", "PowerCal DB", 200000);
        db.transaction(createTables, errorCB, successCB);
		function createTables(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS TERMIN (tid INTEGER PRIMARY KEY, ANFANG TEXT, ENDE TEXT, TITEL TEXT, BESCHREIBUB TEXT, OID INTEGER);");
			tx.executeSql("CREATE TABLE IF NOT EXISTS KUNDE (kid INTEGER PRIMARY KEY, VORNAME TEXT, NACHNAME TEXT, TELNR TEXT,EMAIL TEXT, OID INTEGER,BEMERKUNG TEXT);");
			tx.executeSql("CREATE TABLE IF NOT EXISTS DOKUMENT (did INTEGER PRIMARY KEY, TID INTEGER, FILE BLOB,DATUM TEXT,BEMERKUNG TEXT,MIMETYPE TEXT);");
			tx.executeSql("CREATE TABLE IF NOT EXISTS ORT (oid INTEGER PRIMARY KEY,PLZ TEXT,LAND TEXT, STADT TEXT, STRASSE TEXT, HAUSNUMMER TEXT, BEZEICHNUNG TEXT);");
			tx.executeSql("CREATE TABLE IF NOT EXISTS TERMIN_KUNDE (TID INTEGER , KID INTEGER);");
		}
		function errorCB(err){
			alert(err.code+ ' ' +  err.message);
		}
		function successCB(){
			//alert("Tabellen angelegt");
		}
    }
	
function createContact(){
		var vname = $("#kontakt_vorname").val();
		var nname = $("#kontakt_name").val();
		var telnr = $("#kontakt_telnr").val();
		var email = $("#kontakt_email").val();
		var bem = $("#kontakt_bemerkung").val();
		//alert(vname+nname+telnr+email+bem);
		db.transaction(newContact, errorCB, successCB);
		function newContact(tx){
			tx.executeSql("INSERT INTO KUNDE (VORNAME,NACHNAME,TELNR,EMAIL,BEMERKUNG) VALUES (?,?,?,?,?)",[vname,nname,telnr,email,bem]);
		}
		function errorCB(err){
			alert(err.code+ ' ' +  err.message);
		}
		function successCB(){
			alert("Kontakt angelegt");
			fillContactsList();
			location.href="#contacts_overview";
		}
}

function updateContact(kid){
	var vname = $("#kontakt_vorname").val();
	var nname = $("#kontakt_name").val();
	var telnr = $("#kontakt_telnr").val();
	var email = $("#kontakt_email").val();
	var bem = $("#kontakt_bemerkung").val();
	db.transaction(update, errorCB, successCB);
	function update(tx){
		tx.executeSql("UPDATE KUNDE SET " +
				"VORNAME = ?, NACHNAME = ?, TELNR = ?, EMAIL = ? , BEMERKUNG = ? " +
				"WHERE kid = ?",[vname,nname,telnr,email,bem,kid]);
	}
	function errorCB(err){
		alert(err.code+ ' ' +  err.message);
	}
	function successCB(){
		alert("Kontakt aktualisiert");
		fillContactsList();
		location.href="#contacts_overview";
	}
}

function deleteContact(kid){
	db.transaction(update, errorCB, successCB);
	function update(tx){
		tx.executeSql("DELETE FROM KUNDE " +
				"WHERE kid = ?",[kid]);
	}
	function errorCB(err){
		alert(err.code+ ' ' +  err.message);
	}
	function successCB(){
		alert("Kontakt gelöscht");
		fillContactsList();
		location.href="#contacts_overview";
	}
}

function getContacts(callback){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM KUNDE ORDER BY NACHNAME",[],callback);
	},errorCB,successCB);
	function errorCB(err){
	}
	function successCB(){
	}
}

function getContactDetails(kid,callback){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM KUNDE WHERE kid = ?",[kid],callback);
	},errorCB,successCB);
	function errorCB(err){
	}
	function successCB(){
	}
}

function getPlaces(callback){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM ORT ORDER BY BEZEICHNUNG",[],callback);
	},errorCB,successCB);
	function errorCB(err){
	}
	function successCB(){
	}
}
	
function createPlace(){
	var bezeichnung = $('#ort_bezeichnung').val();
	var strasse = $('#ort_strasse').val();
	var hausnummer = $('#ort_hausnummer').val();
	var stadt = $('#ort_name').val();
	var plz = $('#ort_plz').val();
	var land = $('#ort_land').val();
	db.transaction(newPlace, errorCB, successCB);
	function newPlace(tx){
		tx.executeSql("INSERT INTO ORT (BEZEICHNUNG,STRASSE,HAUSNUMMER,STADT,PLZ,LAND) VALUES " +
				"(?,?,?,?,?,?)",[bezeichnung,strasse,hausnummer,stadt,plz,land]);
	}
	function errorCB(err){
		alert(err.code+ ' ' +  err.message);
	}
	function successCB(){
		alert("Ort gespeichert");
		fillPlacesList();
		location.href="#places_overview";
	}
}	
	
function getPlaceDetails(oid,callback){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM ORT WHERE oid = ?",[oid],callback);
	},errorCB,successCB);
	function errorCB(err){
	}
	function successCB(){
	}
}	
	
function updatePlace(oid){
	var bezeichnung = $('#ort_bezeichnung').val();
	var strasse = $('#ort_strasse').val();
	var hausnummer = $('#ort_hausnummer').val();
	var stadt = $('#ort_name').val();
	var plz = $('#ort_plz').val();
	var land = $('#ort_land').val();
	db.transaction(updateOrt, errorCB, successCB);
	function updateOrt(tx){
		tx.executeSql("UPDATE ORT SET " +
				"BEZEICHNUNG = ?, STRASSE = ?, HAUSNUMMER = ?, STADT = ? , PLZ = ?, LAND = ? " +
				"WHERE oid = ?",[bezeichnung,strasse,hausnummer,stadt,plz,land,oid]);
	}
	function errorCB(err){
		alert(err.code+ ' ' +  err.message);
	}
	function successCB(){
		alert("Ort aktualisiert");
		fillPlacesList();
		location.href="#Places_overview";
	}
}	

function deletePlace(oid){
	db.transaction(delPlace, errorCB, successCB);
	function delPlace(tx){
		tx.executeSql("DELETE FROM ORT " +
				"WHERE oid = ?",[oid]);
	}
	function errorCB(err){
		alert(err.code+ ' ' +  err.message);
	}
	function successCB(){
		alert("Ort gelöscht");
		fillPlacesList();
		location.href="#places_overview";
	}
}