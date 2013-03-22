/*-----------------------------------------
    Dooda Game
    Created by Nawfel Bengherbia
    Licence: GNU GPL v 3.0
    version: 0.15.1 Fri Aug 24 14:14:58 CET 2012
------------------------------------------*/

var Dooda = ( function () {

/************** utils ***************/
if (Array.prototype.forEach === undefined)
    Array.prototype.forEach = function (action) {
        for (var i = 0, len = this.length; i < len; i++)
            action( this[i], i );
    };

function randomInt(n) {
    return Math.round( Math.random() * n );
}

function range(start, end, step) {
    step = step || 1;
    var arr = [];
    while (start < end) {
        arr.push(start);
        start += step;
    }
    return arr;
}

function copyArray(arr) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        newArr[i] = arr[i];
    }
    return newArr;
}

function copyObject(obj) {
    var newObj = {};
    for (var property in obj)
        if ( obj.hasOwnProperty( property ) )
            if ( obj[ property ] instanceof Array )
                newObj[ property ] = copyArray( obj[ property ] );
            else if ( obj[ property ] instanceof Object )
                newObj[ property ] = copyObject( obj[ property ] );
            else
                newObj[ property ] = obj[ property ];
    return newObj;
}

function removeFromArray(arr, elm) {
    var stop = false;
    for (var i = 0, len = arr.length; i < len && !stop; i++)
            if (arr[i] === elm) {
                stop = true;
                arr[i] = arr[len - 1];
                arr.pop();
            }
}

function existeInArray(arr, elm) {
    for (var i = 0, len = arr.length; i < len; i++)
        if (arr[i] === elm)
            return true;
    return false;
}

function uniqueArray(arr) {
    var newArr = [];
    arr.forEach(function (elm) {
        if ( ! existeInArray( newArr, elm ) )
            newArr.push( elm );
    });
    arr.length = 0;
    newArr.forEach(function (elm) {
        arr.push( elm );
    });
}

function sortArray(arr, isGreater) {
    for (var i = 0, len = arr.length - 1; i < len; i++)
        if ( isGreater( arr[i], arr[i+1] ) ) {
            //[ arr[i], arr[i+1] ] = [ arr[i+1], arr[i] ]; in modern JS
            var temp = arr[i]; arr[i] = arr[i+1]; arr[i+1] = temp;
            var j = i - 1;
            while (j >= 0)
                if ( isGreater( arr[j], arr[j+1] ) ) {
                    //[ arr[j], arr[j+1] ] = [ arr[j+1], arr[j] ]; in modern JS
                    var temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;
                    j -= 1;
                } else
                    j = -1;
        }
    return arr;
}

function forEachXY(arr, action) {
    for (var i = 0, len = arr.length; i < len; i += 2)
        action( arr[i], arr[i+1], i / 2 );
}

function sortArrayXY(arr, isGreater) {
    for (var i = 0, len = arr.length - 3; i < len; i += 2)
        if ( isGreater( arr[i], arr[i+1], arr[i+2], arr[i+3] ) ) {
            // xchg (arr[i],arr[i+1]) with (arr[i+2],arr[i+3])
            var temp = arr[i];
            arr[i] = arr[i+2];
            arr[i+2] = temp;
            temp = arr[i+1];
            arr[i+1] = arr[i+3];
            arr[i+3] = temp;
            var j = i - 2; // init j
            while (j >= 0)
                if ( isGreater( arr[j], arr[j+1], arr[j+2], arr[j+3] ) ) {
                    // xchg (arr[j],arr[j+1]) with (arr[j+2],arr[j+3])
                    var temp = arr[j];
                    arr[j] = arr[j+2];
                    arr[j+2] = temp;
                    temp = arr[j+1];
                    arr[j+1] = arr[j+3];
                    arr[j+3] = temp;
                    // dec j
                    j -= 2;
                } else break;
        }
    return arr;
}

function emptyStr(str) {
    var i, len = str.length;
    if (len == 0)
        return true;
    for (i = 0; i < len; i++)
        if ( str.charAt(i) != " " && str.charAt(i) != "\t" )
            break;
    if (i < len)
        return false;
    return true;
}

function forEachPaire(arr, action) {
    var i, j, len = arr.length;
    for (i = 0; i < len; i++)
        for (j = 0; j < len; j++) {
            if (j == i)
                continue;
            action( arr[i], arr[j] );
        }
}


