import React,{useId} from 'react';
import {model} from '../game/model.js';
import {CSA_RESOURCES,LEARNING_COPY} from '../game/learning.js';
import {Icon,Tag} from './UI.jsx';

export const learningText=()=>LEARNING_COPY[model.language]||LEARNING_COPY.en;

export function LearningResource({id}){
 const resource=CSA_RESOURCES[id],copy=resource[model.language]||resource.en,text=learningText(),heading=useId();
 return <article className="learning-resource" aria-labelledby={heading}>
  <div className="learning-resource-label"><Icon name={id==='food'?'life':'book'}/><span>{copy.label}</span></div>
  <h3 id={heading}>{copy.title}</h3><p>{copy.description}</p>
  <a className="learning-link" href={resource.href} target="_blank" rel="noopener noreferrer">{copy.action}<span aria-hidden="true">↗</span></a>
  <small>{text.agency}</small>
 </article>;
}

export function LearningLab(){
 const text=learningText();
 return <section className="learning-lab" aria-label={text.lab}>
  <Tag real>{text.agency}</Tag><h2>{text.lab}</h2><p className="intro">{text.intro}</p>
  <div className="learning-resources"><LearningResource id="food"/><LearningResource id="youth"/></div>
  <details className="learning-prompts"><summary>{text.discuss}</summary><ul>{text.prompts.map(prompt=><li key={prompt}>{prompt}</li>)}</ul></details>
  <p className="note">{text.external}</p><p className="note">{text.optional}</p>
 </section>;
}

export function GreenhouseLearning(){
 const text=learningText();
 return <details className="greenhouse-learning"><summary>{text.greenhouse}</summary>
  <p>{text.greenIntro}</p><LearningResource id="food"/>
  <p className="note">{text.context}</p><p className="note">{text.external}</p>
  <details><summary>{text.discuss}</summary><p>{text.prompts[0]}</p></details>
  <p className="note">{text.labHint}</p>
 </details>;
}
