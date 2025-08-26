<template>
  <div class="game-screen">
    <div class="game-screen-section">
      <button class="quit" @click="quit">
        {{$t('ABORT')}}
      </button>
      <ScoreLine 
        :result="result" 
        :timeLeft="timeLeft"
        :isInfiniteRound="!options.gameLength" />
      <FeedbackLine 
        :feedback="feedback"
        :feedbackNote="feedbackNote"
        :uniqueId="numAnswers" />
    </div>
    <div class="game-screen-section" id="game-note-display">
      <NoteDisplay 
        :currentExercise="currentExercise"
        @play="playNote(currentExercise.value)" />
    </div>
    <div class="game-screen-section" id="game-screen-input">
      <ButtonInput 
        v-if="options.inputMode === 'button'" 
        :isSharp="currentExercise.isSharp" 
        @solved="checkAnswer" />  
      <KeyboardInput 
        v-if="options.inputMode === 'keyboard'" 
        @solved="checkAnswer" />
      <MidiInput
        v-if="options.inputMode === 'midi'"
        @solved="(value) => checkAnswer(value, true)" />
      <MousetrapInput 
        v-if="options.inputMode !== 'midi'"
        @solved="checkAnswer" />
    </div>
  </div>
</template>

<script>
import ScoreLine from "./ScoreLine";
import NoteDisplay from "./NoteDisplay";
import FeedbackLine from "./FeedbackLine";
import ButtonInput from "./ButtonInput";
import KeyboardInput from "./KeyboardInput";
import MidiInput from "./MidiInput";
import MousetrapInput from "./MousetrapInput";

import Utils from "../model/Utils";
import Options from "../model/Options";
import Statistics from "../model/Statistics";

import * as _ from "lodash";

