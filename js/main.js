function addService(displayName){
     $('ul.selectOptions').append('<li class="selectOption">' + displayName + '</li>');    
}
 
function addFile(displayName){
     $('ul.selectOptions_file').append('<li class="selectOption_file">' + displayName + '</li>');     
     $('ul.selectOptions_file').css('top', $('ul.selectOptions_file').css('top').replace('px','')-30);     
}
 
 

$(document).ready(function() {
     addService("Media-API #1");
     addService("Media-API #2");
     addService("Media-API #3");
     addService("Media-API #4");
     addService("Media-API #5");
     addFile("File #1");
     addFile("File #2");
     addFile("File #3");
     addFile("File #4");
});