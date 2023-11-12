const sectors = [
  { color: "#f82", label: "BUKYA" },
  { color: "#0bf", label: "BUKYA" },
  { color: "#fb0", label: 2  },
  { color: "#0fb", label: "BUKYA" },
  { color: "#b0f", label: "REWARDS" },
  { color: "#f0b", label: "BUKYA" },
  { color: "#bf0", label: 1 }
];
window.addEventListener("load", (event) => {
  var money = document.getElementById("money");
  var costToPlay = document.getElementById("cost");
  money.innerHTML = 2;
  if (money.innerHTML > 3) {
    document.getElementById("cost").style.color = "red";
  } else {
    document.getElementById("cost").style.color = "green";
  }
});
// Generate random float in range min-max:
const rand = (m, M) => Math.random() * (M - m) + m;

const tot = sectors.length;
const elSpin = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext`2d`;
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;
const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
const angVelMin = 0.002; // Below that number will be treated as a stop
let angVelMax = 0; // Random ang.vel. to acceletare to
let angVel = 0; // Current angular velocity
let ang = 0; // Angle rotation in radians
let isSpinning = false;
let isAccelerating = false;

//* Get index of current sector */
const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;
var shopon = true;
function showshop() {
  if (shopon == true) {
    document.getElementById("shop").style.display = "none";
  }
  document.getElementById("shop").style.display = "block";
}
//* Draw sectors and prizes texts to canvas */
const drawSector = (sector, i) => {
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);
  //
  ctx.restore();
};

//* CSS rotate CANVAS Element */
const rotate = () => {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  elSpin.textContent = !angVel ? "-1Point" : sector.label;
  elSpin.style.background = sector.color;
};

const frame = () => {
  if (!isSpinning) return;

  if (angVel >= angVelMax) isAccelerating = false;

  // Accelerate
  if (isAccelerating) {
    angVel ||= angVelMin; // Initial velocity kick
    angVel *= 1.06; // Accelerate
  }

  // Decelerate
  else {
    isAccelerating = false;
    angVel *= friction; // Decelerate by friction

    // SPIN END:
    if (angVel < angVelMin) {
      const sector = sectors[getIndex()];
      isSpinning = false;
      angVel = 1;
      alert("You got: " + sector.label);
      console.log(parseInt(money.innerHTML) + 5);
      if (sector.label == "REWARDS") {
        money.innerHTML = parseInt(money.innerHTML) + 5;
      } else if (sector.label == "BUKYA") {
        let i = 0;
        i++;
      } else {
        money.innerHTML = parseInt(money.innerHTML) + parseInt(sector.label);
      }

      money.innerHTML -= 1;
      if (money.innerHTML < 3) {
        document.getElementById("cost").style.color = "red";
      } else if (money.innerHTML > 3) {
        alert("You Won!");
        document.getElementById("goalnumber").style.color = "green";
      } else {
        document.getElementById("cost").style.color = "green";
      }
    }
  }

  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate(); // CSS rotate!
};

const engine = () => {
  frame();
  requestAnimationFrame(engine);
};

elSpin.addEventListener("click", () => {
  if (money.innerHTML < 1) {
    alert("You don't have spin points to play this game,");
    return;
  }
  if (isSpinning) return;
  isSpinning = true;
  isAccelerating = true;
  angVelMax = rand(0.25, 0.4);
});

// INIT!
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine!
