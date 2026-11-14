# Outpost Odyssey Surface Crew

A React rebuild of the lunar outpost game, with a camera behind the selected astronaut, interactive equipment consoles, mobile controls, a local soundtrack and effects, and optional spoken guidance.

This repository contains the standalone React edition of the game.

## Start playing

Requires Node.js **22.12 or newer**. On Windows, double-click **start-game.cmd** in this folder. It installs missing dependencies and starts the server.

Or open a terminal in this folder:

```powershell

npm install

npm run dev

```

Open **http://localhost:5173/** on the computer. Keep that terminal running while you play; Ctrl+C stops it.

### Play on a phone

1. Connect the phone and computer to the same Wi-Fi.

2. Start the game on the computer using the steps above.

3. Open the **Network** URL printed by Vite in Safari or Chrome on the phone. Use the address printed by your server; it can change between networks.

`localhost` on a phone refers to the phone itself; use the computer's Network URL. LAN access must be available on the network and host. No firewall or security settings are changed by this project.

Portrait and landscape layouts are supported. The phone does not need Node.js or an app installation. For access away from the same Wi-Fi, build and host the `dist` folder on an HTTPS static host. A standalone web-app manifest is included for browsers that offer an Add to Home Screen feature; this is a browser game, not an APK or an iOS package. Offline installation/service-worker caching is not implemented.

## Controls

| Action | Computer | Phone |

| --- | --- | --- |

| Move | W A S D / arrows | Left thumbstick |

| Look around | Drag the scene | Drag the scene with another finger |

| Sprint | Hold Shift | Toggle the sprint button |

| Use nearby equipment | E / Use prompt | USE button |

| Follow the next task | Follow the beacon | Follow the beacon / target button |

| Select crew | Crew cards / 1–4 | Crew cards |

| Map | M / Map | Map icon |

| Reset camera | R / reset icon | Reset icon |

| Leave console / pause | Escape | Step away / pause |

| Fullscreen | Fullscreen button | Fullscreen button, when supported |

The movement stick and look gesture use independent pointer captures, so moving and looking can happen together. Touch controls clear on cancellation, focus loss, backgrounding and crew changes. Camera collision checks shorten the view around buildings, and the camera tracks terrain height.

## In-world consoles

Walk to a lit console beside the equipment and press USE. React renders the choices into a Three.js CSS3D screen mounted on a physical platform in the scene. The camera moves toward that screen while you read. There is no modal backdrop and no browser popup for mission choices.

- Training, site choice, construction and placement use the science-station console.

- Hazards are handled at their equipment: solar array, shelter, habitat, rover or life support.

- Daily jobs direct the crew to the relevant station.

- Rover routes, instrument results, sampling and ice processing use the rover's field console.

- Night reports are available at the habitat.

- Maps, field guide, mission log, meters, settings and pause use a deployable field terminal near the selected crew member.

Scroll the console to read more, then step away to explore. Reading pauses movement and action timers. Resource meters change through decisions and daily upkeep; simply reading or walking does not consume supplies.

## Sound and voice

The first player tap unlocks browser audio. The settings console has separate controls for:

- Master volume and a quick mute/unmute button.

- A synthesized space soundtrack.

- Suit ventilation and nearby equipment ambience.

- Footsteps, rover motor, interface tones, scan sounds, work cues, warnings and completion sounds.

- Spoken mission guidance and voice volume.

Audio is generated locally with Web Audio. Ambient effects represent the suit and equipment; the soundtrack is fictional. The Moon has no atmosphere to carry ordinary outdoor sound.

Voice cues use **local device/browser speech voices** in English or Arabic. Availability depends on the device's installed voices. If a matching local voice is absent, the game keeps all written guidance/captions and reports the unavailable voice in Settings. It does not send narration to a remote speech API, and it never uses the microphone. Sound preferences are saved in the browser. If audio is suspended after switching apps, tap a control to resume it.

## Mission systems retained

The five-day Moon mission retains the three landing sites; original site modifiers; 100-credit construction; four equipment tiers with three levels each; optional rover and greenhouse; habitat/panel placement; resource forecasts; three main meters; named crew and injury/recovery; randomized hazards; live/archived DONKI flare context; power emergencies; daily jobs; uncertain ice routes and rover risks; scanning and sampling; water/oxygen choices; night reports; scoring; decision history; previous-score comparison; English/Arabic text; glossary; maps; science and source links.

The 3D terrain, routes, distances, timers, scores and resource effects are illustrative game values. Earth uses NASA Blue Marble imagery. The supplied LOLA elevation/slope images remain accessible with their legends and source attribution. The terrain mesh is not imported NASA topography. Historical and engineering caveats remain available in the in-game science guide.

Saves and settings use a separate `odyssey_react_` namespace. The old game's saves are not overwritten. Rover journeys resume with their saved position and camera heading. Progress saves after completed steps, when a console opens, when backgrounded and on exit.

Arabic text inherited from the original and the new additions are AI-assisted drafts. Native-speaker review is still recommended before public submission.

## Build and verify

```powershell

npm test

npm run build

npm run preview

```

The production build is in `dist`. Preview serves it on **http://localhost:4173/** and prints a Network address for a phone. Serve `dist` over HTTP/HTTPS; directly opening its HTML with a `file:` URL is not supported by browser ES modules.

Dependencies are pinned in `package.json` and `package-lock.json`: React 19.3.1, Vite 8.3.8 and Three.js 0.187.0. They bundle into the production output; the built game does not require a library CDN. Live NASA weather retrieval remains optional and falls back to labelled archived data.

The test suite checks mission guards and all hazard/ice branches, five-day runs at every site in both languages, saves, camera positioning, joystick normalization, console sizing at eight viewport dimensions, navigation around all build placements, audio controls and voice fallbacks, and 70 React-rendering cases.

Browser checks covered the actual WebGL scene, behind-character camera, phone portrait/landscape console layouts, English/Arabic switching, training, preparation, equipment response, daily work, and night progression. Physical iPhone/Android hardware and audible speaker output still need device checks; viewport emulation and audio-node tests do not replace those checks.

## Source structure

| Location | Purpose |

| --- | --- |

| `src/App.jsx` | React app state, mission actions and scene lifecycle |

| `src/components/` | React HUD, setup, physical console content, maps, science and touch controls |

| `src/game/model.js` | Ported mission rules, resource math, sources and observable store |

| `src/game/translations.js` | Original English/Arabic text and scientific corrections |

| `src/game/copy.js` | New interface and audio text in both languages |

| `src/world/` | Procedural models, navigation, follow camera and CSS3D consoles |

| `src/audio/AudioBus.js` | Synthesized audio and local speech |

| `public/assets/` | Lunar maps and the local NASA Earth texture |

| `tests/` | Node tests and React rendering checks |

React owns the interface, choices, settings and mission updates. Three.js owns scene rendering and frame-based motion through a React effect with cleanup. The old imperative UI is not loaded or embedded. There are no mission `innerHTML` templates, `<dialog>` popups or `dangerouslySetInnerHTML` render paths.

Credits and assistance disclosure are included below. `README.md` is the only Markdown file included in this repository.

## Detailed models and direction fix — 14 November 2026

Left/right movement now matches the view for A/D, arrow keys and the thumbstick, including the rover camera. A regression projects movement through the actual Three.js camera at six headings.

The scene now has adult-proportioned astronauts with articulated knees and elbows, woven suit surfaces, curved reflective visors, crew patches, chest controls, hoses, gloves, boot soles and radiator backpacks. Stations have formed panels, airlock hardware, stairs and handrails, pressure tanks, plumbing, solar-cell textures, plant trays and instrument housings. The rover has six treaded wheels, suspension, optics, radiators and a sampling arm. Wheel rotation and walking footprints respond to movement.

