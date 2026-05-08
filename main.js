import { Vec2, dropletObj, GlassObj, Rect } from "./class.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

// Game properties
let gravity = 150;
let alldrops = [];
let allglasses = [];
let dt_time = 0;
let uni_time = 0;
let color_index = 0;
const colors = ["red", "blue", "green"];

// Times ( for delays )
let drop_delay = 0.15, drop_snap = 0;

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
            if (glass.flowRect.collidePoint(drop.position.x, drop.position.y-drop.radius)){
                drop.dead = true;
                glass.flow += 0.02;
            }
        });
    });

    // Filter all dead drops
    let newDrops = [];
    alldrops.map((drop) => { if (!drop.dead) newDrops.push(drop); });
    alldrops = newDrops;

    // Delays in shiz
    if (uni_time-drop_snap >= drop_delay) {
        if (pointer_down) {
            let vec2 = new Vec2(mouseX, mouseY);
            let drop = new dropletObj(vec2, 10, "red");
            alldrops.push(drop);
        }
        drop_snap = uni_time;
    }

    // Time in miliseconds
    if (dt_time >= 0.01) {
        dt_time = 0;
        uni_time += 0.01;
    } else {
        dt_time += dt * 1;
    }
}

// Main draw method
const draw = (dt) => {
    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // Game things
    ctx.fillStyle = colors[color_index];
    ctx.fillRect(mouseX, mouseY, 20, 20);

    // Supposed cups
    allglasses.map((glass) => {
        glass.drawInWater(ctx, "red");
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
//key
window.addEventListener("keyup", (e) => {
    if (e.key == 1) {
        color_index = 0;
    } else if (e.key == 2) {
        color_index = 1;
    } else if (e.key == 3) {
        color_index = 2;
    }
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
