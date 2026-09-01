#!/usr/bin/env node
/**
 * generate-curriculum.ts — Gera currículo adaptativo a partir de fontes confiáveis.
 * 
 * Uso: npx ts-node scripts/generate-curriculum.ts <domain>
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, homedir } from 'node:path';

const PROGRESS_DIR = join(homedir(), 'ai-tutors');

interface CurriculumPhase {
  name: string;
  order: number;
  modules: CurriculumModule[];
  estimatedHours: number;
}

interface CurriculumModule {
  name: string;
  lessons: CurriculumLesson[];
}

interface CurriculumLesson {
  id: string;
  title: string;
  concepts: string[];
  estimatedMinutes: number;
}

interface Curriculum {
  domain: string;
  phases: CurriculumPhase[];
  totalEstimatedHours: number;
  generatedAt: string;
  sources: string[];
}

async function generateCurriculum(domain: string): Promise<Curriculum> {
  console.log(`🔍 Gerando currículo para: ${domain}`);
  
  // Fontes base por domínio (em produção, buscar via web_search)
  const domainSources: Record<string, string[]> = {
    cybersecurity: [
      'https://csrc.nist.gov/publications/detail/sp/800-12/final',
      'https://owasp.org/www-project-top-ten/',
      'MIT 6.858 Computer Systems Security (transcripts)',
      'Stanford CS251 Cryptocurrency (transcripts)'
    ],
    programming: [
      'MIT 6.0001 Introduction to Computer Science',
      'Stanford CS106A/B',
      'Harvard CS50'
    ],
    python: [
      'Python.org Official Tutorial',
      'Real Python Tutorials',
      'MIT 6.0001 (Python track)'
    ],
    german: [
      'Goethe Institut A1-C2 Curriculum',
      'Deutsche Welle Learn German',
      'FSI German Basic Course'
    ]
  };

  const sources = domainSources[domain] || [
    `Documentação oficial de ${domain}`,
    `Cursos MIT/Stanford/Harvard sobre ${domain}`,
    `Documentação técnica de ${domain}`
  ];

  // Estrutura padrão (em produção, LLM geraria isso)
  const curriculum: Curriculum = {
    domain,
    phases: getDefaultPhases(domain),
    totalEstimatedHours: 0,
    generatedAt: new Date().toISOString(),
    sources
  };

  // Calcular horas totais
  curriculum.totalEstimatedHours = curriculum.phases.reduce(
    (sum, p) => sum + p.estimatedHours, 0
  );

  return curriculum;
}

function getDefaultPhases(domain: string): CurriculumPhase[] {
  const phaseTemplates: Record<string, CurriculumPhase[]> = {
    cybersecurity: [
      { name: 'Fundamentos', order: 1, modules: [
        { name: 'Conceitos Básicos', lessons: [
          { id: '01', title: 'CIA Triad & Princípios', concepts: ['Confidencialidade', 'Integridade', 'Disponibilidade', 'Ameaças', 'Vulnerabilidades'], estimatedMinutes: 45 },
          { id: '02', title: 'Criptografia Básica', concepts: ['Simétrica', 'Assimétrica', 'Hash', 'Assinatura Digital'], estimatedMinutes: 60 },
          { id: '03', title: 'TLS/SSL & PKI', concepts: ['Handshake', 'Certificados', 'CA', 'Chain of Trust'], estimatedMinutes: 60 }
        ]},
        { name: 'Segurança de Redes', lessons: [
          { id: '04', title: 'Modelo OSI & TCP/IP', concepts: ['Camadas', 'Protocolos', 'Firewalls'], estimatedMinutes: 45 },
          { id: '05', title: 'VPN & Acesso Remoto', concepts: ['IPsec', 'WireGuard', 'Zero Trust'], estimatedMinutes: 45 }
        ]}
      ], estimatedHours: 8 },
      { name: 'Aplicações & Web', order: 2, modules: [
        { name: 'OWASP Top 10', lessons: [
          { id: '06', title: 'Injection & XSS', concepts: ['SQLi', 'XSS', 'CSRF', 'Prevenção'], estimatedMinutes: 60 },
          { id: '07', title: 'Auth & Session Mgmt', concepts: ['JWT', 'OAuth', 'MFA', 'Session Fixation'], estimatedMinutes: 60 }
        ]},
        { name: 'API Security', lessons: [
          { id: '08', title: 'REST/GraphQL Security', concepts: ['Rate Limiting', 'Input Validation', 'CORS'], estimatedMinutes: 45 }
        ]}
      ], estimatedHours: 6 },
      { name: 'Operações & Incident Response', order: 3, modules: [
        { name: 'Monitoramento & SIEM', lessons: [
          { id: '09', title: 'Logs & Detecção', concepts: ['SIEM', 'EDR', 'Threat Hunting'], estimatedMinutes: 60 }
        ]},
        { name: 'Incident Response', lessons: [
          { id: '10', title: 'Plano de Resposta', concepts: ['NIST 800-61', 'Contenção', 'Erradicação', 'Recuperação'], estimatedMinutes: 60 }
        ]}
      ], estimatedHours: 6 }
    ],
    programming: [
      { name: 'Fundamentos', order: 1, modules: [
        { name: 'Lógica & Algoritmos', lessons: [
          { id: '01', title: 'Variáveis & Tipos', concepts: ['Inteiros', 'Float', 'String', 'Boolean'], estimatedMinutes: 45 },
          { id: '02', title: 'Controle de Fluxo', concepts: ['If/Else', 'Loops', 'Switch'], estimatedMinutes: 45 },
          { id: '03', title: 'Funções & Escopo', concepts: ['Parâmetros', 'Retorno', 'Closure'], estimatedMinutes: 45 }
        ]},
        { name: 'Estruturas de Dados', lessons: [
          { id: '04', title: 'Arrays & Listas', concepts: ['Indexação', 'Iteração', 'Métodos'], estimatedMinutes: 45 },
          { id: '05', title: 'Objetos & Maps', concepts: ['Chave-Valor', 'Hash Tables'], estimatedMinutes: 45 }
        ]}
      ], estimatedHours: 8 },
      { name: 'Paradigmas', order: 2, modules: [
        { name: 'OOP', lessons: [
          { id: '06', title: 'Classes & Herança', concepts: ['Encapsulamento', 'Polimorfismo', 'Composição'], estimatedMinutes: 60 },
          { id: '07', title: 'Padrões de Projeto', concepts: ['Singleton', 'Factory', 'Observer'], estimatedMinutes: 60 }
        ]},
        { name: 'Funcional', lessons: [
          { id: '08', title: 'Imutabilidade & Pure Functions', concepts: ['Map/Filter/Reduce', 'Monads'], estimatedMinutes: 45 }
        ]}
      ], estimatedHours: 6 }
    ],
    german: [
      { name: 'A1 - Iniciante', order: 1, modules: [
        { name: 'Básico', lessons: [
          { id: '01', title: 'Alfabeto & Pronúncia', concepts: ['Vogais', 'Consoantes', 'Umlauts'], estimatedMinutes: 30 },
          { id: '02', title: 'Apresentação Pessoal', concepts: ['Ich heiße', 'Ich komme aus', 'Ich bin'], estimatedMinutes: 45 },
          { id: '03', title: 'Números & Tempo', concepts: ['1-100', 'Horas', 'Datas'], estimatedMinutes: 45 }
        ]},
        { name: 'Cotidiano', lessons: [
          { id: '04', title: 'Compras & Restaurante', concepts: ['Artikel', 'Preise', 'Bestellen'], estimatedMinutes: 45 },
          { id: '05', title: 'Direções & Transporte', concepts: ['Wo ist', 'Links/Rechts', 'ÖPNV'], estimatedMinutes: 45 }
        ]}
      ], estimatedHours: 10 },
      { name: 'A2 - Básico', order: 2, modules: [
        { name: 'Gramática Essencial', lessons: [
          { id: '06', title: 'Casos (Nominativ/Akkusativ)', concepts: ['Artikel', 'Präpositionen'], estimatedMinutes: 60 },
          { id: '07', title: 'Perfekt & Präteritum', concepts: ['Partizip II', 'Verbos irregulares'], estimatedMinutes: 60 }
        ]}
      ], estimatedHours: 10 }
    ]
  };

  return phaseTemplates[domain] || [{
    name: 'Fase 1',
    order: 1,
    modules: [{
      name: 'Módulo 1',
      lessons: [
        { id: '01', title: `Introdução a ${domain}`, concepts: [`Conceito 1`, `Conceito 2`], estimatedMinutes: 45 }
      ]
    }],
    estimatedHours: 4
  }];
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Uso: npx ts-node scripts/generate-curriculum.ts <domain>');
    process.exit(1);
  }

  const domain = args[0];
  const domainDir = join(homedir(), 'ai-tutors', domain);

  if (!existsSync(join(domainDir, 'config.json'))) {
    console.error(`❌ Domínio "${domain}" não configurado. Rode setup-tutor primeiro.`);
    process.exit(1);
  }

  const curriculum = await generateCurriculum(domain);
  const outputPath = join(domainDir, 'curriculum.json');
  writeFileSync(outputPath, JSON.stringify(curriculum, null, 2), 'utf8');

  console.log(`✅ Currículo salvo: ${outputPath}`);
  console.log(`📚 ${curriculum.phases.length} fases, ${curriculum.totalEstimatedHours}h estimadas`);
  console.log(`📖 Fontes: ${curriculum.sources.length}`);
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});