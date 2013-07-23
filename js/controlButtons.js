function successCB(success){
    console.debug('SuccessCB: ' + success);
}

function errorCB(error){
    console.error('ErrorCB: ' + error);
}


$(document).ready(function() {
    $('div.arr-up').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.bigStepforward(successCB, errorCB);
    });
    
    $('div.arr-down').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.bigStepback(successCB, errorCB);
    });
    
    $('div.arr-left').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.stepback(successCB, errorCB);
    });
    
    $('div.arr-right').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.stepforward(successCB, errorCB);
    });
    
    $('#play').click(function(){                
        if(mediaService.selected !== null){   //service has been selected                             
            if($('span.selected_file').data('selectedFile') === undefined){ //no file selected
                console.debug('Failed to play:  ' + $('span.selected_file')[0].textContent);                                                
            }
            else { //file has been selected
                if(mediaService.currentlyPlaying === null){ //first time playback
                    console.debug('trying to play file: ' + $('span.selected_file').data('selectedFile'));
                    mediaService.selected.play(mediaService.exportedPath+$('span.selected_file').data('selectedFile'), successCB,
                        function(error){ 
                            showPlay();
                            errorCB('Play error: ' + error);
                    });            
                }
                else {
                    if(mediaService.currentlyPlaying.replace(mediaService.exportedPath ,'') !== $('span.selected_file').data('selectedFile')){     //different media selected
                        console.debug('trying to play file: ' + $('span.selected_file').data('selectedFile'));
                        mediaService.selected.play(mediaService.exportedPath+$('span.selected_file').data('selectedFile'), successCB,
                            function(error){ 
                                showPlay();
                                errorCB('Play error: ' + error);
                        });            
                    }
                    else {//resuming playback
                        mediaService.selected.playPause(function(){
                            console.debug('Resumed playback of ' + $('span.selected_file').data('selectedFile'));
                            successCB();
                        }, errorCB);
                    }
                }
            }
        }
        else{
            console.debug('Play has failed: no selected device');
            showPlay();            
        }            
    });
    
    $('#pause').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.playPause(successCB, errorCB);
    });
    
    $('div.prev').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.decreasePlaybackSpeed(successCB, errorCB);
    });
    
    $('div.next').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.increasePlaybackSpeed(successCB, errorCB);
    });
    
    $('span.stop_file').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.stop(function(success){
                $('span.selected_file').text('Choose media to play');
                $('span.selected_file').removeData('selectedFile');                                          
                successCB(success);
            }, errorCB);
    });
    
    //volume
    var clicking = false;
    var startVolume;
    
    $('#slider-handle').mousedown(function(ev){
        clicking = true;
        startVolume = Math.round(App.volume * 30 / 100)
    });    
    
    $(document).mouseup(function(ev){ 
        if(mediaService.selected !== null && clicking == true)
        {
            var relativePositionX = (ev.pageX-$('#slider-handle')[0].parentElement.offsetLeft)/$('#slider-handle')[0].parentElement.clientWidth;
            var relativePositionY = 1-((ev.pageY-$('#slider-handle')[0].parentElement.offsetTop)/$('#slider-handle')[0].parentElement.clientHeight);
            
            relativePositionX > 1 ? relativePositionX = 1 : null;
            relativePositionX < 0 ? relativePositionX = 0 : null;
            
            relativePositionY > 1 ? relativePositionY = 1 : null;
            relativePositionY < 0 ? relativePositionY = 0 : null;
            
            if(($('#slider-left').width()+$('#slider-right').width())/($('#slider-left').height()+$('#slider-right').height()) > 1) // portrait
                mediaService.selected.setVolume(Math.round(relativePositionX/0.033), successCB, function(err){ setVolumePosition(startVolume); errorCB(err);});            
            else // landscape
                mediaService.selected.setVolume(Math.round(relativePositionY/0.033), successCB, function(err){ setVolumePosition(startVolume); errorCB(err);});            
        
        }
        else if (clicking == true)
        {
            console.debug('SetVolume has failed: no selected device');
            setVolumePosition(startVolume);
        }
        
        clicking = false;
    });
    $(document).mousemove(function(ev){
        if(clicking == false)
            return;
    });      
}); 

