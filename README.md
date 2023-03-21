# Modular Monosynth

## [Play the synth!](https://modular-monosynth.netlify.app)

<img src="https://res.cloudinary.com/dpkg7rmxr/image/upload/v1679378914/Screen_Shot_2023-03-21_at_5.06.24_pm_wnixcp.png" height="250px" alt="synth image"/>

### About

The Modular Monosynth web app is a project that is inspired by my passion for modular synthesizers (I design and build my own hardware synths). I wanted to code a web app that could also be a fun synthesizer to play music with. The main library used in Tone.js which uses the Web Audio API. 

The main goal of the synth is to create a monosynth with the flexibility of a modular synth system.

### Technical details
The web app is being built with ReactJS and Sass. For sound the main library used in Tone.js, which wraps the Web Audio API. 

### Updates

The following features have been recently added:

- Cursor highlighting on the matrix to improve visibility and usability. When the user places their cursor over a square, the row and column are highlighted with another colour to show which two modules correlate at that location. 
- Added second track to sequencer. The user is now able to sequence two lines simulultaneously.
- Gate and Note assignation for the sequencer. Now that there are two tracks, the user can assign which oscillator the notes will be assigned to, and which adsr/envelope the gates will be assigned to. 
- 4 VCAs have been introduced. This allows the user to have more control over modulation. They can also use them as a 4 channel mixer.


### Next steps

Features to come:

- Saving and loading matrix and module settings presets
- Add settings to keyboard allowing user to control the key-osc-adsr assignation
- Ability to add and remove modules from the system
- MIDI - possible for the user to plug in a midi keyboard and play the synth


