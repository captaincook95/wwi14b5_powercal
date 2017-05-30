document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

function onDeviceReady() {
		alert("db.js onDeviceReady");
        var db = window.openDatabase("Database", "1.0", "PowerCal DB", 200000);
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
			alert('Tabellen angelegt');
		}
    }
	
	
	
	
	
	
	