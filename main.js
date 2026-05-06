import { Vec2, dropletObj, GlassObj, Rect } from "./class.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Game properties
let gravity = 150;
let alldrops = [];
let allglasses = [];
let sec_time = 0;

// Controls properties
let screenWidth = 500, screenHeight = 500;
let mouseX = 0, mouseY = 0;
let pointer_down = false;

// General variables
let p_x = 0, p_y = 0;
let lastTime = 0;

// Main update method
const update = (dt) => {
    alldrops.map((drop) => {
        if (drop.dead) return;
        drop.update(dt);
        drop.velocity.y += (gravity * dt);
        
        if (drop.position.y >= screenHeight) drop.dead = true;

        allglasses.map((glass) => {
            if (glass.flowRect.collidePoint(drop.position.x, drop.position.y)){
                drop.dead = true;
                glass.flow += 0.20;
            }
        });
    });

    // Filter all dead drops
    let newDrops = [];
    alldrops.map((drop) => { if (!drop.dead) newDrops.push(drop); });
    alldrops = newDrops;

    // Time in seconds
    if (sec_time >= 1) {
        if (pointer_down) {
            let vec2 = new Vec2(mouseX, mouseY);
            let drop = new dropletObj(vec2, 20);
            alldrops.push(drop);
        }

        sec_time = 0;
    } else {
        sec_time += dt * 1;
    }
}

// Main draw method
const draw = (dt) => {
    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // Game things
    ctx.fillStyle = "red";
    ctx.fillRect(mouseX, mouseY, 20, 20);

    // Supposed cups
    allglasses.map((glass) => {
        glass.drawInWater(ctx);
        glass.draw(ctx);
    });

    // Draw all drops
    alldrops.map((drop) => {
        drop.draw(ctx, "green");
    });
}

const loop = (timestamp) => {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop)

// Pointer events
// down
canvas.addEventListener("pointerdown", (e) => {
    mouseX = e.clientX, mouseY = e.clientY;
    pointer_down = true;

    p_x = mouseX;
    p_y = mouseY;
});
// up
canvas.addEventListener("pointerup", (e) => {
    mouseX = e.clientX, mouseY = e.clientY;
    pointer_down = false;
});
// down
canvas.addEventListener("pointermove", (e) => {
    mouseX = e.clientX, mouseY = e.clientY;
});

// Resize screen
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Initializing objects
let test_Rect = new Rect(100, 100, 100, 250);
let test_glass = new GlassObj(test_Rect);
allglasses.push(test_glass);
