'use strict';

function outerTracks(value){
  const tracks=String(value||'').trim().split(/\s+/);
  return tracks.length>=3?{first:tracks[0],last:tracks[tracks.length-1]}:null;
}

function keepsFixedFrameTracks(beforeColumns,beforeRows,afterColumns,afterRows){
  const bc=outerTracks(beforeColumns),br=outerTracks(beforeRows);
  const ac=outerTracks(afterColumns),ar=outerTracks(afterRows);
  return !!bc&&!!br&&!!ac&&!!ar
    &&bc.first==='30px'&&bc.last==='42px'
    &&br.first==='28px'&&br.last==='30px'
    &&ac.first===bc.first&&ac.last===bc.last
    &&ar.first===br.first&&ar.last===br.last;
}

module.exports={keepsFixedFrameTracks};
