# FSRS Algorithm Reference (Validado via Context7)

## Library: ts-fsrs (`/open-spaced-repetition/ts-fsrs`)

### Installation
```bash
npm install ts-fsrs
# ou
pnpm add ts-fsrs
```

### Core API

```typescript
import { 
  fsrs,           // cria scheduler com parâmetros padrão
  fsrsDefault,    // parâmetros padrão (w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61])
  createEmptyCard,
  createCard,
  Rating,         // Again=1, Hard=2, Good=3, Easy=4
  Card,
  Scheduler
} from 'ts-fsrs';
```

### Basic Usage

```typescript
const scheduler = fsrs();  // ou fsrs({ parameters: customParams })
const card = createEmptyCard();  // novo card, due = agora

// Preview outcomes (sem modificar card)
const preview = scheduler.repeat(card, new Date());
// preview = { Again: { card, log }, Hard: {...}, Good: {...}, Easy: {...} }

// Aplicar rating após resposta do usuário
const result = scheduler.next(card, new Date(), Rating.Good);
// result = { card: Card, log: ReviewLog }

// Card atualizado tem:
// card.due = próxima data de revisão
// card.stability = estabilidade da memória (dias)
// card.difficulty = dificuldade do card
// card.elapsed_days = dias desde criação
// card.reps = número de revisões
// card.state = New | Learning | Review | Relearning
```

### Ratings Enum

```typescript
enum Rating {
  Again = 1,   // Errou completamente
  Hard = 2,    // Acertou com dificuldade
  Good = 3,    // Acertou normalmente  
  Easy = 4     // Acertou facilmente
}
```

### Complete Workflow

```typescript
import { fsrs, createEmptyCard, Rating, Card } from 'ts-fsrs';

class FlashcardManager {
  private scheduler = fsrs();
  private cards: Map<string, Card> = new Map();

  async addConcept(conceptId: string, question: string, answer: string) {
    const card = createEmptyCard();
    this.cards.set(conceptId, card);
    await this.saveCard(conceptId, card);
    // Criar no Anki via Anki-Connect
  }

  async review(conceptId: string, rating: Rating) {
    const card = this.cards.get(conceptId);
    if (!card) throw new Error('Card não encontrado');

    const result = this.scheduler.next(card, new Date(), rating);
    this.cards.set(conceptId, result.card);
    await this.saveCard(conceptId, result.card);
    
    // Atualizar Anki (opcional: sync due date)
    return {
      nextReview: result.card.due,
      stability: result.card.stability,
      difficulty: result.card.difficulty
    };
  }

  getDueCards(now: Date = new Date()): Card[] {
    return Array.from(this.cards.values()).filter(c => c.due <= now);
  }
}
```

### Card State Persistence

```typescript
// Serializar para JSON (salvar em progress.json)
const cardJson = JSON.stringify(card, (key, value) =>
  value instanceof Date ? value.toISOString() : value
);

// Deserializar
const card = JSON.parse(cardJson, (key, value) => {
  if (key === 'due' || key === 'last_review') return new Date(value);
  return value;
}) as Card;
```

### Custom Parameters (Opcional)

```typescript
// Parâmetros otimizados para domínio específico
const customParams = [
  0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 
  1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61
];

const scheduler = fsrs({ parameters: customParams });
```

### SM-2 Alternative (Legacy)

Se preferir SM-2 (algoritmo Anki original):

```typescript
interface SM2Card {
  easeFactor: number;      // default 2.5
  interval: number;        // dias
  repetitions: number;     // quantas vezes revisado
  dueDate: Date;
}

function sm2Review(card: SM2Card, quality: 0-5): SM2Card {
  // quality: 0=Again, 1=Hard, 2=Good, 3=Easy (mapeado do Rating)
  // Implementação padrão SM-2
}
```

**Recomendação:** Use **FSRS** — superior ao SM-2, parâmetros aprendidos de dados reais, melhor predição de retenção.

---

## Integração com Anki-Connect

```typescript
async function syncCardToAnki(conceptId: string, card: Card, deckName: string) {
  // Atualizar due date no Anki (se suportado pelo modelo)
  // Ou recriar card com novo agendamento
  // Nota: Anki-Connect não expõe due date diretamente
  // Workaround: usar filtered deck ou addNote com agendamento manual
}
```

---

## Referências Oficiais

- GitHub: https://github.com/open-spaced-repetition/ts-fsrs
- Context7 ID: `/open-spaced-repetition/ts-fsrs`
- Benchmark Score: 88.42
- Source Reputation: High
- Documentation: https://github.com/open-spaced-repetition/ts-fsrs/blob/main/README.md
- Paper: "Free Spaced Repetition Scheduler" (2023)