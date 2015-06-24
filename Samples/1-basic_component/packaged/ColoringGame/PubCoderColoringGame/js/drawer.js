    var Trig = {
        distanceBetween2Points: function ( point1, point2 ) {
            
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;
            return Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ) );  
        },
        
        angleBetween2Points: function ( point1, point2 ) {
        
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;   
            return Math.atan2( dx, dy );
        }
    }

    var Sketcher = function(canvasID, brushImage, bgcolor) {
        var sk = this;

        this.renderFunction = function(event){
            if(sk.curTool == 'marker') this.updateCanvasByLine(event);
            else if(sk.curTool == 'crayon') this.updateCanvasByBrush(event);
            else if(sk.curTool == 'eraser') this.updateCanvasByLineEraser(event);
            else return; 
        }

        this.brush = undefined;
        this.canvasID = canvasID;
        this.drawer = $("#"+canvasID );
        this.canvas = $("#"+canvasID + " canvas.drawing-area");
        this.context = this.canvas[0].getContext("2d"); 
        this.context.strokeStyle = "#000000";
        this.context.lineJoin = "round";

        this.canvas_touch = $("#"+canvasID + " canvas.drawing-area-touch");
        this.context_touch = this.canvas_touch[0].getContext("2d"); 

        this.lastMousePoint = {x:0, y:0};
        this.curTool = 'marker';
        this.curColor = '#000000';
        this.curSize = $('.size.selected').attr("data-size")/1;

        //bgcolor
        this.bgcolor = bgcolor;

        this.canvas_touch.bind( window.touchDownEvent, this.onCanvasMouseDown() );
        this.drawer.on( window.touchDownEvent, function(e){ e.preventDefault() });

        this.drawer.find(".tool").on(window.touchDownEvent , function(e){
            sk.drawer.find(".tool").removeClass("selected");
            $(this).addClass("selected");
            if($(this).is(".tool-crayon")) sk.curTool = 'crayon';
            if($(this).is(".tool-marker")) sk.curTool = 'marker';
            if($(this).is(".tool-eraser")) sk.curTool = 'eraser';
            e.preventDefault();
        });

        this.selectColor = function(){
            sk.drawer.find(".color").removeClass("selected");
            $(this).addClass("selected");
            sk.curColor = $(this).attr("data-color");
        };
            

        this.loadBrush = function(){
            this.brush = new Image();
            this.brush.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEX///////9VfPVsAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfeAhQKGhjvjaMMAAAFK0lEQVQ4yx3Ub0wTdxgH8O9dr/WAwo5asCLbrnCFFnUUBBTjtl9LMQWrlomKiEsBdZg5wxj+WxZzLcXVWrUoMqrMHQgEnBJ0kxdmIVdERZ0ONcvQ7AUQx9zcFlyWzBf7d+71kzzJ83yf5wOOf2YoraqV7eT3qAjiQ6jKGDC1gDVL4BiLRYi3HqlhUjkRRcsEnY3Oc3ck9LcTxJnZ3OHdtjjaL5pkWNIMtDAt2oQ2rxGwOGq0+1znb40eyw9YYT/NOH0nrjy/98icyKPYRE9w1VxkCpGFMuIqJvwjq56lnMl+t5xgvkaUzo/7PCF9thVIYgk1f3yYvlpVHCYQCqL/2DTG6sL2+/NkiCSObtKm1aSzzJUwMvKp7pllwoj/0OWwFTuLyO2J+34s/NhSyCMYIwepN4cqGtkGnsAfXaqLiv5WTYvnLxkhujGTyhF3sOE7DIdf/aSRXaaXTze4BQJO8L23KFb+UE/6YiYhPAnfiBdTi11sTZRDnM1YvfBMl86+SEvxOGXNecvRz7MDdd0yh05V2qTG2CtxzaGmMJx2T+HjG6Cvxf8kWaEl3mbh2HpXlmGdnoM5pN/E88dJnpj6Po90asXXEp/7sD/EbONQ3aiiWvfrqTK1zQu4qacLFtk+d91j+Pp6FBee1B3dtFGt1ncTGYjxM4InWeJobRhIUdca3QfPO3/ZnhgSUbCa2al19y/PfZbH8QiY/b7YpvFLZ/mf0wgisk4q0AcvCj1GJ4Fclkypjui66Ha30w0v/4VOn7nOa17ju0Mw1inQoZHeXep0EWHYE2ZE7hDXUcgaeOBU+c2tPfXbLXbL/R+A3taslObHr9iS57olHrOhbk9umVhbhCXNHNTbtDQ116x6ktihZNvxlb6AeJwSTXY7PBDs0ZXcbyIvxhx+Gajyzk/1HpbtaRA21qNhbIFBHSGzfS7zcoJvY63c8fQxzUFsgYjyMb35zxzTNUGVk+IBcwgWZ+UHCXn0urmD2CyVPBiyf+Lalh3Nl5EBUw17IJnzc455IuQDBjZzJtB3lnpQ4UElnyRO09RAf114pVJr3otEwZP0kDD76qFD1+j3U5yBmmi4ChBC561dHEixJbKMR9kF7V5WicHvlDP1QDM63rRr6tCCS5EGFUFnn7UpKWFqcQrTrQWS+xiNm/hLkHKddSMGXVxQ5fN7uzNeIxitFE1bxHLMCaQBeKlh6BZNsf6qIfq0kpiJZw1ZuRmMdFnNo8bicKqiQca6TnqVRwipQ+9cLtXl5bB7lH8YtnsSEOR9q2ZZgI+PvFH9pLPpIznjj1nUlxhb5KV+99nJvjaCNHbMaUT25olAVg+PSiPFViwBbfSca+NBs1neYPr0BkZn7uLRsuOJlbWWh2+PqiDDxGj2rB7c7+tud0c4kJatokzLM9VivwgUZXErT9Yniq/7z88fh8rSGGM2qgY4bc9F5XpKbd6j38RQFZ2dyoAXXLZIhoFda59JjCUQv7x+cq+Ou1nqGzEQbJValcYjO5J0B+sIHJNm3D3cteoEq5VElLA/9soubS0FVSgMx33ndWNd1t1CFmIYx81/E7a8VixSBJNeCNZX3hU0RZysJAEuY790ASGerOAGoWK3clE6L9yhsSiCqbLq/h1aXxJD+7t5RTBNRUPndCARBz9TnFAES61b0xdsfZrfrggWcbh83nPPy26tOcHDYYqt0BlFRbBPXwhW36EeiZuKbcss3aCoaIdx4JHPE2BeCPY2S2BwDxtE9/+C7SlOtmWqcsyYmCP/B/HdwNS6DfvtAAAAAElFTkSuQmCC";
            this.brush.onload = function(){
                sk.selectColor.apply(sk.drawer.find(".color.selected"));
                $(".drawing-tmp-area").attr("width", sk.curSize).attr("height", sk.curSize);
                var _canvas = $(".drawing-tmp-area")[0];
         
                var _ctx = _canvas.getContext("2d");
                _ctx.strokeStyle = "#ffffff";

                _ctx.clearRect(0, 0, sk.brush.width, sk.brush.height);
    /*            _ctx.arc(sk.curSize/2, sk.curSize/2, sk.curSize/2, 0, 2 * Math.PI, false);
                _ctx.stroke();
                _ctx.clip();
    */           _ctx.drawImage(sk.brush, 0, 0);

                var  _imageData = _ctx.getImageData(0, 0, sk.curSize, sk.curSize);
                var colors = sk.hexToRgb(sk.curColor);
                for (var i=0;i<_imageData.data.length;i+=4){
                    if(_imageData.data[i+3] === 255 || _imageData.data[i+3] === 100){
                        _imageData.data[i] = colors[0];
                        _imageData.data[i+1] = colors[1];
                        _imageData.data[i+2] = colors[2];
                        _imageData.data[i+3] = colors[3];
                    }
                }
                _ctx.putImageData(_imageData, 0,0); 
                _ctx.restore();
                sk.brush = new Image();
                sk.brush.src = _canvas.toDataURL();
             }
        }

        this.drawer.find(".sizeContainer").on(window.touchDownEvent , function(e){
            e.preventDefault();
            sk.drawer.find(".size").removeClass("selected");
            $(this.children).addClass("selected");
            sk.curSize = $(this.children).attr("data-size");
            sk.loadBrush();
        });

        $('.drawing-background-hidden').on(window.touchDownEvent , function(e){
            e.preventDefault();
        })

        this.drawer.find(".drawing-background").on(window.touchDownEvent , function(e){
            e.preventDefault();
            sk.drawer.find(".drawing-background").removeClass("selected");
            $(this).addClass("selected");
            sk.drawSelectedImage(true);
        });

        this.drawSelectedImage = function(clear){
            if(clear) sk.clear();
            var imgName = sk.drawer.find(".drawing-background.selected").attr("id");
            if (typeof imgName != "undefined") {
                var img = $("#" + imgName + "-hidden")[0];
                var maxwidth = sk.canvas_touch[0].width;
                var maxheight = sk.canvas_touch[0].height;
                var fW = maxwidth / img.width;
                var fH = maxheight / img.height;
                var f = (fW < fH ? fW : fH);
                if (img.width <= maxwidth && img.height <= maxheight) f = 1;
                var imgWidth = img.width*f;
                var imgHeight = img.height*f;
                var leftMargin = (maxwidth - imgWidth) / 2;
                var topMargin = (maxheight - imgHeight) / 2;
                sk.context_touch.drawImage(img, leftMargin, topMargin, imgWidth, imgHeight);
            }
        }
        

        this.drawer.find(".color").on(window.touchDownEvent , function(e){
            sk.selectColor.apply(this);
            sk.loadBrush();
            e.preventDefault();
        });

        this.clear = function(event){
            if(event)
                event.preventDefault();
            var c = sk.canvas_touch[0];
            sk.context_touch.clearRect( 0, 0, c.width, c.height );
            c = sk.canvas[0];
            sk.context.clearRect( 0, 0, c.width, c.height );  
            var fillStyle = sk.context.fillStyle;
            sk.context.fillStyle = bgcolor;
            sk.context.fillRect( 0, 0, c.width, c.height );
            sk.context.fillStyle = fillStyle;  
            sk.drawSelectedImage(false);  
        }

        $(".drawing-clear").on(window.touchDownEvent, this.clear);

        this.loadBrush();
        this.clear();
    }

    Sketcher.prototype.onCanvasMouseDown = function () {
        var self = this;
        return function(event) {
            self.mouseMoveHandler = self.onCanvasMouseMove();
            self.mouseUpHandler = self.onCanvasMouseUp();

            $(document).bind( window.touchMoveEvent, self.mouseMoveHandler );
            $(document).bind( window.touchUpEvent, self.mouseUpHandler );
            
            self.updateMousePosition( event );
            self.renderFunction( event );
            event.preventDefault();
        }
    }

    Sketcher.prototype.hexToRgb = function(hex) {
        if (hex.charAt(0) == "#") {
            hex = hex.substr(1, hex.length-1);
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            return [r,g,b,100];
        } else if (hex.substr(0,5) == "rgba(") {
            hex = hex.substr(5, hex.length-6);
            var values = hex.split(",");
            var r = parseInt(values[0]);
            var g = parseInt(values[1]);
            var b = parseInt(values[2]);
            var a = values[3] * 100;
            return [r,g,b,a];
        }
    }

    Sketcher.prototype.onCanvasMouseMove = function () {
        var self = this;
        return function(event) {
            self.renderFunction( event );
            event.preventDefault();
            return false;
        }
    }

    Sketcher.prototype.onCanvasMouseUp = function (event) {
        var self = this;
        return function(event) {

            $(document).unbind( window.touchMoveEvent, self.mouseMoveHandler );
            $(document).unbind( window.touchUpEvent, self.mouseUpHandler );
            
            self.mouseMoveHandler = null;
            self.mouseUpHandler = null;
            event.preventDefault();
        }
    }

    Sketcher.prototype.updateMousePosition = function (event) {
        var target;
        if ((typeof event.originalEvent !== "undefined") 
            && (typeof event.originalEvent.touches !== "undefined") 
            && (typeof event.originalEvent.touches[0] !== "undefined") ) {
            target = event.originalEvent.touches[0];
        }
        else {
            target = event;
        }
        var offset = this.canvas.offset();
        this.lastMousePoint.x = target.pageX - offset.left;
        this.lastMousePoint.y = target.pageY - offset.top;
        event.preventDefault();

    }

    Sketcher.prototype.updateCanvasByLine = function (event) {
        //this.drawSelectedImage(true);
        this.context.strokeStyle = this.curColor;
        this.context.lineWidth = this.curSize;
        this.context.beginPath();
        var prevMousePoint = this.lastMousePoint;
        this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
        this.updateMousePosition( event );
        if(prevMousePoint.x == this.lastMousePoint.x && prevMousePoint.y == this.lastMousePoint.y){
            this.context.lineTo( this.lastMousePoint.x +1, this.lastMousePoint.y +1 );
        }else{
            this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
        }
        this.context.closePath();
        this.context.stroke();
        event.preventDefault();
    }

