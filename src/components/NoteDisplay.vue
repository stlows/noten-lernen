<template>
  <div id="note-outer-box">
    <div id="note-display" @click="playCurrentNote"></div>
  </div>
</template>

<script>
import Utils from "../model/Utils";
import Options from "../model/Options";
import abcjs from "abcjs";

export default {
  name: "NoteDisplay",
  data() {
    return {
      options: Options
    };
  },
  props: {
    currentExercise: Object
  },
  computed: {
    accidental() {
      // if (!Utils.hasAccidental(this.currentExercise.value)) {
      //   return "";
      // }
      // return this.currentExercise.isSharp ? "^" : "_";
      return "";
    },
    noteLetter() {
      return Utils.notesByKey(this.options.key)[
        this.currentExercise.value % 12
      ];
    },
    note() {
      // ABC notation reference: https://abcnotation.com/wiki/abc:standard:v2.1#pitch
      // We are numbering the notes starting with C0 = 0, D0 = 1 and so on. Thus C4 = 48.
      const value = this.currentExercise.value;
      if (value < 12) {
        return this.noteLetter + ",,,,";
      } else if (value < 24) {
        return this.noteLetter + ",,,";
      } else if (value < 36) {
        return this.noteLetter + ",,";
      } else if (value < 48) {
        return this.noteLetter + ",";
      } else if (value < 60) {
        return this.noteLetter;
      } else if (value < 72) {
        return this.noteLetter.toLowerCase();
      } else if (value < 84) {
        return this.noteLetter.toLowerCase() + "'";
      } else if (value < 96) {
        return this.noteLetter.toLowerCase() + "''";
      }
    },
    abc() {
      if (this.currentExercise.staff === "piano") {
        return (
          // Multiple voices notation: https://abcnotation.com/wiki/abc:standard:v2.1#multiple_voices
          "L:1/4\n" +
          "%%score {1 2}\n" +
          "V:1 clef=treble\n" +
          "V:2 clef=bass\n" +
          "K:" +
          this.options.key +
          "\n" +
          "[V:1] " +
          (this.currentExercise.clef === "treble"
            ? this.accidental + this.note
            : "z") +
          "\n" +
          "[V:2] " +
          (this.currentExercise.clef === "bass"
            ? this.accidental + this.note
            : "z")
        );
      } else {
        return (
          "L:1/4\nK:" +
          this.options.key +
          " " +
          this.currentExercise.clef +
          "\n" +
          this.accidental +
          this.note
        );
      }
    }
  },
  watch: {
    abc(value) {
      abcjs.renderAbc("note-display", this.abc, {
        clickListener: () => this.unselect(),
        paddingtop: "0",
        paddingleft: "0",
        paddingbottom: "0",
        paddingright: "0",
        // It is somewhat tricky to size and layout an SVG image correctly. We start by setting 'responsive'
        // here, which lets us control size via the width of the parent object.
        //responsive: "resize",
        scale: 3,
        staffwidth: 450 // Sufficient to show a single quarter note.
      });
    }
  },
  methods: {
    playCurrentNote() {
      this.$emit("play");
    },
    unselect() {
      Array.from(document.getElementsByTagName("path"))
        .filter(p => p.getAttribute("fill") === "#ff0000")
        .forEach(p => p.setAttribute("fill", null));
    }
  }
};
</script>

<style scoped>
#note-display {
  margin: 0px auto;
  padding-bottom: 20px;
}

#note-outer-box {
  width: 450px;
}
</style>
