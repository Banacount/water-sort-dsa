
export class Vec2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.objId = 0;
    }
}

export class Rect {
    constructor (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.objId = 1;
    }

    collideRect (other_rect) {
        return (
            this.x < other_rect.x + other_rect.width &&
            this.x + this.width > other_rect.x &&
            this.y < other_rect.y + other_rect.height &&
            this.y + this.height > other_rect.y
        );
    }
}

export class GlassObj {
    constructor (rect) {
        this.rect = rect;
        this.flow = new Rect(rect.x, rect.y, rect.width, 2);
        this.objId = 2;
    }

    draw (ctx, color) {
        let rect_base = this.rect;
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        //left
        ctx.moveTo(rect_base.x, rect_base.y); ctx.lineTo(rect_base.x, rect_base.y + rect_base.height); //right
        ctx.moveTo(rect_base.x + rect_base.width, rect_base.y); 
        ctx.lineTo(rect_base.x + rect_base.width, rect_base.y + rect_base.height);
        ctx.stroke();
        //bottom
        ctx.moveTo(rect_base.x, rect_base.y + rect_base.height); 
        ctx.lineTo(rect_base.x + rect_base.width, rect_base.y + rect_base.height);
        ctx.stroke();
    }
}

export class dropletObj {
    constructor (vec2_pos, radius) {
        this.position = vec2_pos;
        this.radius = radius;
        this.velocity = new Vec2(0, 0);
        this.dead = false;
        this.objId = 3;
    }

    draw (ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    update (dt) {
        this.position.x += (this.velocity.x * dt);
        this.position.y += (this.velocity.y * dt);
    }
}
