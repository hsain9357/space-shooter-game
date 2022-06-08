const cloudsContainer = document.querySelector(".cloudsContainer");
const failedVideo = document.querySelector(".failedVideo");
const startGame = document.querySelector(".startGame");
const planit = document.querySelector(".planit");
const rendomAliens = document.querySelector(".rendomAliens");
const pointCollected = document.querySelector(".pointCollected");
const audioBlowAlien = new Audio("/assets/gunsound.mp3");
audioBlowAlien.load();
const audioLevelUp = new Audio("/assets/levelup.wav");
audioLevelUp.load();

class StartGameClass {
  constructor() {
    this.pointsColoceted = 0;
    this.alien = null;
    this.shouldStopIntervalCheckIfTheyCrashed = false;
    this.shouldStopIntervalDestroyAlient = false;
    this.shouldStopIntervalChangeHorizantilOfAlien = false;
    this.shouldStopIntervalNewAlien = false;
    this.newClouds();
    this.events();
  }
  startGameFun() {
    this.shouldStopIntervalCheckIfTheyCrashed = false;
    this.shouldStopIntervalDestroyAlient = false;
    this.shouldStopIntervalNewAlien = false;
    this.shouldStopIntervalChangeHorizantilOfAlien = false;
    this.destroyTheAlien();
    this.checkThewinIfTheyCrashedThePlatnet();
    this.newAliens();
  }

  stopGame() {
    this.shouldStopIntervalDestroyAlient = true;
    this.shouldStopIntervalNewAlien = true;
    this.shouldStopIntervalCheckIfTheyCrashed = true;
    this.shouldStopIntervalChangeHorizantilOfAlien = true;
    this.deleteChildren();
    startGame.style.display = "block";
  }

  events() {
    startGame.addEventListener("click", () => {
      this.startGameFun();
      startGame.style.display = "none";
    });

    planit.addEventListener("pointerup", (e) => {
      this.eventHandler(e);
    });
    planit.addEventListener("pointerdown", (e) => {
      this.eventHandler(e);
    });
  }
  newClouds() {
    setInterval(() => {
      const randomNum = Math.floor(Math.random() * 100);
      const cloud = document.createElement("img");
      cloud.src = "./assets/imgs/nube-sheet0.webp";
      cloud.className = "clouds";
      cloud.style.left = `${randomNum}%`;
      cloud.style.top = "-2rem";
      cloud.style.zIndex = "1";
      this.apendClouds(cloud);
    }, 2000);
  }

  apendClouds(clouds) {
    cloudsContainer.appendChild(clouds);
    this.deleteChapes(clouds);
  }

  newAliens() {
    const intervalNewAlien = setInterval(() => {
      if (this.shouldStopIntervalNewAlien) {
        clearInterval(intervalNewAlien);
      }
      const randomNum = Math.floor(Math.random() * 88);
      const alien = document.createElement("div");
      alien.className = "alien";
      alien.style.left = ` ${randomNum}vw`;
      alien.style.top = "-2rem";
      alien.style.zIndex = "1";
      this.appendAliens(alien);
      this.changeTheHorizantilOfAlien();
    }, 500);
  }
  appendAliens(alien) {
    rendomAliens.appendChild(alien);
    this.deleteChapes(alien);
  }

  deleteChapes(cloud) {
    setTimeout(() => {
      cloud.remove();
    }, 15000);
  }

  eventHandler(e) {
    e.preventDefault();
    this.handlePointerDown = this.handlePointerDown;
    this.handlePointerUp = this.handlePointerUp;

    switch (e.type) {
      case "pointerdown":
        this.handlePointerDown();
        break;

      case "pointerup":
        this.handlePointerUp();
        break;

      default:
    }
  }

  handlePointerDown() {
    document.addEventListener("pointermove", this.handlePointerMove);
  }

  handlePointerUp() {
    document.removeEventListener("pointermove", this.handlePointerMove);
  }

  handlePointerMove(e) {
    e.preventDefault();

    planit.style.left = `${e.pageX + 5}px`;
    planit.style.top = `${e.pageY - 80}px`;
  }

  changeTheHorizantilOfAlien() {
    this.alien = document.querySelectorAll(".rendomAliens .alien");
    return this.alien.forEach((element) => {
      let shouldBeTop;
      const intervalChangeHorizantilOfAlien = setInterval(() => {
        if (this.shouldStopIntervalChangeHorizantilOfAlien) {
          clearInterval(intervalChangeHorizantilOfAlien);
          return;
        }
        shouldBeTop = parseInt(element.style.top) + 40;
        element.style.top = `${shouldBeTop}px`;
      }, 50);
    });
  }

  destroyTheAlien() {
    let currentReached = 100;
    const interval = setInterval(() => {
      if (this.shouldStopIntervalDestroyAlient) {
        clearInterval(interval);
        return;
      }
      this.alien = document.querySelectorAll(".rendomAliens .alien");
      this.alien.forEach((element) => {
        let leftFires = parseInt(
          window.getComputedStyle(planit).getPropertyValue("left")
        );
        let leftAlien = parseInt(
          window.getComputedStyle(element).getPropertyValue("left")
        );
        
        if (leftFires <= leftAlien + 80 && leftFires >= leftAlien - 10) {
          this.pointsColoceted++;
          pointCollected.textContent = this.pointsColoceted;
          element.style.backgroundImage = "url('./assets/imgs/humoavion.webp')";
          element.style.backgroundSize = "60px";
          element.style.backgroundPosition = "center";
          if (
            currentReached == this.pointsColoceted 
          ) {
            currentReached += 100;
            this.newAliens();
            audioLevelUp.play();
          }
          // to make the audio lots at the same time
          audioBlowAlien.cloneNode(true).play();
          return setTimeout(() => {
            element.remove();
          }, 50);
        }

        return;
      });
    }, 500);
  }

  checkThewinIfTheyCrashedThePlatnet() {
    this.alien = document.querySelectorAll(".rendomAliens .alien");
    const intervalCheckIfTheyCrached = setInterval(() => {
      if (this.shouldStopIntervalCheckIfTheyCrashed) {
        clearInterval(intervalCheckIfTheyCrached);
        return;
      }

      this.alien.forEach((element) => {
        let leftFires = parseInt(
          window.getComputedStyle(planit).getPropertyValue("left")
        );
        let leftAlien = parseInt(
          window.getComputedStyle(element).getPropertyValue("left")
        );
        let topFires = parseInt(
          window.getComputedStyle(planit).getPropertyValue("top")
        );
        let topAlien = parseInt(
          window.getComputedStyle(element).getPropertyValue("top")
        );

        if (
          leftFires <= leftAlien + 80 &&
          leftFires >= leftAlien - 10 &&
          topFires <= topAlien + 30 &&
          topFires >= topAlien - 10
        ) {
          this.pointsColoceted = 0;
          pointCollected.textContent = this.pointsColoceted;
          failedVideo.style.display = "block";
          failedVideo.play();
          this.reHideFailedVideo();
          this.deleteChildren();
          this.stopGame();
          return;
        }
      });
    }, 50);
  }

  reHideFailedVideo() {
    return setTimeout(() => {
      failedVideo.style.display = "none";
    }, 3000);
  }

  deleteChildren() {
    var child = rendomAliens.lastElementChild;

    while (child) {
      rendomAliens.removeChild(child);

      child = rendomAliens.lastElementChild;
    }
  }
}

const game = new StartGameClass();
