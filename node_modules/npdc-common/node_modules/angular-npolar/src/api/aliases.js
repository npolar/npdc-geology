'use strict';

// Aliases => (official) email address
// Use name property only for people/entities without official email (ie. not in npolarPeople)

let aliases = [
  // Alphabetical:
  { email: 'are.bjordal@npolar.no', alias: ['are@npolar.no', 'are']},
  { email: 'christian.lydersen@npolar.no', alias: ['lydersen@npolar.no', 'lydersen']},
  { email: 'conrad.helgeland@npolar.no', alias: ['conrad@npolar.no', 'conrad', 'ch', 'c']},
  { email: 'dag.vongraven@npolar.no', alias: ['vongraven@npolar.no']},
  { email: 'ermias.beyene.tesfamariam@npolar.no', alias: ['ermias@npolar.no', 'ermias.tesfamariam@npolar.no', 'ermias']},
  { email: 'polona.itkin@npolar.no', alias: ['polona@npolar.no', 'polona']},
  { email: 'ruben.dens@npolar.no', alias: ['ruben@npolar.no', 'ruben', 'rd', 'r']},
  { email: 'stein.tronstad@npolar.no', alias: ['stein@npolar.no', 'steint@npolar.no', 'stein', 'steint', 'st', 's']},
  { email: 'stein.orjan.nilsen@npolar.no', alias: ['steinnilsen@npolar.no', 'steinnilsen', 'stein.nilsen@npolar.no', 'stein.nilsen']},
  { email: 'stephen.hudson@npolar.no', alias: ['hudson@npolar.no', 'hudson']},
  // With name:
  { email: 'cesar.deschamps.berger@npolar.no', name: 'César Deschamps-Berger', alias: ['cesar@npolar.no', 'cesar']},
  { email: 'external@data.npolar.no', alias: ['external@data.npolar.no'], name: 'System'},
  { email: 'kkjaer@online.no', name: 'Kjell-G. Kjær', alias: ['kkjaer@online.no']},
  { email: 'ssf@npolar.no', name: 'Svalbard Science Forum', alias: ['ssf@npolar.no', 'ssf']},
  { email: 'trevor.lovett@npolar.no', name: 'Trevor Lovett', alias: ['trevor@npolar.no', 'trevor']}
];

module.exports = aliases;