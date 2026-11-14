import {model,t,EVENT_AT,JOBS} from './model.js';
import {r} from './copy.js';
export const surveyPoint=()=>({edge:[21,-14],mid:[28,-22],deep:[26,-29]}[model.state.scan?.target]||[21,-14]);
export function objective(screen,trained=false){
 const s=model.state,phase=s.phase,event=s.events[s.turn];
 if(screen==='training')return {at:'lab',title:r(trained?'setup':'trainingTitle'),description:r('trainingGuide'),tool:t('x.tool.power')};
 if(screen==='setup')return {at:'lab',title:r('setup'),description:t('x.buildSub')};
 if(phase==='emergency')return {at:'lab',title:r('warning'),description:t('emerg.intro'),tool:t('x.tool.power')};
 if(phase==='event')return {at:EVENT_AT[event],title:t('ev.'+event+'.teaches'),description:t('x.brief.'+event),tool:t('x.tool.'+event)};
 if(phase==='route')return {at:'rover',title:r('route'),description:t('x.brief.ice'),tool:t('x.tool.ice')};
 if(['drive','scan','iceUse'].includes(phase))return {point:surveyPoint(),title:r(phase==='drive'?'drive':phase==='scan'?'scan':'ice'),description:phase==='drive'?t('x.roverDrive'):phase==='scan'?t('x.scanSim'):t('x.iceIntro'),tool:t('x.tool.ice')};
 if(phase==='return')return {point:[12,13.8],title:r('return'),description:r('bringHome')};
 if(phase==='result')return {at:s.last?.type==='event'?EVENT_AT[s.last.id]:'rover',title:r('result'),description:r('completed')};
 if(phase==='job')return {at:s.pendingJob?JOBS[s.pendingJob].at:'lab',title:r('jobs'),description:r('jobGuidance')};
 if(phase==='nightReady')return {at:'hab',title:t('x.nightGoal'),description:r('jobDone')};
 if(phase==='night')return {at:'hab',title:t('x.nightTitle'),description:t('x.nightHint')};
 return {at:'hab',title:r('missionReport'),description:t('x.reportSub')};
}
