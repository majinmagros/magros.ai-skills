# Vidu S1 Available Voices & Languages

---

## Default Voices (avatar.voice)

| Voice | Description | Language |
|---|---|---|
| Tina | Default female voice | Multi |
| ... | Outras vozes padrão documentadas no Console | Multi |

**Fonte oficial:** [Available Voice List](https://shengshu.feishu.cn/wiki/MD2XwciyHiOMnskpul0cP6iOnyR?from=from_copylink)

---

## Voice Clone Languages (POST /live/v1/voices/clone)

### Idiomas Principais (16)

| Código | Idioma |
|---|---|
| zh | Chinese |
| en | English |
| de | German |
| it | Italian |
| pt | Portuguese |
| es | Spanish |
| ja | Japanese |
| ko | Korean |
| fr | French |
| ru | Russian |
| th | Thai |
| id | Indonesian |
| ar | Arabic |
| cs | Czech |
| da | Danish |
| nl | Dutch |
| fi | Finnish |
| he | Hebrew |
| hi | Hindi |
| is | Icelandic |
| ms | Malay |
| no | Norwegian |
| fa | Persian |
| pl | Polish |
| sv | Swedish |
| tl | Tagalog |
| tr | Turkish |
| ur | Urdu |
| vi | Vietnamese |

### Dialetos Chineses

| Dialeto | Região |
|---|---|
| Dongbei | Northeast China |
| Shaanxi | Shaanxi Province |
| Sichuan | Sichuan Province |
| Henan | Henan Province |
| Changsha | Hunan Province |
| Tianjin | Tianjin Municipality |
| Hangzhou | Zhejiang Province |
| Liaoning | Liaoning Province |
| Shenyang | Liaoning Province |
| Anshan | Liaoning Province |

---

## Requisitos de Áudio de Referência (Voice Clone)

| Parâmetro | Especificação |
|---|---|
| Formatos | WAV (16-bit), MP3, M4A |
| Duração recomendada | 10-20 segundos |
| Duração máxima | 60 segundos |
| Tamanho máximo | 10 MB |
| Transcrição (text) | **Obrigatório** - deve match EXATO do áudio |
| language | Código do idioma (ex: "pt", "en", "zh") |

---

## Exemplo: Clone Voz PT-BR

```json
{
  "audio_url": "https://storage.seu-app.com/jarvis_ref.wav",
  "voice": "jarvis_dj_br",
  "text": "Bora pro set, galera! Essa vai ser a melhor noite de todas.",
  "language": "pt"
}
```

**Nota:** Para melhor qualidade em PT-BR, use áudio de referência **em português**. Cross-lingual funciona mas pode vazar sotaque.