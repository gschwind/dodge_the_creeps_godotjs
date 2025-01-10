import { Variant, Area2D, Input, Vector2, PropertyHint, CollisionShape2D, AnimatedSprite2D, Signal, Signal0, Signal1 } from "godot";
import { signal, export_ } from "jsb.core";

export default class Player extends Area2D {
    @signal() hit! : Signal0;
    @export_(Variant.Type.TYPE_INT) speed = 400;
    screen_size! : Vector2;
    // Called when the node enters the scene tree for the first time.
    _ready() {
        this.screen_size = this.get_viewport_rect().size;
        //this.hide();
        //this.hit.connect((body) => this._on_body_entered(body));
    }

    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta : number) : void {
        let AnimatedSprite2D = <AnimatedSprite2D>this.get_node("AnimatedSprite2D");
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

    _on_body_entered(body : Player) : void {
        this.hide(); // Player disappears after being hit.
        this.hit.emit();
        // Must be deferred as we can't change physics properties on a physics callback.
        let s = <CollisionShape2D>this.get_node("CollisionShape2D");
        s.set_deferred("disabled", true);
    }

    start(pos : Vector2) : void {
        this.position = pos;
        this.show();
        let s = <CollisionShape2D>this.get_node("CollisionShape2D")
        s.disabled = false;
    }
};