/******************************************************************
                            AnimText 
******************************************************************/
var AnimText = function (text, config) {
    
    var options = {
        ctx: game.ctx,
        show: true,
        size: 70,
        times: 10,
        x: 0, y: 0,
        fillStyle: 'black',
        shadowColor: 'black',
        shadowBlur: 0,
        fontFamily: 'sans-serif'
    };
    if (config != undefined)
        for (var option in options)
            if ( config[ option ] != undefined )
                options[ option ] = config[ option ];
    
    var arr = range( 0, options.size, options.size / options.times );
    var i = 0, len = arr.length - 1;
    
    if ( !options.show )
        arr.reverse();
    
    return {
        hasNext: true,
        draw: function () {
            
            if (i == len)
                this.hasNext = false;
            
            var ctx = options.ctx;
            
            ctx.font = arr[ i ] +'px '+ options.fontFamily;
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle';
            ctx.fillStyle = options.fillStyle;
            ctx.shadowColor = options.shadowColor;
            ctx.shadowBlur = options.shadowBlur;
            
            ctx.fillText(text, options.x, options.y);
            
            i += 1;
        }
    };
};

/************************************************************
                            Text
************************************************************/
var Text = function (text, config) {
    
    var options = {
        ctx: game.ctx,
        show: true,
        size: 70,
        fontFamily: 'sans-serif',
        x: 0, y: 0,
        fillStyle: 'black',
        shadowColor: 'black',
        shadowBlur: 0,
        strokeStyle: 'white',
        lineWidth: 1
    };
    if (config != undefined)
        for (var option in options)
            if ( config[ option ] != undefined )
                options[ option ] = config[ option ];
    
    return function () {
            
            var ctx = options.ctx;
            
            ctx.font = options.size +'px ' + options.fontFamily;
            ctx.textAlign = 'center';
            ctx.textBaseLine = 'middle';
            ctx.fillStyle = options.fillStyle;
            ctx.shadowColor = options.shadowColor;
            ctx.shadowBlur = options.shadowBlur;
            ctx.strokeStyle = options.strokeStyle;
            ctx.lineWidth = options.lineWidth;
            
            ctx.fillText(text, options.x, options.y);
    };
};

