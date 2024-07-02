import React, {useEffect } from 'react';
import Draggable from 'react-draggable';
import {calculateAngle, calculateEdgeLength, calculateMidpoint, calculateArrowPositions} from './Helper Functions/GraphUtilities';
import GraphModal from './GraphModal';
import { useGraph } from './Helper Functions/GraphContext';
import { useGraphAlgorithms } from './Helper Functions/GraphAlgorithms';
import { useInternalGraphFunctions } from './Helper Functions/InternalGraphFunctions';
import AlertModal from './AlertModal';


const Graphs = () => {
    const {
        text,
        setText,
        nodes,
        edges,
        setEdges,
        selectedNode,
        isRemovingEdge,
        visitedNodes,
        visitedEdges,
        setAdjList,
        clickedTraversal,
        setClickedTraversal,
        clickedMST,
        setClickedMST,
        clickedPaths,
        setClickedPaths,
        isDFS,
        setIsDFS,
        isBFS,
        setIsBFS,
        isPrim,
        setIsPrim,
        isTSP,
        setIsTSP,
        algorithmRunning,
        setAlgorithmRunning,
        isShortestPath,
        setIsShortestPath,
        startNode,
        componentColors,
        components,
        showWeights,
        setShowWeights,
        sliderValue,
        currentNode,
        isPaused,
        setIsPaused,
        isPausedRef,
        setCurrentStep,
        currentStepRef,
        isStepMode,
        setIsStepMode,
        isStepModeRef,
        disablePause,
        algorithmStarted,
        runningAlgorithm,
        setRunningAlgorithm,
        isDirected,
        setIsDirected,
        isModalOpen,
        setIsModalOpen,
        highlightedButtonColor,
        startingText,
        setIsAlerting,
        isAlerting,
        modalMessage,
        setStartNode,
        setEndNode
    } = useGraph();

    const {animateKruskalsAlgorithm, graphColoring, findConnectedComponents, findStrongComponents, resetEdges} = useGraphAlgorithms();
    const {addNode, handleGenerateGraph, resetGraph, removeNode, handleNodeClick, handleMouseDown, handleSliderChange, startRemovingEdge, handleAddEdge, handleEdgeClick, handleDrag, handleDragStop, handleOpeningModal, showAlert} = useInternalGraphFunctions();
    
    // Use Effect to differentiate between modes
    useEffect(() => {
        isStepModeRef.current = isStepMode;
        // eslint-disable-next-line
    }, [isStepMode]);

    // Use sEffect to allow pausing mid-alg
    useEffect(() => {
        isPausedRef.current = isPaused;
        // eslint-disable-next-line
    }, [isPaused]);

    // Use Effect to allow stopping mid-alg
    useEffect(() => {
        currentStepRef.current = currentStepRef;
    }, [currentStepRef]);

    // Function to set traversal mode
    const setClickTraversal = () => {
        if(algorithmRunning){
            return;
        }

        setClickedTraversal(true);
    }

    // Function to set MST mode
    const setClickMST = () => {
        if(algorithmRunning){
            return;
        }

        setClickedMST(true);
    }

    // Function to set Paths mode
    const setClickPath = () => {
        if(algorithmRunning){
            return;
        }

        setClickedPaths(true);
    }

    // Functino to go back from algorithm selection
    const goBack = () => {

        if(algorithmRunning){
            return;
        }
        
        setClickedMST(false);
        setClickedTraversal(false);
        setClickedPaths(false);
        setAlgorithmRunning(false);
        setText(startingText);
    }

    // Function to step in the algorithm
    const nextStep = () => {
        if(isPausedRef.current){
            setIsStepMode(true);
            if(isPausedRef.current){
                setCurrentStep(prev => {
                    const next = prev + 1;
                    currentStepRef.current = next;
                    return next;
                });
            }
            setIsPaused(false);
            isPausedRef.current = false;
        }
    };

    // Function to toggle button 
    const togglePlayPause = () => {
        if (isPausedRef.current) {
            setIsStepMode(false);
            setIsPaused(false);
            isPausedRef.current = false;
            switch (runningAlgorithm) {
                case "DFS":
                    setText("DFS in progress...")
                    break;
                case "BFS":
                    setText("BFS in progress...")
                    break;
                case "Kruskall":
                    setText("Kruskall's Algorithm in progress...")
                    break;
                case "Prim":
                    setText("Prim's Algorithm in progress...")
                    break;
                case "SP":
                    setText("Shortest Path Algorithm in progress...")
                    break;
                case "TSP":
                    setText("TSP in progress...")
                    break;
                case "Connected":
                    setText("Connected Components in progress..")
                    break;
                case "Colors":
                    setText("Graph Coloring in progress...")
                    break;
                default:
                    setText("Shouldn't get here");
                }
        } else {
            setIsStepMode(false);
            setIsPaused(true);
            isPausedRef.current = true;
            setText("Algorithm is Paused");
        }
    };
    
    // Function to switch between directed and undirected graphs
    const toggleGraphType = () => {
        if(algorithmRunning){
            return;
        }
        if (isDirected) {
            const consolidatedEdges = [];
            const edgeSet = new Set();
    
            edges.forEach(edge => {
                const edgeKey = `${Math.min(edge.from.id, edge.to.id)}-${Math.max(edge.from.id, edge.to.id)}`;
                if (!edgeSet.has(edgeKey)) {
                    edgeSet.add(edgeKey);
                    consolidatedEdges.push(edge);
                }
            });
    
            const newAdjList = {};
            consolidatedEdges.forEach(edge => {
                if (!newAdjList[edge.from.id]) newAdjList[edge.from.id] = [];
                if (!newAdjList[edge.to.id]) newAdjList[edge.to.id] = [];
                newAdjList[edge.from.id].push(edge.to.id);
                newAdjList[edge.to.id].push(edge.from.id);
            });
    
            setEdges(consolidatedEdges);
            setAdjList(newAdjList);
        }
        setIsDirected(!isDirected);
    }

    // Function to cancel beginning of algorithm
    const cancelAlgorithm = () => {
        resetEdges();
        setIsDFS(false);
        setIsBFS(false);
        setIsPrim(false);
        setIsShortestPath(false);
        setIsTSP(false);
        setStartNode(null);
        setEndNode(null);
    }

    /*
        Algorithms
    */

    // Function to start DFS
    const startDFS = () => {
        if(algorithmRunning|| isRemovingEdge){
            return;
        }
        setRunningAlgorithm("DFS");
        setIsDFS(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin DFS");
    }

    // Function to start BFS
    const startBFS = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("BFS");
        setIsBFS(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin BFS");
    }

    // Function to start Prim's algorithm
    const startPrim = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        if (isDirected) {
            showAlert("Graph cannot be directed for Prim's Algorithm")
            return;
        }
        setRunningAlgorithm("Prim");
        setIsPrim(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin Prim's Algorithm");
    }

    // Function to animate Kruskall's algorithm
    const startKruskal = () => {
        if (algorithmRunning || isRemovingEdge) {
            return;
        }
        if (isDirected) {
            showAlert("Graph cannot be directed for Kruskal's Algorithm");
            return;
        }
        animateKruskalsAlgorithm();
    };

    // Function to start shortest path algorithm
    const startShortestPath = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("SP");

        setIsShortestPath(true);
        setAlgorithmRunning(true);
        setText("Select Start Node for Shortest Path");
    }

    // Function to start TSP
    const startTSP = async () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("TSP");
        setIsTSP(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin TSP");
    }

    // Function to start graphColoring
    const startGraphColoring = async() => {
        graphColoring();
    }

    // Function to start connected components
    const startConnectedComponents = async () => {
        findConnectedComponents();
    }

    // Function to start strong components
    const startStrongComponents = async () => {
        findStrongComponents();
    }

    // JSX for rendering the component
    return (
        <div className="main-container">
            <GraphModal 
                show={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onGenerateGraph={handleGenerateGraph} 
            />
            <AlertModal
                isOpen={isAlerting}
                onClose={() => setIsAlerting(false)} 
                message={modalMessage}
            />
            <div className="button-container">
                <h3>Graph Creation</h3>

                {/* Graph Creation and Updating when node selected */}
                {selectedNode && (
                    <>
                         <button className="graph-button" onClick={handleAddEdge}>Add Edge</button>
                         <button className="graph-button" onClick={removeNode}>Remove Node</button>
                    </>
                )}

                {/* Graph Creation and Updating */}
                {!selectedNode && (
                    <>
                        <button className="graph-button" onClick={addNode}>Add Node</button>
                        <button className="graph-button" onClick={handleOpeningModal}>Generate Graph</button>
                    </>
                )}
                {!selectedNode && nodes.length > 0 && (
                    <button className="graph-button" onClick={resetGraph}>Reset Graph</button>)}

                {/* Edge Editing */}
                {!selectedNode && edges.length > 0 && (
                        <>
                            <h3>Edge Editing</h3>
                            <button className="graph-button" onClick={toggleGraphType}>
                                {isDirected ? 'Set Undirected' : 'Set Directed'}
                            </button>
                            <button className="graph-button" onClick={() => {if(edges.length>0){setShowWeights(!showWeights)}}}>
                                {showWeights ? 'Hide Weights' : 'Show Weights'}
                            </button>
                            <button className="graph-button" onClick={startRemovingEdge}>Remove Edge</button>
                        </>
                )}

                
                {algorithmStarted && !disablePause && (
                    <>
                        <h3>Control</h3>
                        <button className="graph-button" onClick={togglePlayPause}>
                            {((isPaused || isStepMode) && !disablePause) ? "Play" : "Pause"}
                        </button>
                    </>
                )}

                {algorithmRunning && !algorithmStarted && !disablePause && (
                    <>
                        <h3>Control</h3>
                        <button className="graph-button" onClick={cancelAlgorithm}>Cancel</button>
                    </>
                )}

                {isPausedRef.current && algorithmStarted && !disablePause && (
                    <button className="graph-button" onClick={nextStep}>Next Step</button>
                )}

                

            </div>
                
            <div className="graph-content">
                <div className="slider-container">
                    <h4 className="slider-label">Algorithm Speed</h4>
                    <div className="slider-content">
                        <h4>Slow</h4>
                        <input 
                            type="range" 
                            min="100" 
                            max="2000" 
                            step="100" 
                            value={sliderValue} 
                            onChange={handleSliderChange}
                        />
                        <h4>Fast</h4>
                    </div>
                </div>
                <div className="graph-box">
                    
                <svg className="edges-svg" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {edges.map((edge, index) => {
                        const midpoint = calculateMidpoint(edge);
                        const { angle, flipped } = calculateAngle(edge);
                        const{ arrowX1,arrowX2,arrowY1,arrowY2,adjustedFromX,adjustedFromY,adjustedToX,adjustedToY} = calculateArrowPositions(edges, edge, flipped, angle);
                        const edgeCount = edges.filter(e => 
                            (e.from.id === edge.from.id && e.to.id === edge.to.id) || 
                            (e.from.id === edge.to.id && e.to.id === edge.from.id)
                        ).length;

                        return (
                            <React.Fragment key={index}>
                                <line
                                    x1={adjustedFromX}
                                    y1={adjustedFromY}
                                    x2={adjustedToX}
                                    y2={adjustedToY}
                                    stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                    strokeWidth={isRemovingEdge ? 8 : 4}
                                    onClick={() => handleEdgeClick(edge)}
                                />
                                {isDirected && (
                                   <>
                                        <line
                                            x1={adjustedToX}
                                            y1={adjustedToY}
                                            x2={arrowX1}
                                            y2={arrowY1}
                                            stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                            strokeWidth={isRemovingEdge ? 8 : 4}
                                        />
                                        <line
                                           x1={adjustedToX}
                                           y1={adjustedToY}
                                           x2={arrowX2}
                                           y2={arrowY2}
                                           stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                           strokeWidth={isRemovingEdge ? 8 : 4}
                                        />
                                    </>
                                )}
                                {showWeights && (
                                    <text
                                        x={midpoint.x + 10}
                                        y={edgeCount > 1 ? midpoint.y + 2 : midpoint.y + 7}
                                        fill="black"
                                        fontSize="12"
                                        transform={`rotate(${angle}, ${midpoint.x + 10}, ${midpoint.y + 10})`}
                                        textAnchor="middle"
                                    >
                                        {Math.round(calculateEdgeLength(edge))}
                                    </text>)}
                            </React.Fragment>
                        );
                    })}
                </svg>
                    {nodes.map(node => (
                        <Draggable
                            key={node.id}
                            position={{ x: node.x, y: node.y }}
                            bounds="parent"
                            onStart={handleMouseDown}
                            onDrag={(e, data) => handleDrag(e, data, node)}
                            onStop={handleDragStop}
                        >
                            <div
                                className="graph-node"
                                onClick={() => handleNodeClick(node)}
                                style={{
                                    border: (isTSP || isBFS || isPrim || isDFS || isShortestPath) ? (startNode && startNode.id === node.id ? 'none' : '2px solid red') : (selectedNode && selectedNode.id === node.id ? '2px solid red' : 'none'),
                                    backgroundColor: 
                                    node.id === currentNode?.id ? 'red' : 
                                    visitedNodes.some(vn => vn.id === node.id) ? 
                                        (visitedNodes.find(vn => vn.id === node.id)?.color || componentColors[components.findIndex(comp => comp.some(n => n.id === node.id)) % componentColors.length] || "blue") 
                                        : 'black',
                                    pointerEvents: 'auto',
                                    position: 'absolute'
                                }}
                            >
                            </div>
                        </Draggable>
                    ))}
                </div>
                <h3 class-name="status-text">{text}</h3>
            </div>

            <div className="button-container">    
                {/* Traversal and MST and Path*/}
                {edges.length > 0 && !selectedNode &&(
                <h3>Algorithms</h3>)}

                {edges.length > 0 && !selectedNode && !clickedTraversal && !clickedMST && !clickedPaths && (
                    <>
                        <button className="graph-button" onClick={setClickTraversal}>Traversals →</button>
                        <button className="graph-button" onClick={setClickMST}>MSTs →</button>
                        <button className="graph-button" onClick={setClickPath}>Paths →</button>
                    </>
                )}


                {/* Specific Algorithms */}
                {clickedMST && !selectedNode && edges.length > 0 && (
                    <>
                        <button style={{border:runningAlgorithm === "Kruskall" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Kruskall" ? highlightedButtonColor : "" }}className="graph-button" onClick={startKruskal}>Kruskall</button>
                        <button style={{border:runningAlgorithm === "Prim" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Prim" ? highlightedButtonColor : "" }}className="graph-button" onClick={startPrim}>Prim</button>
                    </>
                )}

                {clickedTraversal && !selectedNode && edges.length > 0 && (
                    <>
                        <button style={{border:runningAlgorithm === "DFS" ? highlightedButtonColor : "", backgroundColor: runningAlgorithm === "DFS" ? highlightedButtonColor : "" }}className="graph-button" onClick={startDFS}>DFS</button>
                        <button style={{border:runningAlgorithm === "BFS" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "BFS" ? highlightedButtonColor : "" }}className="graph-button" onClick={startBFS}>BFS</button>
                    </>
                )}

                {clickedPaths && !selectedNode && edges.length > 0 && (
                    <>
                        <button style={{border:runningAlgorithm === "SP" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "SP" ? highlightedButtonColor : "" }}className="graph-button" onClick={startShortestPath}>Shortest Path</button>
                        <button style={{border:runningAlgorithm === "TSP" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "TSP" ? highlightedButtonColor : "" }}className="graph-button" onClick={startTSP}>TSP</button>
                    </>
                )}
                
                {!clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Color" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Color" ? highlightedButtonColor : "" }}className="graph-button" onClick={startGraphColoring}>Graph Coloring</button>)}
                {!isDirected && !clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Connected" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Connected" ? highlightedButtonColor : "" }}className="graph-button" onClick={startConnectedComponents}>Connected Components</button>)}
                {isDirected && !clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Connected" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Connected" ? highlightedButtonColor : "" }}className="graph-button" onClick={startStrongComponents}>Strong Components</button>)}

                {/* Back Button */}
                {(clickedTraversal || clickedMST || clickedPaths) && !selectedNode && (
                <button className="graph-button" onClick={goBack}>← Back</button>)} 
                
            </div>
        </div>
    );
    
}

export default Graphs;