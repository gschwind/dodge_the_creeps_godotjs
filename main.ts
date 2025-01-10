const { Node, Vector2, PackedScene } = require("godot");
const jsb = require("godot-jsb");
const godot = require("godot");
const { signal, export_ } = require("jsb.core");

let PI = 3.1415927;

class Main extends Node {
    mob_scene;
    score;

    _ready() {
        console.log("Main::_ready");
    }

    game_over() {
        this.get_node("Music").stop();
        this.get_node("DeathSound").play();
        this.get_node("ScoreTimer").stop();
        this.get_node("MobTimer").stop();
        this.get_node("HUD").show_game_over();
    }

    new_game() {
        console.log("Main::new_game");
        this.get_tree().call_group("mobs", "queue_free");
        this.score = 0;
        this.get_node("Player").start(this.get_node("StartPosition").position);
        this.get_node("StartTimer").start();

        this.get_node("HUD").update_score(this.score);
        this.get_node("HUD").show_message("Get Ready");
        this.get_node("Music").play();
    }

    _on_mob_timer_timeout() {
        // Create a new instance of the Mob scene.
        let mob = this.mob_scene.instantiate();
        //let mob = godot.load("res://mob.tscn").instantiate();
        // Choose a random location on Path2D.
        let mob_spawn_location = this.get_node("MobPath/MobSpawnLocation");
        mob_spawn_location.progress_ratio = godot.randf();

        // Set the mob's direction perpendicular to the path direction.
        let direction = mob_spawn_location.rotation + PI / 2;

        // Set the mob's position to a random location.
        mob.position = mob_spawn_location.position;

        // Add some randomness to the direction.
        direction += godot.randf_range(-PI / 4, PI / 4);
        mob.rotation = direction;

        // Choose the velocity for the mob.
        let velocity = new Vector2(godot.randf_range(150.0, 250.0), 0.0);
        mob.linear_velocity = velocity.rotated(direction);

        // Spawn the mob by adding it to the Main scene.
        this.add_child(mob);
    }

    _on_score_timer_timeout() {
        this.score += 1;
        this.get_node("HUD").update_score(this.score)
    }

    _on_start_timer_timeout() {
        console.log("_on_start_timer_timeout");
        this.get_node("MobTimer").start();
        this.get_node("ScoreTimer").start();
     }

};

export_(godot.Variant.Type.TYPE_OBJECT)(Main.prototype, "mob_scene");

exports.default = Main;
