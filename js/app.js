;(function(win, doc){
    'use strict';
    var audio, playBtn,
        seekBtn, volBtn,
        cur = 0, songs = [
           'sounds/First_Snow.mp3',
           'sounds/Fly_of_the_Brants.mp3',
           'sounds/Vivace_aperto.mp3'
        ],
        seekFillBtn, volFillBtn,
        audioTime, audioDuration,
        prevBtn, nextBtn,
        volIcon, isDown = false;
    
    function init(){
        audio = new Audio();
        playBtn = doc.querySelector('.play-btn');
        seekBtn = doc.querySelector('.seek-bar');
        seekFillBtn = seekBtn.querySelector('.fill');
        volBtn = doc.querySelector('.vol-bar');
        volFillBtn = volBtn.querySelector('.fill');
        volIcon = doc.querySelector('.vol-icon');
        audioTime = doc.querySelector('.song-timer');
        audioDuration = doc.querySelector('.song-duration');
        prevBtn = doc.querySelector('.back-btn');
        nextBtn = doc.querySelector('.next-btn');
        audio.src = songs[cur];
        handlers();
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
            cur--;
            audio.src = songs[cur];
            if(cur <= 0){
                cur  = songs.length - 1;
            }
        });

        nextBtn.addEventListener('click', function(){
            cur++;
            audio.src = songs[cur];
            if(cur > songs.length - 1){
                cur = 0;
            }
        });
    }
    win.addEventListener('load', init);
})(window, document);