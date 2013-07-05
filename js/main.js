var mediaService = {};
mediaService.currentlyPlaying = null;
mediaService.exportedPath = null;

function addService(displayName){
     $('ul.selectOptions').append('<li class="selectOption">' + displayName + '</li>');    
}
 
function addFile(displayName){   
     var fileID = displayName.replace(/[^a-z0-9]/gi, '_');
     $('ul.selectOptions_file').append('<li id="' + fileID + '" class="selectOption_file" data="' + displayName + '">' + displayName + '</li>');
     $('ul.selectOptions_file').css('top', $('ul.selectOptions_file').css('top').replace('px','')-30);
     
     $('#'+fileID).click(function(){
         $(this).parent().css('display','none');
         $(this).parent().siblings('span.selected_file').html($(this).html());
     });
}


function fillServicesIn(){
    webinos.discovery.findServices(new ServiceType('http://webinos.org/api/media'), {                
        onFound: function(service){            
            var serviceID = service.serviceAddress.replace(/[^a-z0-9]/gi, '_');
            
            $('ul.selectOptions').append('<li id="' + serviceID + '" class="selectOption" data="' + service + '">' + service.serviceAddress + '</li>');                                   
            $('#'+serviceID).click(function(){
                $(this).parent().css('display','none');
                $(this).parent().siblings('span.selected').html($(this).html());
                                               
                service.bindService({
                    onBind: function(service){                        
                        mediaService.selected = service;
                        console.debug("***Bound TO***")
                        console.debug(service);
                        console.debug("***************");
                        webinos.discovery.findServices(new ServiceType('http://webinos.org/api/file'), {                
                            onFound: function(fileService){            
                                console.debug("***Bound TO***");
                                console.debug(fileService.serviceAddress);
                                console.debug("***************");
                                if(fileService.serviceAddress === service.serviceAddress){
                                    fileService.bindService({
                                        onBind: function(fileService){
                                            console.debug("***Bound TO***");
                                            console.debug(fileService);
                                            console.debug("***************");                                                                                        
                                            fileService.requestFileSystem(1, 1024,function(fileSystem){  
                                                mediaService.exportedPath = fileService.description.replace(fileSystem.name+': ' ,'')+'/';
                                                loadDirectory(fileSystem.root);
                                            },function(){console.debug("errorCB");});
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
                    console.debug("found directory" + entry.name);
            }
        ) 
    };   
        
    var errorCallback = function (error) {
        alert("Error reading directory (#" + error.name + ")");
    };    
    reader.readEntries(successCallback, errorCallback);
}