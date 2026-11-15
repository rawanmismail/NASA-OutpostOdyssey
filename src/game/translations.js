const LANG = {};
'use strict';
/* English text for Outpost Odyssey. Every player-facing string lives here and in lang/ar.js; game.js holds no text.
   {name} placeholders are filled in by the game. [[term|text]] becomes a tappable glossary word.
   Keep the keys in lang/ar.js in the same shape as this file. */

LANG.en = {
  dir: 'ltr',
  title: 'dune tech',
  langBtn: 'العربية', langBtnLang: 'ar', langBtnLabel: 'Switch to Arabic',
  list: a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]),

  ui: { brand: 'dune tech', credits: 'NASA science credits', mainMenu: 'Main menu', close: 'Close', tapClose: 'Tap anywhere to close.', notEnoughPower: 'Not enough power', outOf: '{n} out of {of}', comma: ', ' },
  res: { life: 'Life Support', power: 'Power', prot: 'Crew Protection', sci: 'Science' },
  live: { change: '{res} {dir} {n}, now {now}.', up: 'up', down: 'down', danger: 'Danger zone!' },
  tag: { real: 'Real NASA data', est: 'Game estimate', source: 'Source:', srcNasa: 'Real NASA science', srcOther: 'Real science', live: 'Live from NASA DONKI', archived: 'Real NASA DONKI record · archived', simInstrument: 'Simulated instrument', simulated: 'Simulated' },

  terms: {
    regolith: ['Moon soil (regolith)', 'The loose dust and broken rock that covers the Moon. The grains are sharp, a bit like tiny shards of glass.'],
    radiation: ['Radiation', 'Invisible energy and very fast tiny particles from the Sun and deep space. Too much can harm the body. Thick walls and soil block it.'],
    flare: ['Solar flare', 'A sudden burst of light and energy from the Sun. Big ones can fling out particles that reach the Moon in under an hour.'],
    psr: ['Permanently shadowed region', 'A crater floor that never sees direct sunlight. NASA reports some polar ones are as cold as about <span dir="ltr">−203 °C</span>.'],
    slope: ['Slope', 'How steep the ground is, measured in degrees. 0–5° is nearly flat. Above 15° it gets hard for rovers and above 30° it is very steep.'],
    elevation: ['Elevation', 'How high or low the ground is, in metres, compared with the land around it.'],
    scrubber: ['Air scrubber', 'A machine that removes the carbon dioxide (CO₂) we breathe out. Without it the air turns stale and unsafe.'],
    lola: ['LOLA', 'The Lunar Orbiter Laser Altimeter. A laser on a NASA spacecraft that measures the Moon\'s height by timing laser flashes.'],
    donki: ['DONKI', 'NASA\'s Space Weather Database Of Notifications, Knowledge, Information. It lists real solar flares and storms.'],
    rim: ['Crater rim', 'The raised edge around a crater. Some rim peaks near the pole catch sunlight almost all year.'],
  },

  crew: {
    hessa: { name: 'Hessa', role: 'Commander', from: 'the UAE' },
    maya: { name: 'Maya', role: 'Engineer', from: 'the USA' },
    kenji: { name: 'Kenji', role: 'Scientist', from: 'Japan' },
    sam: { name: 'Sam', role: 'Doctor', from: 'Canada' },
  },
  hud: { region: 'Mission status', crewHealth: 'Crew health', missionDay: 'Mission day', day: 'Day {n} of 5', healthy: 'healthy', hurt: 'hurt', mate: '{name}, {role} from {from}: {state}', dangerZone: 'Danger zone', danger: 'Danger', low: 'Low', ok: 'OK' },

  menu: {
    eyebrow: 'NASA-inspired mission trainer · ages 7–12', h1a: 'Outpost', h1b: 'Odyssey',
    sub: 'Build a base near the Moon\'s south pole. Keep your crew alive. Every choice costs something.',
    start: 'Start mission', how: 'How to play',
    note: 'No download, no account. Real NASA science: lunar maps from LOLA, solar flares from DONKI, and facts from NASA\'s Moon research. Game numbers are simplified.',
  },
  how: {
    title: 'How to play', ok: 'Got it',
    items: ['You run a Moon outpost for <b>5 days</b>.', 'Keep three meters up: <b>Life Support</b> (air, water, food), <b>Power</b> and <b>Crew Protection</b>.', 'Each day brings a problem. Every choice has a cost, shown before you pick.', 'Then pick a daily job: do science, fix things, or rest and save power.', 'Little power means the air scrubbers slow down. Everything is connected.', 'At the end you get a mission report. Replay and try a different plan!'],
  },
  credits: {
    intro: '{tag} in this game:',
    items: [
      '<b>Moon maps:</b> elevation and slope maps from the <b>LOLA</b> laser altimeter on NASA\'s Lunar Reconnaissance Orbiter, from the {atlas}. Used on the landing-site screen.',
      '<b>Solar flares:</b> the radiation event uses a real flare class and date from {donki}. It loads live when the browser can reach NASA, and otherwise shows a labelled archived record.',
      '<b>Sunlight and shadows:</b> NASA findings about the Sun\'s low angle, long shadows and sunlit Shackleton rim.',
      '<b>Water ice:</b> NASA research on permanently shadowed regions.',
      '<b>Life support numbers:</b> daily oxygen, water and food needs per astronaut from NASA crew-systems research. Veggie plant growth inspires the greenhouse.',
      'More terrain and lighting layers: {trek}.',
    ],
    sim: '{tag} in this game: all 0–100 meter values, costs, credits and the damage from each event. They are game estimates, not NASA measurements.',
  },

  train: {
    s0: { title: 'Astronaut training', p1: 'You and 3 crewmates are landing near the Moon\'s south pole. You must build a small outpost and keep it running for five days. In training you will learn the three things you have to watch.', p2: 'Here, the Sun is always low, craters are dark and freezing, there is no air, and help is far away. Real NASA planners make choices like yours when they plan the Artemis missions.', btn: 'Meet the meters' },
    s1: {
      title: 'Your three meters', intro: 'Tap each meter to see what uses it. Each goes from 0 to 100. Below 20 is the danger zone.', tapAbove: 'Tap a meter above.', next: 'Next: practice decision',
      sub: { life: 'Air, water and food', power: 'Electricity', prot: 'Suits, walls and safety rules' },
      info: {
        life: 'Used up every day as the crew breathes, drinks and eats. Fancier recyclers waste less but use more power. If power gets too low, the air scrubbers slow down and this meter falls fast.',
        power: 'Made by solar panels. Used by heating, life-support machines, the radio, science and the rover. Shadows and dust make less power. Almost everything you do spends it.',
        prot: 'How well the crew is shielded from radiation, dust, cold and meteorites. Thick walls, shelters, careful suits and repairs raise it. Risky outdoor work lowers it.',
      },
    },
    s2: { title: 'Practice decision', intro: 'The habitat is cold. What do you do? Watch the meters at the top.', up: ['Turn the heater up', 'The crew is comfy.'], down: ['Turn the heater down', 'Save electricity.'], resTitle: 'No choice was free.', resUp: 'A warm habitat protects the crew, but the heater drank power.', resDown: 'You saved power, but a cold habitat is hard on people and equipment.', resEnd: 'That is the whole game: you can never have everything.', next: 'Next' },
    s3: { title: 'Words to know', hint: 'During the game, tap underlined words to see what they mean.', done: 'Training complete. Choose a landing site' },
  },

  site: {
    title: 'Choose your landing site',
    intro: 'NASA picked 13 regions near the south pole as landing candidates, based on [[slope|slope]] and [[elevation|elevation]], lighting and radio contact with Earth. Study the map and pick one of three sites.',
    layer: 'Map layer', elev: 'Elevation map', slope: 'Slope map', full: 'View full size',
    altElev: 'Colour elevation map of the Moon south pole region, 80°S to the pole, with crater names',
    altSlope: 'Colour slope map of the Moon south polar ridge showing de Gerlache and Shackleton craters',
    keyElev: 'Read the colours with the key printed on the map: yellow and orange are higher ground, green is in the middle, blue is lower, and pink and purple are the deepest craters. Shackleton is a crater about 4.2 km deep.',
    keySlope: 'Read the key printed on the map. Grey is nearly flat (0–5°). Cyan and purple are 10–20°. Yellow is 25–30°, and red is steeper than 30°, like the walls of Shackleton. The two maps are zoomed differently, so use the crater names to compare them.',
    mapNote: 'Pins show approximate positions. [[lola|LOLA]] laser elevation and slope maps via the {atlas}.',
    sun: 'Sunlight', rough: 'Rough ground', iceNear: 'Ice nearby',
    dots: 'The dot ratings are game ratings. Sources for the sunlight figures are in each site\'s "NASA says" box.',
    good: 'Good:', risky: 'Risky:', nasaSays: 'NASA says', sunlight: 'Sunlight:',
    land: 'Land here and build', hint: 'Tap a pin on the map or a card to compare sites.',
    bigTitle: '{map} · full size', bigNote: 'Scroll to explore. Source: LOLA data, LPI Lunar South Pole Atlas.', bigAlt: 'Full size map',
  },
  sites: {
    gerlache: {
      name: 'de Gerlache crater edge', short: 'de Gerlache', role: 'Explorer site', pending: 'Sunlight figure still being checked by our team',
      pros: ['Shadowed craters with possible ice are close, so ice trips cost less', 'Great for science'],
      cons: ['Crater walls block the Sun, so solar power is weaker', 'Long shadows hide rocks and slopes'],
      nasa: 'Permanently shadowed craters nearby may hold frozen water, but NASA scientists stress that shadow alone does not guarantee ice.',
      changes: 'Solar panels make about 30% less power. Ice trips are shorter and more likely to find ice. Shadow events hit harder.',
    },
    shackleton: {
      name: 'Shackleton crater rim', short: 'Shackleton', role: 'Power site',
      card: 'Rim lit over 90% of the year', light: 'Three points on Shackleton\'s rim are lit together for more than 90% of the year.',
      pros: ['Rim peaks catch sunlight almost all year, so solar panels work best here', 'Shadow events are mild'],
      cons: ['Very steep and rugged ground', 'The dark crater floor is far below. The rover may get stuck.'],
      nasa: 'The Sun skims the horizon here all year, so high rim peaks stay lit while the crater floor stays dark. The crater itself is about 4.2 km deep.',
      changes: 'Solar panels make about 30% more power. Rover trips cost 60% more power and can get stuck without a rugged rover.',
    },
    ridge: {
      name: 'Connecting Ridge', short: 'Ridge', role: 'Balanced site',
      card: 'Lit about 92% of the time', light: 'Solar panels 2 m above the ground would be lit 92.27% of the time, and 95.65% at 10 m up. The longest darkness here usually lasts only 3–5 days.',
      pros: ['Good sunlight on a high ridge', 'Sits between Shackleton and de Gerlache, so both are reachable'],
      cons: ['Nearby mountains can still cast shadows', 'Narrow ridge, uneven ground'],
      nasa: 'The ridge between Shackleton and de Gerlache is a candidate for long sunlight and access to dark craters. Local slope still has to be checked.',
      changes: 'Normal solar power, medium rover costs, and a small bonus when searching for ice.',
    },
  },

  build: { title: 'Build your outpost', intro: 'You have <b>{budget} credits</b> (game money). You cannot afford the best of everything. Landing at <b>{site}</b>.', extras: 'Extras', left: 'Credits left', startNote: 'Starting meters are shown at the top.', over: 'Over budget', next: 'Next: place your outpost' },
  tiers: {
    hab: { name: 'Habitat', note: 'Where the crew lives. Better insulation means less heating power.', opts: [['Inflatable pod', 'Light and cheap. Loses heat fast.'], ['Hard module', 'Solid walls, decent insulation.'], ['Insulated dome', 'Thick walls. Keeps heat in and meteorites out.']] },
    pow: { name: 'Solar power', note: 'Panels turn sunlight into electricity. More panels, more power.', opts: [['Small array', 'A few panels.'], ['Medium array + battery', 'More panels and a battery.'], ['Large array + big battery', 'Lots of power, costs lots of credits.']] },
    life: { name: 'Life support', note: 'Air, water and food. Fancier systems waste less but use more electricity.', opts: [['Basic supplies', 'Stored air and water. Runs down fast.'], ['Air and water recycler', 'Cleans and reuses your water and air.'], ['Full recycling system', 'Reuses nearly everything. Uses the most power.']] },
    shelter: { name: 'Radiation shelter', note: 'A safe room for solar storms.', opts: [['Suits and walls only', 'No special room.'], ['Storm shelter room', 'A small room with thick walls.'], ['Soil-covered shelter', 'Buried under Moon soil, which blocks radiation.']] },
  },
  extras: {
    rover: ['Rugged rover', 'Big wheels and strong motors. Trips cost 30% less power and it will not get stuck.'],
    green: ['Greenhouse', 'Grows fresh food like NASA\'s Veggie system on the space station. Uses a little power each day, makes your supplies last longer.'],
  },
  daily: { title: 'Every day, roughly', panels: 'Solar panels at this site', heat: 'Heating', ls: 'Life-support machines', radio: 'Radio', green: 'Greenhouse', net: 'Power change', lifeUse: 'Crew uses Life Support', wear: 'Protection wears down', note: 'Before events and daily jobs.' },

  place: {
    title: 'Place your outpost', intro: 'Choose where the habitat and the solar panels go at <b>{site}</b>. Each spot holds one thing.', narrow: ' The ridge is narrow, so there are only 2 spots.',
    est: 'Spot bonuses are game numbers, made up to show the trade-offs.',
    powQ: 'Where do the solar panels go?', powHint: 'Pick a spot for the solar panels.', habQ: 'Where do the crew live?', habHint: 'Pick a spot for the habitat.',
    powUp: 'Lots of sun: the panels make {n} more Power a day.', powDown: 'Hills and crater walls shade the low Sun: the panels make {n} less Power a day.', powSame: 'Normal sunlight.',
    heatDown: 'Sheltered: heating uses {n} less Power a day.', heatUp: 'Exposed: heating uses {n} more Power a day.',
    ice: 'The rover starts close to the crater, so ice trips cost {n}% less Power.', none: 'No bonus here.',
    takenHab: 'The habitat is here. Tap to swap.', takenPow: 'The solar panels are here. Tap to swap.',
    back: 'Back to build', launch: 'Launch mission', first: 'Place both first',
    crater: 'Dark crater', mapLabel: 'Site map of {site}. {desc}.', spotIs: '{spot}: {what}', empty: 'empty', habitat: 'habitat', panels: 'solar panels',
  },
  spots: { high: 'High sunny ground', low: 'Low sheltered ground', edge: 'Near the crater edge' },
  spotsLc: { high: 'high sunny ground', low: 'low sheltered ground', edge: 'near the crater edge' },

  dash: {
    title: 'Day {n} briefing', hint: 'Tap parts of your outpost to inspect them.', inspectHint: 'Tap the habitat, panels, shelter, life support or rover.',
    forecast: 'Today\'s forecast', net: 'Power: sun minus machines', note: 'Before today\'s event.', start: 'Start Day {n}', goals: 'Mission objectives',
    powCrit: 'Power is critical. The air scrubbers will slow down and Life Support will fall fast.', powLow: 'Power is getting low. Below 15 the air scrubbers slow down.',
    lifeLow: 'Life Support is low. The crew needs air, water and food.', protLow: 'Crew Protection is low. The crew is exposed to radiation, dust and cold.',
  },
  goals: { crew: 'Keep all 4 crew healthy', crewN: '{n} of 4 healthy', crewLost: 'Crew lost', meters: 'Keep every meter above 0', sci: 'Collect 6 science points', sciN: '{n} / 6', ice: 'Investigate the possible water ice', done: 'Done', skipped: 'Skipped', day4: 'Day 4' },
  scene: { label: 'Your outpost on the Moon. Tap a building to inspect it.', shelter: 'Radiation shelter', life: 'Life support', hab: 'Habitat', pow: 'Solar panels', green: 'Greenhouse', rover: 'Rover' },
  obj: {
    hab: 'Habitat: {name}', habOn: ' Built on {spot}.', habText: ' Heating uses {heat} power a day. Meteorite damage factor {mm}.',
    pow: 'Solar power: {name}', powText: 'At {site}{spot} the panels make about {gen} power a day{boost}.{dust} Shadows and dust make less.', powOn: ', on {spot},', powBoost: ' (+10 for now from your moved panels)', powDust: ' Dust is cutting this by 20%.',
    life: 'Life support: {name}', lifeText: 'The crew uses about {drain} Life Support a day. The machines use {ls} power a day. Under 15 power the [[scrubber|scrubbers]] slow down.',
    shelter: 'Radiation shelter: {name}', shelterText: '{desc} Blocks about {pct}% of storm [[radiation|radiation]] in the game.{soil}', shelterSoil: ' Includes your extra Moon soil.',
    green: 'Greenhouse', greenText: 'Plants like NASA\'s Veggie system make fresh food. Uses 2 power a day, lowers Life Support use by 2, and you can tend it for +8 Life Support.',
    rugged: 'Rugged rover', basic: 'Basic rover', ruggedText: 'Big wheels. Cheaper trips and will not get stuck.', basicText: 'Small wheels. Can get stuck on steep or rough ground.', roverText: ' Rover trips use power and the crew picks up dust.',
  },

  event: { dayTeaches: 'Day {n} · {teaches}', rightAway: 'Right away:', whatDo: 'What do you do?', risk: '⚠ Risk: {n} in 10 chance of {fx}' },
  ev: {
    power: {
      title: 'A long shadow covers your solar panels', teaches: 'Power budgeting',
      story: 'Near the Moon\'s poles the Sun skims along the horizon, so mountains throw shadows that stretch up to 120 km. One of them has slid across your panels.',
      worse: 'Your crater-edge site makes this worse.', better: 'Your sunny rim site helps a little.',
      choices: [
        { t: 'Pause research and turn the heater down', d: 'Heaters and labs are the biggest users of power.', why: 'Heaters and labs use the most electricity, so switching them down saved power. But a cold habitat is hard on suits and equipment, so Crew Protection dropped.' },
        { t: 'Keep the research going', d: 'Science does not wait for the Sun.', why: 'You got good science, but with the panels in shadow the energy came straight out of your battery. Every extra activity needs power.' },
        { t: 'Crew goes outside to move the panels into sunlight', d: 'A spacewalk now for more power later.', why: 'The spacewalk cost power and exposed the crew to radiation and dust today. In return, the panels will make extra power for the next 2 days. A cost now for a gain later.' },
      ],
      fact: { title: 'Why are the shadows so long?', text: 'At the lunar poles the Sun never climbs higher than about 1.5° above the horizon. Mountains and crater rims can cast shadows over 100 km long, and the shadows move as the Moon turns.' },
    },
    rad: {
      title: 'Radiation warning: a solar storm is coming', teaches: 'Radiation protection',
      story: 'NASA\'s space weather team has spotted a [[flare|flare]] on the Sun. Particles from storms like this can reach the Moon quickly, and the Moon has no thick air or magnetic field to stop them. The crew is outside. You get about 30 minutes of warning.',
      choices: [
        { t: 'Everyone into the storm shelter now', d: 'Safe, but outdoor work stops.', why: 'Inside thick walls most radiation is blocked. You lost a little outdoor time and shelter systems used power, but the crew stayed safe.' },
        { t: 'Finish the outdoor mapping first', d: 'Risky. The crew takes the full dose.', risk: 'Bad luck! A burst of particles arrived early.', why: 'Mapping gave great data, but the crew was outside with no shelter and took the full radiation dose. Radiation exposure adds up, so astronauts avoid it.' },
        { t: 'Pile Moon soil on the shelter roof', d: 'Costs a lot of power. Helps all future storms.', why: 'Packed Moon soil is a good shield. About 0.75 m of it is suggested. Building during the storm cost power and some exposure. From now on, radiation hits are weaker.' },
      ],
      fact: { title: 'How much radiation is there on the Moon?', text: 'The Moon has no global magnetic field and almost no atmosphere. China\'s Chang\'e-4 lander measured about 1,369 µSv a day on the surface, around 200 times more than on Earth. Solar storm warnings give roughly 30 minutes to reach shelter, and walls of packed Moon soil about 0.75 m thick are suggested for shielding.' },
      sim: 'Storm strength comes from the real flare class. The exact damage numbers are game estimates, not measured doses at your outpost.',
    },
    dust: {
      title: 'Moon dust is everywhere', teaches: 'Equipment safety',
      story: 'After the last spacewalk, [[regolith|Moon dust]] is stuck to the suits, the airlock and your solar panels. It is sharp, it clings, and it can scratch seals and harm lungs and eyes.',
      choices: [
        { t: 'Clean and inspect the suits and panels', d: 'Slow, careful work.', why: 'Cleaning cost power and time, but sealed suits and clear panels keep the crew safe and the power coming.' },
        { t: 'Brush off the solar panels only', d: 'Quick fix for power.', why: 'Clear panels protect your power, but dusty suits still wear out their seals and track dust into the habitat.' },
        { t: 'Skip it and keep working', d: 'Dust will probably be fine. Probably.', risk: 'Dust clogged the panels and got into the airlock!', why: 'You kept the schedule, but dust is sharp and sticky. Left alone it can block panels and wear out equipment.' },
      ],
      fact: { title: 'Why is Moon dust a problem?', text: 'Lunar regolith contains sharp, abrasive particles. NASA explains that it can wear down spacesuits and equipment, stick to surfaces, get into habitats, and cause breathing and eye problems. On the Apollo missions, Moon dust wore away at spacesuit boots and damaged the vacuum seals on sample containers.' },
    },
    micro: {
      title: 'A micrometeorite hit the habitat', teaches: 'Habitat shielding',
      story: 'The Moon has no thick air to slow down tiny space rocks, so they hit the surface at huge speed. A fast speck has just punched a small hole in an outer panel.',
      choices: [
        { t: 'Repair it right now', d: 'Crew patches the hole.', why: 'Fixing the hole straight away cost power and crew time, but it made the habitat safe again.' },
        { t: 'Seal the module and inspect later', d: 'Close the door and save energy.', why: 'Sealing the room saved power, but some air escaped through the hole before the door shut.' },
        { t: 'It is tiny. Ignore it.', d: 'Hope nothing happens.', risk: 'The hole grew into a slow leak.', why: 'Small damage can grow. Space engineers inspect every hit because a tiny leak can slowly empty a habitat.' },
      ],
      fact: { title: 'Tiny rocks, big speed', text: 'The Moon is hit all the time by micrometeoroids. With no atmosphere to slow them down, they strike at full speed. Thicker habitat walls and shielding reduce the damage.' },
    },
    freeze: {
      title: 'Equipment freezing near the dark crater', teaches: 'Staying warm',
      real: 'Permanently shadowed craters near the pole can reach about <span dir="ltr">−203 °C</span>.',
      story: 'Your outpost sits next to a [[psr|permanently shadowed crater]]. Its cold is creeping into your equipment. The rover battery is sluggish, a water valve is stiff, and the suit seals are getting brittle.',
      choices: [
        { t: 'Run the heaters on full', d: 'Warm everything up. Uses lots of power.', why: 'The heaters kept the batteries, valves and seals working, so the crew stayed safe. But heating is one of the biggest power users, so Power dropped.' },
        { t: 'Wrap the equipment in insulating blankets', d: 'Saves power, but the crew must work outside in the cold.', why: 'Blankets trap heat without using electricity, so you saved power. But the crew had to go out near the freezing crater to fit them, which was hard on their suits.' },
        { t: 'Keep working and hope it warms up', d: 'No cost now. Risky.', risk: 'A frozen water line cracked and leaked!', why: 'You kept the science going, but extreme cold makes metal and plastic brittle and freezes water lines. Engineers plan for the cold because ignoring it is risky.' },
      ],
      fact: { title: 'How cold is a shadowed crater?', text: 'Craters near the Moon\'s poles that never see sunlight get extremely cold. NASA says some can reach about <span dir="ltr">−203 °C (−334 °F)</span>. Equipment that works there needs heaters and insulation.' },
      sim: 'The <span dir="ltr">−203 °C</span> is real. The Power, Protection and Life Support numbers are made up for the game.',
    },
    ice: {
      title: 'Possible water ice in a dark crater', teaches: 'Exploring for resources',
      story: 'Your sensors suggest a [[psr|permanently shadowed crater]] close by. It never sees the Sun, so it can be colder than <span dir="ltr">−200 °C</span>, cold enough to keep ice for billions of years. Ice could become drinking water, air and rocket fuel. But a dark crater does not always hold ice. Is it worth the trip?',
      choices: [
        { t: 'Send the rover to investigate', d: 'Costs power and time. You choose where to go.', why: '' },
        { t: 'Stay home and save energy', d: 'Nobody learns whether the ice is there.', why: 'Playing it safe saved power, but the ice question stays unanswered. Scientists have to take smart risks to find out what is really out there.' },
      ],
      fact: { title: 'Does shadow mean ice?', text: 'Permanently shadowed regions can stay cold enough to preserve ice, but not every shadowed place holds accessible water. In 2009, NASA\'s LCROSS mission crashed into Cabeus crater near the south pole on purpose, and the cloud it kicked up contained water. Scientists use measurements like this to find out where ice really is, which is why players should investigate rather than assume.' },
    },
    life: {
      title: 'Life support alarm: the air is getting stale', teaches: 'Survival planning',
      story: 'The [[scrubber|air scrubbers]] are struggling. Each astronaut breathes out about 1.08 kg of carbon dioxide a day and it has to be removed. Air quality is falling. You must keep the crew breathing.',
      lowPw: 'Only {pw} power left, so it works less well.',
      choices: [
        { t: 'Send all spare power to the air scrubbers', d: 'Best fix, but it uses lots of power.', why: 'Scrubbers need electricity. This restores the most air, but it only works as well as the power you still have. This is why power and life support are linked.' },
        { t: 'Switch off labs, rover and lights', d: 'Only keep the essentials running.', why: 'When things go wrong, astronauts turn off optional activities first. You lost some science but kept power for what matters most.' },
        { t: 'Use the emergency air-cleaning canisters', d: 'Old trick, tiring work.', why: 'On Apollo 13 the crew improvised with spare canisters to clean their air. It works with almost no power, but the crew is tired and stressed, so protection drops.' },
      ],
      fact: { title: 'How much do astronauts need?', text: 'Each astronaut uses about 0.89 kg of oxygen and drinks about 2.79 kg of water a day, and eats about 1.8 kg of food.    For 4 crew over 5 days that is roughly 18 kg of oxygen, 56 kg of water and 36 kg of food.' },
    },
  },
  rashid: {
    title: 'A rover from the UAE',
    text: 'The UAE\'s Mohammed Bin Rashid Space Centre (MBRSC) is one of the official space agency partners of NASA Space Apps 2026. MBRSC built the small Rashid rover, which was sent toward the Moon in December 2022 on a Japanese lander called HAKUTO-R. In April 2023 the lander crashed while trying to land, and Rashid was lost with it. Landing on the Moon is still very hard.',
  },
  outcome: { youChose: 'You chose', lucky: 'You got lucky. The risk did not happen this time, but it could have.', why: 'Why this happened', next: 'Next: choose today\'s job' },

  explore: {
    eyebrow: 'Exploration mission', title: 'Where should the rover go?',
    intro: 'Farther and darker means a better chance of ice, but the trip costs more {icon} Power. At {site} rover trips cost {cost} because of the ground.',
    costHigh: 'a lot', costMid: 'a medium amount', costNorm: 'a normal amount', rugged: ' Your rugged rover helps.', edge: ' Your habitat is near the crater edge, so the trip is shorter.',
    chance: 'Chance of ice', stuck: '⚠ {n} in 10 chance the rover gets stuck', cancel: 'Change my mind: stay home (+8 Power)',
    heading: 'Rover heading to {target}', driving: 'Driving across the [[regolith|Moon soil]]...',
    stuckT: 'The rover got stuck!', stuckLog: 'The rover got stuck on the rough ground and the crew had to rescue it. A rugged rover or an easier route would have helped.',
    stuckWhy: 'Steep, rocky ground can trap rovers. Mission planners check the slope map before sending a rover, which is why your landing-site choice matters. The crew spent power and time on a rescue and the trip gave no data.',
  },
  targets: {
    edge: { name: 'Shadowed edge near the base', lc: 'the shadowed edge near the base', d: 'Short trip. Ice, if any, is thin.' },
    mid: { name: 'Mid-crater slope', lc: 'the mid-crater slope', d: 'Medium trip on sloped ground.' },
    deep: { name: 'Deep crater floor', lc: 'the deep crater floor', d: 'Long trip into the coldest, darkest place.' },
  },
  scan: {
    title: 'Instrument scan at {target}', note: 'Taller bars mean a stronger hint of hydrogen, which can mean water ice.',
    strong: ['Strong signal!', 'The rover found a strong hint of water ice. Digging a sample could confirm it.'],
    weak: ['Weak signal.', 'There might be a little ice mixed into the soil. A sample could tell you more.'],
    none: ['No ice signal here.', 'This place is dark and cold but the scan found no ice. That is useful too: scientists learn where ice is not, and a shadow alone never guarantees ice.'],
    homeNone: 'Head home (+1 Science for the data)', dig: 'Dig a sample', digD: 'Takes more power. Confirms the ice.', digStrong: ' Then you choose how to use it.', home: 'Head home now', homeD: 'Keep the power. Bring back the scan.',
  },
  finish: {
    digWhy: 'The sample had traces of water. It is a clue, but not enough ice to use yet. Science often moves in small steps.',
    noneWhy: 'Finding no ice is still a real result. Scientists need to know where ice is not, so they can choose better places later.',
    homeWhy: 'You kept your power and brought home the scan. It is less certain than a sample, but still useful data.',
    dust: ' The crew also picked up Moon dust on the trip, which costs a little Crew Protection.',
    dig: 'Dig a sample', home: 'Head home', at: '{ch} at {target}', log: '{target}: {ch}',
  },
  iceUse: {
    title: 'It is real ice! How will you use it?',
    intro: 'Water ice is treasure on the Moon. Melted, it becomes drinking water. Split with electricity, water becomes oxygen to breathe and hydrogen. Hydrogen and oxygen together are also rocket fuel, so one day Moon ice could refuel rockets for the trip home or on to Mars.',
    est: 'The Life Support and Power amounts are game numbers.', confirmed: 'The sample confirmed ice! ', then: 'Dig a sample, then {use}',
    water: { t: 'Melt it into drinking water', lc: 'melt it into drinking water', d: 'Warm the ice and filter it. Simple and cheap.', why: 'You melted the ice into clean drinking water. It is the simplest way to use Moon ice and needs no extra power.' },
    oxy: { t: 'Split it into oxygen', lc: 'split it into oxygen', d: 'Electricity splits water into oxygen to breathe, plus hydrogen. Uses power.', why: 'You used electricity to split the water into oxygen for the crew to breathe. It helped Life Support more than water would, but it cost Power. The leftover hydrogen, together with oxygen, is rocket fuel.' },
  },
  plan: {
    eyebrow: 'Day {n} · daily job', title: 'What is the crew\'s job for the rest of the day?', intro: 'Pick one. Each one trades one meter for another.',
    opts: { sci: ['Science day', 'Run experiments and map the area.'], fix: ['Maintenance day', 'Inspect, clean and fix equipment.'], gh: ['Tend the greenhouse', 'Water and harvest the plants.'], save: ['Rest and save energy', 'Lights low, nothing risky. Systems go unchecked.'] },
  },
  night: {
    eyebrow: 'End of day {n}', title: 'Night report', intro: 'Today\'s job: <b>{job}</b>. Then the Moon\'s night routine ran by itself.',
    panels: 'Solar panels', panelsMoved: 'Solar panels (moved panels help)', machines: 'Heating, machines, radio', machinesGh: 'Heating, machines, radio, greenhouse',
    crew: 'Crew breathes, drinks, eats', crewSlow: 'Crew breathes, drinks, eats and the scrubbers slow', wear: 'Dust, cosmic rays and wear',
    note: 'Power is below 15, so the air scrubbers ran slowly: {n} extra Life Support.',
    zero: 'A meter hit 0! Badly hurt: {names}.', low: '{res} is in the danger zone. A crew member is hurt: {name}.', recover: 'The crew is rested and a crew member has recovered: {name}.',
    debrief: 'See mission debrief', next: 'Start day {n}',
  },
  emerg: {
    eyebrow: 'Before day {n} · power emergency', title: 'Power is down to {n}!',
    intro: 'Below 15 Power the [[scrubber|air scrubbers]] slow down and Life Support falls fast. Choose what to switch off. You can pick more than one.',
    switching: 'Switching off: {list}', nothing: 'Nothing switched off yet.', willBe: 'Power will be {n}.',
    goMany: 'Switch them off and start day {n}', goOne: 'Switch it off and start day {n}', goNone: 'Keep everything on and start day {n}',
    est: 'The Power you save and what each switch-off costs are game numbers.',
    logOff: 'Power emergency: switched off {list}', whyOff: 'When power runs low, astronauts switch off what they can live without first, so the air scrubbers keep running.',
    logNone: 'Power emergency: kept everything on', whyNone: 'Nothing was switched off, so Power stayed in the danger zone and the air scrubbers risked slowing down.',
  },
  off: {
    labs: { t: 'Switch off the labs', short: 'labs', d: 'Experiments pause for today.' },
    rover: { t: 'Put the rover to sleep', short: 'rover', d: 'No quick drives to check on things.' },
    green: { t: 'Switch off the greenhouse', short: 'greenhouse', d: 'The plants get cold and stop growing for a while.' },
    heat: { t: 'Turn the heating down', short: 'heating', d: 'A cold habitat is hard on the crew and equipment.' },
  },
  debrief: {
    eyebrow: 'Mission debrief · {site}',
    words: {
      success: ['Mission success!', 'The crew is safe and the outpost is running. You balanced power, air and protection and still got science done.'],
      partial: ['Partial success', 'The crew survived, but some goals were missed or the outpost is running low. Every real mission has trade-offs like this.'],
      failRun: ['Mission failed', 'A key system ran out and the outpost could not continue.'],
      failCrew: ['Mission failed', 'The crew could not be kept safe. Real mission planners study failures like this so they never happen in real life.'],
    },
    short: { success: 'success', partial: 'partial', fail: 'fail' },
    last: 'Last time: <b>{site}</b>, score {score} ({outcome}). This time: score {now}. {cmp}', better: 'Better!', worse: 'Try a different plan.', same: 'Same score.',
    safety: 'Crew safety', eff: 'Resource use', sci: 'Science', overall: 'Overall',
    final: 'Final levels', lifeN: 'Life {n}', powerN: 'Power {n}', protN: 'Protection {n}', crewN: 'Crew {n}/4',
    goals: 'Objectives', decisions: 'Your decisions', dayCh: 'Day {n}: {choice}', verdict: { helped: 'worked well', hurt: 'was costly', mixed: 'a trade-off' },
    best: 'Best call: <b>{c}</b>. ', hardest: 'Hardest lesson: <b>{c}</b>.', noSink: 'No single choice sank the mission.',
    science: 'Science you used', est: 'All meter numbers and costs are made up for the game, not NASA measurements.',
    again: 'Play again', againNote: 'Try another landing site or build. Events change every time.', againBtn: 'Try again, new site',
  },
  flare: {
    recorded: '[[flare|Solar flare]] recorded {date}', region: ' · active region {ar}', strength: 'Game storm strength',
    live: 'Strongest flare in the last 5 months', archive: ['Strongest flare of Solar Cycle 25 so far', 'Part of the May 2024 solar storm period'],
  },

  crewScienceTitle: "REAL SPACE SCIENCE",
