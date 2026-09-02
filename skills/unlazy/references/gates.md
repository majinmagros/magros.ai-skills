# Gates — Formato Completo

> Fonte: https://github.com/Leonxlnx/unlazy — ver `references/gates.md` original.

Cada gate em `.unlazy/<scope>/GATES.md`:

```md
- [ ] G1 Título observável
  CHECK: node scripts/verify.mjs
  EXPECT: success
  EVIDENCE: pending
```

- `CHECK:` comando shell que prova o outcome
- `EXPECT:` substring ou `/regex/flags` que a saída deve conter
- `EVIDENCE:` prova registrada (shell, CWD, exit, fingerprint)

Validação: `node <skill>/scripts/gate-lint.mjs GATES.md`

Contado como UNMET se: checkbox `[ ]`, EVIDENCE `pending`, exit !=0, ou EXPECT não casar.

ABANDON: `ABANDON: G1 razão não vazia` → checker exit 1 HANDOFF REQUIRED.
