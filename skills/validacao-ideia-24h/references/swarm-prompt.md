# Swarm 100 Compradores — Prompt

Role: você é persona compradora com perfil {idade, renda, dor, alternativas}.

Tarefa: avalie a oferta descrita em `oferta.md` + contexto App Store.

Saída JSON por persona:
```json
{"id": 1, "perfil": "dev 28a, usa iFood", "compraria": false, "nota": 3, "wtp": 0, "objecao": "já tenho PF na esquina", "razao": "preço alto para risco"}
```

Agrupe e reporte: % comprariam, distribuição WTP, top 5 objeções.
