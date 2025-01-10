const godot = require("godot");
const { Area2D, Input, Vector2, PropertyHint } = require("godot");
const { signal, export_ } = require("jsb.core");
const jsb = require("godot-jsb");

function decorator (value, context) {
  console.log("decorated value is:", value);
  console.log("context is: ", context);
}

class Player extends Area2D {
    speed = 400;
    screen_size;
    // Called when the node enters the scene tree for the first time.
    _ready() {
        this.screen_size = this.get_viewport_rect().size;
        //this.hide();
        //this.hit.connect((body) => this._on_body_entered(body));
    }

    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta) {
        let AnimatedSprite2D = this.get_node("AnimatedSprite2D");
        let velocity = Vector2.ZERO;
        if (Input.is_action_pressed("move_right")) {
            velocity.x += 1;
        }
        if (Input.is_action_pressed("move_left")) {
            velocity.x -= 1;
        }
        if (Input.is_action_pressed("move_down")) {
            velocity.y += 1;
        }
        if (Input.is_action_pressed("move_up")) {
            velocity.y -= 1;
        }
        if (velocity.length() > 0) {
            velocity = velocity.normalized()
            velocity = new Vector2(
                velocity.x * this.speed,
                velocity.y * this.speed);
            AnimatedSprite2D.play();
        } else {
            AnimatedSprite2D.stop();
        }

        this.position = new Vector2(
            this.position.x + velocity.x * delta,
            this.position.y + velocity.y * delta);
        this.position = this.position.clamp(Vector2.ZERO, this.screen_size);

        if (velocity.x != 0) {
            AnimatedSprite2D.animation = "walk";
            AnimatedSprite2D.flip_v = false;
            // See the note below about the following boolean assignment.
            AnimatedSprite2D.flip_h = velocity.x < 0;
        } else if (velocity.y != 0){
            AnimatedSprite2D.animation = "up";
            AnimatedSprite2D.flip_v = velocity.y > 0;
        }
    }

    _on_body_entered(body) {
        this.hide(); // Player disappears after being hit.
        this.hit.emit();
        // Must be deferred as we can't change physics properties on a physics callback.
        this.get_node("CollisionShape2D").set_deferred("disabled", true);
    }

    start(pos) {
        this.position = pos;
        this.show();
        this.get_node("CollisionShape2D").disabled = false;
    }
};

signal()(Player.prototype, "hit");

export_(godot.Variant.Type.TYPE_INT)(Player.prototype, "speed");

exports.default = Player;
