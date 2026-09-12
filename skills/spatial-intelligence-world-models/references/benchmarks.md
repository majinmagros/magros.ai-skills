# Spatial Reasoning Benchmarks

## Standardized Task Suite

| Benchmark | Description | Metric | Target |
|-----------|-------------|--------|--------|
| **Object Permanence** | Track objects through occlusion | Accuracy % | ≥ 90% |
| **Physics Prediction** | Predict object trajectories under forces | MSE vs ground truth | ≤ 0.05 |
| **Affordance Detection** | Identify graspable regions, pushable surfaces | IoU vs human labels | ≥ 0.75 |
| **Novel View Synthesis** | Render unseen viewpoints | PSNR / LPIPS | ≥ 28 dB / ≤ 0.15 |
| **Multi-step Planning** | Plan 5+ step manipulation tasks | Success rate | ≥ 80% |
| **Sim-to-Real Transfer** | Execute planned trajectory on real robot | Real-world success | ≥ 70% |

## Benchmark Execution Flow

```python
# Pseudocode for benchmark runner
def run_spatial_benchmark(model_api, benchmark_name, num_trials=100):
    results = []
    for trial in range(num_trials):
        task = load_benchmark_task(benchmark_name, trial)
        prediction = model_api.spatial_reason(task.scene, task.query)
        score = evaluate(task.ground_truth, prediction)
        results.append(score)
    return aggregate(results)
```
