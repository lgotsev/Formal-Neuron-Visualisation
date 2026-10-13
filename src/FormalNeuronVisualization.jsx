import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, RefreshCw } from 'lucide-react';

const FormalNeuronVisualization = () => {
  const canvasRef = useRef(null);
  
  // Брой входове
  const [numInputs, setNumInputs] = useState(3);
  
  // Входни стойности
  const [inputs, setInputs] = useState([0.5, 0.8, 0.3]);
  
  // Тегла
  const [weights, setWeights] = useState([0.6, -0.4, 0.9]);
  
  // Bias
  const [bias, setBias] = useState(0.5);
  
  // Активационна функция
  const [activationFunction, setActivationFunction] = useState('sigmoid');
  
  // Изчислени стойности
  const weightedSum = inputs.reduce((sum, input, i) => sum + input * weights[i], 0);
  const netInput = weightedSum + bias;
  
  // Активационни функции
  const activations = {
    sigmoid: (x) => 1 / (1 + Math.exp(-x)),
    relu: (x) => Math.max(0, x),
    tanh: (x) => Math.tanh(x),
    linear: (x) => x,
    step: (x) => x >= 0 ? 1 : 0
  };
  
  const output = activations[activationFunction](netInput);
  
  // Добавяне на вход
  const addInput = () => {
    if (numInputs < 6) {
      setNumInputs(numInputs + 1);
      setInputs([...inputs, 0.5]);
      setWeights([...weights, 0.5]);
    }
  };
  
  // Премахване на вход
  const removeInput = () => {
    if (numInputs > 1) {
      setNumInputs(numInputs - 1);
      setInputs(inputs.slice(0, -1));
      setWeights(weights.slice(0, -1));
    }
  };
  
  // Рандомизация на параметрите
  const randomize = () => {
    setInputs(inputs.map(() => Math.random()));
    setWeights(weights.map(() => (Math.random() - 0.5) * 2));
    setBias((Math.random() - 0.5) * 2);
  };
  
  // Рисуване на неврона
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Позиции
    const inputX = 80;
    const sumX = 320;
    const activationX = 480;
    const outputX = 640;
    const centerY = height / 2;
    
    const inputSpacing = Math.min(80, 240 / numInputs);
    const startY = centerY - ((numInputs - 1) * inputSpacing) / 2;
    
    // Рисуване на връзките към суматора
    for (let i = 0; i < numInputs; i++) {
      const y = startY + i * inputSpacing;
      const weight = weights[i];
      
      // Цвят според знака на теглото
      const color = weight > 0 ? `rgba(0, 150, 255, ${Math.min(Math.abs(weight), 1)})` : `rgba(255, 100, 100, ${Math.min(Math.abs(weight), 1)})`;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.abs(weight) * 3 + 1;
      
      ctx.beginPath();
      ctx.moveTo(inputX + 25, y);
      ctx.lineTo(sumX - 35, centerY);
      ctx.stroke();
      
      // Показване на теглото
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`w${i + 1}=${weight.toFixed(2)}`, (inputX + sumX) / 2 - 20, y < centerY ? y + 15 : y - 5);
    }
    
    // Линия от bias към суматор
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(sumX - 40, centerY - 80);
    ctx.lineTo(sumX - 15, centerY - 20);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Bias етикет
    ctx.fillStyle = '#9333ea';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`bias=${bias.toFixed(2)}`, sumX - 40, centerY - 90);
    
    // Линия от суматор към активация
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sumX + 35, centerY);
    ctx.lineTo(activationX - 35, centerY);
    ctx.stroke();
    
    // Показване на net input
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`z=${netInput.toFixed(3)}`, (sumX + activationX) / 2, centerY - 10);
    
    // Линия от активация към изход
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(activationX + 35, centerY);
    ctx.lineTo(outputX - 25, centerY);
    ctx.stroke();
    
    // Показване на изхода
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`y=${output.toFixed(3)}`, (activationX + outputX) / 2, centerY - 10);
    
    // Рисуване на входните възли
    for (let i = 0; i < numInputs; i++) {
      const y = startY + i * inputSpacing;
      const value = inputs[i];
      
      ctx.fillStyle = `rgb(${Math.floor(value * 200 + 55)}, ${Math.floor(value * 200 + 55)}, 255)`;
      ctx.beginPath();
      ctx.arc(inputX, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#000';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`x${i + 1}`, inputX, y - 5);
      ctx.fillText(value.toFixed(2), inputX, y + 8);
    }
    
    // Рисуване на суматор (Σ)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sumX, centerY, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Σ', sumX, centerY + 10);
    
    // Рисуване на активационна функция
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(activationX, centerY, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('f(z)', activationX, centerY + 5);
    
    // Рисуване на изходен възел
    const intensity = Math.floor(Math.min(Math.max(output, 0), 1) * 200 + 55);
    ctx.fillStyle = `rgb(255, ${intensity}, ${intensity})`;
    ctx.beginPath();
    ctx.arc(outputX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('y', outputX, centerY + 4);
    
    // Етикети на компонентите
    ctx.fillStyle = '#666';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ВХОДОВЕ', inputX, 30);
    ctx.fillText('СУМАТОР', sumX, 30);
    ctx.fillText('АКТИВАЦИЯ', activationX, 30);
    ctx.fillText('ИЗХОД', outputX, 30);
    
  }, [inputs, weights, bias, numInputs, netInput, output, activationFunction]);
  
  // Графика на активационната функция
  const drawActivationGraph = () => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const y = activations[activationFunction](x);
      points.push({ x, y });
    }
    return points;
  };
  
  const activationPoints = drawActivationGraph();
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Формален изкуствен неврон
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Интерактивна визуализация на компонентите и математическите изчисления
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Контролен панел */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Параметри</h2>
            
            {/* Брой входове */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Брой входове: {numInputs}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={removeInput}
                  disabled={numInputs <= 1}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                  Премахни
                </button>
                <button
                  onClick={addInput}
                  disabled={numInputs >= 6}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Добави
                </button>
              </div>
            </div>
            
            {/* Входни стойности */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Входни стойности:</h3>
              <div className="space-y-2">
                {inputs.map((input, i) => (
                  <div key={i}>
                    <label className="block text-xs text-gray-600 mb-1">
                      x<sub>{i + 1}</sub> = {input.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={input}
                      onChange={(e) => {
                        const newInputs = [...inputs];
                        newInputs[i] = parseFloat(e.target.value);
                        setInputs(newInputs);
                      }}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Тегла */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Тегла:</h3>
              <div className="space-y-2">
                {weights.map((weight, i) => (
                  <div key={i}>
                    <label className="block text-xs text-gray-600 mb-1">
                      w<sub>{i + 1}</sub> = {weight.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={weight}
                      onChange={(e) => {
                        const newWeights = [...weights];
                        newWeights[i] = parseFloat(e.target.value);
                        setWeights(newWeights);
                      }}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bias */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bias (b) = {bias.toFixed(2)}
              </label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Активационна функция */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Активационна функция:
              </label>
              <select
                value={activationFunction}
                onChange={(e) => setActivationFunction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sigmoid">Sigmoid</option>
                <option value="relu">ReLU</option>
                <option value="tanh">Tanh</option>
                <option value="linear">Linear</option>
                <option value="step">Step (Heaviside)</option>
              </select>
            </div>
            
            {/* Бутон за рандомизация */}
            <button
              onClick={randomize}
              className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              Случайни стойности
            </button>
          </div>
          
          {/* Визуализация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Диаграма на неврона */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Структура на неврона</h2>
              <canvas
                ref={canvasRef}
                width={720}
                height={350}
                className="border border-gray-300 rounded-lg w-full"
              />
            </div>
            
            {/* Графика на активационната функция */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Активационна функция: {activationFunction}</h2>
              <svg width="100%" height="200" viewBox="-10 -10 520 220" className="border border-gray-300 rounded-lg bg-gray-50">
                {/* Оси */}
                <line x1="0" y1="100" x2="500" y2="100" stroke="#666" strokeWidth="1" />
                <line x1="250" y1="0" x2="250" y2="200" stroke="#666" strokeWidth="1" />
                
                {/* Етикети на осите */}
                <text x="490" y="95" fontSize="12" fill="#666">z</text>
                <text x="255" y="12" fontSize="12" fill="#666">f(z)</text>
                
                {/* Графика на функцията */}
                <polyline
                  points={activationPoints.map(p => `${250 + p.x * 40},${100 - p.y * 80}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                
                {/* Текуща стойност */}
                <circle
                  cx={250 + netInput * 40}
                  cy={100 - output * 80}
                  r="5"
                  fill="#ef4444"
                />
                <text
                  x={250 + netInput * 40 + 10}
                  y={100 - output * 80 - 10}
                  fontSize="12"
                  fill="#ef4444"
                  fontWeight="bold"
                >
                  ({netInput.toFixed(2)}, {output.toFixed(2)})
                </text>
                
                {/* Скала */}
                {[-2, -1, 0, 1, 2].map(val => (
                  <g key={val}>
                    <line x1={250 + val * 40} y1="98" x2={250 + val * 40} y2="102" stroke="#666" />
                    <text x={250 + val * 40} y="115" fontSize="10" fill="#666" textAnchor="middle">{val}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
        
        {/* Математически изчисления */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Математически изчисления</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Стъпка 1: Претеглена сума */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">1. Претеглена сума на входовете</h3>
              <div className="font-mono text-sm mb-2">
                Σ(x<sub>i</sub> × w<sub>i</sub>) = {inputs.map((input, i) => 
                  `${input.toFixed(2)} × ${weights[i].toFixed(2)}`
                ).join(' + ')}
              </div>
              <div className="font-mono text-sm mb-2">
                = {inputs.map((input, i) => 
                  (input * weights[i]).toFixed(3)
                ).join(' + ')}
              </div>
              <div className="font-mono text-sm font-bold text-blue-900">
                = {weightedSum.toFixed(3)}
              </div>
            </div>
            
            {/* Стъпка 2: Добавяне на bias */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">2. Добавяне на bias</h3>
              <div className="font-mono text-sm mb-2">
                z = Σ(x<sub>i</sub> × w<sub>i</sub>) + b
              </div>
              <div className="font-mono text-sm mb-2">
                z = {weightedSum.toFixed(3)} + {bias.toFixed(2)}
              </div>
              <div className="font-mono text-sm font-bold text-purple-900">
                z = {netInput.toFixed(3)}
              </div>
            </div>
            
            {/* Стъпка 3: Активационна функция */}
            <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
              <h3 className="font-medium text-green-800 mb-2">3. Прилагане на активационна функция</h3>
              <div className="font-mono text-sm mb-2">
                y = f(z) = {activationFunction}({netInput.toFixed(3)})
              </div>
              {activationFunction === 'sigmoid' && (
                <div className="font-mono text-sm mb-2">
                  y = 1 / (1 + e<sup>-{netInput.toFixed(3)}</sup>) = 1 / (1 + {Math.exp(-netInput).toFixed(3)})
                </div>
              )}
              {activationFunction === 'relu' && (
                <div className="font-mono text-sm mb-2">
                  y = max(0, {netInput.toFixed(3)})
                </div>
              )}
              {activationFunction === 'tanh' && (
                <div className="font-mono text-sm mb-2">
                  y = (e<sup>{netInput.toFixed(3)}</sup> - e<sup>-{netInput.toFixed(3)}</sup>) / (e<sup>{netInput.toFixed(3)}</sup> + e<sup>-{netInput.toFixed(3)}</sup>)
                </div>
              )}
              {activationFunction === 'step' && (
                <div className="font-mono text-sm mb-2">
                  y = {netInput.toFixed(3)} ≥ 0 ? 1 : 0
                </div>
              )}
              {activationFunction === 'linear' && (
                <div className="font-mono text-sm mb-2">
                  y = {netInput.toFixed(3)}
                </div>
              )}
              <div className="font-mono text-lg font-bold text-green-900">
                y = {output.toFixed(3)}
              </div>
            </div>
          </div>
          
          {/* Обяснение на компонентите */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium mb-3">Компоненти на формалния неврон:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-600">Входове (x<sub>i</sub>):</span>
                <p className="text-gray-700">Входни сигнали към неврона</p>
              </div>
              <div>
                <span className="font-medium text-green-600">Тегла (w<sub>i</sub>):</span>
                <p className="text-gray-700">Определят важността на всеки вход</p>
              </div>
              <div>
                <span className="font-medium text-purple-600">Bias (b):</span>
                <p className="text-gray-700">Праг на активация, изместване на функцията</p>
              </div>
              <div>
                <span className="font-medium text-yellow-600">Суматор (Σ):</span>
                <p className="text-gray-700">Изчислява претеглената сума на входовете</p>
              </div>
              <div>
                <span className="font-medium text-green-600">Активационна функция f(z):</span>
                <p className="text-gray-700">Въвежда нелинейност и определя изхода</p>
              </div>
              <div>
                <span className="font-medium text-red-600">Изход (y):</span>
                <p className="text-gray-700">Крайният сигнал от неврона</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalNeuronVisualization;