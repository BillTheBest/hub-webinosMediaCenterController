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
        if(typeof mediaService.selected !== 'undefined'){                                    
            if($('span.selected_file').data('selectedFile') === undefined){
                console.debug('Failed to play:  ' + $('span.selected_file')[0].textContent);                
                App.nowPlaying = true;
                addClass(document.getElementById('play-pause'), 'nowplaying');                
            }
            else {
                if(mediaService.currentlyPlaying !== $('span.selected_file').data('selectedFile')){
                    console.debug('trying to play file: ' + $('span.selected_file').data('selectedFile'));
                    mediaService.selected.play(mediaService.exportedPath+$('span.selected_file').data('selectedFile'), 
                        function(success){
                            $('span.selected_file').text('Now playing ' + $('span.selected_file').data('selectedFile'));
                            mediaService.currentlyPlaying = $('span.selected_file').data('selectedFile');
                            successCB(success);                        
                        }, 
                        function(error){                        
                            removeClass(document.getElementById('play-pause'), 'nowplaying');
                            App.nowPlaying = false;
                            errorCB('Play error: ' + error);
                    });            
                }
                else
                    mediaService.selected.playPause(successCB, errorCB);                    
            }
        }
        else{
            console.debug('Play has failed: no selected media to play');
            App.nowPlaying = true;
            addClass(document.getElementById('play-pause'), 'nowplaying');            
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
                
                removeClass(document.getElementById('play-pause'), 'nowplaying');
                App.nowPlaying = false;                
                successCB(success);
            }, errorCB);
    });
    
    //volume
    var clicking = false;
    var startPosition = {};
    var volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
    
    $('#slider-handle').mousedown(function(ev){
        clicking = true;
        startPosition.x = ev.pageX;
        startPosition.y = ev.pageY;
        
    });    
    $(document).mouseup(function(){
        clicking = false;
    })    
    $(document).mousemove(function(ev){
        if(clicking == false)
            return;
        
        //console.log(($('#slider-left').width()+$('#slider-right').width())/($('#slider-left').height()+$('#slider-right').height()) );
        
        if (($('#slider-left').width()+$('#slider-right').width())/($('#slider-left').height()+$('#slider-right').height()) > 1){
            if(Math.abs(volume - $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth) > 0.05){
                //==0 == numeric cancellation
                if(volume - ($('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth) < 0){ //volumeUP
                    volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
                    mediaService.selected.volumeUP(successCB, errorCB);                
                }
                else{ //volume down
                    volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
                    mediaService.selected.volumeDOWN(successCB, errorCB);                
                }
            }
        }
        else{
            if(Math.abs(volume - $('#slider-handle')[0].offsetTop/$('#slider-handle')[0].parentElement.clientHeight) > 0.05){ //==0 == numeric cancellation
                if(volume - ($('#slider-handle')[0].offsetTop/$('#slider-handle')[0].parentElement.clientHeight) > 0){ //volumeUP
                    volume = $('#slider-handle')[0].offsetTop/$('#slider-handle')[0].parentElement.clientHeight;
                    mediaService.selected.volumeUP(successCB, errorCB);                
                }
                else{ //volume down
                    volume = $('#slider-handle')[0].offsetTop/$('#slider-handle')[0].parentElement.clientHeight;
                    mediaService.selected.volumeDOWN(successCB, errorCB);                
                }
            }
        }
    });      
}); 