/***************************************************
                drawing functions
***************************************************/
function circle( ctx, x, y, r, color ) {

    if (color) ctx.fillStyle = color;
    
    ctx.beginPath();
        ctx.arc( x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
    ctx.closePath();
    
}

function hearth( ctx, x, y, r, color ) {
    
    var oldFillStyle = ctx.fillStyle;
    
    if (color) ctx.fillStyle = color;
    
    ctx.beginPath();
        ctx.moveTo( x, y + r/4 );
        ctx.bezierCurveTo( x, y-r/4, x+r/2, y-r/4, x+r/2, y+r/4);
        ctx.bezierCurveTo( x+r/2, y-r/4, x+r, y-r/4, x+r, y+r/4);
        ctx.lineTo( x+r/2, y+r );
        ctx.lineTo( x, y+r/4 );
    ctx.fill();
    ctx.closePath();
    
    ctx.fillStyle = oldFillStyle;
}

function animateText( ctx, text, size, after ) {
    
    var width = conf.width * conf.unit,
        height = conf.height * conf.unit;
    
    if (after === undefined)
        after = function () {};
    
    var anim = AnimText(text, {
        x: width / 2,
        y: height / 2,
        size: size || 10 * conf.unit,
        ctx: ctx
    });
    
    (function () {
        if ( anim.hasNext ) {
            ctx.clearRect(0, 0, width, height);
            anim.draw();
            setTimeout( arguments.callee, conf.animWait );
        } else
            after();
    })();

}

/******************************************************
                players management
******************************************************/
var players = [];
var trash = [];
var toRemove = [];
var foods = [];
var scores = []; // [ name0, score0, name1, score1, ... ]

/******************************************************
                    game config
******************************************************/
var conf = {
        width: 50, // unit
        height: 40, // unit
        unit: 10, // px
        bgColor: '#EEE',
        startPos: [ [3,1,2,1,1,1], [3,4,2,4,1,4], [3,7,2,7,1,7] ],
        colors: [ '#007', '#700', '#070' ],
        ctrls: [
            {left: 37,up: 38,right: 39,down: 40},
            {left: 81,up: 90,right: 68,down: 83},
            {left:71, up:89, right:74, down:72}
        ],
        pause: 80, // key to pause
        startingLifesNumber: 3,
        food_collision_max: 20,
        bigFoodWait: 900, // ms
        animWait: 100, //ms
        level1Score: 25,
        level1Wait: 120,
        safeTime: 3000 // ms
};

/********************************************************
                         HTML
********************************************************/
var html = '\
<div class="status" style="font-size: 10px; height: 25px; position: relative; top: 7px; left: 7px;"></div>\
<button class="zoom" style="padding: 0 10px;position: absolute; top: 5px; right: 5px; z-index: 2;">+</button>\
<div style="position: relative">\
    <canvas class="canvas"></canvas>\
    <canvas class="notify" style="position: absolute; top: 0; left: 0;"></canvas>\
</div>\
<div class="interface" style="font-size: 1em; line-height: 1.2em;">\
    <div class="scores" style="position: absolute; top: 0; width: 100%; height: 100%; display: none; overflow: hidden;">\
        <div style="margin: 20px 20px 50px;">\
            <h1>Scores</h1>\
            <div style="width: 90%; margin: 10px auto">\
                <div class="output"></div>\
            </div>\
            <button class="playAgain" style="position: absolute; bottom: 20px; right: 20px;">play again</button>\
        </div>\
    </div>\
    <div class="startScreen" style="width: 100%; text-align: center; position: absolute; bottom: 100px; display: none;">\
        <button class="play">  play  </button>\
    </div>\
    <div class="config" style="position: absolute; top: 0px; width: 100%; height: 100%; display: none; overflow: auto;">\
        <div style="background: #CCC; padding: 10px 20px;">\
            <div style="position: relative; text-align: center;">\
                <select class="playersNumber">\
                    <option>1 player    </option>\
                    <option>2 players   </option>\
                </select>\
                <button class="start"> start </button>\
            </div>\
        </div>\
        <div style="padding: 0 10px 20px;">\
            <div class="player1" style="padding: 10px;">\
                <h3>Player 1</h3>\
                Name:\
                <input type="text" class="name" value="player1" maxlength="20" />\
                <br />\
                Color:\
                <select class="color">\
                    <option>#007</option>\
                    <option>CornflowerBlue</option>\
                    <option>Blue</option>\
                    <option>Green</option>\
                    <option>Gray</option>\
                </select>\
                <br />\
                Controls:\
                <button class="up">     up      </button>\
                <button class="right">  right   </button>\
                <button class="down">   down    </button>\
                <button class="left">   left    </button>\
                <br />\
                default keys: <span style="font-size: 0.75em"> up( UP ) right( RIGHT ) down( DOWN ) left( LEFT ) </span> \
                <br />\
                <button class="reset"> reset controls to default </button>\
            </div>\
            \
            <div class="player2" style="padding: 0 10px; display: none;">\
                <h3>Player 2</h3>\
                Name:\
                <input type="text" class="name" value="player2" maxlength="20" />\
                <br />\
                Color:\
                <select class="color">\
                    <option>#700</option>\
                    <option>Red</option>\
                    <option>Gold</option>\
                    <option>Orange</option>\
                    <option>Black</option>\
                </select>\
                <br />\
                Controls:\
                <button class="up">     up      </button>\
                <button class="right">  right   </button>\
                <button class="down">   down    </button>\
                <button class="left">   left    </button>\
                <br />\
                default keys:  <span style="font-size: 0.75em"> up( Z ) right( D ) down( S ) left( Q ) </span> \
                <br />\
                <button class="reset"> reset controls to default </button>\
            </div>\
            <div style="padding: 10px;">\
                <h3>Other settings</h3>\
                key to pause the game:\
                <button class="pause">pause</button>\
                <span style="font-size: 0.75em">(default: P)</span> \
            </div>\
        </div>\
    </div>\
    <div class="alert" style="height: 100%; width: 100%; position: absolute; top: 0; left: 0;\
     display: none; background: rgba(0,0,0,0.5);" >\
        <div style="position: absolute; top: 50%; right: 50%; text-align: center; line-height: 40px;\
             width: 300px; padding: 10px ; margin: -40px -160px 0 0; background: #EEF; border: solid 2px;">\
                press any key\
                </br>\
                <button style="float: right; display: block" class="cancel">cancel</button>\
        </div>\
    </div>\
</div>';

/************************************************************
                        game object
************************************************************/
var game = {
    
    playersColors: [],
    
    playersNumber: 1,
    
    pause: false,
    
    block: false,
    
    wait: conf.level1Wait, // ms
    
    scoreToPass: conf.level1Score,
    
    levelScore: 0,
    
    levelNumber: 1,
    
    ctrls: copyObject( conf.ctrls ),
    
    zoomIn: function () {
        var self = this;
        this.gameContainer.style.width = conf.width * conf.unit * 1.5 + 'px';
        this.canvas.style.height = conf.height * conf.unit * 1.5 + 'px';
        this.canvas.style.width = conf.width * conf.unit * 1.5 + 'px';
        notifications.canvas.style.height = conf.height * conf.unit * 1.5 + 'px';
        notifications.canvas.style.width = conf.width * conf.unit * 1.5 + 'px';
        
        this.gameContainer.style.fontSize = '1.5em';
        this.buttons.forEach( function (button) {
            button.style.fontSize = '0.8em';
        });
        this.gameContainer.getElementsByClassName('zoom')[0].innerHTML = '&nbsp;-&nbsp;';
        this.gameContainer.getElementsByClassName('zoom')[0].onclick = function () { self.zoomOut(); };
        this.gameContainer.getElementsByClassName('zoom')[0].blur();
        
    },
    
    zoomOut: function () {
        var self = this;
        this.gameContainer.style.width = conf.width * conf.unit + 'px';
        this.canvas.style.height = conf.height * conf.unit + 'px';
        this.canvas.style.width = conf.width * conf.unit + 'px';
        notifications.canvas.style.height = conf.height * conf.unit + 'px';
        notifications.canvas.style.width = conf.width * conf.unit + 'px';

        this.gameContainer.style.fontSize = '1em';
        this.buttons.forEach( function (button) {
            button.style.fontSize = '';
        });
        this.gameContainer.getElementsByClassName('zoom')[0].innerHTML = '+';
        this.gameContainer.getElementsByClassName('zoom')[0].onclick = function () { self.zoomIn(); };
        this.gameContainer.getElementsByClassName('zoom')[0].blur();
    },
    
    updateScore: function () {
        var score = '';
        score = '';
        players.forEach(function (player) {
            score += player.name + ': [ score = ' + player.score +
            ', lifes = ' + player.lifesNumber + ' ], ';
        });
        this.status.innerHTML = score.substr( 0, score.length - 2 );
    },
    
    onkeydown:  function (e) {
        
        var supportedKey = false;
        
        // moving players
        players.forEach(function (player) {
            var ctrls = player.ctrls;
            forEachXY( ctrls, function ( keyCode, func ) {
                if ( keyCode == e.keyCode ) {
                    func();
                    supportedKey = true;
                }
            });
        });
        // pause the game
        if ( e.keyCode == conf.pause ) {
            if ( !game.block ) {
                if (game.pause) {
                    console.info('continue from pause');
                    game.pause = false;
                    game.gameLoop();
                } else {
                    console.info('game paused');
                    game.pause = true;
                }
                supportedKey = true;
            }
        }
        
        if (supportedKey)
            return false;
        
    },
    
    circle: function ( x, y, r, color ) {
        circle( this.ctx, x, y, r, color );
    },
    
    hearth: function ( x, y, r, color ) {
        hearth( this.ctx, x, y, r, color );
    },
    
    showStartScreen: function () {
        animateText( this.ctx, 'Dooda', 120, function () {
            game.startScreen.style.display = 'block';
        } );
    }
};

/********************************************************************
                            notifications
********************************************************************/
var notifications = {

    clear: function () {
        this.ctx.clearRect( 0, 0, conf.width * conf.unit, conf.height * conf.unit );
    },
    
    circle: game.circle,
    
    hearth: game.hearth,
    
    animText: function ( text, size, after ) {
        animateText( this.ctx, text, size, after );
    },
    
    text: function( text, config ) {
        config.ctx = this.ctx;
        Text( text, config )();
    }
    
};

/*******************************  init ( id ) ************************************

  ( window.onkeydown && { buttons }.onclick ) are defined here
  
*********************************************************************************/

function init(id) {
    
    var height = conf.height * conf.unit,
        width = conf.width * conf.unit;
    
    var gameContainer = document.getElementById(id);
    gameContainer.style.position = 'relative';
    gameContainer.innerHTML = html;
    gameContainer.style.backgroundColor = conf.bgColor;
    gameContainer.style.width = width + 'px';
    
    var status = gameContainer.getElementsByClassName('status')[0];
    
    // setting up the {canvas}s
    var canvas = gameContainer.getElementsByClassName('canvas')[0];
    var notify = gameContainer.getElementsByClassName('notify')[0];
    
    [ canvas, notify ].forEach(function (elm) {
        elm.width = width;
        elm.height = height;
        elm.margin = elm.padding = 0;
    });
    
    // startSceen
    var startScreen = gameContainer.getElementsByClassName('startScreen')[0];
    // config
    var config = gameContainer.getElementsByClassName('config')[0];
    
    // adding ctx, canvas, gameContainer, status, startScreen to game
    game.canvas = canvas;
    game.ctx = canvas.getContext('2d');
    
    notifications.canvas = notify;
    notifications.ctx = notify.getContext('2d');
    
    game.gameContainer = gameContainer;
    game.status = status;
    game.startScreen = startScreen;
    game.scores = gameContainer.getElementsByClassName('scores')[0];
    game.scoresOutput = game.scores.getElementsByClassName('output')[0];
    
    // buttons & selects
    game.buttons = [];
    [ gameContainer.getElementsByTagName('button') ,
      gameContainer.getElementsByTagName('select') ,
      gameContainer.getElementsByTagName('input')  ]
                .forEach(function (arr) {
                    for (var i = 0, len = arr.length; i < len; i++)
                        game.buttons.push( arr[i] );
                });
    
    /*********** buttons ***********/
    var zoom = gameContainer.getElementsByClassName('zoom')[0];
    
    zoom.onclick = function () {  game.zoomIn();  };
    
    var player1 = gameContainer.getElementsByClassName('player1')[0],
        player2 = gameContainer.getElementsByClassName('player2')[0];
    
    /************ alert *************/
    var alert = gameContainer.getElementsByClassName('alert')[0];
    
    [ player1, player2 ].forEach(function (player, playerIndex) {
        // change players ctrls
        [ 'up', 'right', 'down', 'left' ].forEach(function (dir) {
            player.getElementsByClassName( dir )[0].onclick = function () {
                window.onkeyup = function (e) {
                    game.ctrls[ playerIndex ][ dir ] = e.keyCode;
                    alert.style.display = 'none';
                    window.onkeyup = undefined;
                    return false;
                };
                alert.style.display = 'block';
            };
        });
        // reset players ctrls
        player.getElementsByClassName( 'reset' )[0].onclick = function () {
                game.ctrls[ playerIndex ] = copyObject( conf.ctrls[ playerIndex ] );
        };
        // change players colors
        var playerColor = player.getElementsByClassName('color')[0];
        playerColor.onchange = function () {
            game.playersColors[ playerIndex ] = this.options[ this.selectedIndex ].innerHTML;
        };
        game.playersColors[ playerIndex ] = playerColor.options[ playerColor.selectedIndex ].innerHTML;
    });
    
    alert.getElementsByClassName('cancel')[0].onclick = function () {
        alert.style.display = 'none';
        window.onkeyup = undefined;
    };
    
    /********* {select}s *********/
    gameContainer.getElementsByClassName('playersNumber')[0].onchange = function () {
        var n = game.playersNumber = this.selectedIndex + 1;
        if ( n == 1 )
            player2.style.display = 'none';
        else
            player2.style.display = 'block';
    };
    
    // Game options
    [ 'pause' ].forEach(function (option) {
        gameContainer.getElementsByClassName( option )[0].onclick = function () {
            window.onkeyup = function (e) {
                conf[ option ] = e.keyCode;
                alert.style.display = 'none';
                window.onkeyup = undefined;
                return false;
            };
            alert.style.display = 'block';
        };
    });
    
    // play, start, play again
    gameContainer.getElementsByClassName('playAgain')[0].onclick = 
    startScreen.getElementsByClassName('play')[0].onclick = function () {
        startScreen.style.display = 'none';
        game.scores.style.display = 'none';
        canvas.style.visibility = 'hidden';
        config.style.display = 'block';
    };
    
    config.getElementsByClassName('start')[0].onclick = function () {
        // hide startScreen
        canvas.style.visibility = 'visible';
        config.style.display = 'none';
        
        var playersNames = [
            player1.getElementsByClassName('name')[0].value,
            player2.getElementsByClassName('name')[0].value,
        ];
        
        for (var i = 0; i < game.playersNumber; i++) {
            players.push(new Player( playersNames[ i ] , { color: game.playersColors[ i ] } ));
            foods.push(new Food);
        }
        
        // setting window.onkeydown
        window.onkeydown = game.onkeydown;

        // gameLoop
        gameLoop();
    };
    
    game.showStartScreen();
    
}

/*********************************************************
                          Player 
*********************************************************/
var Player = function (name, config) {

    var self = this;
    var directionEventHendler = function (direction, wrongDirection) {
        return function () {
            if (self.dir != wrongDirection)
                self.dir_temp = direction;
        };
    };
    
    if (name === undefined || emptyStr(name))
        this.name = 'anonymous';
    else    
        this.name = name;
    
    this.dir = 1;
    this.dir_temp = 1;
    this.score = 0;
    this.lifesNumber = conf.startingLifesNumber;
    
    /*********** body *********/
    if (config && config.startPos)
        this.body = copyArray( config.startPos );
    else {
        if ( Player.startPosNum == conf.startPos.length ) {
                console.error('conf.startPos[] is fully used');
                console.info('you must pass ( name, { startPos: ..., ... } ) to Player');
                throw new Error('conf.startPos[] is fully used');
        }
        this.body = copyArray( conf.startPos[ Player.startPosNum ] );
        Player.startPosNum += 1;
    }
    
    /******** color ********/
    if (config && config.color)
        this.color = config.color;
    else
        this.color = 'black';
    
    /********* controls *********/
    var ctrls;
    if ( config && config.ctrls )
        ctrls = config.ctrls;
    else {
        ctrls = game.ctrls[ Player.ctrlsNum ];
        Player.ctrlsNum += 1;
    }
    
    /*----------------------
        directions are tested very commonly.
        So in order to be light weight, Dooda game represent them
        as Numbers instead of Strings
            up: 0
            right: 1
            down: 2
            left: 3
    -----------------------*/
    this.ctrls = [
        ctrls.left,
        directionEventHendler(3, 1),
        ctrls.up,
        directionEventHendler(0, 2),
        ctrls.right,
        directionEventHendler(1, 3),
        ctrls.down,
        directionEventHendler(2, 0)
    ];
};

// Player.*Num
Player.startPosNum = 0;
Player.ctrlsNum = 0;

Player.prototype.forEach = function (action) {
    forEachXY( this.body, action );
};

Player.prototype.move = function () {

    var body = this.body,
        len = this.body.length,
        height = conf.height,
        width = conf.width;
        
    // updating body
    for (var i = len - 1; i > 2; i -= 2) {
        body[i] = body[i - 2];
        body[i - 1] = body[i - 3];
    }
    
    // getting the latest order
    this.dir = this.dir_temp;
    
    switch (this.dir) {
    case 0:// up
        body[1] = (body[1] - 1 + height) % height;
        break;
    case 1:// right
        body[0] = (body[0] + 1) % width;
        break;
    case 2:// down
        body[1] = (body[1] + 1) % height;
        break;
    case 3:// left
        body[0] = (body[0] - 1 + width) % width;
        break;
    default:
        console.error('direction not supported:');
        console.log(this.dir);
    }
};

Player.prototype.eat = function (what) {
    
    var body = this.body,
        len = body.length;
    
    if ( what.constructor == Player ) {

        what.lifesNumber -= 1;
        what.sayAY();
        what.safeOn();
        if (what.lifesNumber == 0)
            what.terminate();
        game.updateScore();
        
    } else if ( what.constructor == Food ) {
    
        // body ++
        body[len] = body[len - 2];
        body[len + 1] = body[len - 1];
        
        if ( what.type == 'lifeFood' )
            this.lifesNumber += 1;
        
        what.terminate();
        
        // update game.status
        this.score += what.score;
        
        game.updateScore();
        
    } else {
        console.error('player eats an alien Object:');
        console.log(what);
    }
};

Player.prototype.terminate = function () {
    toRemove.push( this );
    uniqueArray( toRemove );
};

Player.prototype.sayAY = function () {

    var u = conf.unit,
        x = this.body[0],
        y = this.body[1];
    notifications.text( 'AY', {
        x: x * u,
        y: y * u,
        size: u * 1.5,
        fillStyle: 'red',
        shadowColor: 'white',
        shadowBlur: 5
    });
    setTimeout( function () {
        notifications.ctx.clearRect(
            x * u - 2*u,
            y * u - 2*u,
            4 * u,
            4 * u 
        );
    }, 500 );
    
};

Player.prototype.safeOn = function () {
    var self = this;
    this.safe = true;
    setTimeout(function () { self.safe = false; }, conf.safeTime);
}

Player.prototype.draw = function () {
    var u = conf.unit,
        ctx = game.ctx;
    
    ctx.fillStyle = this.color;
    if (this.safe)
        ctx.globalAlpha = 0.5;
    
        this.forEach(function (x, y) {
            ctx.fillRect(x * u, y * u, u, u);
        });
        game.circle( this.body[0] * u + u/2, this.body[1] * u + u/2, u * 0.6);
    
    ctx.globalAlpha = 1;
    
};

/***********************************************
                     Food
***********************************************/
var Food = function () {
    
    function collision(x, y) {
        var ret = false;
        players.forEach( function (player) {
            player.forEach( function ( playerX, playerY ) {
                if ( x === playerX && y === playerY ) ret = true;
            });
        });
        return ret;
    }
    
    var self = this,
        x, y, counter = 0;
    do {
        x = randomInt(conf.width - 1);
        y = randomInt(conf.height - 1);
        counter += 1;
        if (counter == conf.food_collision_max) {
                console.warn('Lot of food_collision');
                break;
        }
    } while ( collision(x, y) );
    
    var type = randomInt(6);
    
    if (type == 5) {// Big Food 
    
            this.type = 'bigFood';
            this.pts = [
                x-1,  y-1,   x,  y-1,    x+1,  y-1,
                x-1,  y  ,   x,  y  ,    x+1,  y  ,
                x-1,  y+1,   x,  y+1,    x+1,  y+1
            ];
            this.score = 16;
            
            (function () {
                var u = conf.unit;
                self.score -= 3;
                // write score
                notifications.ctx.clearRect(
                     x * u - u,
                     y * u - u,
                     3 * u,
                     3 * u
                );
                notifications.text( self.score + '', {
                    x: x * u + u/2,
                    y: y * u + u/2,
                    size: u,
                    fillStyle: 'white'
                });
                if (self.score != 1) {
                    self.timeOut = setTimeout( arguments.callee, conf.bigFoodWait);
                }
            })();
        
    } else {
        
        this.pts = [ x , y ];
        
        if (type == 6) {
            this.type = 'lifeFood';
            this.score = 2;
        } else
            this.score = 1;
            
    }
};

Food.prototype.terminate = function () {
    if ( this.type == 'bigFood' ) {
        // animation
        var u = conf.unit,
            x = this.pts[8],
            y = this.pts[9];
            
        clearTimeout( this.timeOut );
        
        notifications.ctx.clearRect(
            x * u - u,
            y * u - u,
            3 * u,
            3 * u
        );
    } else if ( this.type == 'lifeFood' ) {
        // animation
            var u = conf.unit,
                x = this.pts[0],
                y = this.pts[1];
            
            notifications.text( '+ life', {
                x: x * u,
                y: y * u,
                size: u * 1.5,
                fillStyle: 'blue',
                shadowColor: 'white',
                shadowBlur: 5
            });
            setTimeout( function () {
                notifications.ctx.clearRect(
                    x * u - 2*u,
                    y * u - 2*u,
                    4 * u,
                    4 * u 
                );
            }, 500 );
    }
    // set new food
    if ( existeInArray(foods, this) ) {
        game.levelScore += this.score;
        removeFromArray( foods, this );
        foods.push(new Food);
    }
};

Food.prototype.draw = function () {
    
    var u = conf.unit;
    
    if (this.type == 'bigFood')
        game.circle( this.pts[8] * u + u/2, this.pts[9] * u + u/2,  u*1.5, 'black' );
        
    else if (this.type == 'lifeFood')
        game.hearth( this.pts[0] * u, this.pts[1] * u,  u, 'red' );
        
    else
        game.circle( this.pts[0] * u  + u/2, this.pts[1] * u + u/2,  u*0.6, 'black' );

};

Food.prototype.forEach = function (action) {
    forEachXY( this.pts, action );
};

/*****************************************
            the game loop 
*****************************************/
var gameLoop = function () {

    // move
    players.forEach(function (player) {
        player.move();
    });
    
    // collision management
    // eat foods
    foods.forEach(function (food) {
        players.forEach(function (player) {
            food.forEach(function (x, y) {
                if (x === player.body[0] && y === player.body[1])
                    player.eat(food);
            });
        });
    });
    
    // a player eats himself
    players.forEach(function (player) {
        if (player.safe)
                return;
        player.forEach(function (x, y, index) {
            if ( index == 0 )
                return;
            if ( player.body[0] == x && player.body[1] == y )
                player.eat(player);
        });
    });
    
    // a player eats an other
    forEachPaire( players, function ( player1, player2 ) {
        if (player2.safe)
            return;
        player2.forEach(function (x, y) {
            if ( player1.body[0] == x && player1.body[1] == y)
                player1.eat(player2);
        });
    });
    
    // deleting what to delete
    toRemove.forEach(function (player) {
        trash.push( player );
        removeFromArray( players, player );
        game.updateScore();
    });
    
    toRemove.length = 0;
    
    // draw
    game.ctx.clearRect(0, 0, conf.width * conf.unit, conf.height * conf.unit);
    
    players.forEach(function (player) {   player.draw();  });
    
    foods.forEach(function (food) {  food.draw();  });
    
    // levelUp
    levelUp();
    
    // game over ?
    if (players.length == 0)
        gameOver();
    else if ( !game.pause )
        setTimeout( gameLoop, game.wait );
};

/************************************************************
                        Level Up
************************************************************/
function levelUp() {
    if (players.length == 0)
        return;
    if ( game.levelScore >= game.scoreToPass * players.length ) {
        game.scoreToPass += 20;
        game.wait = game.wait * 0.9;
        game.levelScore = 0;
        game.levelNumber += 1;
        
        // animation
        game.pause = true;
        game.block = true;
        notifications.animText('Level ' + game.levelNumber, 10 * conf.unit, function () {
            notifications.clear();
            game.pause = false;
            game.block = false;
            gameLoop();
        });
    }
}

/*********************************
            gameOver
*********************************/
var gameOver = function () {
    
    console.info('game over');
    
    //
    trash.forEach(function (player) {
        scores.push( player.name );
        scores.push( player.score );
    });
    
    // clearing the game
    Player.startPosNum = 0;
    Player.ctrlsNum = 0;
    foods.length = 0;
    toRemove.length = 0;
    trash.length = 0;
    game.status.innerHTML = '';
    game.scoreToPass += conf.level1Score;
    game.wait = conf.level1Wait;
    game.levelScore = 0;
    game.levelNumber = 1;
    
    // sorting scores
    sortArrayXY(scores, function ( name1, score1, name2, score2 ) {
        return score1 < score2;
    });
    
    // animating
    
    var anim = AnimText('Game Over', {
        x: conf.width * conf.unit / 2,
        y: conf.height * conf.unit / 2,
        size: 70,
        times: 7
    });
    
    (function () {
        if ( anim.hasNext ) {
            // clear
            game.ctx.clearRect(0, 0, conf.width * conf.unit, conf.height * conf.unit);
            anim.draw();
            setTimeout( arguments.callee, game.wait );
        } else {
            game.canvas.style.visibility = 'hidden';
            game.scores.style.display = 'block';
        }
    })();
    
    window.onkeydown = undefined;
    
    // scores
    var scores_string = '';
    forEachXY(scores, function ( name, score ) {
        scores_string += '<div>' + name + ': <div style="float: right;">' + score + '</div></div>';
    });
    
    game.scoresOutput.innerHTML = scores_string;
    
};



// setting game.gameLoop
game.gameLoop = gameLoop;

return {
    
    conf: conf,
    game: game,
    notifications: notifications,
    players: players,
    foods: foods,
    trash: trash,
    toRemove: toRemove,
    scores: scores,
    Player: Player,
    Food: Food,
    init: init,
    gameOver: gameOver,
    gameLoop: gameLoop,
    AnimText: AnimText,
    Text: Text,
    utils: {
        randomInt: randomInt,
        range: range,
        copyArray: copyArray,
        copyObject: copyObject,
        removeFromArray: removeFromArray,
        existeInArray: existeInArray,
        uniqueArray: uniqueArray,
        sortArray: sortArray,
        forEachXY: forEachXY,
        sortArrayXY: sortArrayXY,
        emptyStr: emptyStr,
        forEachPaire: forEachPaire
    }
    
};

})();