Sketcher.prototype.updateCanvasByLineEraser = function (event) {
        //this.drawSelectedImage(true);
        //this.context.strokeStyle = "#" + this.curColor;
        this.context.strokeStyle = this.bgcolor;
        this.context.lineWidth = this.curSize;
        this.context.beginPath();
        var prevMousePoint = this.lastMousePoint;
        this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
        this.updateMousePosition( event );
        if(prevMousePoint.x == this.lastMousePoint.x && prevMousePoint.y == this.lastMousePoint.y){
            this.context.lineTo( this.lastMousePoint.x +1, this.lastMousePoint.y +1 );
        }else{
            this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
        }
        this.context.closePath();
        this.context.stroke();
        event.preventDefault();
    }

    Sketcher.prototype.updateCanvasByBrush = function (event) {
        //this.drawSelectedImage(true);
        var halfBrushW = this.curSize/2;//this.brush.width/2;
        var halfBrushH = this.curSize/2;//this.brush.height/2;
        
        var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
        this.updateMousePosition( event );
        var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
        
        var distance = parseInt( Trig.distanceBetween2Points( start, end ) );
        var angle = Trig.angleBetween2Points( start, end );
        
        var x,y;

        for ( var z=0; (z<=distance || z==0); z++ )
        {
            x = start.x + (Math.sin(angle) * z) - halfBrushW;
            y = start.y + (Math.cos(angle) * z) - halfBrushH;
            this.context.drawImage(this.brush, x, y);
        }    
        event.preventDefault();
    }

