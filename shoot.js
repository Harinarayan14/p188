var score = 0;
AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
    var duration = 30;
    var timerEl = document.querySelector("#timer");
    this.startTimer(duration, timerEl);
    
  },
  
  startTimer: function (duration, timerEl) {
    var minutes;
    var seconds;

    setInterval(()=> {
      if (duration >=0) {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        timerEl.setAttribute("text", {
          value: minutes + ":" + seconds,
        });

        duration -= 1;
      } 
      else {
        var txt = document.querySelector("#over");
        txt.setAttribute("visible","true") 
        console.log(txt)
      }
    },1000)
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bullet = document.createElement("a-entity");

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 1,
        });
        bullet.setAttribute("class", "bullet")
        bullet.setAttribute("material", "color", "red");

        var cam = document.querySelector("#camera");
        pos = cam.getAttribute("position");

        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z - 0.5,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        bullet.setAttribute("velocity", direction.multiplyScalar(-2000));



        var scene = document.querySelector("#scene");

        //set the bullet as the dynamic entity
        bullet.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "50",
        });

        //add the collide event listener to the bullet
        bullet.addEventListener("collide", this.removeBullet);

        scene.appendChild(bullet);

        //shooting sound
        this.shootSound();
      }
    });
  },
  removeBullet: function (e) {
    var scene = document.querySelector("#scene");

    //bullet element
    var element = e.detail.target.el;

    //element which is hit
    var elementHit = e.detail.body.el;
    console.log(elementHit)

    if (elementHit.id.includes("enemy")) {
      element.setAttribute("static-body")
      var countTankEl = document.querySelector("#countTank");
      var tanksFired = parseInt(countTankEl.getAttribute("text").value);
      tanksFired -= 1;

      countTankEl.setAttribute("text", {
        value: tanksFired
      });

      if (tanksFired <= 0) {
        var txt = document.querySelector("#completed");
        txt.setAttribute("visible", true);       
        
      }
      scene.removeChild(elementHit);

    }


    //remove event listener
    element.removeEventListener("collide", this.removeBullet);
    //check if the bullet belongs to scene
    //console.log(scene.getElementsByClassName("bullets"))
    
  },
  shootSound: function () {
    var entity = document.querySelector("#sound1");
    entity.components.sound.playSound();
  },
});