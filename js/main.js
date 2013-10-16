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
    webinos.discovery.findServices(new ServiceType('http://webinos.org/api/mediaplay'), {                
        onFound: function(service){            
            //var serviceID = service.serviceAddress.replace(/[^a-z0-9]/gi, '_');
            var serviceID = service.id;
            
            $('ul.selectOptions').append('<li id="' + serviceID + '" class="selectOption" data="' + service + '">' + service.serviceAddress + ' ' + service.displayName + '</li>');                                   
            $('#'+serviceID).click(function(){
                $(this).parent().css('display','none');
                $(this).parent().siblings('span.selected').html($(this).html());             
                
                service.bindService({
                    onBind: function(service){  
                        if(mediaService.registeredListeners === true){
                            mediaService.registeredListeners = false;
                            mediaService.selected.removeAllListeners(successCB, errorCB);
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
                        
                        if(service.description.indexOf('(XBMC)') == -1){
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
                        else{ //binding to XBMC                            
                            var xbmcIpAddr = service.description.replace(/.*\ /gi, '');
//                             var url = 'http://xbmc:@'+xbmcIpAddr+':8080/jsonrpc', _data = {jsonrpc:"2.0", method:"JSONRPC.Version", id:"13"};                            
//                              $.ajaxSetup({converters:{'jsonp':function(raw){console.debug(raw);return raw;}}});
//                              $.ajax({
//                                     url: url+'?request='+JSON.stringify(_data),
//                                     type: 'GET',
//                                     dataType: 'jsonp',
//                                     dataFilter: function(data, dataType){console.debug(data);console.debug(dataType);};,
//                                     jsonp: 'function(){}',
//                                     converters: {"jsonp":function(data){console.debug(data);return data;}},
//                                     contentType: 'application/json',
//                                     success: function(data) {
//                                         console.debug("--------------json2rpc success"); 
//                                         console.debug(data); 
//                                     },
//                                     error: function(xhr, status, err) {
//                                         console.error("----------------json2rpc error: " + status);
//                                         console.debug(xhr);
//                                         console.debug(status);
//                                         console.debug(err);
//                                     }
//                              });
            
                            if(!'WebSocket' in window){
                                 console.error("browser does not supports websokets");
                                 return false;
                            }
                            else
                                console.debug("browser supports websokets");
                            
                            var wsUrl = unescape(encodeURI('ws://'+xbmcIpAddr+':9090/jsonrpc')),
                                ws = new WebSocket(wsUrl),
                                id = 100,
                                _data = {id:++id, jsonrpc:'2.0', method:'Files.GetDirectory', params:{directory:'/sdcard/Movies', media:'video'}};
                                
                            $('ul.selectOptions_file').empty();
                            $('ul.selectOptions_file').append('<li id="-1" class="selectOption_file" data="">Now loading...</li>');
                            
                            var timerId = setTimeout(function(){
                                delete ws;
                                $('ul.selectOptions_file').empty();
                                $('ul.selectOptions_file').append('<li id="-1" class="selectOption_file" data="">Connection hanged. Please reselect the source device.</li>');
                            }, 10000);

                            ws.onopen = function(){
                                 console.debug("ws opened");
                                 ws.send(JSON.stringify(_data));
                            };
                            ws.onmessage = function(evt){
                                var data = JSON.parse(evt.data);
                                if(data.id !== undefined && data.result !== undefined){
                                    console.debug('----onMessage---');
                                    console.debug(data);
                                    console.debug(data.result.files);
                                    console.debug('----------------');
                                    $('ul.selectOptions_file').empty();

                                    if(data.result.files.length>0)
                                        mediaService.exportedPath = data.result.files[0].file.replace(data.result.files[0].label, '');
                                    for(var i=0;i<data.result.files.length;i++)
                                        if(data.result.files[i].filetype === 'file')
                                            addFile(data.result.files[i].label);
                                }
                                if(data.error){
                                    console.debug('----onError---');
                                    console.debug(data.error);
                                    console.debug('----------------');
                                    $('ul.selectOptions_file').empty();
                                    $('ul.selectOptions_file').append('<li id="-1" class="selectOption_file" data="">XBMC files directory not supported</li>');
                                }
                                if(data.id == id){
                                    delete ws;
                                    clearTimeout(timerId);
                                }
                            };
                            
                            ws.onerror = function(err){
                                console.debug('----onError---');
                                console.error(err);
                                $('ul.selectOptions_file').empty();
                                $('ul.selectOptions_file').append('<li id="-1" class="selectOption_file" data="">Error while loading files...</li>');
                                console.debug('--------------');
                            };
                            ws.onclose = function(){
                                console.debug("ws is closed.");
                            };
                        }
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
            mediaService.selected.removeAllListeners();
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
    
    callback.onPlay = function(playStatus){
        console.debug("Received event onPlay. Player is playing media " + playStatus.currentMedia + " at volume " + playStatus.volume + "/30");
        mediaService.currentlyPlaying = playStatus.currentMedia;
        setVolumePosition(playStatus.volume);
        showPause();        
        setSelectedFile('Now playing ', mediaService.currentlyPlaying);
    };
    
    callback.onStop = function(){
        console.debug("Received event onStop");
        showPlay();
        $('span.selected_file').text('Choose media to play');
    };
    
    callback.onPause = function(){
        console.debug("Received event onPause");
        if(App.nowPlaying === true)
            showPlay();                    
        else
            showPause();
    };
    
    callback.onEnd = function(){        
        console.debug("Received event onEnd");
        mediaService.currentlyPlaying = null;
        showPlay();
        $('span.selected_file').text('Choose media to play');
    };    
    
    callback.onVolume = function(volume){
        setVolumePosition(volume);
        console.debug("Received event onVolume. Volume set at " + volume);
    };
        
    mediaService.selected.registerListeners(callback, function(success){
        mediaService.registeredListeners = true;
        successCB(success);
    }, errorCB);
}


