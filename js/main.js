var mediaService = {};
mediaService.currentlyPlaying = null;
mediaService.exportedPath = null;
mediaService.selected = null;
mediaService.registeredListeners = false;

function addService(displayName){
     $('ul.selectOptions').append('<li class="selectOption">' + displayName + '</li>');    
}


function addFile(displayName){       
    var fileID = displayName.replace(/[^a-z0-9]/gi, '_');    
    $('ul.selectOptions_file').append('<li id="' + fileID + '" class="selectOption_file" data="' + displayName + '">' + displayName + '</li>');    
    $('#'+fileID).click(function(){setSelectedFile('Ready to play ', mediaService.exportedPath+$(this).html());});         
//     $('#noMediaLabel').css('display','none');
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
                        if(mediaService.registeredListeners === true){
                            mediaService.registeredListeners = false;
                            mediaService.selected.unregisterListenersOnLeave(successCB, errorCB);
                        }
                        
                        mediaService.selected = service;
                        console.debug("***Bound TO MEDIA***")
                        console.debug(service);
                        console.debug("********************");
                                              
                        registerListeners();   
                        
                        mediaService.selected.isPlaying(function(status){
                            console.debug("***Received player STATUS***");
                            console.debug(status);
                            console.debug("****************************");
                            
                            setVolumePosition(status.volume);
                            mediaService.currentlyPlaying = status.currentMedia;
                            
                            if(status.isPlaying == false && status.currentMedia != null){    //onPause
                                showPlay();                                
                                setSelectedFile('Now playing ', mediaService.currentlyPlaying);
                            }
                            else if(status.isPlaying == true){   //playing
                                showPause();                  
                                setSelectedFile('Now playing ', mediaService.currentlyPlaying);
                            }
                        }, errorCB);
                        
                        webinos.discovery.findServices(new ServiceType('http://webinos.org/api/file'), {                
                            onFound: function(fileService){                                            
                                
                                if(fileService.serviceAddress === service.serviceAddress){
                                    fileService.bindService({
                                        onBind: function(fileService){
                                            console.debug("***Bound TO FILE***");
                                            console.debug(fileService);
                                            console.debug("*******************");                                                             
                                            $('ul.selectOptions_file').empty();
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
    
    //unregister listeners before closing or refreshing
    window.addEventListener('beforeunload', function(event) {        
        console.debug(event);
        if(mediaService.selected != null)
            mediaService.selected.unregisterListenersOnExit();
    });
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


function registerListeners(){
    var callback = {};
    console.debug("***Registering Listeners for service***");
    console.debug(mediaService.selected);
    console.debug("***************************************");    
    
    callback.onPlay = function(event){
        console.debug("Received event " + event.type + " : " + event.payload.currentMedia + " at volume " + event.payload.volume + "/30");
        mediaService.currentlyPlaying = event.payload.currentMedia;
        setVolumePosition(event.payload.volume);
        showPause();        
        setSelectedFile('Now playing ', mediaService.currentlyPlaying);
    };
    
    callback.onStop = function(event){
        console.debug("Received event " + event.type + " : " + event.payload);
        showPlay();
        $('span.selected_file').text('Choose media to play');
    };
    
    callback.onPause = function(event){
        console.debug("Received event " + event.type + " : " + event.payload);
        if(App.nowPlaying === true)
            showPlay();                    
        else
            showPause();
    };
    
    callback.onEnd = function(event){        
        console.debug("Received event " + event.type + " : " + event.payload);
        mediaService.currentlyPlaying = null;
        showPlay();
        $('span.selected_file').text('Choose media to play');
    };
    
    callback.onVolumeUP = function(event){
        setVolumePosition(event.payload);
        console.debug("Received event " + event.type + " : " + event.payload);
    };
    
    callback.onVolumeDOWN = function(event){
        setVolumePosition(event.payload);
        console.debug("Received event " + event.type + " : " + event.payload);
    };
    
    callback.onVolumeSet = function(event){
        setVolumePosition(event.payload);
        console.debug("Received event " + event.type + " : " + event.payload);
    };
        
    mediaService.selected.registerListeners(callback, function(success){
        mediaService.registeredListeners = true;
        successCB(success);
    }, errorCB);
}


