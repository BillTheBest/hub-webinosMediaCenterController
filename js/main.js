var mediaService = {};

function addService(displayName){
     $('ul.selectOptions').append('<li class="selectOption">' + displayName + '</li>');    
}
 
function addFile(displayName){   
    $('ul.selectOptions_file').append('<li id="' + displayName.split('.')[0] + '" class="selectOption_file" data="' + displayName + '">' + displayName + '</li>');
     $('ul.selectOptions_file').css('top', $('ul.selectOptions_file').css('top').replace('px','')-30);
     
     $('#'+displayName.split('.')[0]).click(function(){
         $(this).parent().css('display','none');
         $(this).parent().siblings('span.selected_file').html($(this).html());
     });
}


function fillServicesIn(){
    webinos.discovery.findServices(new ServiceType('http://webinos.org/api/media'), {                
        onFound: function(service){            
            
            $('ul.selectOptions').append('<li id="' + service.serviceAddress + '" class="selectOption" data="' + service + '">' + service.serviceAddress + '</li>');           
            
            $('#'+service.serviceAddress).click(function(){
                $(this).parent().css('display','none');
                $(this).parent().siblings('span.selected').html($(this).html());
                                               
                service.bindService({
                    onBind: function(service){                        
                        mediaService.selected = service;
                        console.log(service);
                        webinos.discovery.findServices(new ServiceType('http://webinos.org/api/file'), {                
                            onFound: function(fileService){            
                                console.log("***Bound TO***");
                                console.log(fileService.serviceAddress);
                                console.log("***************");
                                if(fileService.serviceAddress === service.serviceAddress){
                                    fileService.bindService({
                                        onBind: function(fileService){
                                            console.log("***Bound TO***");
                                            console.log(fileService);
                                            console.log("***************");
                                            fileService.requestFileSystem(1, 1024,function(fileSystem){                                                                                                                                                
                                                loadDirectory(fileSystem.root);
                                            },function(){console.log("errorCB");});
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }
    });
}



$(document).ready(function() {
    webinos.session.addListener('registeredBrowser', fillServicesIn);
});



function loadDirectory(directory){       
    var reader = directory.createReader();
    
    var successCallback = function(entries) {
        entries.forEach(
            function (entry) {
                var entryType = ((entry.isDirectory==true) ? 'folder' : 'file');

                if (entry.isDirectory==false)
                    addFile(entry.name);
                else
                    console.log("found directory" + entry.name);
            }
        ) 
    };   
        
    var errorCallback = function (error) {
        alert("Error reading directory (#" + error.name + ")");
    };    
    reader.readEntries(successCallback, errorCallback);
}