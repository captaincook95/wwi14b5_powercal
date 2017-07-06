function validate(form_name)
{
	var results = "";
	var id;
	var name;
	$('#' + form_name + ' *').filter(':input').each(function(){
		id = this.id;
		name = $('label[for="' + id + '"]').text();
	    if ($('#' + id).attr('required') == 'required' && $('#' + id).val() == ''){
	    	results = results + "Das Feld " + 
	    	name + 
	    	" ist ein Pflichtfeld \n";
	    }
	});
	
	return results;
}