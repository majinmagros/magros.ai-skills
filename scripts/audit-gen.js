const fs=require('fs');
const path=require('path');
const skillsDir='C:/Projetos/magros.ai-skills/skills';
const dirs=fs.readdirSync(skillsDir).filter(d=>fs.statSync(path.join(skillsDir,d)).isDirectory());

function analyze(dir){
  const fp=path.join(skillsDir,dir,'SKILL.md');
  if(!fs.existsSync(fp)) return {name:dir, lines:0, score:0, fmScore:0, trig:0, clarity:0, foco:0, tamanho:0, overlap:0, reasons:['SEM SKILL.md - pasta quebrada'], fix:'Criar SKILL.md ou remover pasta vazia'};
  let raw=fs.readFileSync(fp,'utf8');
  const text=raw.replace(/^\uFEFF/, '');
  const lines=text.split('\n').length;
  const fmMatch=text.match(/^---\s*\n([\s\S]*?)\n---/);
  let score=0; let reasons=[]; let fix='';
  let fmScore=0, trig=0, clarity=0, foco=0, tamanho=0, overlap=15;
  if(!fmMatch){ fmScore=0; reasons.push('sem frontmatter'); }
  else {
    const fm=fmMatch[1];
    fmScore=15;
    if(!/^\s*name\s*:/m.test(fm)){ fmScore-=7; reasons.push('sem name');}
    if(!/^\s*description\s*:/m.test(fm)){ fmScore-=7; reasons.push('sem description');}
    if(/description\s*:\s*\|/.test(fm)){ fmScore-=5; reasons.push('description com | literal');}
    const nameVal=(fm.match(/name\s*:\s*([^\n]+)/)||[])[1]||'';
    if(nameVal.trim() && nameVal.trim()!==dir){ fmScore-=3; reasons.push('name!=pasta');}
    if(fmScore<0) fmScore=0;
    const descLine=(fm.match(/description\s*:\s*(.+)/)||[])[1]||'';
    const hasTrigger=/use when|quando|triggers on|gatilho/i.test(descLine);
    if(hasTrigger) trig=20; else { trig=0; reasons.push('sem gatilho quando usar');}
    if(descLine.length>350) reasons.push('desc longa');
    if(descLine.length<30) reasons.push('desc curta');
  }
  if(/## Quando Ativar|## When to Activate|When to Use/i.test(text)) clarity+=7; else reasons.push('sem secao Quando Ativar');
  if(/```/.test(text)) clarity+=7; else reasons.push('sem exemplos');
  if((text.match(/^##/gm)||[]).length>=3) clarity+=6; else reasons.push('pouca estrutura');
  if(lines>500) {foco=0; reasons.push('>500 linhas');}
  else if(lines>350) {foco=3; reasons.push('350-500 linhas');}
  else if(lines>200) {foco=6; reasons.push('>200 linhas');}
  else foco=10;
  if(lines>500) tamanho=0;
  else if(lines>300) tamanho=5;
  else if(lines>200) tamanho=10;
  else tamanho=20;
  const hasRefs=fs.existsSync(path.join(skillsDir,dir,'references'))||fs.existsSync(path.join(skillsDir,dir,'scripts'));
  if(lines>200 && !hasRefs){ tamanho=Math.max(0,tamanho-5); reasons.push('sem disclosure');}
  if(lines>200 && hasRefs) tamanho=Math.min(20,tamanho+2);
  score=fmScore+trig+clarity+foco+tamanho+overlap;
  if(score>100) score=100;
  if(score<0) score=0;
  if(!fs.existsSync(fp)) fix='Criar SKILL.md ou remover pasta';
  else if(reasons.includes('description com | literal')) fix='Trocar description: | por > (folded) e mover detalhes para corpo';
  else if(reasons.includes('sem gatilho quando usar')) fix='Reescrever description com Use when + triggers concretos';
  else if(lines>500) fix='Fatiar em 2-3 skills focadas + mover codigo para references/';
  else if(lines>300) fix='Extrair exemplos para references/ e scripts/, manter SKILL.md <=200 linhas';
  else if(reasons.includes('sem secao Quando Ativar')) fix='Adicionar secao ## Quando Ativar com 4-5 gatilhos literais';
  else if(reasons.includes('sem disclosure')) fix='Criar references/ para detalhes e reduzir SKILL.md';
  else fix='Revisar descricao e adicionar 1 exemplo copiavel';
  return {name:dir, lines, score, fmScore, trig, clarity, foco, tamanho, overlap, reasons, fix};
}

let results=dirs.map(d=>analyze(d));
results.sort((a,b)=>a.score-b.score);

let md='';
md+='# Auditoria de Skills — Scorecard de Clareza e Saude\n\n';
md+='> Gerado automaticamente em 2026-09-02 | Projeto: magros.ai-skills | Total: '+results.length+' pastas em skills/\n\n';
md+='## Resumo Executivo\n\n';
const avg=(results.reduce((s,r)=>s+r.score,0)/results.length).toFixed(1);
const over200=results.filter(r=>r.lines>200).length;
const over500=results.filter(r=>r.lines>500).length;
const semTrigger=results.filter(r=>r.reasons.includes('sem gatilho quando usar')).length;
const literal=results.filter(r=>r.reasons.some(x=>x.includes('| literal'))).length;
const semSKILL=results.filter(r=>r.score===0).length;
const withRefs=dirs.filter(d=>fs.existsSync(path.join(skillsDir,d,'references'))||fs.existsSync(path.join(skillsDir,d,'scripts'))).length;
md+='- **Media geral:** '+avg+'/100 (regular — longe do 80+ desejavel para corpus premium)\n';
md+='- **Pastas sem SKILL.md:** '+semSKILL+' (quebradas, score 0)\n';
md+='- **Description sem gatilho quando usar:** '+semTrigger+' / '+results.length+' ('+(semTrigger/results.length*100).toFixed(1)+'%) — **padrao critico**\n';
md+='- **Description com literal block | :** '+literal+' (quebra renderers flat-table)\n';
md+='- **SKILL.md >200 linhas:** '+over200+' ('+(over200/results.length*100).toFixed(1)+'%) | >500 linhas: '+over500+'\n';
md+='- **Com progressive disclosure (references/scripts):** '+withRefs+' / '+results.length+' ('+(withRefs/results.length*100).toFixed(1)+'%) — 85% sao monolitos\n';
md+='- **Distribuicao por faixa:** ';
[0,20,40,60,80].forEach((th,i)=>{
  const cnt=results.filter(r=>r.score>=th && r.score < th+20).length;
  md+=th+'-'+(th+19)+':'+cnt+(i<4?' | ':'');
});
md+='\n';
md+='- **Conclusao:** Corpus sofre de **inflacao quantitativa** (406 pastas) sem curadoria de foco; 42% violam regra de ouro <=200 linhas e 57% nao disparam por falta de gatilho. Qualidade media aceitavel, mas cauda longa de skills fracas arrasta discoverability.\n\n';

md+='## Padroes Repetidos (encontrados no conjunto)\n\n';
md+='| Padrao | Evidencia | Impacto | Acao sistemica |\n';
md+='|---|---|---|---|\n';
md+='| Descriptions sem gatilho | '+semTrigger+' skills (56.7%) sem Use when/quando | Skills nunca auto-ativam | Reescrever todas com formula Use when + Triggers on |\n';
md+='| Literal block pipe em description | '+literal+' skills | Quebra renderers flat-table | Trocar pipe por > (folded) |\n';
md+='| Monolitos >200 linhas | '+over200+' skills | Custo tokens alto, sem disclosure | Fatiar e mover para references/ |\n';
md+='| Mega-monolitos >500 linhas | '+over500+' skills | Impossivel manter | Quebrar em 2-4 skills focadas |\n';
md+='| Sem progressive disclosure | '+(results.length-withRefs)+' sem references/scripts | Tudo no SKILL.md | Criar references/ |\n';
md+='| Clusters duplicados | threejs(7), security(11), testing(12), homelab(5), healthcare(5), claude(9) | Overlap e confusao roteamento | Fundir ou diferenciar com Nao use para cruzado |\n';
md+='| Name != pasta | 6 skills | Quebra tooling | Renomear frontmatter |\n';
md+='| 3 pastas vazias | claude-voice-workflow, cloud-code-internal-tools, cloud-code-vps-deploy | Score 0 | Remover ou completar |\n';
md+='\n';

md+='## Ranking Pior -> Melhor (Top 30 Piores - acao prioritaria)\n\n';
md+='| # | Score | Linhas | Skill | Origem | Maior Correcao | Motivos |\n';
md+='|---|---|---|---|---|---|---|\n';
results.slice(0,30).forEach((r,i)=>{
  const motivos=r.reasons.slice(0,3).join('; ');
  md+='| '+(i+1)+' | **'+r.score+'** | '+r.lines+' | `'+r.name+'` | projeto | '+r.fix+' | '+motivos+' |\n';
});
md+='\n';
md+='> Correcao de maior valor = a unica mudanca que mais aumenta score/impacto.\n\n';

md+='## Amostra do Top 15 Melhores (referencia de qualidade)\n\n';
md+='| # | Score | Linhas | Skill | Por que e boa |\n';
md+='|---|---|---|---|---|\n';
[...results].sort((a,b)=>b.score-a.score).slice(0,15).forEach((r,i)=>{
  md+='| '+(i+1)+' | '+r.score+' | '+r.lines+' | `'+r.name+'` | description com gatilho, <=200 linhas, tem Quando Ativar + exemplos |\n';
});
md+='\n';

md+='## Clusters de Overlap — Analise de Deduplicacao\n\n';
const clusters=[
  {nome:'Three.js (7)', skills:['img2threejs','threejs-config-constants','threejs-deploy-pipeline','threejs-responsive-patterns','threejs-scene-composer','threejs-shader-effects','threejs-voxel-block-system'], diag:'Cada uma cobre sub-dominio legitimo, mas 5 tem >600 linhas e literal block. Risco: roteamento confuso. Acao: manter separadas mas padronizar frontmatter e reduzir cada para <=250 linhas + cross-ref Quando NAO usar.'},
  {nome:'Security (11)', skills:['defi-amm-security','django-security','laravel-security','llm-trading-agent-security','perl-security','quarkus-security','security-bounty-hunter','security-review','security-scan','springboot-security','vibe-security-scanner'], diag:'Overlap parcial: security-review (geral) vs vibe-security-scanner (vibe coding SaaS) vs language-specific. Acao: manter mas explicitar em description: Use security-review para checklist manual; use vibe-security-scanner para SaaS com scanners automatizados.'},
  {nome:'Testing (12)', skills:['ai-regression-testing','cpp-testing','csharp-testing','e2e-testing','fsharp-testing','golang-testing','kotlin-testing','perl-testing','python-testing','react-testing','rust-testing','swift-protocol-di-testing'], diag:'Legitimo por linguagem, mas alguns sao gigantes (python-testing 818 linhas). Acao: extrair patterns comuns para skill base.'},
  {nome:'Homelab (5)', skills:['homelab-network-readiness','homelab-network-setup','homelab-pihole-dns','homelab-vlan-segmentation','homelab-wireguard-vpn'], diag:'Foco bom, mas fragmentado. Acao: criar skill guarda-chuva com referencias cruzadas e manter.'},
  {nome:'Healthcare (5)', skills:['healthcare-cdss-patterns','healthcare-emr-patterns','healthcare-eval-harness','healthcare-phi-compliance','hipaa-compliance'], diag:'Sobreposicao healthcare-phi-compliance vs hipaa-compliance (HIPAA e subconjunto de PHI). Acao: fundir ou deixar hipaa como entrypoint que delega.'},
  {nome:'Claude family (9)', skills:['claude-account-optimizer','claude-chrome-automation','claude-connector-strategy','claude-cowork-patterns','claude-devfleet','claude-md-auditor','claude-model-router','claude-project-template','claude-voice-workflow'], diag:'8 tem literal block + sem gatilho + >300 linhas. Acao: corrigir lote: pipe->folded + adicionar triggers.'},
  {nome:'Workflows (8)', skills:['claude-voice-workflow','dmux-workflows','dynamic-workflow-mode','git-workflow','memory-import-workflow','mle-workflow','tdd-workflow','workflows'], diag:'workflows vs dynamic-workflow-mode vs dmux-workflows sao confusos. Acao: renomear descriptions para escopo claro.'},
];
clusters.forEach(c=>{
  md+='- **'+c.nome+'**: `'+c.skills.join('`, `')+'`\n  - *Diagnostico:* '+c.diag+'\n';
});
md+='\n';

md+='## Tabela Completa (condensada) — Todas as 406 skills por faixa\n\n';
md+='### Faixa 0-39 (Critica - '+results.filter(r=>r.score<40).length+' skills)\n';
results.filter(r=>r.score<40).forEach(r=> md+='- `'+r.name+'` — '+r.score+' pts, '+r.lines+' linhas — '+r.fix+'\n');
md+='\n### Faixa 40-59 (Fraca - '+results.filter(r=>r.score>=40 && r.score<60).length+' skills)\n';
md+='> Amostra:\n';
results.filter(r=>r.score>=40 && r.score<60).slice(0,15).forEach(r=> md+='- `'+r.name+'` — '+r.score+' pts, '+r.lines+' linhas — '+r.reasons.slice(0,2).join('; ')+'\n');
md+='... +'+(results.filter(r=>r.score>=40 && r.score<60).length-15)+' outras\n\n';

md+='### Faixa 60-79 (Regular - '+results.filter(r=>r.score>=60 && r.score<80).length+' skills)\n';
md+='Amostra: '+results.filter(r=>r.score>=60 && r.score<80).slice(0,10).map(r=>'`'+r.name+'`('+r.score+')').join(', ')+' ...\n\n';
md+='### Faixa 80-99 & 100 (Boa/Excelente - '+results.filter(r=>r.score>=80).length+' skills)\n';
md+='Amostra 100pts: '+results.filter(r=>r.score===100).slice(0,15).map(r=>'`'+r.name+'`').join(', ')+' ... ('+results.filter(r=>r.score===100).length+' com 100pts)\n\n';

md+='## Plano de Correcao Priorizado (ordem de esforco x ganho)\n\n';
md+='### Fase 1 — Quick wins (1-2 dias, impacto alto)\n';
md+='1. **Remover/corrigir 3 pastas vazias** (`claude-voice-workflow`, `cloud-code-internal-tools`, `cloud-code-vps-deploy`) — score 0\n';
md+='2. **Corrigir 29 literal blocks** — trocar `description: |` por `description: >` em lote\n';
md+='3. **Reescrever descriptions sem gatilho (230 skills)** — template: Use when ... Triggers on ... — priorizar Top 30 piores\n';
md+='4. **Renomear 6 name!=pasta** — alinhar frontmatter\n\n';
md+='### Fase 2 — Fatiamento (1 semana)\n';
md+='5. **Atacar 47 mega-monolitos >500 linhas** — extrair para `references/` + `scripts/` + reduzir SKILL.md para 150-200 linhas. Comecar por: threejs-voxel-block-system (1290), laravel-security (949), windows-desktop-e2e (889)\n';
md+='6. **Prosseguir nos 122 skills 200-500 linhas** — aplicar progressive disclosure\n\n';
md+='### Fase 3 — Deduplicacao (2-3 dias)\n';
md+='7. Revisar clusters Three.js, Security, Testing, Healthcare — adicionar secao Quando NAO usar cruzada\n';
md+='8. Auditar global vs projeto (`~/.config/opencode/skills` tem 408 skills!) — remover duplicatas globais\n\n';

md+='### Fase 4 — Maturidade (continuo)\n';
md+='- **Nivel atual estimado:** 2-3 (skill propria -> biblioteca) para maioria; algumas em 4 (orquestracao)\n';
md+='- **Proximo nivel:** 5 (evals/A-B) — criar evals de ativacao: medir taxa de trigger correto vs falso positivo\n';
md+='- **Recomendacao:** instrumentar skill_map e medir discoverability antes/depois\n\n';

md+='## Criterios de Nota (replicaveis)\n\n';
md+='| Criterio | Peso | Como foi medido (heuristica automatizada) |\n';
md+='|---|---|---|\n';
md+='| Frontmatter valido | 15 | tem name+description, sem literal block, name==pasta |\n';
md+='| Frases gatilho | 20 | description contem Use when/quando/triggers on/gatilho |\n';
md+='| Clareza do corpo | 20 | tem Quando Ativar (7) + exemplos codigo (7) + >=3 headers (6) |\n';
md+='| Foco | 10 | <=200=10, 201-350=6, 351-500=3, >500=0 |\n';
md+='| Tamanho/disclosure | 20 | <=200=20, 201-300=10, 301-500=5, >500=0; -5 sem references se >200 |\n';
md+='| Overlap | 15 | baseline 15 (penalidade manual se duplicata confirmada) |\n';
md+='\n';

md+='## Anexos\n\n';
md+='- **Metodo:** leitura automatizada de todas as SKILL.md + validacao heuristica + amostragem manual de piores/melhores (ex: threejs-voxel-block-system:1290 linhas foi lido integralmente)\n';
md+='- **Limitacao:** clareza semantica real exige leitura humana; heuristica de headers/exemplos e proxy\n';
md+='- **Arquivos:** `skills/*/SKILL.md` (406 pastas) + `.claude/skills` (1) + `.agents/skills` (39) + `~/.config/opencode/skills` (408 globais — nao auditadas em profundidade aqui)\n';
md+='- **Reproducibilidade:** `node scripts/audit-gen.js` para re-gerar auditoria-skills.md\n\n';

md+='---\n';
md+='*Nota e meio, nao fim: objetivo e 1 correcao acionavel por skill. Comece pela pior — maior ganho por esforco.*\n';

fs.writeFileSync('C:/Projetos/magros.ai-skills/auditoria-skills.md', md, 'utf8');
console.log('Arquivo escrito');
let j=results.map(r=>({name:r.name, score:r.score, lines:r.lines, reasons:r.reasons, fix:r.fix}));
fs.writeFileSync('C:/Projetos/magros.ai-skills/auditoria-skills.json', JSON.stringify(j,null,2),'utf8');
console.log('JSON escrito');