Terrain uses smooth crater bowls, granular regolith, irregular distant ridges and instanced rocks. Earth uses a locally bundled NASA Blue Marble map. These are more detailed game models, not photorealistic scans or engineering simulations. Static details are merged by material while animated parts remain separate; phone mode retains smaller terrain meshes, reflection textures and shadow maps. Low-detail mode remains available in Settings.

Verification includes the direction regression, every station tier and four crew rigs, preservation of doors/joints/panels/wheels after batching, existing mission/audio/UI tests, and browser checks at phone portrait and landscape sizes. Physical-device frame rates remain unmeasured.



## Credits and scientific sources

### Maps

- **Lunar south pole elevation and slope maps** (`assets/elevation-map.jpg`, `assets/slope-map.jpg`): data from the Lunar Orbiter Laser Altimeter (LOLA) on NASA's Lunar Reconnaissance Orbiter, via the [LPI Lunar South Pole Atlas](https://www.lpi.usra.edu/lunar/lunar-south-pole-atlas/) (Lunar and Planetary Institute / USRA).



### Live data

- **Solar flares:** [NASA DONKI](https://kauai.ccmc.gsfc.nasa.gov/DONKI/) (Space Weather Database Of Notifications, Knowledge, Information), fetched through [api.nasa.gov](https://api.nasa.gov/). When the live data can't load, the game shows archived DONKI records, labelled "archived".



### NASA sources for the science facts

- [NASA: Shadows near the Moon's south pole](https://science.nasa.gov/resource/shadows-near-the-moons-south-pole/)

- [NASA: Shackleton crater's illuminated rim and shadowed interior](https://science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/)

- [NASA: Weather on the Moon](https://science.nasa.gov/moon/weather-on-the-moon/)

- [NASA: Moonbase environment](https://www.nasa.gov/reference/moonbase-environment/)

- Ewert, M. K. & Stromgren, C. (2019). [*Astronaut Mass Balance for Long Duration Missions*](https://ntrs.nasa.gov/api/citations/20190027563/downloads/20190027563.pdf). ICES-2019-126, NASA Johnson Space Center (NTRS 20190027563). Source for the daily oxygen, water and food figures.

- [NASA Moon Trek](https://trek.nasa.gov/moon/) (more terrain and lighting layers, linked from the in-game credits).

- [NASA: LCROSS mission](https://science.nasa.gov/mission/lcross/). The 2009 impact into Cabeus crater found water (ice fact).

- [NASA: What hazards are caused by lunar regolith?](https://science.nasa.gov/biological-physical/what-hazards-are-caused-by-lunar-regolith/). Apollo dust damage to boots and seals (dust fact).

- [NASA: Moonbase environment](https://www.nasa.gov/reference/moonbase-environment/) is also the source for the −203 °C figure in the de Gerlache freezing event.



### Sunlight figures (NASA LOLA data)

- Gläser, P., Scholten, F., De Rosa, D., Marco Figuera, R., Oberst, J., Mazarico, E., Neumann, G. & Robinson, M. S. (2014). Illumination conditions at the lunar south pole using high resolution Digital Terrain Models from LOLA. *Icarus* 243: 79–90. [DLR record](https://elib.dlr.de/94240/). Source for the Connecting Ridge sunlight figures (92.27% at 2 m, 95.65% at 10 m, longest darkness 3–5 days). Co-authors include NASA Goddard scientists, and the work uses NASA LOLA data.

- Shackleton rim sunlight (three rim points lit together for more than 90% of the year): [NASA: Shackleton crater's illuminated rim and shadowed interior](https://science.nasa.gov/resource/shackleton-craters-illuminated-rim-shadowed-interior/).

- de Gerlache rim: the team is still checking this figure.



### Other science sources (not NASA)

- Zhang, S. et al. (2020). First measurements of the radiation dose on the lunar surface. *Science Advances* 6(39): eaaz1334. doi:[10.1126/sciadv.aaz1334](https://doi.org/10.1126/sciadv.aaz1334). Chang'e-4 Lunar Lander Neutrons and Dosimetry (LND) data. Linked in the game through [Sci.News](https://www.sci.news/space/radiation-dose-rates-lunar-surface-08893.html).



### UAE science card (Rashid rover)

- MBRSC as a 2026 Space Agency Partner: [NASA Space Apps 2026: Space Agency Partners](https://www.spaceappschallenge.org/2026/space-agency-partners/), and NASA's 2026 registration announcement ([reposted by astrobiology.com](https://astrobiology.com/2026/09/04/registration-is-now-open-for-the-2026-nasa-space-apps-challenge/)), which names "Mohammed Bin Rashid Space Centre of the United Arab Emirates".

- Launch (December 11, 2022) and the MBRSC rover as a payload: [ispace: HAKUTO-R Mission 1](https://www.ispace-inc.com/mission-1/).

- The April 2023 crash: [NASA: LRO views the impact site of the HAKUTO-R Mission 1 Moon lander](https://www.nasa.gov/centers-and-facilities/goddard/nasas-lro-views-impact-site-of-hakuto-r-mission-1-moon-lander/).



### Crew

- Hessa, Maya, Kenji and Sam are made-up characters, not real astronauts.



### Original edition fonts

- [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) by Cadson Demak, SIL Open Font License 1.1, served by Google Fonts.

- [Nunito](https://fonts.google.com/specimen/Nunito) by Vernon Adams, SIL Open Font License 1.1, served by Google Fonts.

- [Noto Sans Arabic](https://fonts.google.com/noto/specimen/Noto+Sans+Arabic) by Google (Noto project), SIL Open Font License 1.1, served by Google Fonts. Used for the Arabic version.



### Note

All meter values, costs, credits and event damage in the game are simplified game numbers, not NASA measurements.


### Current game, assets and libraries

- React and React DOM 19.3.1, Three.js 0.187.0, and Vite 8.3.8. Library notices ship in `public/licenses/` and are copied to production builds. Three.js addons provide CSS3DRenderer, RoundedBoxGeometry and BufferGeometryUtils.
- Astronauts, terrain, equipment and material maps are procedural game illustrations. The terrain is not an imported LOLA mesh; equipment is not a certified engineering design. The interface uses system fonts.
- Earth: NASA Earth Observatory **Blue Marble: Next Generation**, January 2004, reduced to 2048 x 1024 and bundled locally. [Source and downloads](https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/). [Original JPEG](https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/january/world.200401.3x5400x2700.jpg). NASA Earth Observatory imagery by Reto Stockli, based on MODIS data, NASA Goddard Space Flight Center. NASA does not endorse this game.
- Game music, ambience and effects use locally generated Web Audio synthesis. Voice cues use installed local browser voices through SpeechSynthesis; no third-party voice likenesses or recordings are used.
- Source planning used the project's supplied lunar-elevation, slope, role, planning and scientific-research documents. Those source documents are not included in this standalone game repository.
- Technical references: [React](https://react.dev/learn/build-a-react-app-from-scratch), [Vite](https://vite.dev/guide/), [Three.js](https://threejs.org/docs/), [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) and [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis).

### AI assistance and validation

OpenAI Codex assisted with the React migration, procedural models/materials, world consoles, camera, touch controls, local audio, translations and automated checks. The original mission balance and science sources were retained, with caveats distinguishing estimates from measurements. New and inherited Arabic text needs native-speaker review.

All 22 automated tests pass, including five-day mission runs, hazard/ice branches, saves, audio fallbacks, bilingual React rendering, camera-relative left/right movement, and preservation of animated geometry after batching. Production builds succeed. Browser QA covered equipment interaction and phone portrait/landscape layouts. Physical phone performance and audible speaker output have not been verified on hardware.
