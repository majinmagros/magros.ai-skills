const fs=require('fs');
const path=require('path');
const skillsDir='C:/Projetos/magros.ai-skills/skills';
const list = [
'claude-md-auditor','graph-engineering-patterns','hyper3d-rodin-pipeline','metahuman-identity-pipeline','threejs-config-constants','threejs-deploy-pipeline','threejs-responsive-patterns','threejs-voxel-block-system','fusion-harness','hyper3d-rodin-api','metahuman-animation-retarget','metahuman-unreal-blueprint','sub-agent-cost-guard','threejs-shader-effects','claude-account-optimizer','claude-cowork-patterns','claude-chrome-automation','claude-model-router','claude-project-template','motion-design-skill','skill-creator-methodology','game-npc-ai-integration','claude-connector-strategy','gsap-skills','img2threejs','memory-import-workflow','metahuman-to-unreal-pipeline','rules-to-hooks-auditor'
];
let fixed=0;
for(const name of list){
  const fp=path.join(skillsDir,name,'SKILL.md');
  if(!fs.existsSync(fp)){console.log('missing',name); continue;}
  let txt=fs.readFileSync(fp,'utf8');
  if(!txt.includes('description: |')){
    console.log('no literal',name);
    continue;
  }
  // Replace 'description: |' with 'description: >-'
  // The content after is indented, keep same indentation, folded will handle.
  const before=txt;
  txt=txt.replace(/^description: \|/m,'description: >-');
  // Also ensure subsequent lines after description are indented by 2 spaces (they already are)
  if(txt!==before){
    fs.writeFileSync(fp,txt,'utf8');
    console.log('fixed',name);
    fixed++;
  }
}
console.log('fixed total',fixed);
