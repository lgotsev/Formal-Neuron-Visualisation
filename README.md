# Формален изкуствен неврон

Интерактивна образователна визуализация на формален (изкуствен) неврон: входове, тегла, bias, суматор, активационна функция и стъпка по стъпка математически изчисления.

## Възможности

- 1–6 входа с настройваеми стойности x₁…xₙ
- Тегла w₁…wₙ и bias b, задавани със слайдери
- Активационни функции: Sigmoid, ReLU, Tanh, Linear, Step (Heaviside)
- Графика на активационната функция с текущата точка (z, f(z))
- Изчисления: Σ(xᵢ·wᵢ) → z = Σ + b → y = f(z)

## Локално стартиране

Изисква Node.js 18+.

```bash
npm install
npm run dev
```

Приложението се отваря на http://localhost:5173

## Деплойване във Vercel

1. Качете проекта в GitHub репозитори:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<потребител>/formal-neuron.git
   git push -u origin main
   ```
2. Във [vercel.com](https://vercel.com) → **Add New… → Project** → изберете репозиторито.
3. Vercel разпознава Vite автоматично (настройките са и във `vercel.json`):
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Натиснете **Deploy**. Всеки следващ `git push` към `main` деплойва нова версия.

## Технологии

React 18 · Vite · Tailwind CSS · lucide-react

## Структура

```
formal-neuron/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── public/neuron.svg
└── src/
    ├── main.jsx
    ├── index.css
    └── FormalNeuronVisualization.jsx
```
