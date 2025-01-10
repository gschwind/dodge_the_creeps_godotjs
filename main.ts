import { randf, randf_range, Variant, Node, Vector2, PackedScene, AudioStreamPlayer, Timer, CanvasLayer, PathFollow2D, Marker2D } from "godot";
import { $wait, experimental, export_, export_enum, export_exp_easing, export_file, export_flags, export_global_file, export_multiline, export_range, export_range_i, help, onready, signal } from "jsb.core";
import Hud from "./hud";
import Mob from "./mob";
import Player from "./player"

let PI = 3.1415927;

export default class Main extends Node {
    @export_(Variant.Type.TYPE_OBJECT) mob_scene! : PackedScene;
    score! : number;

    _ready() : void {
        console.log("Main::_ready");
    }

    game_over() : void {
        (<AudioStreamPlayer>this.get_node("Music")).stop();
        (<AudioStreamPlayer>this.get_node("DeathSound")).play();
        (<Timer>this.get_node("ScoreTimer")).stop();
        (<Timer>this.get_node("MobTimer")).stop();
        (<Hud>this.get_node("HUD")).show_game_over();
    }

    new_game() {
        console.log("Main::new_game");
        this.get_tree().call_group("mobs", "queue_free");
        this.score = 0;
        (<Player>this.get_node("Player")).start((<Marker2D>this.get_node("StartPosition")).position);
        (<Timer>this.get_node("StartTimer")).start();

        (<Hud>this.get_node("HUD")).update_score(this.score);
        (<Hud>this.get_node("HUD")).show_message("Get Ready");
        (<AudioStreamPlayer>this.get_node("Music")).play();
    }

    _on_mob_timer_timeout() {
        // Create a new instance of the Mob scene.
        let mob = <Mob>this.mob_scene.instantiate();
        // Choose a random location on Path2D.
        let mob_spawn_location = <PathFollow2D>this.get_node("MobPath/MobSpawnLocation");
        mob_spawn_location.progress_ratio = randf();

        // Set the mob's direction perpendicular to the path direction.
        let direction = mob_spawn_location.rotation + PI / 2;

        // Set the mob's position to a random location.
        mob.position = mob_spawn_location.position;

        // Add some randomness to the direction.
        direction += randf_range(-PI / 4, PI / 4);
        mob.rotation = direction;

        // Choose the velocity for the mob.
        let velocity = new Vector2(randf_range(150.0, 250.0), 0.0);
        mob.linear_velocity = velocity.rotated(direction);

        // Spawn the mob by adding it to the Main scene.
        this.add_child(mob);
    }

    _on_score_timer_timeout() {
        this.score += 1;
        (<Hud>this.get_node("HUD")).update_score(this.score)
    }

    _on_start_timer_timeout() {
        console.log("_on_start_timer_timeout");
        (<Timer>this.get_node("MobTimer")).start();
        (<Timer>this.get_node("ScoreTimer")).start();
     }

};
