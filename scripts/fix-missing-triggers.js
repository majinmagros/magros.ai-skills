const fs=require('fs');
const path=require('path');
const skillsDir='C:/Projetos/magros.ai-skills/skills';
const dirs=fs.readdirSync(skillsDir).filter(d=>fs.statSync(path.join(skillsDir,d)).isDirectory());

function hasTrigger(desc){
  return /use when|quando|triggers on|gatilho/i.test(desc);
}

function toTriggers(name){
  // generate triggers from kebab-case name
  const spaced=name.replace(/-/g,' ');
  const parts=[name, spaced];
  // add short variant if name contains prefix like django-, laravel-, etc.
  if(name.includes('-')){
    const last=name.split('-').pop();
    if(last.length>3) parts.push(last);
  }
  // unique
  return [...new Set(parts)].slice(0,3);
}

let fixed=0;
let skipped=0;
for(const d of dirs){
  const fp=path.join(skillsDir,d,'SKILL.md');
  if(!fs.existsSync(fp)) continue;
  let txt=fs.readFileSync(fp,'utf8');
  const fmMatch=txt.match(/^---\s*\n([\s\S]*?)\n---/);
  if(!fmMatch) continue;
  const fm=fmMatch[1];
  const descMatch=fm.match(/^\s*description\s*:\s*(.+)$/m);
  if(!descMatch) continue;
  let desc=descMatch[1].trim();
  // remove surrounding quotes if any
  if((desc.startsWith('"') && desc.endsWith('"')) || (desc.startsWith("'") && desc.endsWith("'"))){
    desc=desc.slice(1,-1);
  }
  if(hasTrigger(desc)){
    skipped++;
    continue;
  }
  // need to fix
  // keep original desc but ensure it ends with period, then append triggers
  let base=desc;
  // if base ends without period, add
  if(!/[.!?]$/.test(base.trim())) base=base.trim()+'.';
  const triggers=toTriggers(d);
  const triggerStr=triggers.map(t=>`"${t}"`).join(', ');
  let newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
  // Capitalize first letter after Use when? Keep as is.
  // Ensure length <350, if too long truncate base
  if(newDesc.length>340){
    const maxBase=340 - (`Use when  Triggers on ${triggerStr}.`.length + 10);
    base=base.slice(0,maxBase).trim()+'...';
    newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
  }
  // Replace in txt
  // Need to escape for regex: find the exact line
  const oldLine=descMatch[0];
  const newLine=`description: ${newDesc}`;
  const newTxt=txt.replace(oldLine, newLine);
  if(newTxt!==txt){
    fs.writeFileSync(fp,newTxt,'utf8');
    fixed++;
    if(fixed<=5) console.log(`fixed ${d}: ${newDesc.slice(0,80)}...`);
  }
}
console.log(`fixed ${fixed}, skipped ${skipped}, total ${dirs.length}`);
