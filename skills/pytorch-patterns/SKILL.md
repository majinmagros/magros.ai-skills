---
name: pytorch-patterns
description: "Use when pyTorch deep learning patterns and best practices for building robust, efficient, and reproducible training pipelines, model architectures, and data loading. Triggers on \"pytorch-patterns\", \"pytorch patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# PyTorch Development Patterns

Idiomatic PyTorch patterns and best practices for building robust, efficient, and reproducible deep learning applications.

## When to Activate

- Writing new PyTorch models or training scripts
- Reviewing deep learning code
- Debugging training loops or data pipelines
- Optimizing GPU memory usage or training speed
- Setting up reproducible experiments

## Core Principles

### 1. Device-Agnostic Code

Always write code that works on both CPU and GPU without hardcoding devices.

```python
# Good: Device-agnostic
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MyModel().to(device)
data = data.to(device)

# Bad: Hardcoded device
model = MyModel().cuda()  # Crashes if no GPU
data = data.cuda()
```

### 2. Reproducibility First

Set all random seeds for reproducible results.

```python
# Good: Full reproducibility setup
def set_seed(seed: int = 42) -> None:
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)
    random.seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Bad: No seed control
model = MyModel()  # Different weights every run
```

### 3. Explicit Shape Management

Always document and verify tensor shapes.

```python
# Good: Shape-annotated forward pass
def forward(self, x: torch.Tensor) -> torch.Tensor:
    # x: (batch_size, channels, height, width)
    x = self.conv1(x)    # -> (batch_size, 32, H, W)
    x = self.pool(x)     # -> (batch_size, 32, H//2, W//2)
    x = x.view(x.size(0), -1)  # -> (batch_size, 32*H//2*W//2)