export default {
  name: "Game",
  components: {
    ScoreLine,
    NoteDisplay,
    FeedbackLine,
    ButtonInput,
    KeyboardInput,
    MidiInput,
    MousetrapInput
  },
  data() {
    return {
      options: Options,
      currentExercise: {
        clef: "treble",
        staff: "treble",
        value: 36,
        isSharp: false
      },
      numCorrect: 0,
      numWrong: 0,
      timeLeft: 0,
      timer: null,
      feedbackNote: "none",
      feedback: "none",
      sample: null,
    };
  },
  computed: {
    numAnswers() {
      return this.numCorrect + this.numWrong;
    },
    accuracy() {
      if (this.numAnswers === 0) {
        return 0;
      }
      return Math.round((100 * this.numCorrect) / this.numAnswers);
    },
    score() {
      if (this.numAnswers === 0) {
        return 0;
      }
      return Math.round(
        (this.baseFactor * this.numCorrect * this.numCorrect) / this.numAnswers
      );
    },
    baseFactor() {
      // 20s -> 300, 1min -> 100, 5min -> 20
      return this.options.gameLength ? 6000 / this.options.gameLength : 0;
    },
    result() {
      return {
        numAnswers: this.numAnswers,
        numCorrect: this.numCorrect,
        numWrong: this.numWrong,
        accuracy: this.accuracy,
        score: this.score
      };
    },
    bassValues() {
      switch (this.options.difficulty) {
        case "custom":
          return Utils.notesSample(this.options.customDifficultyBassMin || 28, this.options.customDifficultyBassMax || 47)
        case "easy":
          return Utils.notesSample(36, 47)
        case "normal":
          return Utils.notesSample(28, 47)
        case "hard":
        default:
          return Utils.notesSample(19,57)
      }
    },
    trebleValues() {
      switch (this.options.difficulty) {
        case "custom":
          return Utils.notesSample(this.options.customDifficultyTrebleMin || 48, this.options.customDifficultyTrebleMax || 69)
        case "easy":
          return Utils.notesSample(48, 60)
        case "normal":
          return Utils.notesSample(48, 69)
        case "hard":
        default:
          return Utils.notesSample(40, 77)
      }
    },
    altoValues() {
      switch (this.options.difficulty) {
         case "custom":
        return Utils.notesSample(this.options.customDifficultyAltoMin || 36, this.options.customDifficultyAltoMax || 60)
        case "easy":
          return Utils.notesSample(43, 55)
        case "normal":
          return Utils.notesSample(36, 60)
        case "hard":
        default:
          return Utils.notesSample(29, 67)
      }
    },
    tenorValues() {
      switch (this.options.difficulty) {
         case "custom":
          return Utils.notesSample(this.options.customDifficultyTenorMin || 36, this.options.customDifficultyTenorMax || 60)
        case "easy":
          return Utils.notesSample(43, 55)
        case "normal":
          return Utils.notesSample(36, 60)
        case "hard":
        default:
          return Utils.notesSample(26, 64)
      }
    }
  },
  methods: {
    startGame() {
      this.numCorrect = 0;
      this.numWrong = 0;
      this.timeLeft = this.options.gameLength;
      if (this.options.gameLength) {
        this.timer = setInterval(() => {
          this.timeLeft -= 1;
          if (this.timeLeft < 0) {
            this.onGameFinished();
          }
        }, 1000);
      }
      this.generateNewExercise();
    },
    onExit() {
      clearInterval(this.timer);
      if (this.sample) {
        this.sample.pause();
      }
    },
    onGameFinished() {
      this.onExit();
      Statistics.addScore(
        this.score,
        this.options.clef,
        this.options.difficulty,
        this.options.accidentals
      );
      this.$emit("gameEnded", this.result);
    },
    quit() {
      this.onExit();
      this.$emit("gameEnded", null);
    },
    generateNewExercise() {
      let exercise = this.currentExercise;
      while (exercise.value === this.currentExercise.value) {
        exercise = this.generateExercise();
      }
      this.currentExercise = exercise;
    },
    generateExercise() {
      var clef = _.sample(this.options.clef);
      if (clef === "piano") {
        const staves = ["treble", "bass"];
        clef = staves[_.random(0, staves.length - 1)];
        var staff = "piano";
      } else {
        var staff = clef;
      }
      const exercise = {
        clef,
        staff,
        natural: this.getRandomNoteForClef(clef),
        accidental: ""
      };
      exercise.value = exercise.natural;
      const accidentalsInKey = Utils.accidentalsByKey(this.options.key);

      console.log("Natural note selected: ", exercise.natural % 12);
      if (accidentalsInKey.sharps.includes(exercise.value % 12)) {
        exercise.value++;
        exercise.isSharp = true;
        console.log(
          "This note is sharp in this key so raising the value to: ",
          exercise.value % 12
        );
      }
      if (accidentalsInKey.flats.includes(exercise.natural % 12)) {
        exercise.value--;
        exercise.isSharp = false;
        console.log(
          "This note is flat in this key so falttening the value to: ",
          exercise.value % 12
        );
      }

      if (this.options.accidentals !== "off") {
        let accidental = "";
        switch (this.options.accidentals) {
          case "some":
            accidental = _.sample(["sharpen", "flatten", "", "", "", "", "", ""]);
          case "more":
            accidental = _.sample(["sharpen", "flatten", "", ""]);
          case "always":
            accidental = _.sample(["sharpen", "flatten"]);
        }

        if (accidental === "sharpen") {
          exercise.value++;
          exercise.accidental = "^";
          console.log(
            "Sharpening the note, new value to guess is",
            exercise.value % 12
          );
          if (accidentalsInKey.sharps.includes(exercise.natural % 12)) {
            console.log("This note is already sharp, make it double sharp!");
            exercise.accidental = "^^";
          }
          if (accidentalsInKey.flats.includes(exercise.natural % 12)) {
            console.log("This note is already flat, make it natural !");
            exercise.accidental = "=";
          }
        }

        if (accidental === "flatten") {
          exercise.value--;
          exercise.accidental = "_";
          console.log(
            "Flattening the note, new value to guess is",
            exercise.value % 12
          );
          if (accidentalsInKey.sharps.includes(exercise.natural % 12)) {
            console.log("This note is already sharp, make it natural !");
            exercise.accidental = "=";
          }
          if (accidentalsInKey.flats.includes(exercise.natural % 12)) {
            console.log("This note is already sharp, make it double flat!");
            exercise.accidental = "__";
          }
        }
      }

      //console.log(exercise.value);
      //console.log(exercise, Utils.accidentalsByKey(this.options.key));
      return exercise;
    },
    getRandomNoteForClef(clef) {
      switch (clef) {
        case "treble":
          return _.sample(this.trebleValues);
        case "bass":
          return _.sample(this.bassValues);
        case "alto":
          return _.sample(this.altoValues);
        case "tenor":
          return _.sample(this.tenorValues);
      }
    },
    checkAnswer(value, checkOctave = false) {
      console.log(value, this.currentExercise);
      this.playNote(
        Utils.getNearestNoteOfValue(value, this.currentExercise.value)
      );
      if (checkOctave) {
        var submittedValue = value;
        var expectedValue = this.currentExercise.value;
      } else {
        var submittedValue = value % 12;
        var expectedValue = this.currentExercise.value % 12;
      }
      if (submittedValue === expectedValue) {
        this.onCorrectAnswer(value, this.currentExercise.isSharp);
        this.generateNewExercise();
      } else {
        this.onWrongAnswer(value);
      }
    },
    onCorrectAnswer(noteValue, isSharp) {
      this.numCorrect += 1;

      if (this.options.displayNote) {
        this.feedback = "correct-note";
        this.feedbackNote = Utils.getNoteName(noteValue % 12, isSharp);
      } else {
        this.feedback = "correct";
      }
    },
    onWrongAnswer(wrongValue) {
      this.numWrong += 1;
      this.feedback = "wrong";
      if ("vibrate" in navigator && this.options.vibration) {
        navigator.vibrate(200);
      }
    },
    playNote(value) {
      if (!this.options.sound) {
        return;
      }
      if (!!this.sample && !this.sample.paused) {
        this.sample.pause();
      }
      this.sample = new Audio("static/samples/piano/" + value + ".mp3");
      this.sample.play();
    }
  },
  mounted() {
    this.startGame();
  }
};
</script>

<style>
.game-screen {
  margin: 0 auto;
  max-width: 720px;
  height: 100%;
}

.game-screen-section {
  display: flex;
  flex: auto;
  min-width: 50%;
  flex-flow: column wrap;
}

#game-screen-input {
  min-width: 100%;
  align-self: start;
}

#game-note-display {
  align-items: center;
  justify-content: flex-end;
}

@media (orientation: landscape) {
  #game-note-display,
  #game-screen-input {
  }
}

@media (orientation: portrait) {
  #game-note-display,
  #game-screen-input {
    min-height: 33%;
    min-width: 100%;
  }
}

button.quit {
  padding: 5px;
  font-weight: bold;
  border: none;
  outline: none;
  background-color: lightblue;
  cursor: pointer;
}

button.quit:hover {
  background-color: steelblue;
}

button.quit:focus {
  outline: none;
  background-color: lightblue;
}

button.quit:active {
  background-color: yellow;
}
</style>
