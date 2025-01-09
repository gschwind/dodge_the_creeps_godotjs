const { RigidBody2D } = require("godot");
const godot = require("godot");
const jsb = require("godot-jsb");

exports.default = class Mob extends RigidBody2D {
    // Called when the node enters the scene tree for the first time.
    _ready() {
        // TODO: fix it, array does not seems to work
        //let mob_types = this.get_node("AnimatedSprite2D").sprite_frames.get_animation_names();
        const mob_types = ["fly", "swim", "walk"];
        this.get_node("AnimatedSprite2D").play(mob_types[godot.randi() % mob_types.length]);
    }

    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta) {
    }

    _on_visible_on_screen_notifier_2d_screen_exited() {
        console.log("Mob::_on_visible_on_screen_notifier_2d_screen_exited");
        this.queue_free();
    }
};
