const { CanvasLayer } = require("godot");
const godot = require("godot");
const jsb = require("godot-jsb");

exports.default = class Hud extends CanvasLayer {
    // Called when the node enters the scene tree for the first time.
    _ready() {

    }

    // Called every frame. 'delta' is the elapsed time since the previous frame.
    _process(delta) {
    }

    show_message(text) {
        this.get_node("Message").text = text;
        this.get_node("Message").show();
        this.get_node("MessageTimer").start();
    }

    show_game_over() {
        this.show_message("Game Over");

        // TODO: fixit
        // Wait until the MessageTimer has counted down.
        jbs.core.$await(this.get_node("MessageTimer").timeout);

        this.get_node("Message").text = "Dodge the Creeps!"
        this.get_node("Message").show();
        // Make a one-shot timer and wait for it to finish.
        jbs.core.$await(this.get_tree().create_timer(1.0).timeout);
        this.get_node("StartButton").show();
    }

    update_score(score) {
        this.get_node("ScoreLabel").text = godot.str(score);
    }

    _on_start_button_pressed() {
        this.get_node("StartButton").hide();
        this.start_game.emit();
    }

    _on_message_timer_timeout() {
        this.get_node("Message").hide();
    }

};

jsb.internal.add_script_signal(exports.default.prototype, "start_game");
