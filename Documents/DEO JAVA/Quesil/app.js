(function() {
    // DOM elements
    const userScoreSpan = document.getElementById('user-score');
    const compScoreSpan = document.getElementById('comp-score');
    const resultDiv = document.getElementById('result');
    const battleBtn = document.getElementById('battleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const userVideo = document.getElementById('userVideo');
    const compVideo = document.getElementById('compVideo');
    const choiceCards = document.querySelectorAll('.choice-card');
    
    // Move mapping with RPS details
    const moveMap = {
      'punch': { name: 'THUNDER SPEAR', rps: 'ROCK', beats: 'scissor', losesTo: 'thunder', video: 'punch.mp4', emoji: '🤜' },
      'scissor': { name: 'BLADE STORM', rps: 'SCISSORS', beats: 'thunder', losesTo: 'punch', video: 'scissor.mp4', emoji: '✂️' },
      'thunder': { name: 'COLOSSUS ROAR', rps: 'PAPER', beats: 'punch', losesTo: 'scissor', video: 'thunder.mp4', emoji: '📄' }
    };
    
    let userScore = 0;
    let compScore = 0;
    let currentSelectedMove = null;      // user's chosen move
    
    // Disable animation flags until battle
    let isAnimating = false;
    
    // Helper: Update score UI
    function updateScoreUI() {
      userScoreSpan.textContent = userScore;
      compScoreSpan.textContent = compScore;
    }
    
    // Helper: Set video with source and play
    function setVideoSource(videoElement, srcPath) {
      if (!videoElement) return;
      if (videoElement.src !== window.location.href + srcPath && videoElement.src !== srcPath) {
        videoElement.pause();
        videoElement.src = srcPath;
        videoElement.load();
        videoElement.play().catch(e => console.log("video play", e));
      } else {
        videoElement.play().catch(e => console.log("play"));
      }
    }
    
    // Show default idle state for user video (first frame or default)
    function setDefaultUserVideo() {
      // idle: default titan emblem - we can show a default or first move preview? we set empty or neutral mp4 fallback
      // But we set to a placeholder: use punch.mp4 as default but not showing any move? Better: show a generic "?"
      // However since we want no selection before strike, we show a static dark video or we keep last attacked, but after reset show default.
      // Let's set both to a neutral style: maybe the survey corps logo but we use first video as placeholder? I'll use a black video placeholder or just clear.
      // to avoid confusion: set a dark silent video? No video source? we show nothing? but better to show a subtle emblem.
      // For professional look, set a default "ready" poster effect. We'll set video src to a transparent or just show the first move but user hasn't selected? 
      // To match requirement: computer selection not pre-selected, users see no move until attack. both sides: default blank or default emblems? Use empty src with black background.
      if (userVideo) {
        userVideo.src = '';
        userVideo.poster = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250"%3E%3Crect width="200" height="250" fill="%231a110b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23e07c3c" font-size="16"%3EWAITING%3C/text%3E%3C/svg%3E';
        userVideo.load();
      }
      if (compVideo) {
        compVideo.src = '';
        compVideo.poster = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="250" viewBox="0 0 200 250"%3E%3Crect width="200" height="250" fill="%231a110b"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23c2511a" font-size="16"%3E???%3C/text%3E%3C/svg%3E';
        compVideo.load();
      }
    }
    
    // For battle: animate videos and set moves
    function animateAndSetMoves(userMoveKey, compMoveKey) {
      return new Promise((resolve) => {
        const userMoveData = moveMap[userMoveKey];
        const compMoveData = moveMap[compMoveKey];
        
        // Remove any previous animation classes
        userVideo.classList.remove('animate-user');
        compVideo.classList.remove('animate-comp');
        
        // Force reflow to reset animation
        void userVideo.offsetWidth;
        void compVideo.offsetWidth;
        
        // Set video sources
        setVideoSource(userVideo, userMoveData.video);
        setVideoSource(compVideo, compMoveData.video);
        
        // Add animation classes (slide from left to mid, from right to mid)
        userVideo.classList.add('animate-user');
        compVideo.classList.add('animate-comp');
        
        // Remove animation classes after duration
        setTimeout(() => {
          userVideo.classList.remove('animate-user');
          compVideo.classList.remove('animate-comp');
          resolve();
        }, 500);
      });
    }
    
    // Determine winner: returns 'user', 'comp', 'draw'
    function getRoundWinner(userChoice, compChoice) {
      if (userChoice === compChoice) return 'draw';
      const userMove = moveMap[userChoice];
      if (userMove.beats === compChoice) return 'user';
      return 'comp';
    }
    
    // Execute battle with animations
    async function executeBattle() {
      if (isAnimating) {
        resultDiv.textContent = "⚔️ BATTLE IN PROGRESS... WAIT! ⚔️";
        return;
      }
      if (!currentSelectedMove) {
        resultDiv.textContent = "⚠️ SELECT A MOVE CARD FIRST! (ROCK / PAPER / SCISSORS) ⚠️";
        resultDiv.style.color = "#ffaa77";
        return;
      }
      
      const playerChoice = currentSelectedMove;
      const computerChoice = getComputerMove();
      const userMoveData = moveMap[playerChoice];
      const compMoveData = moveMap[computerChoice];
      const winner = getRoundWinner(playerChoice, computerChoice);
      
      isAnimating = true;
      
      // Animate the vs videos (user from left, comp from right)
      await animateAndSetMoves(playerChoice, computerChoice);
      
      let resultMessage = '';
      let scoreUpdated = false;
      
      if (winner === 'user') {
        userScore++;
        resultMessage = `🔥 VICTORY! ${userMoveData.emoji} ${userMoveData.name} (${userMoveData.rps}) crushes ${compMoveData.name} (${compMoveData.rps})! +1 SCOUT! 🔥`;
        scoreUpdated = true;
      } else if (winner === 'comp') {
        compScore++;
        resultMessage = `💀 DEFEAT! ${compMoveData.emoji} ${compMoveData.name} (${compMoveData.rps}) overpowers ${userMoveData.name} (${userMoveData.rps})! TITAN scores! 💀`;
        scoreUpdated = true;
      } else {
        resultMessage = `⚖️ TITAN CLASH! Both use ${userMoveData.name} (${userMoveData.rps}) — STALEMATE! No points. ⚖️`;
      }
      
      if (scoreUpdated) {
        updateScoreUI();
      }
      
      // Update result panel
      resultDiv.textContent = resultMessage;
      resultDiv.style.color = "#ffd6a8";
      
      // Flash effect
      if (winner === 'user') {
        document.body.style.transition = '0.1s';
        document.body.style.backgroundColor = '#3a280e30';
        setTimeout(() => document.body.style.backgroundColor = '', 200);
      } else if (winner === 'comp') {
        document.body.style.backgroundColor = '#2f111130';
        setTimeout(() => document.body.style.backgroundColor = '', 200);
      }
      
      isAnimating = false;
    }
    
    // Computer random move
    function getComputerMove() {
      const moves = ['punch', 'scissor', 'thunder'];
      return moves[Math.floor(Math.random() * 3)];
    }
    
    // Reset Scoreboard, also reset videos to default state (no previous move)
    function resetScoreboard() {
      userScore = 0;
      compScore = 0;
      updateScoreUI();
      resultDiv.textContent = "⚔️ SCORE RESET! CHOOSE YOUR WEAPON, SOLDIER! ⚔️";
      resultDiv.style.color = "#ffd6a8";
     
      setDefaultUserVideo();
    }
    
    // Card selection logic
    function onChoiceClick(event) {
      if (isAnimating) return;
      const targetCard = event.currentTarget;
      const choiceValue = targetCard.getAttribute('data-choice');
      if (!choiceValue) return;
      
      choiceCards.forEach(card => card.classList.remove('active'));
      targetCard.classList.add('active');
      currentSelectedMove = choiceValue;
      
      const moveData = moveMap[choiceValue];
      resultDiv.textContent = `⚔️ SELECTED: ${moveData.emoji} ${moveData.name} — [${moveData.rps}] Press STRIKE! ⚔️`;
      resultDiv.style.color = "#ffcf9a";
      
      // Flash animation on card
      const videoElem = targetCard.querySelector('.choice');
      if (videoElem) {
        videoElem.style.animation = 'pulseSelect 0.2s ease';
        setTimeout(() => { if(videoElem) videoElem.style.animation = ''; }, 200);
      }
      
    }
    
    // Enable media interaction, loop all videos
    function enableMedia() {
      const bgMusic = document.getElementById('bg-music');
      const allVids = document.querySelectorAll('video');
      const tryPlay = () => {
        if (bgMusic) bgMusic.play().catch(e=>{});
        allVids.forEach(v => { if(v.paused) v.play().catch(e=>{}); });
      };
      document.body.addEventListener('click', function once() {
        tryPlay();
        document.body.removeEventListener('click', once);
      }, { once: true });
      tryPlay();
    }
    
    function ensureLoop() {
      const videos = document.querySelectorAll('video');
      videos.forEach(vid => {
        vid.addEventListener('ended', () => { vid.currentTime = 0; vid.play().catch(e=>{}); });
        vid.muted = true;
        vid.loop = true;
      });
    }
    
    function setDefaultActiveAndPlaceholders() {
      // Default selected first card for better UX but no enemy selection shown until attack.
      if (choiceCards.length > 0 && !currentSelectedMove) {
        const firstCard = choiceCards[0];
        const defaultMove = firstCard.getAttribute('data-choice');
        if (defaultMove) {
          firstCard.classList.add('active');
          currentSelectedMove = defaultMove;
          resultDiv.textContent = `⚔️ READY: ${moveMap[defaultMove].name} (${moveMap[defaultMove].rps}) selected. Tap Strike! ⚔️`;
        }
      }
      setDefaultUserVideo();  
    }
    
    function bindEvents() {
      battleBtn.addEventListener('click', executeBattle);
      resetBtn.addEventListener('click', resetScoreboard);
      choiceCards.forEach(card => card.addEventListener('click', onChoiceClick));
    }
    
    function init() {
      bindEvents();
      ensureLoop();
      enableMedia();
      setDefaultActiveAndPlaceholders();
      updateScoreUI();
    }
    
    init();
  })();