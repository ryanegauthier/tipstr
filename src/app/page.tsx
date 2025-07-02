'use client';

import { useState } from 'react';

const TIP_PERCENTAGES = [15, 18, 20, 22, 25, 30];

export default function TipstrApp() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (!billAmount || parseFloat(billAmount) <= 0) {
      alert('Please enter a valid bill amount first!');
      return;
    }

    setIsSpinning(true);
    setSelectedTip(null);

    // Generate random rotation (multiple full spins + random position)
    const randomIndex = Math.floor(Math.random() * TIP_PERCENTAGES.length);
    const segmentAngle = 360 / TIP_PERCENTAGES.length;
    const finalRotation = 360 * 5 + (randomIndex * segmentAngle); // 5 full spins + position
    
    setRotation(prev => prev + finalRotation);

    // Stop spinning after animation
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedTip(TIP_PERCENTAGES[randomIndex]);
    }, 3000);
  };

  const calculateTip = () => {
    if (!selectedTip || !billAmount) return 0;
    return (parseFloat(billAmount) * selectedTip) / 100;
  };

  const calculateTotal = () => {
    if (!billAmount) return 0;
    return parseFloat(billAmount) + calculateTip();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tipstr</h1>
          <p className="text-gray-600">Let your server spin their fortune!</p>
        </div>

        {/* Bill Amount Input */}
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Bill Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              step="0.01"
            />
          </div>
        </div>

        {/* Spinning Wheel */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-64 h-64 mb-6">
            {/* Wheel */}
            <div 
              className="w-full h-full rounded-full border-8 border-gray-800 relative overflow-hidden transition-transform duration-3000 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {TIP_PERCENTAGES.map((percentage, index) => {
                const segmentAngle = 360 / TIP_PERCENTAGES.length;
                const rotation = index * segmentAngle;
                const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
                
                return (
                  <div
                    key={percentage}
                    className={`absolute w-full h-full ${colors[index]} flex items-center justify-center`}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.sin((segmentAngle * Math.PI) / 180)}%)`
                    }}
                  >
                    <span 
                      className="text-white font-bold text-lg"
                      style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                    >
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gray-800"></div>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {isSpinning ? 'Spinning...' : 'Spin for Tip!'}
          </button>
        </div>

        {/* Results */}
        {selectedTip && billAmount && (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🎉 {selectedTip}% Tip!
            </h3>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Bill:</span>
                <span>${parseFloat(billAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip ({selectedTip}%):</span>
                <span>${calculateTip().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}