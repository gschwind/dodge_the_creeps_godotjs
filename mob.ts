import { RigidBody2D, AnimatedSprite2D, randi } from "godot";

export default class Mob extends RigidBody2D {
    // Called when the node enters the scene tree for the first time.
    _ready() : void {
        // TODO: fix it, array does not seems to work
        //let mob_types = this.get_node("AnimatedSprite2D").sprite_frames.get_animation_names();
        const mob_types = ["fly", "swim", "walk"];
        (<AnimatedSprite2D>this.get_node("AnimatedSprite2D")).play(mob_types[randi() % mob_types.length]);
    }

    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta : number) : void {
    }

    _on_visible_on_screen_notifier_2d_screen_exited() : void {
        console.log("Mob::_on_visible_on_screen_notifier_2d_screen_exited");
        this.queue_free();
    }
};
