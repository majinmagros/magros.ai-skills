const fs=require('fs');
const path=require('path');
const skillsDir='C:/Projetos/magros.ai-skills/skills';
const dirs=fs.readdirSync(skillsDir).filter(d=>fs.statSync(path.join(skillsDir,d)).isDirectory());

function hasTrigger(desc){
  return /use when|quando|triggers on|gatilho/i.test(desc);
}
function toTriggers(name){
  const spaced=name.replace(/-/g,' ');
  const parts=[name, spaced];
  if(name.includes('-')){
    const last=name.split('-').pop();
    if(last.length>3) parts.push(last);
  }
  return [...new Set(parts)].slice(0,3);
}
let fixed=0, skipped=0;
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
  // strip surrounding quotes if present and unescape
  if((desc.startsWith('"') && desc.endsWith('"')) || (desc.startsWith("'") && desc.endsWith("'"))){
    try{ desc=JSON.parse(desc.includes('"')?desc.replace(/'/g,'"'):desc); } catch{ desc=desc.slice(1,-1); }
  } else if(desc.startsWith('>-') || desc.startsWith('>') || desc.startsWith('|')){
    // folded/literal already has trigger? skip
    // but we already fixed literal, so skip
    continue;
  }
  // if already has trigger skip
  if(hasTrigger(desc)){ skipped++; continue; }
  let base=desc;
  if(!/[.!?]$/.test(base.trim())) base=base.trim()+'.';
  const triggers=toTriggers(d);
  const triggerStr=triggers.map(t=>`"${t}"`).join(', ');
  let newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
  if(newDesc.length>340){
    const maxBase=340 - (`Use when  Triggers on ${triggerStr}.`.length + 10);
    base=base.slice(0,maxBase).trim()+'...';
    newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
  }
  // escape for yaml double quoted string
  const escaped=newDesc.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
  const quoted=`"${escaped}"`;
  const oldLine=descMatch[0];
  const newLine=`description: ${quoted}`;
  const newTxt=txt.replace(oldLine, newLine);
  if(newTxt!==txt){
    fs.writeFileSync(fp,newTxt,'utf8');
    fixed++;
    if(fixed<=3) console.log(`fixed ${d}: ${newDesc.slice(0,70)}...`);
  }
}
console.log(`fixed ${fixed}, skipped ${skipped}`);
