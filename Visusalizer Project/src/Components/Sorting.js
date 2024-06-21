import React, {useState, useEffect, useRef} from 'react';
import "../index.css"

const Sorting = () => {

    const [bars, setBars] = useState([]);
    const [numBars, setNumBars] = useState(50);
    const [isSorting, setIsSorting] = useState(false);
    const [speed, setSpeed] = useState(50);
    const barsRef = useRef([]);
    const speedRef = useRef(speed);

    useEffect(() => {
        generateBars(numBars);
    }, [numBars]);

    const generateBars = (numBars) => {
        const newBars = []
        for(let i = 0; i < numBars; i++){
            newBars.push( (i +1)* (500 / numBars));
        }

        shuffleBars(newBars);
        setBars(newBars);
    }

    const shuffleBars = (barsArray) => {
        for (let i = barsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [barsArray[i], barsArray[j]] = [barsArray[j], barsArray[i]];
        }
        setBars([...barsArray]); // Update state with the shuffled array
    }

    const handleNumBars = (event) => {
        setNumBars(event.target.value);
    }

    const handleSpeed = (event) => {
        const newValue = event.target.value;
        setSpeed(newValue);
        speedRef.current = newValue;
    }
    
    const handleSort = (sortMethod) => {
        
        const barsCopy = [...bars];

        if(isSorted(barsCopy)){
            lightUpBlue(barsCopy);
            return;
        }

        setIsSorting(true);
        if(sortMethod === "selectionSort"){
            selectionSort(barsCopy);
        }else if(sortMethod === "insertionSort"){
            insertionSort(barsCopy);
        }else if(sortMethod === "mergeSort"){
            mergeSort(barsCopy);
        }else if(sortMethod === "quickSort"){
            quickSort(barsCopy);
        }else if(sortMethod === "heapSort"){
            heapSort(barsCopy);
        }else{
            shellSort(barsCopy);
        }
    }

    const isSorted = (barsArray) => {
        for(let i = 1; i < barsArray.length - 1; i++){
            if(barsArray[i] < barsArray[i - 1]){
                return false;
            }
        }

        return true;
    }

    const lightUpBlue = async (barsArray) => {
        const barElements = barsRef.current;
        for(let i = 0; i < barsArray.length; i++){
            if(barElements[i]){
                barElements[i].classList.add('sorted');
                await sleep(15);
            }
        }

        for(let i = 0; i < barsArray.length; i++){
            if(barElements[i]){
                barElements[i].classList.remove('sorted');
                await sleep(15);
            }
        }

        setIsSorting(false);
    }

    const selectionSort = async (barsArray) => {
        for(let i = 0; i < barsArray.length; i++){
            let minIndex = i;
            for(let j = i + 1; j < barsArray.length; j++){
                if(barsArray[j] < barsArray[minIndex]){
                    minIndex = j;
                }
            }

            if(minIndex !== i){
                await swap(barsArray, i, minIndex, speedRef.current);
            }
        }
        lightUpBlue(barsArray);
    }

    const insertionSort = async (barsArray) => {
        for(let i  = 1; i < barsArray.length; i++){
            let key = barsArray[i];
            let j = i - 1;
            while(j >= 0 && barsArray[j] > key){
                await swap(barsArray, j, j+1, speedRef.current);
                j -= 1;
            }
        }
        lightUpBlue(barsArray);
    }

    const mergeSort = async (barsArray) => {
        await divideAndMerge(barsArray, 0, barsArray.length - 1);
        lightUpBlue(barsArray);
    };

    const divideAndMerge = async (barsArray, left, right) => {
        if (left < right){
            const middle = Math.floor((left + right) / 2);
            
            await divideAndMerge(barsArray, left, middle);
            await divideAndMerge(barsArray, middle + 1, right);
            await merge(barsArray, left, middle, right);
        }
    }

    const merge = async(barsArray, left, middle, right) => {
        const leftArray = barsArray.slice(left, middle + 1);
        const rightArray = barsArray.slice(middle + 1, right + 1);

        let i = 0, j = 0, k = left;

        while(i < leftArray.length && j < rightArray.length){
            if(leftArray[i] <= rightArray[j]){
                barsArray[k] = leftArray[i];
                i++;
            }else{
                barsArray[k] = rightArray[j];
                j++;
            }
            await swap(barsArray, k, k, speedRef.current);
            k++;
        }

        while(i < leftArray.length){
            barsArray[k] = leftArray[i];
            await swap(barsArray, k, k, speedRef.current);
            i++;
            k++;
        }

        while(j < rightArray.length){
            barsArray[k] = rightArray[j];
            await swap(barsArray, k, k, speedRef.current);
            j++;
            k++;
        }
    }

    const quickSort = async (barsArray) => {
        await quickSortHelper(barsArray, 0, barsArray.length - 1);
        lightUpBlue(barsArray);
    }

    const quickSortHelper = async (barsArray, low, high) => {
        if(low < high){
            const pi = await partition(barsArray, low, high);
            await quickSortHelper(barsArray, low, pi - 1);
            await quickSortHelper(barsArray, pi + 1, high);
        }
    }

    const partition = async (barsArray, low, high) => {
        const pivot = barsArray[high];
        let i = low - 1;

        for(let j = low; j < high; j++){
            if(barsArray[j] < pivot){
                i++;
                await swap(barsArray, i, j, speedRef.current);
            }
        }

        await swap(barsArray, i + 1, high, speedRef.current);
        return i + 1;
    }

    const heapSort = async (barsArray) => {
        const n = barsArray.length;

        for(let i = Math.floor(n / 2) - 1; i>= 0; i--){
            await heapify(barsArray, n, i);
        }

        for(let i = n - 1; i > 0; i--){
            await swap(barsArray, 0, i, speedRef.current);
            await heapify(barsArray, i, 0);
        }

        lightUpBlue(barsArray);
    }

    const heapify = async (barsArray, n, i) => {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if(left < n && barsArray[left] > barsArray[largest]){
            largest = left;
        }

        if(right < n && barsArray[right] > barsArray[largest]){
            largest = right;
        }

        if(largest !== i){
            await swap(barsArray, i, largest, speedRef.current);

            await heapify(barsArray, n, largest);
        }

    }

    const shellSort = async (barsArray) => {
        let n = barsArray.length;
    
        // Start with a big gap, then reduce the gap
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // Do a gapped insertion sort for this gap size
            for (let i = gap; i < n; i++) {
                for (let j = i; j >= gap && barsArray[j] < barsArray[j - gap]; j -= gap) {
                    // Swap barsArray[j] and barsArray[j - gap]
                    await swap(barsArray, j, j - gap, speedRef.current);
    
                    // Visualize the swap
                    await new Promise(resolve => setTimeout(resolve, speedRef.current));
                    setBars(barsArray);
                }
            }
        }
    
        lightUpBlue(barsArray);
    }
    
    const swap = async (barsArray, i, j, ms) => {
        const barElements = barsRef.current;
        
        if (barElements[i] && barElements[j]) {

            barElements[i].classList.add('active');
            barElements[j].classList.add('active');
            
            [barsArray[i], barsArray[j]] = [barsArray[j], barsArray[i]];

            setBars([...barsArray]);

            await sleep(125-ms);

            barElements[i].classList.remove('active');
            barElements[j].classList.remove('active');
        }
    }

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="sorting-main-container">
            <div className="sorting-container">
                <div className="bars-container">
                    {bars.map((bar, index) => (
                    <div 
                        key={index} 
                        className="bar" 
                        style={{ 
                            height: `${bar}px`,
                            width: `calc(100%/ ${numBars})`
                        }}
                        ref={(el) => (barsRef.current[index] = el)}
                        ></div>
                    ))}
                </div>
                <div className="slider-container">

                    <div className="slider-content">
                        <h4>Amount</h4>
                        <input 
                            type="range" 
                            min="12" 
                            max="100" 
                            step="1" 
                            value={numBars} 
                            onChange={handleNumBars}
                            disabled={isSorting===true}
                        />
                    </div>
                    
                    <button className="sorting-button-small" onClick={() => shuffleBars([...bars])} disabled={isSorting}>Shuffle</button>
                    <h4>Speed</h4>
                    <input 
                        type="range" 
                        min="25" 
                        max="100" 
                        step="1" 
                        value={speed} 
                        onChange={handleSpeed}
                    />
                </div>
            </div>
            <div className="sorting-button-container">
                <button className="sorting-button" onClick={() => handleSort("selectionSort")} disabled={isSorting}>Selection Sort</button>
                <button className="sorting-button" onClick={() => handleSort("insertionSort")} disabled={isSorting}>Insertion Sort</button>
                <button className="sorting-button" onClick={() => handleSort("mergeSort")} disabled={isSorting}>Merge Sort</button>
                <button className="sorting-button" onClick={() => handleSort("quickSort")} disabled={isSorting}>Quick Sort</button>
                <button className="sorting-button" onClick={() => handleSort("heapSort")} disabled={isSorting}>Heap Sort</button>
                <button className="sorting-button" onClick={() => handleSort("shellSort")} disabled={isSorting}>Shell Sort</button>
            </div>
        </div>
      );
}
 
export default Sorting;