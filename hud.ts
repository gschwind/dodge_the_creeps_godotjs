import { CanvasLayer, Signal0, Label, Timer, Button, str } from "godot";
import { $wait, experimental, export_, export_enum, export_exp_easing, export_file, export_flags, export_global_file, export_multiline, export_range, export_range_i, help, onready, signal } from "jsb.core";

export default class Hud extends CanvasLayer {
    @signal() start_game! : Signal0;

    // Called when the node enters the scene tree for the first time.
    _ready() :void {

    }

    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta : number) {
    }

    show_message(text : string) {
        (<Label>this.get_node("Message")).text = text;
        (<Label>this.get_node("Message")).show();
        (<Timer>this.get_node("MessageTimer")).start();
    }

    async show_game_over() : Promise<void> {
        this.show_message("Game Over");

        // TODO: fixit
        // Wait until the MessageTimer has counted down.
        await $wait((<Timer>this.get_node("MessageTimer")).timeout);

        (<Label>this.get_node("Message")).text = "Dodge the Creeps!";
        (<Label>this.get_node("Message")).show();
        // Make a one-shot timer and wait for it to finish.
        await $wait(this.get_tree().create_timer(1.0).timeout);
        (<Button>this.get_node("StartButton")).show();
    }

    update_score(score : number) : void {
        (<Label>this.get_node("ScoreLabel")).text = str(score);
    }

    _on_start_button_pressed() : void {
        (<Button>this.get_node("StartButton")).hide();
        this.start_game.emit();
    }

    _on_message_timer_timeout() : void {
        (<Label>this.get_node("Message")).hide();
    }

};

//jsb.internal.add_script_signal(exports.default.prototype, "start_game");
