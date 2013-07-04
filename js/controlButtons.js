$(document).ready(function() {
    $('div.arr-up').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.bigStepforward();
    });
    
    $('div.arr-down').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.bigStepback();
    });
    
    $('div.arr-left').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.stepback();
    });
    
    $('div.arr-right').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.stepforward();
    });
    
    $('#play').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.play();
    });
    
    $('#pause').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.playPause();
    });
    
    $('div.prev').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.increasePlaybackSpeed();
    });
    
    $('div.next').click(function(){
        if(typeof mediaService.selected !== 'undefined')
            mediaService.selected.decreasePlaybackSpeed();
    });
    
    
    var clicking = false;
    var volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
    console.log($('#slider-handle'));
    
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
                console.log('up');
            }
            else{ //volume down
                volume = $('#slider-handle')[0].offsetLeft/$('#slider-handle')[0].parentElement.clientWidth;
                console.log('down');
            }
        }
    });      
}); 

