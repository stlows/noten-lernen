export default {
  hasAccidental(v) {
    v %= 12;
    return v === 1 || v === 3 || v === 6 || v === 8 || v === 10;
  },

  getNearestNoteOfValue(value, otherNote) {
    let v = value;
    while (otherNote >= v + 6) {
      v += 12;
    }
    return v;
  },

  getNoteName(noteValue, isSharp) {
    var noteNames = this.getNoteNamesArray(isSharp);
    return noteNames[noteValue];
  },

  getNoteNamesArray(isSharp) {
    if (isSharp) {
      return [
        "C",
        "CSharp",
        "D",
        "DSharp",
        "E",
        "F",
        "FSharp",
        "G",
        "GSharp",
        "A",
        "ASharp",
        "B"
      ];
    } else {
      return [
        "C",
        "DFlat",
        "D",
        "EFlat",
        "E",
        "F",
        "GFlat",
        "G",
        "AFlat",
        "A",
        "BFlat",
        "B"
      ];
    }
  },

  accidentalsByKey(key) {
    switch (key) {
      case "C": // no sharps or flats
        return { sharps: [], flats: [] };
      case "G": // 1 sharp: F#
        return { sharps: [5], flats: [] }; // F = 5
      case "D": // 2 sharps: F#, C#
        return { sharps: [5, 0], flats: [] };
      case "A": // 3 sharps: F#, C#, G#
        return { sharps: [5, 0, 7], flats: [] };
      case "E": // 4 sharps: F#, C#, G#, D#
        return { sharps: [5, 0, 7, 2], flats: [] };
      case "B": // 5 sharps: F#, C#, G#, D#, A#
        return { sharps: [5, 0, 7, 2, 9], flats: [] };
      case "F#": // 6 sharps: F#, C#, G#, D#, A#, E#
        return { sharps: [5, 0, 7, 2, 9, 4], flats: [] };
      case "C#": // 7 sharps: F#, C#, G#, D#, A#, E#, B#
        return { sharps: [5, 0, 7, 2, 9, 4, 11], flats: [] };

      case "F": // 1 flat: Bb
        return { sharps: [], flats: [11] }; // B
      case "Bb": // 2 flats: Bb, Eb
        return { sharps: [], flats: [11, 4] }; // B, E
      case "Eb": // 3 flats: Bb, Eb, Ab
        return { sharps: [], flats: [11, 4, 9] }; // B, E, A
      case "Ab": // 4 flats: Bb, Eb, Ab, Db
        return { sharps: [], flats: [11, 4, 9, 2] }; // B, E, A, D
      case "Db": // 5 flats: Bb, Eb, Ab, Db, Gb
        return { sharps: [], flats: [11, 4, 9, 2, 7] }; // B, E, A, D, G
      case "Gb": // 6 flats: Bb, Eb, Ab, Db, Gb, Cb
        return { sharps: [], flats: [11, 4, 9, 2, 7, 0] }; // B, E, A, D, G, C
      case "Cb": // 7 flats: Bb, Eb, Ab, Db, Gb, Cb, Fb
        return { sharps: [], flats: [11, 4, 9, 2, 7, 0, 5] }; // B, E, A, D, G, C, F

      default:
        return { sharps: [], flats: [] };
    }
  },

  midiPianoNotes: [19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77],

  notesSample(start, end) {
    return this.midiPianoNotes.filter(n => n >= start && n <= end);
  },

  notesByKey(key) {
    switch (key) {
      case "C":
      case "G":
      case "D":
      case "A":
      case "E":
      case "B":
      case "F#":
      case "C#":
        return "CCDDEFFGGAAB";

      case "F":
      case "Bb":
      case "Eb":
      case "Ab":
      case "Db":
      case "Gb":
      case "Cb":
        return "CDDEEFGGAABB";

      default:
        return "CCDDEFFGGAAB";
    }
  }
};