crewScienceFact: "Spaceflight can affect the human body. NASA scientists study changes in astronauts during space missions to understand how to protect crew members on future long-duration journeys.",
crewScienceSource: "Source: NASA Open Science Data Repository (OSDR)",
};

'use strict';
/* ==========================================================================
   Arabic text for Outpost Odyssey.
   NEEDS NATIVE SPEAKER CHECK: this is a first draft written with AI help
   (Modern Standard Arabic for ages 7–12). Please have a native Arabic speaker
   review every string before release, especially the game title, crew roles,
   kid-friendly wording and science terms.
   Notes for the reviewer:
   - Digits are Western (0–9). Signed numbers like +8 are wrapped in <span dir="ltr">.
   - Temperatures are written in words ("203 درجات مئوية تحت الصفر") to avoid
     the minus sign flipping in right-to-left text.
   - Source link titles stay in English because the linked pages are in English.
   - Keys must match lang/en.js exactly.
   ========================================================================== */

LANG.ar = {
  dir: 'rtl',
  title: 'dune tech',
  langBtn: 'English', langBtnLang: 'en', langBtnLabel: 'التبديل إلى الإنجليزية',
  list: a => (a.length < 2 ? a.join('') : a.slice(0, -1).join('، ') + ' و' + a[a.length - 1]),

  ui: { brand: 'dune tech', credits: 'مصادر علوم ناسا', mainMenu: 'القائمة الرئيسية', close: 'إغلاق', tapClose: 'اضغط في أي مكان للإغلاق.', notEnoughPower: 'الطاقة لا تكفي', outOf: '{n} من {of}', comma: '، ' },
  res: { life: 'دعم الحياة', power: 'الطاقة', prot: 'حماية الطاقم', sci: 'العلوم' },
  live: { change: '{res}: {dir} {n}، والقيمة الآن {now}.', up: 'زيادة', down: 'نقص', danger: 'منطقة الخطر!' },
  tag: { real: 'بيانات حقيقية من ناسا', est: 'تقدير اللعبة', source: 'المصدر (بالإنجليزية):', srcNasa: 'علم حقيقي من ناسا', srcOther: 'علم حقيقي', live: 'مباشر من DONKI التابع لناسا', archived: 'سجل حقيقي من DONKI التابع لناسا · مؤرشف', simInstrument: 'جهاز افتراضي', simulated: 'محاكاة' },

  terms: {
    regolith: ['تربة القمر (الريغوليث)', 'الغبار والصخور المفتتة التي تغطي سطح القمر. حبيباتها حادة، تشبه قطعًا صغيرة جدًا من الزجاج.'],
    radiation: ['الإشعاع', 'طاقة غير مرئية وجسيمات صغيرة سريعة جدًا تأتي من الشمس ومن الفضاء البعيد. الكثير منها يضر الجسم. الجدران السميكة والتربة تحجبها.'],
    flare: ['التوهج الشمسي', 'انفجار مفاجئ من الضوء والطاقة على الشمس. التوهجات الكبيرة قد تقذف جسيمات تصل إلى القمر في أقل من ساعة.'],
    psr: ['منطقة مظللة دائمًا', 'قاع فوهة لا يصله ضوء الشمس المباشر أبدًا. تقول ناسا إن حرارة بعض هذه المناطق القطبية تصل إلى نحو 203 درجات مئوية تحت الصفر.'],
    slope: ['الانحدار', 'مدى ميل الأرض، ويُقاس بالدرجات. من 0 إلى 5 درجات تكون الأرض شبه مستوية. فوق 15 درجة يصعب سير المركبات، وفوق 30 درجة يكون الانحدار شديدًا جدًا.'],
    elevation: ['الارتفاع', 'مدى علوّ الأرض أو انخفاضها بالأمتار مقارنةً بما حولها.'],
    scrubber: ['منقّي الهواء', 'جهاز يزيل غاز ثاني أكسيد الكربون (CO₂) الذي نُخرجه مع الزفير. من دونه يصبح الهواء خانقًا وغير آمن.'],
    lola: ['LOLA', 'مقياس الارتفاع الليزري المداري للقمر: جهاز ليزر على مركبة فضائية تابعة لناسا يقيس ارتفاعات سطح القمر بحساب زمن ومضات الليزر.'],
    donki: ['DONKI', 'قاعدة بيانات ناسا للطقس الفضائي، وفيها سجلات حقيقية للتوهجات والعواصف الشمسية.'],
    rim: ['حافة الفوهة', 'الطرف المرتفع المحيط بالفوهة. بعض قمم الحواف قرب القطب يصلها ضوء الشمس طوال السنة تقريبًا.'],
  },

  crew: {
    hessa: { name: 'حصة', role: 'القائدة', from: 'الإمارات' },
    maya: { name: 'مايا', role: 'المهندسة', from: 'الولايات المتحدة' },
    kenji: { name: 'كينجي', role: 'العالِم', from: 'اليابان' },
    sam: { name: 'سام', role: 'الطبيب', from: 'كندا' },
  },
  hud: { region: 'حالة المهمة', crewHealth: 'صحة الطاقم', missionDay: 'يوم المهمة', day: 'اليوم {n} من 5', healthy: 'بصحة جيدة', hurt: 'تحت العلاج', mate: '{name}، {role} من {from}: {state}', dangerZone: 'منطقة الخطر', danger: 'خطر', low: 'منخفض', ok: 'جيد' },

  menu: {
    eyebrow: 'مدرّب مهمات مستوحى من ناسا · للأعمار 7–12', h1a: 'مغامرة', h1b: 'المحطة القمرية',
    sub: 'ابنِ قاعدة قرب القطب الجنوبي للقمر. حافظ على سلامة طاقمك. لكل قرار ثمن.',
    start: 'ابدأ المهمة', how: 'طريقة اللعب',
    note: 'لا تنزيل ولا حساب. علوم حقيقية من ناسا: خرائط القمر من LOLA، والتوهجات الشمسية من DONKI، وحقائق من أبحاث ناسا عن القمر. أرقام اللعبة مبسّطة.',
  },
  how: {
    title: 'طريقة اللعب', ok: 'فهمت',
    items: ['تدير محطة على القمر لمدة <b>5 أيام</b>.', 'حافظ على ارتفاع ثلاثة مؤشرات: <b>دعم الحياة</b> (الهواء والماء والطعام)، و<b>الطاقة</b>، و<b>حماية الطاقم</b>.', 'كل يوم تظهر مشكلة جديدة. لكل اختيار ثمن، ويظهر لك قبل أن تختار.', 'بعدها اختر مهمة اليوم: أجرِ تجارب علمية، أو أصلح المعدات، أو استرح ووفّر الطاقة.', 'قلة الطاقة تُبطئ منقّيات الهواء. كل شيء مترابط.', 'في النهاية تحصل على تقرير المهمة. العب مجددًا وجرّب خطة مختلفة!'],
  },
  credits: {
    intro: '{tag} في هذه اللعبة:',
    items: [
      '<b>خرائط القمر:</b> خرائط الارتفاع والانحدار من مقياس الارتفاع الليزري <b>LOLA</b> على مركبة ناسا المدارية لاستطلاع القمر، من {atlas}. تظهر في شاشة اختيار موقع الهبوط.',
      '<b>التوهجات الشمسية:</b> حدث الإشعاع يستخدم فئة توهج حقيقي وتاريخه من {donki}. تُحمَّل البيانات مباشرة عندما يستطيع المتصفح الوصول إلى ناسا، وإلا يظهر سجل مؤرشف مع توضيح ذلك.',
      '<b>ضوء الشمس والظلال:</b> نتائج ناسا عن زاوية الشمس المنخفضة والظلال الطويلة وحافة فوهة شاكلتون المضاءة.',
      '<b>الجليد المائي:</b> أبحاث ناسا عن المناطق المظللة دائمًا.',
      '<b>أرقام دعم الحياة:</b> حاجة كل رائد فضاء اليومية من الأكسجين والماء والطعام، من أبحاث ناسا عن أنظمة الطاقم. ونظام Veggie لزراعة النباتات ألهمنا فكرة البيت الزجاجي.',
      'طبقات إضافية للتضاريس والإضاءة: {trek}.',
    ],
    sim: '{tag} في هذه اللعبة: كل قيم المؤشرات من 0 إلى 100، والتكاليف، والعملات، والضرر الناتج عن كل حدث. هذه تقديرات للعبة، وليست قياسات من ناسا.',
  },

  train: {
    s0: { title: 'تدريب رواد الفضاء', p1: 'ستهبط أنت و3 من زملائك قرب القطب الجنوبي للقمر. عليك أن تبني محطة صغيرة وتبقيها تعمل لمدة خمسة أيام. في التدريب ستتعلم الأمور الثلاثة التي يجب أن تراقبها.', p2: 'هنا تكون الشمس منخفضة دائمًا، والفوهات مظلمة وشديدة البرودة، ولا يوجد هواء، والمساعدة بعيدة جدًا. مخططو ناسا الحقيقيون يتخذون قرارات مثل قراراتك عندما يخططون لمهمات أرتميس.', btn: 'تعرّف على المؤشرات' },
    s1: {
      title: 'مؤشراتك الثلاثة', intro: 'اضغط على كل مؤشر لتعرف ما الذي يستهلكه. كل مؤشر من 0 إلى 100. ما دون 20 هو منطقة الخطر.', tapAbove: 'اضغط على أحد المؤشرات في الأعلى.', next: 'التالي: قرار للتدريب',
      sub: { life: 'الهواء والماء والطعام', power: 'الكهرباء', prot: 'البدلات والجدران وقواعد السلامة' },
      info: {
        life: 'يُستهلك كل يوم لأن الطاقم يتنفس ويشرب ويأكل. أجهزة إعادة التدوير المتطورة تهدر أقل لكنها تستهلك طاقة أكثر. إذا انخفضت الطاقة كثيرًا تتباطأ منقّيات الهواء وينخفض هذا المؤشر بسرعة.',
        power: 'تنتجها الألواح الشمسية، وتستهلكها التدفئة وأجهزة دعم الحياة والراديو والتجارب العلمية والمركبة الجوالة. الظلال والغبار تقلل الطاقة المنتجة. كل ما تفعله تقريبًا يستهلكها.',
        prot: 'مدى حماية الطاقم من الإشعاع والغبار والبرد والنيازك. الجدران السميكة والملاجئ والبدلات المعتنى بها والإصلاحات ترفعه. العمل الخطِر في الخارج يخفضه.',
      },
    },
    s2: { title: 'قرار للتدريب', intro: 'المسكن بارد. ماذا ستفعل؟ راقب المؤشرات في الأعلى.', up: ['ارفع حرارة المدفأة', 'الطاقم مرتاح.'], down: ['اخفض حرارة المدفأة', 'وفّر الكهرباء.'], resTitle: 'لا يوجد قرار مجاني.', resUp: 'المسكن الدافئ يحمي الطاقم، لكن المدفأة استهلكت الطاقة.', resDown: 'وفّرت الطاقة، لكن المسكن البارد متعب للناس والمعدات.', resEnd: 'هذه هي اللعبة كلها: لا يمكنك أن تحصل على كل شيء.', next: 'التالي' },
    s3: { title: 'كلمات مهمة', hint: 'أثناء اللعب، اضغط على الكلمات التي تحتها خط لتعرف معناها.', done: 'انتهى التدريب. اختر موقع الهبوط' },
  },

  site: {
    title: 'اختر موقع الهبوط',
    intro: 'اختارت ناسا 13 منطقة قرب القطب الجنوبي كمواقع هبوط محتملة، بناءً على [[slope|الانحدار]] و[[elevation|الارتفاع]] والإضاءة والاتصال اللاسلكي مع الأرض. ادرس الخريطة واختر واحدًا من ثلاثة مواقع.',
    layer: 'طبقة الخريطة', elev: 'خريطة الارتفاع', slope: 'خريطة الانحدار', full: 'عرض بالحجم الكامل',
    altElev: 'خريطة ملوّنة لارتفاعات منطقة القطب الجنوبي للقمر، من خط العرض 80 جنوبًا حتى القطب، مع أسماء الفوهات',
    altSlope: 'خريطة ملوّنة لانحدار السلسلة الجبلية قرب القطب الجنوبي للقمر، تظهر فيها فوهتا دي جيرلاش وشاكلتون',
    keyElev: 'اقرأ الألوان باستخدام المفتاح المطبوع على الخريطة (بالإنجليزية): الأصفر والبرتقالي أرض مرتفعة، والأخضر في المنتصف، والأزرق أرض منخفضة، والوردي والبنفسجي أعمق الفوهات. عمق فوهة شاكلتون نحو 4.2 كم.',
    keySlope: 'اقرأ المفتاح المطبوع على الخريطة (بالإنجليزية). الرمادي شبه مستوٍ (من 0 إلى 5 درجات). السماوي والبنفسجي من 10 إلى 20 درجة. الأصفر من 25 إلى 30 درجة، والأحمر أشد انحدارًا من 30 درجة، مثل جدران فوهة شاكلتون. الخريطتان مكبّرتان بشكل مختلف، فاستخدم أسماء الفوهات للمقارنة بينهما.',
    mapNote: 'الدبابيس تُظهر مواقع تقريبية. خرائط الارتفاع والانحدار من جهاز الليزر [[lola|LOLA]] عبر {atlas}.',
    sun: 'ضوء الشمس', rough: 'وعورة الأرض', iceNear: 'قرب الجليد',
    dots: 'التقييم بالنقاط من تقديرات اللعبة. مصادر أرقام ضوء الشمس موجودة في مربع «ماذا تقول ناسا» لكل موقع.',
    good: 'الإيجابيات:', risky: 'المخاطر:', nasaSays: 'ماذا تقول ناسا', sunlight: 'ضوء الشمس:',
    land: 'اهبط هنا وابدأ البناء', hint: 'اضغط على دبوس في الخريطة أو على بطاقة لمقارنة المواقع.',
    bigTitle: '{map} · بالحجم الكامل', bigNote: 'مرّر للاستكشاف. المصدر: بيانات LOLA، أطلس القطب الجنوبي للقمر من معهد LPI.', bigAlt: 'الخريطة بالحجم الكامل',
  },
  sites: {
    gerlache: {
      name: 'حافة فوهة دي جيرلاش', short: 'دي جيرلاش', role: 'موقع للاستكشاف', pending: 'ما زال فريقنا يتحقق من رقم ضوء الشمس',
      pros: ['الفوهات المظللة التي قد تحتوي على جليد قريبة، لذلك رحلات البحث عن الجليد أقل تكلفة', 'ممتاز للعلوم'],
      cons: ['جدران الفوهة تحجب الشمس، لذلك الطاقة الشمسية أضعف', 'الظلال الطويلة تخفي الصخور والمنحدرات'],
      nasa: 'قد تحتوي الفوهات المظللة دائمًا القريبة على ماء متجمد، لكن علماء ناسا يؤكدون أن الظل وحده لا يضمن وجود الجليد.',
      changes: 'تنتج الألواح الشمسية طاقة أقل بنحو 30%. رحلات الجليد أقصر وفرصة العثور على الجليد أكبر. أحداث الظل أشد تأثيرًا.',
    },
    shackleton: {
      name: 'حافة فوهة شاكلتون', short: 'شاكلتون', role: 'موقع للطاقة',
      card: 'الحافة مضاءة أكثر من 90% من السنة', light: 'ثلاث نقاط على حافة فوهة شاكلتون تبقى مضاءة معًا أكثر من 90% من السنة.',
      pros: ['قمم الحافة يصلها ضوء الشمس طوال السنة تقريبًا، لذلك تعمل الألواح الشمسية هنا بأفضل شكل', 'أحداث الظل خفيفة'],
      cons: ['الأرض شديدة الانحدار والوعورة', 'قاع الفوهة المظلم بعيد جدًا في الأسفل، وقد تعلق المركبة الجوالة.'],
      nasa: 'تمرّ الشمس هنا قريبة من الأفق طوال السنة، فتبقى قمم الحافة العالية مضاءة بينما يبقى قاع الفوهة مظلمًا. عمق الفوهة نفسها نحو 4.2 كم.',
      changes: 'تنتج الألواح الشمسية طاقة أكثر بنحو 30%. رحلات المركبة الجوالة تكلف طاقة أكثر بنسبة 60%، وقد تعلق المركبة إن لم تكن متينة.',
    },
    ridge: {
      name: 'السلسلة الواصلة', short: 'السلسلة', role: 'موقع متوازن',
      card: 'مضاءة نحو 92% من الوقت', light: 'الألواح الشمسية على ارتفاع 2 م فوق الأرض تكون مضاءة 92.27% من الوقت، و95.65% على ارتفاع 10 م. أطول فترة ظلام هنا تستمر عادةً من 3 إلى 5 أيام فقط.',
      pros: ['ضوء شمس جيد على سلسلة مرتفعة', 'تقع بين شاكلتون ودي جيرلاش، لذلك يمكن الوصول إلى كلتيهما'],
      cons: ['الجبال القريبة قد تلقي ظلالها', 'سلسلة ضيقة وأرض غير مستوية'],
      nasa: 'السلسلة بين شاكلتون ودي جيرلاش مرشّحة لأن تحظى بضوء شمس طويل وبوصول سهل إلى الفوهات المظلمة، لكن ما زال يجب فحص الانحدار في الموقع نفسه.',
      changes: 'طاقة شمسية عادية، وتكلفة متوسطة لرحلات المركبة الجوالة، ومكافأة صغيرة عند البحث عن الجليد.',
    },
  },

  build: { title: 'ابنِ محطتك', intro: 'لديك <b>{budget} عملة</b> (نقود اللعبة). لا يمكنك شراء الأفضل في كل شيء. موقع الهبوط: <b>{site}</b>.', extras: 'إضافات', left: 'العملات المتبقية', startNote: 'المؤشرات في الأعلى تُظهر قيم البداية.', over: 'تجاوزت الميزانية', next: 'التالي: ضع مباني محطتك' },
  tiers: {
    hab: { name: 'المسكن', note: 'المكان الذي يعيش فيه الطاقم. العزل الأفضل يعني طاقة تدفئة أقل.', opts: [['وحدة قابلة للنفخ', 'خفيفة ورخيصة. تفقد الحرارة بسرعة.'], ['وحدة صلبة', 'جدران متينة وعزل جيد.'], ['قبة معزولة', 'جدران سميكة. تحفظ الحرارة في الداخل وتصدّ النيازك.']] },
    pow: { name: 'الطاقة الشمسية', note: 'الألواح تحوّل ضوء الشمس إلى كهرباء. ألواح أكثر تعني طاقة أكثر.', opts: [['مجموعة صغيرة', 'بضعة ألواح.'], ['مجموعة متوسطة + بطارية', 'ألواح أكثر وبطارية.'], ['مجموعة كبيرة + بطارية كبيرة', 'طاقة كثيرة، لكنها تكلف عملات كثيرة.']] },
    life: { name: 'دعم الحياة', note: 'الهواء والماء والطعام. الأنظمة المتطورة تهدر أقل لكنها تستهلك كهرباء أكثر.', opts: [['مؤن أساسية', 'هواء وماء مخزّنان. ينفدان بسرعة.'], ['جهاز لإعادة تدوير الهواء والماء', 'ينظّف الماء والهواء ويعيد استخدامهما.'], ['نظام إعادة تدوير كامل', 'يعيد استخدام كل شيء تقريبًا. يستهلك أكثر طاقة.']] },
    shelter: { name: 'ملجأ الإشعاع', note: 'غرفة آمنة للاحتماء من العواصف الشمسية.', opts: [['البدلات والجدران فقط', 'لا توجد غرفة خاصة.'], ['غرفة ملجأ للعواصف', 'غرفة صغيرة بجدران سميكة.'], ['ملجأ مغطى بالتربة', 'مدفون تحت تربة القمر التي تحجب الإشعاع.']] },
  },
  extras: {
    rover: ['مركبة جوالة متينة', 'عجلات كبيرة ومحركات قوية. رحلاتها تكلف طاقة أقل بنسبة 30% ولن تعلق.'],
    green: ['بيت زجاجي', 'يزرع طعامًا طازجًا مثل نظام Veggie التابع لناسا في محطة الفضاء الدولية. يستهلك قليلًا من الطاقة كل يوم، ويجعل مؤنك تدوم أطول.'],
  },
  daily: { title: 'كل يوم تقريبًا', panels: 'الألواح الشمسية في هذا الموقع', heat: 'التدفئة', ls: 'أجهزة دعم الحياة', radio: 'الراديو', green: 'البيت الزجاجي', net: 'تغيّر الطاقة', lifeUse: 'الطاقم يستهلك دعم الحياة', wear: 'الحماية تتآكل', note: 'قبل الأحداث ومهام اليوم.' },

  place: {
    title: 'ضع مباني محطتك', intro: 'اختر مكان المسكن ومكان الألواح الشمسية في <b>{site}</b>. كل مكان يتسع لشيء واحد فقط.', narrow: ' السلسلة ضيقة، لذلك يوجد مكانان فقط.',
    est: 'مكافآت الأماكن أرقام من اللعبة، وُضعت لتوضيح الموازنة بين الخيارات.',
    powQ: 'أين تضع الألواح الشمسية؟', powHint: 'اختر مكانًا للألواح الشمسية.', habQ: 'أين يعيش الطاقم؟', habHint: 'اختر مكانًا للمسكن.',
    powUp: 'شمس كثيرة: تزيد طاقة الألواح بمقدار {n} كل يوم.', powDown: 'التلال وجدران الفوهة تحجب الشمس المنخفضة: تقل طاقة الألواح بمقدار {n} كل يوم.', powSame: 'ضوء شمس عادي.',
    heatDown: 'مكان محمي: تقل طاقة التدفئة بمقدار {n} كل يوم.', heatUp: 'مكان مكشوف: تزيد طاقة التدفئة بمقدار {n} كل يوم.',
    ice: 'تنطلق المركبة الجوالة قريبًا من الفوهة، لذلك تكلف رحلات الجليد طاقة أقل بنسبة {n}%.', none: 'لا توجد مكافأة هنا.',
    takenHab: 'المسكن هنا. اضغط للتبديل.', takenPow: 'الألواح الشمسية هنا. اضغط للتبديل.',
    back: 'العودة إلى البناء', launch: 'أطلق المهمة', first: 'ضع الاثنين أولًا',
    crater: 'فوهة مظلمة', mapLabel: 'خريطة موقع {site}. {desc}.', spotIs: '{spot}: {what}', empty: 'فارغ', habitat: 'المسكن', panels: 'الألواح الشمسية',
  },
  spots: { high: 'أرض مرتفعة مشمسة', low: 'أرض منخفضة محمية', edge: 'قرب حافة الفوهة' },
  spotsLc: { high: 'أرض مرتفعة مشمسة', low: 'أرض منخفضة محمية', edge: 'قرب حافة الفوهة' },

  dash: {
    title: 'إحاطة اليوم {n}', hint: 'اضغط على أجزاء محطتك لفحصها.', inspectHint: 'اضغط على المسكن أو الألواح أو الملجأ أو أجهزة دعم الحياة أو المركبة الجوالة.',
    forecast: 'توقعات اليوم', net: 'الطاقة: الشمس ناقص الأجهزة', note: 'قبل حدث اليوم.', start: 'ابدأ اليوم {n}', goals: 'أهداف المهمة',
    powCrit: 'الطاقة في وضع حرج. ستتباطأ منقّيات الهواء وسينخفض دعم الحياة بسرعة.', powLow: 'الطاقة تنخفض. تحت 15 تتباطأ منقّيات الهواء.',
    lifeLow: 'دعم الحياة منخفض. الطاقم يحتاج إلى الهواء والماء والطعام.', protLow: 'حماية الطاقم منخفضة. الطاقم معرّض للإشعاع والغبار والبرد.',
  },
  goals: { crew: 'حافظ على صحة أفراد الطاقم الأربعة', crewN: '{n} من 4 بصحة جيدة', crewLost: 'لم يبقَ أحد بصحة جيدة', meters: 'أبقِ كل المؤشرات فوق 0', sci: 'اجمع 6 نقاط علوم', sciN: '{n} من 6', ice: 'تحقّق من الجليد المائي المحتمل', done: 'تم', skipped: 'تم التخطي', day4: 'اليوم 4' },
  scene: { label: 'محطتك على القمر. اضغط على أحد المباني لفحصه.', shelter: 'ملجأ الإشعاع', life: 'دعم الحياة', hab: 'المسكن', pow: 'الألواح الشمسية', green: 'البيت الزجاجي', rover: 'المركبة الجوالة' },
  obj: {
    hab: 'المسكن: {name}', habOn: ' مبني في: {spot}.', habText: ' تستهلك التدفئة {heat} من الطاقة كل يوم. معامل الضرر من النيازك {mm}.',
    pow: 'الطاقة الشمسية: {name}', powText: 'في {site}{spot} تنتج الألواح نحو {gen} من الطاقة كل يوم{boost}.{dust} الظلال والغبار تقلل الإنتاج.', powOn: ' (في: {spot})', powBoost: ' (<span dir="ltr">+10</span> مؤقتًا بفضل الألواح التي نقلتها)', powDust: ' الغبار يقلل ذلك بنسبة 20%.',
    life: 'دعم الحياة: {name}', lifeText: 'يستهلك الطاقم نحو {drain} من دعم الحياة كل يوم، وتستهلك الأجهزة {ls} من الطاقة كل يوم. إذا قلّت الطاقة عن 15 تتباطأ [[scrubber|منقّيات الهواء]].',
    shelter: 'ملجأ الإشعاع: {name}', shelterText: '{desc} يحجب نحو {pct}% من [[radiation|إشعاع]] العواصف في اللعبة.{soil}', shelterSoil: ' يشمل ذلك تربة القمر الإضافية التي وضعتها.',
    green: 'البيت الزجاجي', greenText: 'نباتات مثل نظام Veggie التابع لناسا تنتج طعامًا طازجًا. يستهلك 2 من الطاقة كل يوم، ويقلل استهلاك دعم الحياة بمقدار 2، ويمكنك العناية به لتحصل على <span dir="ltr">+8</span> من دعم الحياة.',
    rugged: 'مركبة جوالة متينة', basic: 'مركبة جوالة عادية', ruggedText: 'عجلات كبيرة. رحلات أرخص ولن تعلق.', basicText: 'عجلات صغيرة. قد تعلق في الأرض المنحدرة أو الوعرة.', roverText: ' رحلات المركبة تستهلك الطاقة، ويلتصق الغبار بالطاقم.',
  },

  event: { dayTeaches: 'اليوم {n} · {teaches}', rightAway: 'فورًا:', whatDo: 'ماذا ستفعل؟', risk: '⚠ خطر: احتمال {n} من 10 أن يحدث: {fx}' },
  ev: {
    power: {
      title: 'ظل طويل يغطي ألواحك الشمسية', teaches: 'إدارة الطاقة',
      story: 'قرب قطبي القمر تمرّ الشمس قريبة من الأفق، فتلقي الجبال ظلالًا يصل طولها إلى 120 كم. أحد هذه الظلال انزلق فوق ألواحك.',
      worse: 'موقعك عند حافة الفوهة يجعل الأمر أسوأ.', better: 'موقعك المشمس على الحافة يساعد قليلًا.',
      choices: [
        { t: 'أوقف الأبحاث واخفض حرارة المدفأة', d: 'المدافئ والمختبرات أكثر ما يستهلك الطاقة.', why: 'المدافئ والمختبرات تستهلك أكثر الكهرباء، فإطفاؤها وفّر الطاقة. لكن المسكن البارد متعب للبدلات والمعدات، فانخفضت حماية الطاقم.' },
        { t: 'استمر في الأبحاث', d: 'العلم لا ينتظر الشمس.', why: 'حصلت على نتائج علمية جيدة، لكن الألواح كانت في الظل فجاءت الطاقة مباشرة من بطاريتك. كل نشاط إضافي يحتاج إلى طاقة.' },
        { t: 'يخرج الطاقم لنقل الألواح إلى ضوء الشمس', d: 'سير في الفضاء الآن مقابل طاقة أكثر لاحقًا.', why: 'السير في الفضاء كلّف طاقة وعرّض الطاقم اليوم للإشعاع والغبار. في المقابل ستنتج الألواح طاقة إضافية في اليومين القادمين. ثمن الآن مقابل فائدة لاحقًا.' },
      ],
      fact: { title: 'لماذا الظلال طويلة جدًا؟', text: 'عند قطبي القمر لا ترتفع الشمس أكثر من نحو 1.5 درجة فوق الأفق، لذلك تلقي الجبال وحواف الفوهات ظلالًا يزيد طولها على 100 كم، وتتحرك هذه الظلال مع دوران القمر.' },
    },
    rad: {
      title: 'تحذير من الإشعاع: عاصفة شمسية قادمة', teaches: 'الحماية من الإشعاع',
      story: 'رصد فريق الطقس الفضائي في ناسا [[flare|توهجًا]] على الشمس. الجسيمات القادمة من عواصف كهذه قد تصل إلى القمر بسرعة، وليس للقمر غلاف جوي سميك أو مجال مغناطيسي يوقفها. الطاقم في الخارج، ولديك نحو 30 دقيقة من التحذير المسبق.',
      choices: [
        { t: 'الجميع إلى ملجأ العواصف الآن', d: 'آمن، لكن العمل في الخارج يتوقف.', why: 'الجدران السميكة تحجب معظم الإشعاع. خسرت قليلًا من وقت العمل في الخارج واستهلكت أنظمة الملجأ بعض الطاقة، لكن الطاقم بقي آمنًا.' },
        { t: 'أكمل رسم الخرائط في الخارج أولًا', d: 'خطر. سيتلقى الطاقم الجرعة كاملة.', risk: 'حظ سيئ! وصلت دفعة من الجسيمات مبكرًا.', why: 'رسم الخرائط أعطى بيانات رائعة، لكن الطاقم كان في الخارج بلا ملجأ وتلقى جرعة الإشعاع كاملة. التعرض للإشعاع يتراكم، لذلك يتجنبه رواد الفضاء.' },
        { t: 'كدّس تربة القمر فوق سقف الملجأ', d: 'يكلّف طاقة كثيرة، لكنه يفيد في كل العواصف القادمة.', why: 'تربة القمر المضغوطة درع جيد، ويُقترح أن يكون سمكها نحو 0.75 م. البناء أثناء العاصفة كلّف طاقة وبعض التعرض للإشعاع. من الآن ستكون ضربات الإشعاع أضعف.' },
      ],
      fact: { title: 'كم يوجد من الإشعاع على القمر؟', text: 'ليس للقمر مجال مغناطيسي عام، ولا يكاد يكون له غلاف جوي. قاست مركبة الهبوط الصينية تشانغ إي-4 نحو 1,369 ميكروسيفرت يوميًا على السطح، أي نحو 200 ضعف ما على الأرض. تحذيرات العواصف الشمسية تعطي نحو 30 دقيقة للوصول إلى الملجأ، ويُقترح بناء جدران من تربة القمر المضغوطة بسمك نحو 0.75 م للحماية.' },
      sim: 'قوة العاصفة مأخوذة من فئة التوهج الحقيقية. أما أرقام الضرر بالتحديد فهي تقديرات للعبة، وليست جرعات مقيسة في محطتك.',
    },
    dust: {
      title: 'غبار القمر في كل مكان', teaches: 'سلامة المعدات',
      story: 'بعد آخر سير في الفضاء، التصق [[regolith|غبار القمر]] بالبدلات وغرفة معادلة الضغط والألواح الشمسية. إنه حاد ولاصق، وقد يخدش موانع التسرّب ويؤذي الرئتين والعينين.',
      choices: [
        { t: 'نظّف وافحص البدلات والألواح', d: 'عمل بطيء ودقيق.', why: 'التنظيف كلّف طاقة ووقتًا، لكن البدلات المحكمة والألواح النظيفة تحافظ على سلامة الطاقم وعلى تدفق الطاقة.' },
        { t: 'امسح الألواح الشمسية فقط', d: 'حل سريع للحفاظ على الطاقة.', why: 'الألواح النظيفة تحمي طاقتك، لكن البدلات المغبرة ما زالت تُتلف موانع التسرّب وتنقل الغبار إلى داخل المسكن.' },
        { t: 'تجاهل الأمر واستمر في العمل', d: 'على الأغلب لن يضر الغبار. على الأغلب.', risk: 'سدّ الغبار الألواح ودخل إلى غرفة معادلة الضغط!', why: 'حافظت على الجدول، لكن الغبار حاد ولاصق. إذا تُرك فقد يحجب الألواح ويُتلف المعدات.' },
      ],
      fact: { title: 'لماذا غبار القمر مشكلة؟', text: 'تحتوي تربة القمر على جسيمات حادة وخشنة. توضح ناسا أنها قد تُتلف البدلات الفضائية والمعدات، وتلتصق بالأسطح، وتدخل إلى المساكن، وتسبب مشكلات في التنفس والعينين. في مهمات أبولو، أكل غبار القمر من أحذية البدلات الفضائية وأتلف موانع التسرّب في حاويات العينات.' },
    },
    micro: {
      title: 'نيزك دقيق أصاب المسكن', teaches: 'تدريع المسكن',
      story: 'ليس للقمر هواء سميك يبطئ الصخور الفضائية الصغيرة، لذلك تضرب السطح بسرعة هائلة. حبة صغيرة سريعة ثقبت للتو ثقبًا صغيرًا في أحد الألواح الخارجية.',
      choices: [
        { t: 'أصلحه الآن', d: 'الطاقم يرقع الثقب.', why: 'إصلاح الثقب فورًا كلّف طاقة ووقتًا من الطاقم، لكنه أعاد الأمان إلى المسكن.' },
        { t: 'أغلق الوحدة وافحصها لاحقًا', d: 'أغلق الباب ووفّر الطاقة.', why: 'إغلاق الغرفة وفّر الطاقة، لكن بعض الهواء تسرّب من الثقب قبل أن يُغلق الباب.' },
        { t: 'إنه صغير جدًا. تجاهله.', d: 'تمنَّ ألا يحدث شيء.', risk: 'كبر الثقب وأصبح تسربًا بطيئًا.', why: 'الضرر الصغير قد يكبر. مهندسو الفضاء يفحصون كل إصابة لأن التسرب الصغير قد يفرغ المسكن من الهواء ببطء.' },
      ],
      fact: { title: 'صخور صغيرة وسرعة كبيرة', text: 'يتعرض القمر طوال الوقت لضربات النيازك الدقيقة. ولأنه لا يوجد غلاف جوي يبطئها، فإنها تضرب بكامل سرعتها. الجدران الأسمك والدروع تقلل الضرر.' },
    },
    freeze: {
      title: 'المعدات تتجمد قرب الفوهة المظلمة', teaches: 'البقاء دافئًا',
      real: 'قد تصل حرارة الفوهات المظللة دائمًا قرب القطب إلى نحو 203 درجات مئوية تحت الصفر.',
      story: 'تقع محطتك بجوار [[psr|فوهة مظللة دائمًا]]. بردها يتسلل إلى معداتك: بطارية المركبة الجوالة بطيئة، وأحد صمامات الماء متصلّب، وموانع تسرّب البدلات أصبحت هشّة.',
      choices: [
        { t: 'شغّل المدافئ بأقصى قوة', d: 'دفّئ كل شيء. يستهلك طاقة كثيرة.', why: 'أبقت المدافئ البطاريات والصمامات وموانع التسرّب تعمل، فبقي الطاقم آمنًا. لكن التدفئة من أكثر ما يستهلك الطاقة، فانخفضت الطاقة.' },
        { t: 'لُفّ المعدات ببطانيات عازلة', d: 'يوفّر الطاقة، لكن على الطاقم العمل في الخارج في البرد.', why: 'البطانيات تحبس الحرارة دون استهلاك الكهرباء، فوفّرت الطاقة. لكن الطاقم اضطر للخروج قرب الفوهة المتجمدة لتركيبها، وكان ذلك متعبًا لبدلاتهم.' },
        { t: 'استمر في العمل وتمنَّ أن يدفأ الجو', d: 'لا تكلفة الآن. خطر.', risk: 'تشقّق أنبوب ماء متجمد وبدأ يسرّب!', why: 'واصلت العمل العلمي، لكن البرد الشديد يجعل المعادن والبلاستيك هشّة ويجمّد أنابيب الماء. المهندسون يخططون للبرد لأن تجاهله خطِر.' },
      ],
      fact: { title: 'ما مدى برودة الفوهة المظللة؟', text: 'الفوهات القريبة من قطبي القمر التي لا ترى ضوء الشمس أبدًا باردة جدًا. تقول ناسا إن حرارة بعضها قد تصل إلى نحو 203 درجات مئوية تحت الصفر (334 درجة فهرنهايت تحت الصفر). المعدات التي تعمل هناك تحتاج إلى مدافئ وعزل.' },
      sim: 'رقم 203 درجات مئوية تحت الصفر حقيقي. أما أرقام الطاقة والحماية ودعم الحياة فهي من صنع اللعبة.',
    },
    ice: {
      title: 'جليد مائي محتمل في فوهة مظلمة', teaches: 'البحث عن الموارد',
      story: 'تشير أجهزة الاستشعار إلى وجود [[psr|فوهة مظللة دائمًا]] قريبة. لا ترى الشمس أبدًا، لذلك قد تكون حرارتها أقل من 200 درجة مئوية تحت الصفر، وهذا بارد بما يكفي لحفظ الجليد مليارات السنين. يمكن أن يتحول الجليد إلى ماء للشرب وهواء للتنفس ووقود للصواريخ. لكن الفوهة المظلمة لا تحتوي دائمًا على جليد. فهل تستحق الرحلة؟',
      choices: [
        { t: 'أرسل المركبة الجوالة للتحقق', d: 'تكلّف طاقة ووقتًا. أنت تختار الوجهة.', why: '' },
        { t: 'ابقَ في المحطة ووفّر الطاقة', d: 'لن يعرف أحد إن كان الجليد موجودًا.', why: 'اللعب بأمان وفّر الطاقة، لكن سؤال الجليد بقي بلا إجابة. على العلماء أن يخوضوا مخاطر محسوبة ليكتشفوا ما هو موجود فعلًا.' },
      ],
      fact: { title: 'هل الظل يعني وجود الجليد؟', text: 'قد تبقى المناطق المظللة دائمًا باردة بما يكفي لحفظ الجليد، لكن ليس كل مكان مظلل يحتوي على ماء يمكن الوصول إليه. في عام 2009 اصطدمت مهمة LCROSS التابعة لناسا عمدًا بفوهة كابيوس قرب القطب الجنوبي، وكانت سحابة الغبار التي أثارتها تحتوي على ماء. يستخدم العلماء قياسات كهذه لمعرفة أماكن الجليد الحقيقية، ولهذا على اللاعبين أن يتحققوا بدلًا من أن يفترضوا.' },
    },
    life: {
      title: 'إنذار دعم الحياة: الهواء يصبح خانقًا', teaches: 'التخطيط للبقاء',
      story: '[[scrubber|منقّيات الهواء]] تعاني. كل رائد فضاء يُخرج مع زفيره نحو 1.08 كغ من ثاني أكسيد الكربون يوميًا، ويجب إزالته. جودة الهواء تنخفض، وعليك أن تحافظ على تنفس الطاقم.',
      lowPw: 'بقي {pw} فقط من الطاقة، لذلك سيكون الحل أقل فاعلية.',
      choices: [
        { t: 'وجّه كل الطاقة الفائضة إلى منقّيات الهواء', d: 'أفضل حل، لكنه يستهلك طاقة كثيرة.', why: 'منقّيات الهواء تحتاج إلى الكهرباء. هذا يعيد أكبر قدر من الهواء النقي، لكن فاعليته تعتمد على الطاقة المتبقية لديك. لهذا ترتبط الطاقة بدعم الحياة.' },
        { t: 'أطفئ المختبرات والمركبة والأضواء', d: 'أبقِ الأساسيات فقط تعمل.', why: 'عندما تسوء الأمور، يطفئ رواد الفضاء الأنشطة غير الضرورية أولًا. خسرت بعض العلوم لكنك حفظت الطاقة لما هو أهم.' },
        { t: 'استخدم عبوات تنقية الهواء للطوارئ', d: 'حيلة قديمة، وعمل متعب.', why: 'في مهمة أبولو 13 ارتجل الطاقم حلًا بعبوات احتياطية لتنقية هوائهم. هذا الحل لا يحتاج تقريبًا إلى طاقة، لكن الطاقم متعب ومتوتر، فتنخفض الحماية.' },
      ],
      fact: { title: 'كم يحتاج رواد الفضاء؟', text: 'يستهلك كل رائد فضاء يوميًا نحو 0.89 كغ من الأكسجين، ويشرب نحو 2.79 كغ من الماء، ويأكل نحو 1.8 كغ من الطعام. لطاقم من 4 أفراد مدة 5 أيام، هذا يعني تقريبًا 18 كغ من الأكسجين و56 كغ من الماء و36 كغ من الطعام.' },
    },
  },
  rashid: {
    title: 'مستكشف من الإمارات',
    text: 'مركز محمد بن راشد للفضاء في دولة الإمارات هو أحد الشركاء الرسميين من وكالات الفضاء في تحدي ناسا Space Apps لعام 2026. بنى المركز المستكشف الصغير «راشد»، الذي أُرسل نحو القمر في ديسمبر 2022 على متن مركبة هبوط يابانية اسمها HAKUTO-R. وفي أبريل 2023 تحطمت مركبة الهبوط أثناء محاولة الهبوط، وفُقد «راشد» معها. ما زال الهبوط على القمر صعبًا جدًا.',
  },
  outcome: { youChose: 'اخترت', lucky: 'حالفك الحظ. الخطر لم يحدث هذه المرة، لكنه كان ممكنًا.', why: 'لماذا حدث هذا', next: 'التالي: اختر مهمة اليوم' },

  explore: {
    eyebrow: 'مهمة استكشاف', title: 'إلى أين تذهب المركبة الجوالة؟',
    intro: 'كلما كانت الوجهة أبعد وأكثر ظلامًا زادت فرصة العثور على الجليد، لكن الرحلة تكلف {icon} طاقة أكثر. في {site} تكلف رحلات المركبة {cost} بسبب طبيعة الأرض.',
    costHigh: 'الكثير', costMid: 'قدرًا متوسطًا', costNorm: 'قدرًا عاديًا', rugged: ' مركبتك المتينة تساعد.', edge: ' مسكنك قرب حافة الفوهة، لذلك الرحلة أقصر.',
    chance: 'فرصة وجود الجليد', stuck: '⚠ احتمال {n} من 10 أن تعلق المركبة', cancel: 'غيّرت رأيي: سأبقى في المحطة (<span dir="ltr">+8</span> طاقة)',
    heading: 'المركبة في طريقها إلى {target}', driving: 'تسير فوق [[regolith|تربة القمر]]...',
    stuckT: 'علقت المركبة الجوالة!', stuckLog: 'علقت المركبة في الأرض الوعرة واضطر الطاقم لإنقاذها. كانت مركبة متينة أو طريق أسهل ستساعد.',
    stuckWhy: 'الأرض المنحدرة والصخرية قد تحبس المركبات. يفحص مخططو المهمات خريطة الانحدار قبل إرسال أي مركبة، ولهذا يهم اختيارك لموقع الهبوط. أنفق الطاقم طاقة ووقتًا في الإنقاذ ولم تُعطِ الرحلة أي بيانات.',
  },
  targets: {
    edge: { name: 'الحافة المظللة قرب القاعدة', lc: 'الحافة المظللة قرب القاعدة', d: 'رحلة قصيرة. الجليد، إن وُجد، قليل.' },
    mid: { name: 'منحدر وسط الفوهة', lc: 'منحدر وسط الفوهة', d: 'رحلة متوسطة على أرض منحدرة.' },
    deep: { name: 'قاع الفوهة العميق', lc: 'قاع الفوهة العميق', d: 'رحلة طويلة إلى أبرد وأظلم مكان.' },
  },
  scan: {
    title: 'مسح بالأجهزة عند {target}', note: 'الأعمدة الأطول تعني إشارة أقوى للهيدروجين، وقد يعني ذلك وجود جليد مائي.',
    strong: ['إشارة قوية!', 'وجدت المركبة إشارة قوية على وجود جليد مائي. حفر عيّنة قد يؤكد ذلك.'],
    weak: ['إشارة ضعيفة.', 'قد يكون هناك قليل من الجليد مختلطًا بالتربة. العيّنة قد تخبرك بالمزيد.'],
    none: ['لا توجد إشارة جليد هنا.', 'هذا المكان مظلم وبارد لكن المسح لم يجد جليدًا. وهذا مفيد أيضًا: يتعلم العلماء أين لا يوجد الجليد، والظل وحده لا يضمن وجوده أبدًا.'],
    homeNone: 'عُد إلى المحطة (<span dir="ltr">+1</span> علوم مقابل البيانات)', dig: 'احفر عيّنة', digD: 'يكلف طاقة أكثر. يؤكد وجود الجليد.', digStrong: ' بعدها تختار طريقة استخدامه.', home: 'عُد إلى المحطة الآن', homeD: 'احتفظ بالطاقة. أعِد نتائج المسح.',
  },
  finish: {
    digWhy: 'وجدت في العيّنة آثارًا من الماء. إنها دليل، لكنها ليست جليدًا كافيًا للاستخدام بعد. العلم يتقدم غالبًا بخطوات صغيرة.',
    noneWhy: 'عدم العثور على الجليد نتيجة حقيقية أيضًا. يحتاج العلماء إلى معرفة أين لا يوجد الجليد، ليختاروا أماكن أفضل لاحقًا.',
    homeWhy: 'احتفظت بطاقتك وأعدت نتائج المسح. إنها أقل يقينًا من العيّنة، لكنها بيانات مفيدة.',
    dust: ' كما التقط الطاقم غبار القمر أثناء الرحلة، وهذا يكلف قليلًا من حماية الطاقم.',
    dig: 'حفر عيّنة', home: 'العودة إلى المحطة', at: '{ch} عند {target}', log: '{target}: {ch}',
  },
  iceUse: {
    title: 'إنه جليد حقيقي! كيف ستستخدمه؟',
    intro: 'الجليد المائي كنز على القمر. إذا أذبته صار ماءً للشرب. وإذا فصلته بالكهرباء صار أكسجينًا للتنفس وهيدروجينًا. والهيدروجين والأكسجين معًا وقود للصواريخ أيضًا، فقد يُستخدم جليد القمر يومًا ما لتزويد الصواريخ بالوقود في رحلة العودة أو في الطريق إلى المريخ.',
    est: 'كميات دعم الحياة والطاقة أرقام من اللعبة.', confirmed: 'أكدت العيّنة وجود الجليد! ', then: 'حفر عيّنة، ثم {use}',
    water: { t: 'أذِبه ليصبح ماءً للشرب', lc: 'إذابته ليصبح ماءً للشرب', d: 'دفّئ الجليد ثم رشّحه. بسيط ورخيص.', why: 'أذبت الجليد فصار ماءً نظيفًا للشرب. هذه أبسط طريقة لاستخدام جليد القمر ولا تحتاج إلى طاقة إضافية.' },
    oxy: { t: 'افصله لتحصل على الأكسجين', lc: 'فصله للحصول على الأكسجين', d: 'الكهرباء تفصل الماء إلى أكسجين للتنفس وهيدروجين. يستهلك طاقة.', why: 'استخدمت الكهرباء لفصل الماء إلى أكسجين يتنفسه الطاقم. أفاد ذلك دعم الحياة أكثر من الماء، لكنه كلّف طاقة. والهيدروجين المتبقي مع الأكسجين يكوّنان وقودًا للصواريخ.' },
  },
  plan: {
    eyebrow: 'اليوم {n} · مهمة اليوم', title: 'ما مهمة الطاقم في بقية اليوم؟', intro: 'اختر واحدة. كل مهمة تزيد مؤشرًا وتنقص آخر.',
    opts: { sci: ['يوم علمي', 'أجرِ التجارب وارسم خرائط المنطقة.'], fix: ['يوم صيانة', 'افحص المعدات ونظّفها وأصلحها.'], gh: ['اعتنِ بالبيت الزجاجي', 'اسقِ النباتات واحصد الثمار.'], save: ['استرح ووفّر الطاقة', 'أضواء خافتة ولا مخاطرة، لكن الأنظمة لا تُفحص.'] },
  },
  night: {
    eyebrow: 'نهاية اليوم {n}', title: 'تقرير الليل', intro: 'مهمة اليوم: <b>{job}</b>. بعدها عمل روتين الليل على القمر تلقائيًا.',
    panels: 'الألواح الشمسية', panelsMoved: 'الألواح الشمسية (الألواح المنقولة تساعد)', machines: 'التدفئة والأجهزة والراديو', machinesGh: 'التدفئة والأجهزة والراديو والبيت الزجاجي',
    crew: 'الطاقم يتنفس ويشرب ويأكل', crewSlow: 'الطاقم يتنفس ويشرب ويأكل، ومنقّيات الهواء بطيئة', wear: 'الغبار والأشعة الكونية والتآكل',
    note: 'الطاقة أقل من 15، لذلك عملت منقّيات الهواء ببطء: {n} إضافية من دعم الحياة.',
    zero: 'وصل أحد المؤشرات إلى 0! إصابات خطيرة: {names}.', low: '{res} في منطقة الخطر. أُصيب أحد أفراد الطاقم: {name}.', recover: 'الطاقم مرتاح، وتعافى أحد أفراده: {name}.',
    debrief: 'شاهد تقرير المهمة', next: 'ابدأ اليوم {n}',
  },
  emerg: {
    eyebrow: 'قبل اليوم {n} · طوارئ الطاقة', title: 'انخفضت الطاقة إلى {n}!',
    intro: 'عندما تقل الطاقة عن 15 تتباطأ [[scrubber|منقّيات الهواء]] وينخفض دعم الحياة بسرعة. اختر ما ستطفئه. يمكنك اختيار أكثر من شيء.',
    switching: 'سيتم إطفاء: {list}', nothing: 'لم تطفئ شيئًا بعد.', willBe: 'ستصبح الطاقة {n}.',
    goMany: 'نفّذ الإطفاء وابدأ اليوم {n}', goOne: 'نفّذ الإطفاء وابدأ اليوم {n}', goNone: 'أبقِ كل شيء يعمل وابدأ اليوم {n}',
    est: 'كمية الطاقة التي توفرها وتكلفة كل إطفاء أرقام من اللعبة.',
    logOff: 'طوارئ الطاقة: إطفاء {list}', whyOff: 'عندما تنخفض الطاقة، يطفئ رواد الفضاء أولًا ما يمكنهم الاستغناء عنه، لكي تستمر منقّيات الهواء في العمل.',
    logNone: 'طوارئ الطاقة: أبقيت كل شيء يعمل', whyNone: 'لم يُطفأ شيء، فبقيت الطاقة في منطقة الخطر وأصبحت منقّيات الهواء معرّضة للتباطؤ.',
  },
  off: {
    labs: { t: 'أطفئ المختبرات', short: 'المختبرات', d: 'تتوقف التجارب اليوم.' },
    rover: { t: 'ضع المركبة الجوالة في وضع السكون', short: 'المركبة الجوالة', d: 'لا جولات سريعة لتفقّد الأمور.' },
    green: { t: 'أطفئ البيت الزجاجي', short: 'البيت الزجاجي', d: 'تبرد النباتات وتتوقف عن النمو لفترة.' },
    heat: { t: 'اخفض التدفئة', short: 'التدفئة', d: 'المسكن البارد متعب للطاقم والمعدات.' },
  },
  debrief: {
    eyebrow: 'تقرير المهمة · {site}',
    words: {
      success: ['نجحت المهمة!', 'الطاقم آمن والمحطة تعمل. وازنت بين الطاقة والهواء والحماية، وأنجزت عملًا علميًا أيضًا.'],
      partial: ['نجاح جزئي', 'نجا الطاقم، لكن بعض الأهداف لم تتحقق أو أن موارد المحطة منخفضة. كل مهمة حقيقية فيها موازنات كهذه.'],
      failRun: ['فشلت المهمة', 'نفد أحد الأنظمة الأساسية ولم تستطع المحطة الاستمرار.'],
      failCrew: ['فشلت المهمة', 'لم نتمكن من الحفاظ على سلامة الطاقم. يدرس مخططو المهمات الحقيقيون حالات فشل كهذه حتى لا تحدث في الواقع أبدًا.'],
    },
    short: { success: 'نجاح', partial: 'نجاح جزئي', fail: 'فشل' },
    last: 'المرة السابقة: <b>{site}</b>، النتيجة {score} ({outcome}). هذه المرة: النتيجة {now}. {cmp}', better: 'أفضل!', worse: 'جرّب خطة مختلفة.', same: 'النتيجة نفسها.',
    safety: 'سلامة الطاقم', eff: 'استخدام الموارد', sci: 'العلوم', overall: 'النتيجة الكلية',
    final: 'المستويات النهائية', lifeN: 'دعم الحياة {n}', powerN: 'الطاقة {n}', protN: 'الحماية {n}', crewN: 'الطاقم {n} من 4',
    goals: 'الأهداف', decisions: 'قراراتك', dayCh: 'اليوم {n}: {choice}', verdict: { helped: 'كان قرارًا موفقًا', hurt: 'كان مكلفًا', mixed: 'موازنة بين خيارين' },
    best: 'أفضل قرار: <b>{c}</b>. ', hardest: 'أصعب درس: <b>{c}</b>.', noSink: 'لم يُفشل أي قرار وحده المهمة.',
    science: 'العلوم التي استخدمتها', est: 'كل أرقام المؤشرات والتكاليف من صنع اللعبة، وليست قياسات من ناسا.',
    again: 'العب مجددًا', againNote: 'جرّب موقع هبوط آخر أو بناءً مختلفًا. الأحداث تتغير في كل مرة.', againBtn: 'حاول مجددًا في موقع جديد',
  },
  flare: {
    recorded: '[[flare|توهج شمسي]] سُجّل في {date}', region: ' · المنطقة النشطة {ar}', strength: 'قوة العاصفة في اللعبة',
    live: 'أقوى توهج في آخر 5 أشهر', archive: ['أقوى توهج في الدورة الشمسية 25 حتى الآن', 'جزء من فترة العواصف الشمسية في مايو 2024'],
  },

  crewScienceTitle: "علوم الفضاء الحقيقية",
crewScienceFact: "يمكن أن يؤثر السفر إلى الفضاء على جسم الإنسان. يدرس علماء ناسا التغيرات التي تحدث لرواد الفضاء خلال المهمات لفهم كيفية حماية أفراد الطاقم في الرحلات الفضائية الطويلة مستقبلاً.",
crewScienceSource: "المصدر: مستودع بيانات العلوم المفتوحة التابع لناسا (OSDR)",
};

