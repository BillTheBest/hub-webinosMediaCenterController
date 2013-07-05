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
            console.debug('Now playing: ' + mediaService.exportedPath+$('span.selected_file')[0].textContent);
            mediaService.selected.play(mediaService.exportedPath+$('span.selected_file')[0].textContent, successCB, errorCB);            
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
//                 nowPlaying();
            }, errorCB);
    });
    
    //volume
    var clicking = false;
    var volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
    
    $('#slider-handle').mousedown(function(){
        clicking = true;        
    });    
    $(document).mouseup(function(){
        clicking = false;
    })    
    $(document).mousemove(function(){
        if(clicking == false)
            return;

        if(Math.abs(volume - $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth) > 0.05){ //==0 == numeric cancellation
            if(volume - ($('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth) < 0){ //volumeUP
                volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
                mediaService.selected.volumeUP(successCB, errorCB);                
            }
            else{ //volume down
                volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
                mediaService.selected.volumeDOWN(successCB, errorCB);                
            }
        }
    });      
}); 

