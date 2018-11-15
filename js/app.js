;(function(win, doc){
    'use strict';
    var audio, playBtn,
        seekBtn, volBtn,
        cur = 0, songs = [
           'sounds/First_Snow.mp3',
           'sounds/Fly_of_the_Brants.mp3',
           'sounds/Vivace_aperto.mp3',
           'sounds/words.mp3'
        ],
        songsTitle = [
            'first snow',
            'fly of the brants',
            'vivac aperto',
            'words'
        ], 
        songsImgs = [
            'url("images/1.jpg")',
            'url("images/2.jpg")',
            'url("images/3.jpg")',
            'url("images/words.jpg")'
        ],
        songTitle, songAvatar,
        seekFillBtn, volFillBtn,
        audioTime, audioDuration,
        prevBtn, nextBtn,
        replayBtn, randomBtn,
        isClicked = false,
        volIcon, isDown = false;
    var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
    function init(){
        audio = new Audio();
        playBtn = doc.querySelector('.play-btn');
        seekBtn = doc.querySelector('.seek-bar');
        seekFillBtn = seekBtn.querySelector('.fill');
        volBtn = doc.querySelector('.vol-bar');
        volFillBtn = volBtn.querySelector('.fill');
        volIcon = doc.querySelector('.vol-icon');
        songTitle = doc.querySelector('.song__title');
        songAvatar = doc.querySelector('.song__avatar');
        audioTime = doc.querySelector('.song-timer');
        audioDuration = doc.querySelector('.song-duration');
        prevBtn = doc.querySelector('.back-btn');
        nextBtn = doc.querySelector('.next-btn');
        replayBtn = doc.querySelector('.replay-btn');
        randomBtn = doc.querySelector('.shuffle-btn');
        audio.src = songs[cur];
        handlers();
        makeVisulazation();
    }
    function makeVisulazation() {
        context = new AudioContext(); // AudioContext object instance
        analyser = context.createAnalyser(); // AnalyserNode method
        canvas = doc.getElementById('myCanvas');
        ctx = canvas.getContext('2d');
        // Re-route audio playback into the processing graph of the AudioContext
        source = context.createMediaElementSource(audio); 
        source.connect(analyser);
        analyser.connect(context.destination);
        frameLooper();
    }
    function frameLooper(){
        fbc_array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbc_array);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
         // Color of the bars
        bars = 100;
        for (var i = 0; i < bars; i++) {
            bar_x = i * 3;
            bar_width = 2;
            bar_height = -(fbc_array[i] / 2);
            ctx.fillStyle = `hsl(${i * 2}, 100%, 60%)`;
            //  fillRect( x, y, width, height ) // Explanation of the parameters below
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        }
        win.requestAnimationFrame(frameLooper);
    }
    function clamp(min, val, max) {
        return Math.min(Math.max(min, val), max);
    }
    function getP(e, btn) {
        var p = (e.clientX - btn.offsetLeft) / btn.clientWidth;
        p = clamp(0, p, 1);
        return p;
    }
    function handlers(){

        playBtn.addEventListener('click', function(){
            if(audio.paused){
                audio.play();
            }else {
                audio.pause();
            }
        });
        randomBtn.addEventListener('click',function(){
            
            this.classList.toggle('active');
            if(!isClicked){
                var rand = ~~(Math.random() * songs.length);
                audio.src = songs[rand];
                songTitle.textContent = songsTitle[rand];
                songAvatar.style.backgroundImage = songsImgs[rand];
                isClicked = !isClicked;
            }
            
        });
        replayBtn.addEventListener('click', function(){
            this.classList.toggle('active');
            if(!isClicked){
                audio.addEventListener('ended', function(){
                    audio.currentTime = 0;
                    audio.paly();
                }, false);
                audio.play();
                isClicked = !isClicked;
            }
        })
        audio.addEventListener('play', function(){
            playBtn.firstElementChild.className = 'fas fa-pause';
        });
        audio.addEventListener('pause', function(){
            playBtn.firstElementChild.className = 'fas fa-play';
        });
        audio.addEventListener('timeupdate', function(e){
            if(isDown) return;
            var p = audio.currentTime / audio.duration;
            seekFillBtn.style.width = p * 100 + '%';
            var curTimeMins = ~~(audio.currentTime / 60),
                curTimeSec = ~~(audio.currentTime - curTimeMins * 60),
                durMins = ~~(audio.duration / 60),
                durSec = ~~(audio.duration - durMins * 60);
                curTimeSec = curTimeSec < 10 ? `0${curTimeSec}`:curTimeSec;
                curTimeMins = curTimeMins < 10 ? `0${curTimeMins}`:curTimeMins;
                durSec = durSec < 10 ? `0${durSec}`:durSec;
                durMins = durMins < 10 ? `0${durMins}`:durMins;
                audioTime.textContent = `${curTimeMins}:${curTimeSec}`;
                audioDuration.textContent = `${durMins}:${durSec}`;
        });
        seekBtn.addEventListener('mousedown', function(e){
            isDown = true;
            var p = getP(e, this);
            seekFillBtn.style.width = p * 100 + '%';
        });
        seekBtn.addEventListener('mouseup', function(e){
             if(!isDown) return;
            isDown = false;
            var p = getP(e, this);
            seekFillBtn.style.width = p * 100 + '%';
            audio.currentTime = p * audio.duration;
        });

        seekBtn.addEventListener('mousemove', function(e){
            if(!isDown) return;
            var p = getP(e, this);
            seekFillBtn.style.width = p * 100 + '%';
        });

        volIcon.addEventListener('click', function(){
            if(audio.muted){
                audio.muted = false;
                this.firstElementChild.className = 'fas fa-volume-up';
            }else{
                audio.muted = true;
                this.firstElementChild.className = 'fas fa-volume-off';
            }
        });

        volBtn.addEventListener('mousedown', function(e){
            isDown = true;
            var p = getP(e, volBtn);
            volFillBtn.style.width = p * 100 + '%';
        });
        
        volBtn.addEventListener('mouseup', function(e){
            if(!isDown) return;
            isDown = false;
            var p = getP(e, volBtn);
            volFillBtn.style.width = p * 100 + '%';
            
            if(p <= 20){
                volIcon.firstElementChild.className = 'fas fa-volume-down';
            }else if(p <= 0){
                volIcon.firstElementChild.className = 'fas fa-volume-off';
            }else if(p > 50) {
                volIcon.firstElementChild.className = 'fas fa-volume-up';
            }
            audio.volume = p;
        });
        volBtn.addEventListener('mousemove', function(e){
            if(!isDown) return;
            var p = getP(e, volBtn);
            volFillBtn.style.width = p * 100 + '%';

        });

        prevBtn.addEventListener('click', function(){
            audio.src = songs[cur];
            songTitle.textContent = songsTitle[cur];
            songAvatar.style.backgroundImage = songsImgs[cur];
            if(cur <= 0){
                cur  = songs.length - 1;
            }else {
                cur--;
            }
        });

        nextBtn.addEventListener('click', function(){
            audio.src = songs[cur];
            songTitle.textContent = songsTitle[cur];
            songAvatar.style.backgroundImage = songsImgs[cur];
            if(cur >= songs.length - 1){
                cur = 0;
            }else {
                cur++;
            }
        });
    }
    win.addEventListener('load', init);
})(window, document);