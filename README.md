# Noten-Lernen Fork

## Live at

https://vbeaulieu.com/noten-lernen

## Modifications

This fork adds/modify the original version likeso

### Key signature option
Added a setting to select the Key of the song. For example if your are playing in D / Bm, all F and C and sharps. In F / Dm, B is flat and so on.

### Note distribution correction
Every natural note has the same probability to appear. Original version has a skewed distribution due to being surrounded by 2 black keys. In the original version the distribution is like this:
  - C, E, F and B = 3/24
  - D, G and A = 4/24

### Accidentals with key signature
Changed how the accidentals are being asked to be more precise and more consistent to how to add an accidental to a note, depending on the key signature as well.
  - Sharpen a sharp note = Double sharp
  - Flatten a sharp note = Natural
  - Sharpen a flat note = Natural
  - Flatten a flat note = Double flat

### Custom difficulty
Let's you choose a custom range of notes to be asked for every clef (Bass, Treble, Alto, Tenor)


