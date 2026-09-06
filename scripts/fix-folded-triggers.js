const fs=require('fs'), path=require('path');
const dir='C:/Projetos/magros.ai-skills/skills';
const dirs=fs.readdirSync(dir).filter(d=>fs.statSync(path.join(dir,d)).isDirectory());
function toTriggers(name){
  const spaced=name.replace(/-/g,' ');
  const parts=[name, spaced];
  if(name.includes('-')){
    const last=name.split('-').pop();
    if(last.length>3) parts.push(last);
  }
  return [...new Set(parts)].slice(0,3);
}
let fixed=0;
for(const d of dirs){
  const fp=path.join(dir,d,'SKILL.md');
  if(!fs.existsSync(fp)) continue;
  let txt=fs.readFileSync(fp,'utf8');
  const fmMatch=txt.match(/^---\s*\n([\s\S]*?)\n---/);
  if(!fmMatch) continue;
  const fm=fmMatch[1];
  if(/use when|quando|triggers on|gatilho/i.test(fm)) continue;
  // check if folded or literal
  const descFoldedMatch=fm.match(/^description:\s*[>|][-+]?\s*\n((?:[ \t]+.+\n?)+)/m);
  if(descFoldedMatch){
    let content=descFoldedMatch[1];
    // content is indented lines, join
    const lines=content.split('\n').map(l=>l.trim()).filter(Boolean);
    let base=lines.join(' ').trim();
    if(!/[.!?]$/.test(base)) base+='.';
    const triggers=toTriggers(d);
    const triggerStr=triggers.map(t=>`"${t}"`).join(', ');
    let newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
    if(newDesc.length>340){
      const maxBase=340 - (`Use when  Triggers on ${triggerStr}.`.length+10);
      base=base.slice(0,maxBase).trim()+'...';
      newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
    }
    const escaped=newDesc.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
    const quoted=`"${escaped}"`;
    // replace the folded block with single line quoted
    const oldBlock=descFoldedMatch[0];
    const newBlock=`description: ${quoted}`;
    const newTxt=txt.replace(oldBlock, newBlock);
    if(newTxt!==txt){
      fs.writeFileSync(fp,newTxt,'utf8');
      fixed++;
      if(fixed<=5) console.log(`fixed folded ${d}`);
    }
  } else {
    // plain single line without trigger but maybe contains colon etc. Already handled by previous script, but check again
    const descMatch=fm.match(/^\s*description\s*:\s*(.+)$/m);
    if(!descMatch) continue;
    let desc=descMatch[1].trim();
    if(desc.startsWith('"') || desc.startsWith("'")) continue;
    if(/use when|quando|triggers on|gatilho/i.test(desc)) continue;
    let base=desc;
    if(!/[.!?]$/.test(base.trim())) base=base.trim()+'.';
    const triggers=toTriggers(d);
    const triggerStr=triggers.map(t=>`"${t}"`).join(', ');
    let newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
    if(newDesc.length>340){
      const maxBase=340 - (`Use when  Triggers on ${triggerStr}.`.length+10);
      base=base.slice(0,maxBase).trim()+'...';
      newDesc=`Use when ${base.charAt(0).toLowerCase()+base.slice(1)} Triggers on ${triggerStr}.`;
    }
    const escaped=newDesc.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
    const quoted=`"${escaped}"`;
    const oldLine=descMatch[0];
    const newLine=`description: ${quoted}`;
    const newTxt=txt.replace(oldLine, newLine);
    if(newTxt!==txt){
      fs.writeFileSync(fp,newTxt,'utf8');
      fixed++;
      console.log(`fixed plain ${d}`);
    }
  }
}
console.log('fixed total',fixed);
