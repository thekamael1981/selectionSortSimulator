import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, SkipBack, SkipForward, Upload, RotateCcw, SortAsc, Keyboard, Eye, Gamepad2, Book, TrendingUp, Github, HelpCircle } from "lucide-react";

interface ArrayElement {
  value: number;
  index: number;
  state: 'sorted' | 'unsorted' | 'comparing' | 'swapping' | 'minimum';
}

interface SortStep {
  array: ArrayElement[];
  currentIndex: number;
  minIndex: number;
  comparing: number[];
  swapping: number[];
  description: string;
  sortedBoundary: number;
}

export default function SelectionSort() {
  const [inputValue, setInputValue] = useState("7, 8, 5, 10, 6, 3, 2, 4, 1, 9");
  const [originalArray, setOriginalArray] = useState<number[]>([7, 8, 5, 10, 6, 3, 2, 4, 1, 9]);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([3]);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [totalSwaps, setTotalSwaps] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate all steps for selection sort
  const generateSelectionSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const workingArray = [...arr];
    let comparisons = 0;
    let swaps = 0;

    // Initial state
    steps.push({
      array: workingArray.map((value, index) => ({
        value,
        index,
        state: 'unsorted'
      })),
      currentIndex: 0,
      minIndex: 0,
      comparing: [],
      swapping: [],
      description: "Initial array - all elements are unsorted",
      sortedBoundary: 0
    });

    for (let i = 0; i < workingArray.length - 1; i++) {
      let minIndex = i;
      
      // Show start of iteration
      steps.push({
        array: workingArray.map((value, index) => ({
          value,
          index,
          state: index < i ? 'sorted' : index === i ? 'comparing' : 'unsorted'
        })),
        currentIndex: i,
        minIndex: minIndex,
        comparing: [i],
        swapping: [],
        description: `Starting iteration ${i + 1}: Looking for minimum in unsorted section`,
        sortedBoundary: i
      });

      // Find minimum element in remaining unsorted array
      for (let j = i + 1; j < workingArray.length; j++) {
        comparisons++;
        
        // Show comparison
        steps.push({
          array: workingArray.map((value, index) => ({
            value,
            index,
            state: index < i ? 'sorted' : 
                   index === minIndex ? 'minimum' :
                   index === j ? 'comparing' : 'unsorted'
          })),
          currentIndex: i,
          minIndex: minIndex,
          comparing: [minIndex, j],
          swapping: [],
          description: `Comparing ${workingArray[j]} (index ${j}) with current minimum ${workingArray[minIndex]} (index ${minIndex})`,
          sortedBoundary: i
        });

        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j;
          
          // Show new minimum found
          steps.push({
            array: workingArray.map((value, index) => ({
              value,
              index,
              state: index < i ? 'sorted' : 
                     index === minIndex ? 'minimum' : 'unsorted'
            })),
            currentIndex: i,
            minIndex: minIndex,
            comparing: [],
            swapping: [],
            description: `New minimum found: ${workingArray[minIndex]} at index ${minIndex}`,
            sortedBoundary: i
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        swaps++;
        
        // Show swapping
        steps.push({
          array: workingArray.map((value, index) => ({
            value,
            index,
            state: index < i ? 'sorted' : 
                   index === i || index === minIndex ? 'swapping' : 'unsorted'
          })),
          currentIndex: i,
          minIndex: minIndex,
          comparing: [],
          swapping: [i, minIndex],
          description: `Swapping ${workingArray[i]} (index ${i}) with ${workingArray[minIndex]} (index ${minIndex})`,
          sortedBoundary: i
        });

        // Perform the swap
        [workingArray[i], workingArray[minIndex]] = [workingArray[minIndex], workingArray[i]];
      }

      // Show result after swap/no swap
      steps.push({
        array: workingArray.map((value, index) => ({
          value,
          index,
          state: index <= i ? 'sorted' : 'unsorted'
        })),
        currentIndex: i,
        minIndex: -1,
        comparing: [],
        swapping: [],
        description: `Element ${workingArray[i]} is now in its correct position. Sorted boundary moves to index ${i + 1}`,
        sortedBoundary: i + 1
      });
    }

    // Final state - all sorted
    steps.push({
      array: workingArray.map((value, index) => ({
        value,
        index,
        state: 'sorted'
      })),
      currentIndex: workingArray.length - 1,
      minIndex: -1,
      comparing: [],
      swapping: [],
      description: "Sorting complete! All elements are now in ascending order.",
      sortedBoundary: workingArray.length
    });

    setTotalComparisons(comparisons);
    setTotalSwaps(swaps);
    return steps;
  };

  const loadData = () => {
    try {
      const numbers = inputValue
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
        .map(s => {
          const num = parseInt(s);
          if (isNaN(num)) throw new Error(`"${s}" is not a valid number`);
          return num;
        });

      if (numbers.length === 0) {
        throw new Error("Please enter at least one number");
      }

      if (numbers.length > 20) {
        throw new Error("Please enter no more than 20 numbers for optimal visualization");
      }

      setOriginalArray(numbers);
      const newSteps = generateSelectionSortSteps(numbers);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Invalid input format. Please use comma-separated numbers.");
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setInputValue("7, 8, 5, 10, 6, 3, 2, 4, 1, 9");
    setOriginalArray([7, 8, 5, 10, 6, 3, 2, 4, 1, 9]);
    const newSteps = generateSelectionSortSteps([7, 8, 5, 10, 6, 3, 2, 4, 1, 9]);
    setSteps(newSteps);
  };

  const play = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsPlaying(true);
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      const delay = 3000 - (speed[0] - 1) * 500; // Speed 1 = 2500ms, Speed 5 = 500ms
      intervalRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, delay);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Initialize steps on component mount
  useEffect(() => {
    const initialSteps = generateSelectionSortSteps(originalArray);
    setSteps(initialSteps);
  }, []);

  const currentStep = steps[currentStepIndex];

  const getBarHeight = (value: number) => {
    if (!currentStep) return 80;
    const maxValue = Math.max(...currentStep.array.map(el => el.value));
    const minHeight = 60;
    const maxHeight = 200;
    return minHeight + ((value / maxValue) * (maxHeight - minHeight));
  };

  const getBarColor = (element: ArrayElement) => {
    switch (element.state) {
      case 'sorted': return 'bg-emerald-500';
      case 'comparing': return 'bg-amber-500 ring-2 ring-amber-300 animate-pulse';
      case 'swapping': return 'bg-red-500 ring-2 ring-red-300 animate-bounce';
      case 'minimum': return 'bg-blue-500 ring-2 ring-blue-300';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <SortAsc className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Selection Sort Visualizer</h1>
                <p className="text-sm text-slate-600">Interactive algorithm learning tool</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">
                  Step {currentStepIndex}
                </div>
                <div className="text-xs text-slate-500">
                  of {steps.length - 1} total
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Keyboard className="text-blue-600 mr-2" />
              Input Data
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="numberInput" className="block text-sm font-medium text-slate-700 mb-2">
                  Enter numbers separated by commas
                </label>
                <Input
                  id="numberInput"
                  type="text"
                  placeholder="7, 8, 5, 10, 6, 3, 2, 4, 1, 9"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">Example: 7, 8, 5, 10, 6, 3, 2, 4, 1, 9</p>
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex gap-3">
                  <Button onClick={loadData} className="flex-1">
                    <Upload className="mr-2 h-4 w-4" />
                    Load Data
                  </Button>
                  <Button onClick={reset} variant="secondary">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization Area */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <Eye className="text-blue-600 mr-2" />
                Algorithm Visualization
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span className="text-sm text-slate-600">Sorted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-slate-300 rounded"></div>
                  <span className="text-sm text-slate-600">Unsorted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span className="text-sm text-slate-600">Comparing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-slate-600">Swapping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-slate-600">Minimum</span>
                </div>
              </div>
            </div>

            {/* Array Visualization */}
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="flex flex-wrap gap-3 justify-center items-end min-h-[250px]">
                {currentStep?.array.map((element, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 transition-all duration-300 transform hover:scale-105">
                    <div 
                      className={`text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md min-w-[60px] text-center relative transition-all duration-300 ${getBarColor(element)}`}
                      style={{ height: `${getBarHeight(element.value)}px` }}
                    >
                      {element.value}
                      <div className="absolute -top-1 -right-1 bg-white text-slate-600 text-xs px-1 rounded-full shadow">
                        {index}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">Index {index}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Information */}
            {currentStep && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-1">
                      Step {currentStepIndex}: {currentStep.description.split(':')[0]}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {currentStep.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Gamepad2 className="text-blue-600 mr-2" />
              Controls
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Playback Controls */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Playback</h3>
                <div className="flex gap-3">
                  <Button 
                    onClick={play}
                    disabled={isPlaying || currentStepIndex >= steps.length - 1}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </Button>
                  <Button 
                    onClick={pause}
                    disabled={!isPlaying}
                    className="flex-1 bg-amber-600 hover:bg-amber-700"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                  <Button 
                    onClick={stop}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                </div>
              </div>

              {/* Step Controls */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Manual Stepping</h3>
                <div className="flex gap-3">
                  <Button 
                    onClick={prevStep}
                    disabled={currentStepIndex <= 0}
                    variant="secondary"
                    className="flex-1"
                  >
                    <SkipBack className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={nextStep}
                    disabled={currentStepIndex >= steps.length - 1}
                    className="flex-1"
                  >
                    <SkipForward className="mr-2 h-4 w-4" />
                    Next
                  </Button>
                </div>
              </div>
            </div>

            {/* Speed Control */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Animation Speed</h3>
              <div className="flex items-center space-x-4">
                <label className="text-xs text-slate-500">Slow</label>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  max={5}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <label className="text-xs text-slate-500">Fast</label>
                <div className="text-sm font-medium text-slate-700 min-w-[60px]">
                  Speed: {speed[0]}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Explanation */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Book className="text-blue-600 mr-2" />
              Algorithm Explanation
            </h2>
            
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h3 className="text-md font-semibold text-slate-800 mb-2">Selection Sort Steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                  <li>Divide the array into sorted (left) and unsorted (right) sections</li>
                  <li>Initially, sorted section is empty, unsorted section contains all elements</li>
                  <li>Find the smallest element in the unsorted section</li>
                  <li>Swap it with the first element of the unsorted section</li>
                  <li>Move the boundary between sorted and unsorted sections one position right</li>
                  <li>Repeat steps 3-5 until all elements are sorted</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    Advantages
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Simple to understand and implement</li>
                    <li>• In-place sorting (no extra memory needed)</li>
                    <li>• Consistent performance regardless of input</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">
                    Disadvantages
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• O(n²) time complexity</li>
                    <li>• Not stable (doesn't preserve relative order)</li>
                    <li>• More swaps compared to insertion sort</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <TrendingUp className="text-blue-600 mr-2" />
              Results & Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalComparisons}</div>
                <div className="text-sm text-blue-700">Total Comparisons</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totalSwaps}</div>
                <div className="text-sm text-green-700">Total Swaps</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">O(n²)</div>
                <div className="text-sm text-purple-700">Time Complexity</div>
              </div>
            </div>

            {/* Final Result Display */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-slate-800 mb-3">Current Array State:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentStep?.array.map((element, index) => (
                  <div 
                    key={index}
                    className={`text-white text-sm font-bold px-3 py-2 rounded shadow ${getBarColor(element)}`}
                  >
                    {element.value}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-3 text-center">
                Current state: <strong className="text-slate-800">
                  {currentStep?.array.map(el => el.value).join(', ')}
                </strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2024 Selection Sort Visualizer. Educational tool for algorithm learning.
            </p>
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <Github className="h-5 w-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