Drawer = function(objectID, bgcolor){
    initSizeBoxesAndImages(objectID);
    var canvasID = objectID;
    var brushImage = document.createElement('img');
    var s = new Sketcher(canvasID, brushImage, bgcolor);
    setTimeout(function(){ 
        $("#"+objectID+" .drawing-background.selected").trigger(window.touchDownEvent);
        $("#"+objectID+" .tool.selected").trigger(window.touchDownEvent);
        $("#"+objectID+" .color.selected").trigger(window.touchDownEvent);
    },200);
}             

function initSizeBoxesAndImages(objectID) {
	$('#'+objectID+' .drawing-images').hide();
    $('#'+objectID+' .drawing-size').hide();
    setTimeout(function() {
        var i = document.getElementById(objectID).getElementsByClassName('size').length;
        i = i - 1;
        var size = 0;
        var sizeLabel = 0;
        var reducingFactor = 0;
        var containerHeight = $('#'+objectID+' .drawing-size > .sizeContainer').height(); // height == max-height 
        var containerWidth = $('#'+objectID+' .drawing-size > .sizeContainer').width(); // width == max-width 
        var customCSSstyle = 'margin-top:0px;position:relative;top:50%;transform:translateY(-50%);-ms-transform:translateY(-50%);-webkit-transform:translateY(-50%);';
        while (i > -1) {
            size = document.getElementById(objectID).getElementsByClassName('size')[i].getAttribute('data-size');
            size = size - (size*reducingFactor/100);
            if (size < (containerHeight - 5)) {
                document.getElementById(objectID).getElementsByClassName('size')[i].setAttribute('style','height:'+size+'px;width:'+size+'px;border-radius:'+size+'px;'+customCSSstyle);
            }
            else {
                sizeLabel = document.getElementById(objectID).getElementsByClassName('size')[i].getAttribute('data-size');
                size = containerHeight - 5;
                document.getElementById(objectID).getElementsByClassName('size')[i].setAttribute('style','height:'+size+'px;width:'+size+'px;border-radius:'+size+'px;'+customCSSstyle);
                document.getElementById(objectID).getElementsByClassName('size')[i].innerHTML='<span style="position:relative;overflow:hidden;font-size:10px;vertical-align:top;height:11px;width:36px;text-align:center;display:inline-block;color:#fff;">'+sizeLabel+'</span>';
            }
            i = i - 1;
        }
        $('#'+objectID+' .drawing-size .sizeContainer .size > span').each(function() { 
            var spanH = $(this).height(); 
            var spanW = $(this).width();
            // containerHeight is set to maximum == containerWidth
            var posH = (containerHeight - 5 - spanH) / 2;
            var posW = (containerHeight - 5 - spanW) / 2;
            $(this).css('top',posH+'px');
            $(this).css('left',posW+'px');
        });
        $('#'+objectID+' .drawing-size').show();
    }, 100);
    setTimeout(function(){ 
        var imagesTotWidth = $('#'+objectID+' .drawing-images').width();
        var objTotWidth = $('#'+objectID).width();
        var imagesLeftVal = (objTotWidth - imagesTotWidth) / 2;
        if (imagesLeftVal > 0) {
            $('#'+objectID+' .drawing-images').css('left',imagesLeftVal+'px');
        }
        $('#'+objectID+' .drawing-images').show();
    },100);
}