'use strict';
// Arabic is an AI-assisted draft. Native-speaker review is required before submission.
LANG.en.x={
 expedition:'LUNAR EXPEDITION / 01',edition:'THE 3D EXPEDITION',tagline:'A little courage.\nA whole new world.',hero:'Your crew. Your outpost. Your Moon.',heroSub:'Touch down at the lunar south pole. Build a home, explore the unknown, and bring everyone back safe.',start:'Begin your expedition',resume:'Continue expedition',duration:'5 mission days · Play at your own pace',team:'A mission by DuneTech',navBase:'Outpost',navMap:'Map',navJournal:'Mission log',navScience:'Science library',navHelp:'Controls',settings:'Settings',pause:'Pause',paused:'Mission paused',continue:'Continue',newMission:'New expedition',confirmNew:'Start a new expedition?',newNote:'Your current saved expedition will be replaced when you launch.',back:'Back',next:'Continue',close:'Close',optional:'Explore more',details:'More detail',skip:'Skip training',trainLabel:'FLIGHT SCHOOL',trainTitle:'One small step',trainIntro:'You are Hessa, the commander. Move to the glowing beacon, then use the training console.',move:'Move with W A S D or arrow keys. You can also click the ground.',trainGoal:'Walk to the training console',trainTask:'Click the beacon or use your movement keys.',trainUse:'Use the console',trainDone:'Nice work. Every action has a trade-off.',trainStep:'TRAINING {n} / 2',toSites:'Choose a landing site',heater:'Try the habitat heater',heaterIntro:'The habitat feels cold. Make one choice and watch the meters.',trained:'Ready for the Moon',siteStep:'01 / CHOOSE YOUR DESTINATION',siteTitle:'Where will you call home?',siteSub:'Three places. Three different adventures. Compare sunlight, terrain, and access to ice.',recommended:'A good first mission',siteHint:'These are simplified game ratings. The exact place still matters.',map:'Open NASA terrain maps',buildStep:'02 / PREPARE YOUR OUTPOST',buildTitle:'Pack for the unexpected',buildSub:'Choose one option in each row. You have 100 credits to build a safe home.',credits:'Credits remaining',preset:'Use balanced kit',preview:'Daily forecast',placeStep:'03 / FIND THE RIGHT SPOT',placeTitle:'Give your outpost a home',placeSub:'Put panels in sunlight. Put the habitat where your crew can reach it. Each spot holds one building.',placeItem:'Place {item}',deploy:'Deploy outpost',swap:'Occupied: selecting this spot swaps the buildings.',landing:'Touchdown confirmed',mode:'SURFACE EXPLORATION',day:'DAY {n} / 05',missionTime:'Mission time',simClock:'Game schedule. A mission day advances when you finish its tasks.',goal:'YOUR NEXT STEP',go:'Show the way',walk:'Walk here',interact:'Use',inspect:'Inspect',near:'Move closer to use this',distance:'{n} m away',destination:'Destination',arrived:'You have arrived',pathHint:'Follow the glowing trail. Click an object to walk to it.',prompt:'Press E to use',jobGoal:'Choose a job for today',jobSub:'One job each day. Walk to a station and use it, or choose below.',jobAction:'Assign this job',nightGoal:'Return to the habitat',nightSub:'Your work is done. Go home for the night report.',finishDay:'End the mission day',resolve:'Choose a response',done:'Task complete',after:'What happened',nextJob:'Choose today’s job',backOutside:'Back to the surface',eventAt:'Go to {name}',eventHint:'Use the highlighted station to respond.',learn:'Why does this happen?',working:'Working on it…',seconds:'{n} seconds',timer:'Task timer',noPressure:'Reading pauses the action. There is no time penalty.',tools:'Mission tools',activeCrew:'ACTIVE CREW',crewRole:'{name} · {role}',crewStatus:'{n} / 4 healthy',selected:'Selected',crewHelp:'Select a crewmate to explore as them. All four share the same resources.',health:'Healthy',hurt:'Needs care',pan:'Drag to orbit',zoom:'Scroll to zoom',resetView:'Reset camera',moveKeys:'Move',useKey:'Use station',mapKey:'Map',pauseKey:'Pause',rest:'Rest in habitat',lab:'Science station',lifeDetail:'Air, water and food share the Life Support meter. These are simplified supplies, not separate measured tanks.',supplies:'Crew supplies',scientific:'Science points',units:'Game values · 0–100',forecastNote:'At the end of each mission day. Events and jobs have extra costs.',route:'Plan a rover journey',roverDrive:'Rover controls: W A S D / arrows, or click the ground. Follow the beacon to your destination.',driveGoal:'Drive to the survey beacon',scanGoal:'Use the survey instrument',scanAction:'Scan the ground',returnGoal:'Drive back to the outpost',returnHint:'Bring your rover back to its parking pad.',returnAction:'Unload the rover',range:'Route length is compressed for play.',scanSim:'Simulated hydrogen signal. This is not a real measurement.',sample:'Take a soil sample',return:'Return with the data',iceLabel:'ICE SAMPLE',iceIntro:'Your sample confirmed ice. Choose how the outpost should use it.',library:'Your field guide',libraryIntro:'Open a topic when you are curious. Science sources are linked in each card.',topics:'Science topics',glossary:'Space words',source:'Source',sourceNote:'Facts come from the supplied research and original game. The 3D terrain, routes, timers, scores, credits and resource effects are illustrative game estimates.',terrain:'Terrain maps',terrainNote:'Original LOLA maps via LPI. These maps have different scales. Compare crater names. Pins are approximate.',localMap:'Outpost map',localMapNote:'Schematic map of your playable outpost. Click a station to walk there. North is at the top; this is not a NASA terrain map.',log:'Your mission so far',emptyLog:'Your decisions will appear here.',objectives:'Mission objectives',time:'Elapsed play time',saved:'Progress saved on this browser',saveMissing:'No saved expedition found.',nightTitle:'A good day on the Moon',nightHint:'Panels charge the battery. Your crew uses supplies. Equipment needs care.',report:'Mission report',reportSub:'Every choice tells a story. Here is yours.',replay:'Plan another expedition',previous:'Previous score: {n}',risk:'Risk {n}%',chance:'Ice chance {n}%',cost:'Power cost {n}',read:'Read science note',trainingOnly:'Practice meters reset before your mission.',fullMap:'View full map',sound:'Sound effects',motion:'Reduced motion',on:'On',off:'Off',quality:'Graphics',qualityLow:'Battery saver',qualityHigh:'Full detail',keyboard:'Keyboard and mouse',touch:'Touch controls',helpTitle:'Your guide to the Moon',helpIntro:'Move, follow the beacon, and use the highlighted station. You decide when each day ends.',helpSteps:['Click the ground to walk. Click a building to walk to its entrance.','Use W A S D or arrow keys to move, and E to use the closest station.','Follow the blue trail and the next-step card. M opens the map.','Drag the scene to rotate. Scroll to zoom. R resets the camera.','Select a crewmate at the bottom. On a rover trip, you drive the rover.','Meters change when you make decisions or finish a day. Reading never drains supplies.','Escape pauses or closes a panel. Your mission saves after each completed step.'],webgl:'3D graphics could not start',webglHelp:'Enable hardware acceleration in your browser and reload. The keyboard station list still lets you play.',stations:'Nearby stations',travel:'Travel',shelterUse:'Enter shelter',habUse:'Enter habitat',powUse:'Operate solar array',lifeUse:'Use air scrubber',labUse:'Use science console',greenUse:'Tend plants',roverUse:'Use rover',noGreen:'Add a greenhouse during preparation to grow food.',visitDone:'Station visited',simulation:'SIMULATED MISSION',flareNote:'A real flare class informs the game difficulty. Flare class alone does not predict radiation at the Moon. The scenario, warning time and damage are simulated.',flareArchive:'Archived solar flare · not a current alert',critical:'Resource warning',danger:'Below 20: crew at risk',finishTraining:'Finish training',cancelRoute:'Stay at the outpost (+8 Power)',stop:'Stop walking',journey:'Expedition progress',total:'Overall score',loading:'Preparing the lunar surface…',retry:'Reload game',screen:'Choose a response at the station',powerShort:'Not enough power for this action',viewMode:'Camera',viewOrbit:'Orbit',viewFollow:'Follow crew',nightHealth:'Crew health: {before} → {after}',trainResult:'Heater decision recorded. Follow the effects on Power and Protection.',taskTime:'Estimated task time',calm:'No countdown. Take your time.',eta:'{n} s travel',
 brief:{power:'Your panels are in shadow. Check the solar array and decide how to keep the base powered.',rad:'A simulated solar storm is approaching. Go to the shelter and make a safety plan.',dust:'Dust is clinging to suits and panels. Take the cleaning kit to the solar array.',micro:'A tiny impact damaged the habitat. Go to the airlock to inspect the panel.',freeze:'Cold is affecting the rover. Take a thermal kit to its parking pad.',ice:'A dark crater may hold ice. Visit the rover and plan a journey.',life:'The air scrubber needs help. Go to life support and decide how to clean the air.'},
 tool:{power:'Power console',rad:'Shelter console',dust:'Dust brush',micro:'Repair kit',freeze:'Thermal blanket',ice:'Rover scanner',life:'Air filter'},
};
LANG.ar.x={
 expedition:'رحلة قمرية / 01',edition:'الرحلة ثلاثية الأبعاد',tagline:'قليل من الشجاعة.\nوعالم جديد بالكامل.',hero:'طاقمك. قاعدتك. قمرك.',heroSub:'اهبط قرب القطب الجنوبي للقمر. ابنِ منزلاً، واستكشف المجهول، وحافظ على سلامة الجميع.',start:'ابدأ رحلتك',resume:'تابع الرحلة',duration:'٥ أيام للمهمة · العب بالسرعة التي تناسبك',team:'مهمة من فريق DuneTech',navBase:'القاعدة',navMap:'الخريطة',navJournal:'سجل المهمة',navScience:'مكتبة العلوم',navHelp:'التحكم',settings:'الإعدادات',pause:'إيقاف مؤقت',paused:'المهمة متوقفة',continue:'متابعة',newMission:'رحلة جديدة',confirmNew:'هل تبدأ رحلة جديدة؟',newNote:'ستحل المهمة الجديدة محل الحفظ الحالي عند الانطلاق.',back:'رجوع',next:'متابعة',close:'إغلاق',optional:'اكتشف المزيد',details:'تفاصيل أكثر',skip:'تجاوز التدريب',trainLabel:'مدرسة رواد الفضاء',trainTitle:'خطوة صغيرة',trainIntro:'أنت حصة، قائدة الطاقم. تحرك نحو العلامة المضيئة ثم استخدم لوحة التدريب.',move:'تحرك بمفاتيح W A S D أو الأسهم، أو انقر على الأرض.',trainGoal:'اذهب إلى لوحة التدريب',trainTask:'انقر على العلامة أو استخدم مفاتيح الحركة.',trainUse:'استخدم اللوحة',trainDone:'أحسنت. لكل قرار مكسب وتكلفة.',trainStep:'التدريب {n} / 2',toSites:'اختر موقع الهبوط',heater:'جرّب مدفأة المسكن',heaterIntro:'المسكن بارد. اختر حلاً وراقب المؤشرات.',trained:'جاهز للقمر',siteStep:'01 / اختر وجهتك',siteTitle:'أين ستبني منزلك؟',siteSub:'ثلاثة أماكن وثلاث مغامرات. قارن ضوء الشمس والتضاريس والوصول للجليد.',recommended:'مناسب للمهمة الأولى',siteHint:'هذه تقييمات مبسطة للعبة. الموقع الدقيق مهم.',map:'افتح خرائط تضاريس ناسا',buildStep:'02 / جهّز القاعدة',buildTitle:'استعد للمفاجآت',buildSub:'اختر خياراً من كل صف. لديك 100 رصيد لبناء منزل آمن.',credits:'الرصيد المتبقي',preset:'استخدم تجهيزاً متوازناً',preview:'التوقع اليومي',placeStep:'03 / اختر المكان المناسب',placeTitle:'اختر مكان قاعدتك',placeSub:'ضع الألواح في الشمس والمسكن حيث يصل إليه الطاقم. كل مكان يتسع لمبنى واحد.',placeItem:'ضع {item}',deploy:'أنشئ القاعدة',swap:'المكان مشغول. اختياره يبدّل المبنيين.',landing:'تم تأكيد الهبوط',mode:'استكشاف السطح',day:'اليوم {n} / 05',missionTime:'وقت المهمة',simClock:'جدول للعبة. ينتهي اليوم عند إكمال مهامه.',goal:'خطوتك التالية',go:'أرني الطريق',walk:'اذهب إلى هنا',interact:'استخدم',inspect:'افحص',near:'اقترب لاستخدامه',distance:'على بعد {n} م',destination:'الوجهة',arrived:'لقد وصلت',pathHint:'اتبع المسار المضيء. انقر على أي جهاز للذهاب إليه.',prompt:'اضغط E للاستخدام',jobGoal:'اختر عمل اليوم',jobSub:'عمل واحد كل يوم. اذهب إلى محطة واستخدمها أو اختر أدناه.',jobAction:'نفّذ هذا العمل',nightGoal:'عد إلى المسكن',nightSub:'اكتمل العمل. عد لتقرير نهاية اليوم.',finishDay:'أنهِ يوم المهمة',resolve:'اختر استجابة',done:'اكتملت المهمة',after:'ماذا حدث',nextJob:'اختر عمل اليوم',backOutside:'العودة إلى السطح',eventAt:'اذهب إلى {name}',eventHint:'استخدم المحطة المضيئة لاتخاذ قرار.',learn:'لماذا يحدث هذا؟',working:'جارٍ العمل…',seconds:'{n} ثوانٍ',timer:'وقت العمل',noPressure:'تتوقف الحركة أثناء القراءة. لا توجد عقوبة زمنية.',tools:'أدوات المهمة',activeCrew:'الطاقم النشط',crewRole:'{name} · {role}',crewStatus:'{n} / 4 بصحة جيدة',selected:'محدد',crewHelp:'اختر أحد أفراد الطاقم. الموارد مشتركة بين الأربعة.',health:'بصحة جيدة',hurt:'يحتاج للرعاية',pan:'اسحب لتدوير المشهد',zoom:'مرر للتقريب',resetView:'إعادة ضبط الكاميرا',moveKeys:'تحرك',useKey:'استخدم المحطة',mapKey:'الخريطة',pauseKey:'إيقاف',rest:'استرح في المسكن',lab:'محطة العلوم',lifeDetail:'يشترك الهواء والماء والغذاء في مؤشر دعم الحياة. هذه إمدادات مبسطة وليست خزانات مقاسة منفصلة.',supplies:'إمدادات الطاقم',scientific:'نقاط العلوم',units:'قيم اللعبة · 0–100',forecastNote:'في نهاية كل يوم. للأحداث والأعمال تكاليف إضافية.',route:'خطط لرحلة العربة',roverDrive:'تحكم بالعربة بمفاتيح W A S D أو الأسهم، أو انقر على الأرض. اتبع العلامة إلى الوجهة.',driveGoal:'قد العربة إلى علامة المسح',scanGoal:'استخدم جهاز المسح',scanAction:'امسح الأرض',returnGoal:'عد بالعربة إلى القاعدة',returnHint:'أعد العربة إلى موقفها.',returnAction:'أفرغ العربة',range:'المسافة مختصرة لأغراض اللعب.',scanSim:'إشارة هيدروجين محاكاة وليست قياساً حقيقياً.',sample:'خذ عينة من التربة',return:'عد بالبيانات',iceLabel:'عينة جليد',iceIntro:'أكدت العينة وجود الجليد. اختر طريقة استخدامه.',library:'دليلك الميداني',libraryIntro:'افتح موضوعاً عندما تريد المعرفة. المصادر مرتبطة بكل بطاقة.',topics:'الموضوعات العلمية',glossary:'كلمات الفضاء',source:'المصدر',sourceNote:'الحقائق من البحث واللعبة الأصلية. التضاريس والمسارات والأوقات والدرجات والأرصدة وتأثيرات الموارد تقديرات للعبة.',terrain:'خرائط التضاريس',terrainNote:'خرائط LOLA الأصلية عبر LPI. تختلف مقاييس الخرائط. قارن أسماء الفوهات. العلامات تقريبية.',localMap:'خريطة القاعدة',localMapNote:'رسم توضيحي للقاعدة القابلة للعب. انقر على محطة للذهاب إليها. الشمال في الأعلى. هذه ليست خريطة تضاريس لناسا.',log:'رحلتك حتى الآن',emptyLog:'ستظهر قراراتك هنا.',objectives:'أهداف المهمة',time:'وقت اللعب',saved:'حُفظ التقدم في هذا المتصفح',saveMissing:'لا توجد رحلة محفوظة.',nightTitle:'يوم على القمر',nightHint:'تشحن الألواح البطارية. يستهلك الطاقم الإمدادات وتحتاج المعدات للعناية.',report:'تقرير المهمة',reportSub:'لكل اختيار قصة. هذه قصتك.',replay:'خطط لرحلة أخرى',previous:'الدرجة السابقة: {n}',risk:'الخطر {n}٪',chance:'احتمال الجليد {n}٪',cost:'تكلفة الطاقة {n}',read:'اقرأ المعلومة العلمية',trainingOnly:'تُعاد مؤشرات التدريب عند بدء المهمة.',fullMap:'اعرض الخريطة كاملة',sound:'المؤثرات الصوتية',motion:'تقليل الحركة',on:'تشغيل',off:'إيقاف',quality:'الرسوم',qualityLow:'توفير البطارية',qualityHigh:'تفاصيل كاملة',keyboard:'لوحة المفاتيح والفأرة',touch:'التحكم باللمس',helpTitle:'دليلك إلى القمر',helpIntro:'تحرك واتبع العلامة واستخدم المحطة المضيئة. أنت من يقرر نهاية اليوم.',helpSteps:['انقر على الأرض للمشي، وعلى المبنى للذهاب إلى مدخله.','استخدم W A S D أو الأسهم للحركة، وE لاستخدام أقرب محطة.','اتبع المسار الأزرق وبطاقة الخطوة التالية. يفتح M الخريطة.','اسحب المشهد لتدويره، ومرر للتقريب، واضغط R لإعادة الكاميرا.','اختر فرداً من الطاقم في الأسفل. في رحلات العربة أنت تقودها.','تتغير المؤشرات عند القرارات ونهاية اليوم. القراءة لا تستهلك الإمدادات.','يوقف Escape اللعبة أو يغلق اللوحة. تُحفظ المهمة بعد كل خطوة مكتملة.'],webgl:'تعذر تشغيل الرسوم ثلاثية الأبعاد',webglHelp:'فعّل تسريع الرسوم في المتصفح وأعد التحميل. تتيح قائمة المحطات اللعب بلوحة المفاتيح.',stations:'المحطات القريبة',travel:'انتقال',shelterUse:'ادخل الملجأ',habUse:'ادخل المسكن',powUse:'شغّل الألواح الشمسية',lifeUse:'استخدم منقّي الهواء',labUse:'استخدم لوحة العلوم',greenUse:'اعتنِ بالنباتات',roverUse:'استخدم العربة',noGreen:'أضف بيتاً زجاجياً عند التجهيز لزراعة الغذاء.',visitDone:'تمت زيارة المحطة',simulation:'مهمة محاكاة',flareNote:'تؤثر فئة توهج حقيقي في صعوبة اللعبة، لكنها وحدها لا تتنبأ بالإشعاع عند القمر. السيناريو والإنذار والضرر محاكاة.',flareArchive:'توهج شمسي مؤرشف · ليس إنذاراً حالياً',critical:'تحذير الموارد',danger:'أقل من 20: الطاقم في خطر',finishTraining:'أكمل التدريب',cancelRoute:'ابق في القاعدة (طاقة +8)',stop:'توقف',journey:'تقدم الرحلة',total:'الدرجة الإجمالية',loading:'جارٍ تجهيز سطح القمر…',retry:'أعد تحميل اللعبة',screen:'اختر استجابة في المحطة',powerShort:'لا توجد طاقة كافية لهذا العمل',viewMode:'الكاميرا',viewOrbit:'مدار',viewFollow:'تتبع الطاقم',nightHealth:'صحة الطاقم: {before} ← {after}',trainResult:'سُجّل قرار المدفأة. راقب تأثيره في الطاقة والحماية.',taskTime:'الوقت التقديري للعمل',calm:'لا عد تنازلي. خذ وقتك.',eta:'{n} ثوانٍ للوصول',
 brief:{power:'غطى الظل الألواح. افحصها واختر كيف تحافظ على طاقة القاعدة.',rad:'تقترب عاصفة شمسية محاكاة. اذهب إلى الملجأ وضع خطة للسلامة.',dust:'التصق الغبار بالبدلات والألواح. خذ فرشاة التنظيف إلى الألواح.',micro:'أصاب المسكن جسم صغير. اذهب إلى المدخل وافحص اللوح.',freeze:'يؤثر البرد في العربة. خذ الغطاء الحراري إلى الموقف.',ice:'قد توجد مياه متجمدة في فوهة مظلمة. زر العربة وخطط للرحلة.',life:'يحتاج منقّي الهواء للمساعدة. اذهب إلى دعم الحياة واختر حلاً.'},tool:{power:'لوحة الطاقة',rad:'لوحة الملجأ',dust:'فرشاة الغبار',micro:'عدة إصلاح',freeze:'غطاء حراري',ice:'ماسح العربة',life:'مرشح الهواء'}
};
// Correct historical/engineering statements that the supplied research simplifies.
LANG.en.ev.rad.story='A solar eruption has triggered a simulated safety alert. Go to the shelter before the mission continues. The 30-minute warning in this scenario is a game estimate; real warning times vary.';
LANG.ar.ev.rad.story='تسبب ثوران شمسي في إنذار سلامة محاكاة. اذهب إلى الملجأ قبل متابعة المهمة. مهلة الثلاثين دقيقة تقدير للعبة؛ تختلف الإنذارات الحقيقية.';
LANG.en.ev.rad.fact.text='The Moon has almost no atmosphere and no global magnetic field. Chang’e-4 measured about 1,369 µSv per day at its landing site (Zhang et al., 2020). This is a site measurement, not a constant dose everywhere. Shielding needs depend on the material, particle energy and shelter design. The supplied research discusses about 0.75 m of soil as an example, not a universal safety thickness. On the International Space Station, NASA\'s RadLab data shows about 140 µGy a day (DOSTEL detectors in the Columbus module, a 2-hour sample from April 2022).';
LANG.ar.ev.rad.fact.text='للقمر غلاف جوي ضئيل جداً ولا يملك مجالاً مغناطيسياً عالمياً. قاست مركبة تشانغ آه 4 نحو 1369 ميكروسيفرت يومياً في موقع هبوطها (تشانغ وآخرون، 2020). ليست جرعة ثابتة في كل مكان. تعتمد الحماية على المادة وطاقة الجسيمات وتصميم الملجأ. يذكر البحث 0.75 متر من التربة كمثال لا كسماكة أمان عامة. وعلى متن محطة الفضاء الدولية، تُظهر بيانات RadLab التابعة لناسا نحو 140 ميكروغراي يومياً (كاشفات DOSTEL في وحدة كولومبوس، عينة مدتها ساعتان في أبريل 2022).';
LANG.en.ev.rad.choices[2].why='Adding Moon soil improves shielding in this game. It costs power and exposes the crew while they work. Real shelters need a detailed engineering design; a single soil thickness does not guarantee safety.';
LANG.ar.ev.rad.choices[2].why='تزيد تربة القمر الحماية في اللعبة. يتطلب العمل طاقة ويعرض الطاقم للإشعاع. تحتاج الملاجئ الحقيقية إلى تصميم هندسي مفصل ولا تضمن سماكة واحدة الأمان.';
LANG.en.flare.archive[0]='Historical October 2024 flare';LANG.ar.flare.archive[0]='توهج تاريخي في أكتوبر 2024';
LANG.en.site.intro='Compare three example outpost sites near the lunar south pole. Use slope, elevation, lighting and access to ice to make your choice.';
LANG.ar.site.intro='قارن ثلاثة مواقع نموذجية قرب القطب الجنوبي للقمر. استخدم الانحدار والارتفاع والإضاءة والوصول إلى الجليد للاختيار.';

export default LANG;
