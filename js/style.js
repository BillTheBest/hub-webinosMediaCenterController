function showPlay(){
    var playPause = document.getElementById('play-pause');
    
    playPause.className = 'button';
    App.nowPlaying = false;
    console.debug("Setting application in show-play status");
}

function showPause(){
    var playPause = document.getElementById('play-pause');
    
    playPause.className = 'button nowplaying';
    App.nowPlaying = true;
    console.debug("Setting application in show-pause status");
}

function setVolumePosition(steps){
    App.volume = Math.round(steps * 100 / 30);
    that.redraw();
}

function setSelectedFile(prefix ,fullPath){
    /*this methods don't work because the exportedPath is not filled in when refreshing and a media is already playing
    $('span.selected_file').text(prefix + fullPath.replace(mediaService.exportedPath ,''));        
    $('span.selected_file').data('selectedFile', fullPath.replace(mediaService.exportedPath ,''));*/
    $('span.selected_file').text(prefix + fullPath.split('/')[fullPath.split('/').length-1]);
    $('span.selected_file').data('selectedFile', fullPath.split('/')[fullPath.split('/').length-1]);
}

function removeClass(element, className) {
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;
	var newClassString = '';
	var indexPos = classString.indexOf(className);    
	if(indexPos == -1) {
		return;
	} else if (indexPos == 0) {
		newClassString = classString.substring(0, indexPos) + classString.substr(indexPos+className.length);
	} else {
		newClassString = classString.substring(0, indexPos-1) + classString.substr(indexPos+className.length);
	}
	element.className = newClassString;    
}

function addClass(element, className) {    
	if(typeof element != 'object') element = document.getElementById(element);
	var classString = element.className;            
	if(classString != '') {
		var indexPos = classString.indexOf(className);           
		if(indexPos == -1) {
			element.className += ' '+className;
		}
	} else {
		element.className = className;
	}	
}

function getStyle(element,styleProp) {
	if(typeof element != 'object') element = document.getElementById(element);
	var style;
	if (element.currentStyle) {
		style = element.currentStyle[styleProp];
	} else if (window.getComputedStyle) {
		style = document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp);
	}
	return style;
}


/* INIT */


var App = {};
App.nightmode = false;
App.nowPlaying = false;
App.volume = 30;

window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

document.getElementById('nightmode').onclick = function() {
	if(App.nightmode) {
		removeClass(document.body, 'nightmode');
		App.nightmode = false;
	} else {
		addClass(document.body, 'nightmode');
		App.nightmode = true;
	}
}

// document.getElementById('play-pause').onclick = function() {
// 	if(App.nowPlaying) {
// 		removeClass(this, 'nowplaying');
// 		App.nowPlaying = false;
// 	} else {
// 		addClass(this, 'nowplaying');
// 		App.nowPlaying = true;
// 	}
// }

var that;

function VolumeSlider() {
	that = this;

    that.container = document.getElementById('volume');
	that.volumeActiveBar = document.getElementById('slider-left');
	that.volumeInactiveBar = document.getElementById('slider-right');
	that.volumeHandle = document.getElementById('slider-handle');

	that.container_width = 0;
    that.container_height = 0;
	that.current_pos = 0;
	that.step = 0; //pixels for one percent

	
	
	that.init = function() {
		that.setDimensions();       
	};

	that.setDimensions = function() {
        console.log("setDimensions setDimensions");
		if(that.container_width != that.container.offsetWidth || that.container_height != that.container.offsetHeight) 
        {
			that.container_width = that.container.offsetWidth;
            that.container_height = that.container.offsetHeight;
            console.log("width " + that.container_width + "\n height " + that.container_height);
            //that.step = that.container_width / 100 > that.container_height / 100 ? that.container_width / 100 : that.container_height / 100;
            if (that.container_width / 100 > that.container_height / 100)
            {
                //PORTRAIT
                that.volumeHandle.style.left = App.volume+'%';
                that.volumeHandle.style.top = '0';
                that.volumeActiveBar.style.width = App.volume+'%';
                that.volumeActiveBar.style.height = '10px';
                that.volumeActiveBar.style.top = 'auto';
                that.volumeInactiveBar.style.width = (100-App.volume)+'%';
                that.volumeInactiveBar.style.height = '10px';
                that.step = that.container_width / 100;
                that.current_pos = that.step*App.volume;
                that.redraw();
            }
            else
            {
                //LANDSCAPE
                that.volumeHandle.style.top = (100-App.volume)+'%';
                that.volumeHandle.style.left = '50%';
                that.volumeActiveBar.style.width = '10px';
                that.volumeActiveBar.style.height = App.volume+'%';
                that.volumeActiveBar.style.top = (100-App.volume)+'%';
                that.volumeInactiveBar.style.width = '10px';
                that.volumeInactiveBar.style.height = (100-App.volume)+'%';
                that.step = that.container_height / 100;
                that.current_pos = that.step*App.volume;
                that.redraw();
            }
		}
	};

	that.setSliderPos = function(move) {
		var newPos = that.current_pos + move;
		if(newPos < 0) { //skipped those two for a more natural behaviour
            //newPos = 0;
        } else if(newPos > that.container_width && newPos > that.container_height) {
			//newPos = that.container_width;
		} else {
			var check = newPos - (App.volume*that.step);
			if(check < -(that.step)) {
				App.volume -= Math.round(-(check)/that.step);
			} else if(check > that.step) {
				App.volume += Math.round(check/that.step);
			}
			that.redraw();
		}

		that.current_pos = newPos;
	}

	that.redraw = function() {
        if(that.container_width > that.container_height)
        {
            //console.log("PORTRAIT");
            that.volumeHandle.style.left = App.volume+'%';
            that.volumeActiveBar.style.width = App.volume+'%';
            that.volumeInactiveBar.style.width = (100-App.volume)+'%';
        }
        else
        {
            //console.log("LANDSCAPE");
            that.volumeHandle.style.top = (100-App.volume)+'%';
            that.volumeActiveBar.style.height = App.volume+'%';
            that.volumeActiveBar.style.top = (100-App.volume)+'%';
            that.volumeInactiveBar.style.height = (100-App.volume)+'%';
        }
	}

	function handleHammer(ev) {
		//console.log(ev);
		// disable browser scrolling
		ev.gesture.preventDefault();

		switch(ev.type) {
			case 'touch':
				//that.setDimensions();
				that.current_pos = that.step*App.volume;
				that.oldDeltaX = 0;
                that.oldDeltaY = 0;
				break;
			case 'dragright':
			case 'dragleft':
                if(that.container_width > that.container_height)
                {
                    that.setSliderPos(ev.gesture.deltaX - that.oldDeltaX);
                    that.oldDeltaX = ev.gesture.deltaX;
                }
				break;
            case 'dragup':
            case 'dragdown':
                if (that.container_height > that.container_width)  //da migliorare
                {
                    that.setSliderPos(that.oldDeltaY - ev.gesture.deltaY);
                    that.oldDeltaY = ev.gesture.deltaY;
                }
                break;
		}
	}

	Hammer(this.volumeHandle, { drag_lock_to_axis: true, drag_min_distance: 3 }).on("touch dragleft dragright dragup dragdown", handleHammer);
}

var volSlider = new VolumeSlider().init();

window.addEventListener("resize", that.setDimensions, false);

